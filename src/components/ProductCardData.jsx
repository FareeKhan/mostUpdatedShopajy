import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RemoteImage from './RemoteImage'
import { height, width } from '../constants/data'
import CustomText from './CustomText'
import BorderLine from './BorderLine'
import StarRating from 'react-native-star-rating-widget';

import PriceSymbol from './PriceSymbol'
import { fonts } from '../constants/fonts'
import { colors } from '../constants/color'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { addToFavorites, toggleFavoriteRemote } from '../redux/reducers/AddFavorite'
import EmptyData from './EmptyData'
import { useTranslation } from 'react-i18next'
import { showMessage } from 'react-native-flash-message'
import PriceComp from './PriceComp'

const ProductCardData = ({ data }) => {
    const { t } = useTranslation()
    const navigation = useNavigation()
    const favoriteItems = useSelector((state) => state?.favorite?.favorites)
    const token = useSelector(s => s?.auth?.token)
    const settings = useSelector(state => state.settings?.values);


    const dispatch = useDispatch()


    const handleFavorite = (item) => {



        const isFav = favoriteItems?.some((i) => i?.id === item?.id)
        dispatch(addToFavorites({ ...item, quantity: 1 }))
        if (token) {
            dispatch(toggleFavoriteRemote({ productId: item.id, isFavorite: isFav }))
        }
        const productTitle = I18nManager.isRTL ? item?.title_ar : item?.title_en

        if (isFav) {
            showMessage({
                type: 'success',
                message: t('hasBeenRemovedFromYourFavorites', { productTitle }),
            })
        } else {
            showMessage({
                type: 'success',
                message: t('hasBeenAddedToYourFavorites', { productTitle }),
            })
        }
    }



    const renderItem = ({ item, index }) => {
        const isFavorite = favoriteItems?.some((i) => i?.id == item?.id)
        const percentage =
            item?.price > 0 && item?.discount_price != null
                ? Math.round(((Number(item.price) - Number(item.discount_price)) / Number(item.price)) * 100)
                : 0;

        return (
            <TouchableOpacity style={styles.cardWrapper} activeOpacity={0.7} onPress={() => navigation.navigate('ProductDetailScreen', {
                productId: item?.id
            })}>
                <RemoteImage
                    uri={item?.image}
                    style={styles.image}
                    resizeMode='stretch'
                />

                <View style={styles.topRow}>

                    {
                        item?.tag &&
                        <View style={[
                            styles.tag,
                            { backgroundColor: item?.is_new ? colors.secondary : colors.red }
                        ]}>
                            <CustomText xs medium style={{
                                color: item?.is_new ? colors.black : colors.white,
                                textTransform: "capitalize"
                            }}>
                                {item?.tag}
                            </CustomText>
                        </View>
                    }

                    {
                        !item?.tag && item?.discount_price &&
                        <View style={[
                            styles.tag,
                            { backgroundColor: colors.red }
                        ]}>
                            <CustomText xs medium style={{
                                color: colors.white
                            }}
                                translate={false}
                            >
                                {percentage}%
                            </CustomText>
                        </View>
                    }


                    <TouchableOpacity
                        onPress={() => handleFavorite(item)}
                        style={[
                            styles.heartBtn,
                            { backgroundColor: isFavorite ? colors.black : colors.white }
                        ]}>
                        <FontAwesome
                            name={isFavorite ? 'heart' : 'heart-o'}
                            size={15}
                            color={isFavorite ? colors.secondary : colors.gray20}
                        />
                    </TouchableOpacity>


                </View>

                <View style={styles.cardContent}>

                    <CustomText style={styles.title} numberOfLines={1}>
                        {I18nManager.isRTL ? item?.title_ar : item?.title_en}
                    </CustomText>

                    <BorderLine centerLine style={styles.borderLine} />


                    {
                        item?.rating &&
                        <View style={styles.ratingRow}>
                            <StarRating
                                rating={parseInt(item?.rating)}
                                starSize={18}
                                starStyle={{ marginHorizontal: 0 }}
                                enableSwiping={false}
                                disabled={true}
                                onChange={() => { }}
                            />
                            <CustomText xxs translate={false}>
                                ({item?.review_count})
                            </CustomText>
                        </View>

                    }




                    {/* {
                        item?.discountPrice ?
                            <PriceComp
                                discountPrice={item?.discountPrice}
                                price={item?.price}
                                equalent={item?.syp_discountPrice ? item?.syp_discountPrice : item?.syp_price}
                            />
                            :
                            <PriceComp
                                discountPrice={item?.price}
                                equalent={item?.syp_discountPrice ? item?.syp_discountPrice : item?.syp_price}
                            />
                    } */}




                    <View style={styles.priceRow}>
                        {
                            item?.discount_price ?
                                <PriceComp
                                    discountPrice={item?.discount_price}
                                    price={item?.price}
                                    equalent={item?.discount_price_syp ? item?.discount_price_syp : item?.price_syp}
                                />
                                :
                                <PriceComp
                                    discountPrice={item?.price}
                                    equalent={item?.discount_price_syp ? item?.discount_price_syp : item?.price_syp}
                                />
                        }

                    </View>

                    {
                        !item?.rating && <View style={{ height: 20 }} />
                    }


                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<CustomText style={{ textAlign: 'center', marginTop: 50 }}>noProductFound</CustomText>}
            />
        </View>
    )
}

export default ProductCardData

const styles = StyleSheet.create({
    cardWrapper: {
        width: width / 2.25,
        marginHorizontal: 2,
        marginBottom: 1,
    },
    image: {
        width: width / 2.25,
        height: 180,
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 0,
    },
    topRow: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    heartBtn: {
        width: 25,
        height: 25,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
    },
    cardContent: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 0.3 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        backgroundColor: colors.white,
        elevation: 3,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        paddingBottom: 10,
        marginBottom: 5,
    },
    title: {
        marginTop: 10,
    },
    borderLine: {
        marginVertical: 10,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    priceRow: {

        marginTop: 7,
        marginBottom: 3,
    },
    priceSymbol: {
        fontFamily: fonts.bold,
        fontSize: 16,
    },
    oldPrice: {
        textDecorationLine: 'line-through',
    },
    usdText: {
        color: colors.gray20,
    },
    columnWrapper: {
        justifyContent: "space-between",
    },
    listContainer: {
        gap: 10,
    }
})