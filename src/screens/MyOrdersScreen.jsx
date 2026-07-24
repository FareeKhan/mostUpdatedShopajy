import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HorizontalTabs from '../components/HorizontalTabs'
import HeaderBox from '../components/HeaderBox'
import { height, orderFilters } from '../constants/data'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import BorderLine from '../components/BorderLine'
import PriceSymbol from '../components/PriceSymbol'
import { fonts } from '../constants/fonts'
import DollarText from '../components/DollarText'
import CustomButton from '../components/CustomButton'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { cancelOrder, fetchOrders } from '../redux/reducers/Orders'
import { Alert } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { addCartRemote, productToCart } from '../redux/reducers/CartProduct'
import EmptyData from '../components/EmptyData'
import PriceComp from '../components/PriceComp'
import { useConvertPrice } from '../constants/helper'
import { fetchProductById } from '../redux/reducers/Home'
import CustomModal from '../components/CustomModal'
import StarRating from 'react-native-star-rating-widget';
import CustomInput from '../components/CustomInput'
import { useTranslation } from 'react-i18next'

const formatDate = iso => {
    if (!iso) return ''
    try {
        const date = new Date(iso)

        if (isNaN(date.getTime())) return iso

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    } catch (e) {
        return iso
    }
}

const MyOrdersScreen = ({ navigation }) => {
    const dispatch = useDispatch()

    const convertPrice = useConvertPrice();
    const { t } = useTranslation()

    const orders = useSelector(s => s?.orders?.list) || []
    const token = useSelector(s => s?.auth?.token)
    const [filter, setFilter] = useState('all')
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (token) dispatch(fetchOrders(filter === 'all' ? {} : { status: filter }))
    }, [token, filter, dispatch])

    const onRefresh = async () => {
        setRefreshing(true);
        if (token) {
            await dispatch(fetchOrders(filter === 'all' ? {} : { status: filter }));
        }
        setRefreshing(false);
    };

    const handlePress = (value) => setFilter(value)
    const data = orders

    const handleReOrder = async (order) => {
        if (!order || !order.items || order.items.length === 0) return;

        try {
            for (const item of order.items) {
                const fullProductData = await dispatch(fetchProductById(item.product_id)).unwrap();

                const product = fullProductData?.data || fullProductData;

                if (product) {
                    dispatch(productToCart({
                        id: product.id,
                        title_en: product.title_en,
                        title_ar: product.title_ar,
                        description_ar: product.description_ar,
                        description_en: product.description_en,
                        image: product.image,
                        price: product.price,
                        discount_price: product.discount_price,
                        discount_price_syp: product.discount_price_syp,
                        price_syp: product.price_syp,
                        color: item.color || '',
                        size: item.size || '',
                        quantity: item.quantity || 1,
                        weight: item.weight || 0,
                    }));
                }
            }

            navigation.navigate('MyCartScreen');

        } catch (error) {
            console.error("Failed to re-order one or more products:", error);
        }
    };

    const handleCancel = (id) => {
        Alert.alert(t('Cancel order'), t('cancelOrderConfirmation', { id }), [
            { text: t('No') },
            {
                text: t('yesCancel'),
                style: 'destructive',
                onPress: async () => {
                    const res = await dispatch(cancelOrder(id))
                    if (cancelOrder.fulfilled.match(res)) {
                        showMessage({ type: 'success', message: t('Order cancelled') })
                    } else {
                        showMessage({ type: 'danger', message: res.payload?.message || 'Cancel failed' })
                    }
                },
            },
        ])
    }

    const renderItem = ({ item, index }) => {
        const sypPrice = convertPrice(item?.total);
        const statusColor = item?.status == 'delivered' ? colors.deliver : item?.status == 'accepted' ? colors.accpted : item?.status == 'out_for_delivery' ? colors.secondary : item?.status == 'pending' ? colors.pending : colors.rejected
        return (
            <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('OrderDetailScreen', {
                orderId: item?.id,
                discount: item?.discount_amount
            })}>
                <ShadowWrapper>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ backgroundColor: statusColor, paddingHorizontal: 15, paddingVertical: 7, borderRadius: 50 }}>
                            <CustomText s semiBold style={{ color: colors.white, textTransform: "capitalize" }}>{item?.status == 'out_for_delivery' ? 'outForDel' : item?.status}</CustomText>
                        </View>
                        <View style={{ gap: 5 }}>
                            <CustomText translate={false} semiBold style={{ marginLeft: "auto" }}>#{item?.id}</CustomText>
                            <CustomText light xs style={{ color: colors.gray3 }}>{formatDate(item?.placed_at || item?.created_at)}</CustomText>
                        </View>
                    </View>

                    <CustomText translate={false} medium xs style={{ marginVertical: 20 }} >{item?.items_summary}</CustomText>
                    <BorderLine centerLine />


                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <View style={{ gap: 5, marginTop: 10 }}>
                            {/* <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                                <CustomText translate={false} l semiBold>{item?.total?.toLocaleString()} <PriceSymbol style={{ fontFamily: fonts.semiBold }} /></CustomText>
                            </View>
                            <DollarText usdPrice={Number(item?.usd_equivalent)?.toLocaleString()} /> */}


                            <PriceComp
                                discountPrice={item?.total}
                                discountStyle={{ fontSize: 16 }}
                                discountSymbol={{ fontSize: 15 }}
                                equalent={sypPrice}
                            />
                        </View>


                        <CustomText translate={false} semiBold style={{ color: colors.gray3 }} xs>{item?.product_count} {t('Products')}</CustomText>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        {
                            item?.status == 'accepted' ?
                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                    <CustomButton
                                        title={'deliveredSoon'}
                                        disabled
                                        // style={{ width: "100%", }}


                                        style={{ width: "100%", height: 35, backgroundColor: colors.gray32 }}
                                        textStyle={{ fontSize: 16, color: colors.gray31 }}
                                    />
                                    {/* <CustomButton
                                        title={'cancelOrder'}
                                        style={{ width: "48%", backgroundColor: colors.red2 }}
                                        textStyle={{ color: colors.red }}
                                        onPress={() => handleCancel(item?.id)}
                                    /> */}
                                </View>
                                :
                                item?.status == 'out_for_delivery' ?
                                    <CustomButton
                                        leftIcon={<MaterialIcons name={'local-shipping'} color={colors.black} size={20} />}
                                        title={'trackOrder'}
                                        style={{ backgroundColor: colors.secondary, height: 35, }}
                                        textStyle={{ fontSize: 16, color: colors.black }}
                                        onPress={() => navigation.navigate('OrderDetailScreen', {
                                            orderId: item?.id,
                                        })}


                                    />

                                    :
                                    item?.status == 'rejected' ?
                                        <CustomButton
                                            onPress={() => handleReOrder(item)}
                                            title={'reOrder'}
                                            style={{ width: "100%", backgroundColor: colors.black, height: 35 }}
                                            textStyle={{ fontSize: 16 }}
                                        />

                                        :
                                        item?.status == 'pending' ?
                                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                <CustomButton
                                                    title={'awaitingConfirmation'}
                                                    disabled
                                                    style={{ width: "100%", height: 35, backgroundColor: colors.gray32 }}
                                                    textStyle={{ fontSize: 16, color: colors.gray31 }}

                                                />
                                                {/* <CustomButton
                                                    title={'cancelOrder'}
                                                    style={{ width: "48%", backgroundColor: colors.red2 }}
                                                    textStyle={{ color: colors.red }}
                                                    onPress={() => handleCancel(item?.id)}
                                                /> */}
                                            </View>

                                            :

                                            item?.status == 'delivered' ?

                                                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                                    <CustomButton
                                                        onPress={() => handleReOrder(item)}
                                                        title={'reOrder'}
                                                        style={{ width: "48%", backgroundColor: colors.secondary, height: 35 }}
                                                        textStyle={{ fontSize: 16, color: colors.black }}
                                                    />
                                                    <CustomButton
                                                        // onPress={() => setIsRatingModal(true)}
                                                        onPress={() => navigation.navigate('OrderDetailScreen', {
                                                            orderId: item?.id,
                                                            isRating: true,
                                                        })}
                                                        title={'review'}
                                                        style={{ width: "48%", height: 35 }}
                                                        leftIcon={<Feather name={"star"} color={colors.white} size={17} />}
                                                        textStyle={{ fontSize: 16, color: colors.white }}
                                                    />
                                                </View>
                                                :
                                                <CustomButton
                                                    onPress={() => handleReOrder(item)}
                                                    title={'reOrder'}
                                                    style={{ width: "100%", backgroundColor: colors.black, height: 35 }}
                                                    textStyle={{ fontSize: 16 }}
                                                />
                        }
                    </View>


                </ShadowWrapper>
            </TouchableOpacity>
        )
    }

    return (
        <CustomScreenView
            refreshing={refreshing} onRefresh={onRefresh}
        >
            <HeaderBox
                title={'myOrders'}
                style={data?.length == 0 && {marginBottom:40}}
            />
            {
                data?.length > 0 &&
                <HorizontalTabs
                    data={orderFilters}
                    handlePress={handlePress}
                    selectedFilter={filter}

                />

            }



            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ marginHorizontal: 5, marginBottom: 10 }}
                scrollEnabled={false}
                ListEmptyComponent={<EmptyData
                    imagePath={require('../assets/images/empyorder.png')}
                    title={'nextChoice'}
                    colorText={'here'}
                    subTitle={'withEasily'}
                    semiBold={true}
                    style={{ width: "80%", }}
                    button
                    arrow
                    onPress={() => {
                        navigation.navigate('DrawerNavigation', {
                            screen: 'BottomTabNavigation',
                            params: {
                                screen: 'CategoryScreen',
                            },
                        });
                    }}

                />}
            />







        </CustomScreenView>
    )
}

export default MyOrdersScreen

const styles = StyleSheet.create({})