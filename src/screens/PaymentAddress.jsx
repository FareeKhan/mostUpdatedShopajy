import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import ShadowWrapper from '../components/ShadowWrapper'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color'
import CustomButton from '../components/CustomButton'
import BorderLine from '../components/BorderLine'
import { deleteAddressRemote, fetchAddressesRemote, setDefaultAddressRemote } from '../redux/reducers/StoreAddress'
import { deleteCard, fetchCards, setDefaultCard } from '../redux/reducers/Payments'

const PaymentAddress = ({ navigation }) => {
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const addresses = useSelector(s => s?.address?.address) || []
    const cards = useSelector(s => s?.payments?.cards) || []

    const [expandTab, setExpandTab] = useState([])

    useEffect(() => {
        if (token) {
            dispatch(fetchAddressesRemote())
            dispatch(fetchCards())
        }
    }, [token, dispatch])



    const renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <CustomText semiBold xl >{item?.type}</CustomText>
                    {
                        item?.is_default ?
                            <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                                <CustomText xs medium>default</CustomText>
                            </View>
                            :
                            <TouchableOpacity onPress={() => dispatch(setDefaultAddressRemote(item?.id))}>
                                <CustomText xs medium style={{ color: colors.gray2, textDecorationLine: 'underline' }}>setDefault</CustomText>
                            </TouchableOpacity>
                    }
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 20, marginTop: 5 }}>
                    <View>
                        {
                            item?.street &&
                            <CustomText medium s style={{ color: colors.black3 }}>{item?.street}</CustomText>
                        }
                        {
                            item?.building &&
                            <CustomText medium s style={{ color: colors.black3 }}>{item?.building}</CustomText>
                        }
                        {
                            item?.full_address &&
                            <CustomText medium s style={{ color: colors.black3 }}>{item?.full_address}</CustomText>
                        }
                    </View>

                    <View style={{ width: 45, height: 45, borderWidth: 1, borderRadius: 50, borderColor: colors.gray, alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={'location-outline'} size={22} color={colors.black} />
                    </View>
                </View>


                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <CustomButton
                        title={'edit'}
                        style={{ width: "48%", backgroundColor: colors.secondary }}
                        textStyle={{ color: colors.black }}
                        onPress={() => navigation.navigate('AddNewAddressScreen', { address: item })}

                    />
                    <CustomButton
                        title={'delete'}
                        style={{ width: "48%", backgroundColor: colors.red2, }}
                        onPress={() => dispatch(deleteAddressRemote(item?.id))}
                        textStyle={{ color: colors.red }}
                    />
                </View>

                {
                    addresses?.length - 1 === index &&
                    <CustomButton
                        title={'addAddress'}
                        style={{ marginTop: 30 }}
                        onPress={() => navigation.navigate('AddNewAddressScreen')}
                    />
                }

            </View>
        )
    }


    const renderPaymentItem = ({ item, index }) => {
        return (
            <View>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <CustomText translate={false} semiBold xl >{item?.holder}</CustomText>
                        {
                            item?.is_default ?
                                <View style={{ backgroundColor: colors.secondary, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                                    <CustomText xs medium>default</CustomText>
                                </View>
                                :
                                <TouchableOpacity onPress={() => dispatch(setDefaultCard(item?.id))}>
                                    <CustomText xs medium style={{ color: colors.gray2, textDecorationLine: 'underline' }}>setDefault</CustomText>
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 20 }}>
                        <View>
                            <CustomText translate={false} medium l style={{ color: colors.gray2 }}>•••• •••• •••• {item?.last4}</CustomText>
                            <CustomText translate={false} medium l style={{ color: colors.gray2 }}>{String(item?.expiry_month).padStart(2, '0')}/{String(item?.expiry_year).slice(-2)}</CustomText>
                        </View>
                        <CustomText translate={false} bold style={{ textTransform: 'uppercase', color: colors.black }}>{item?.holder}</CustomText>
                    </View>


                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        {/* <CustomButton
                            title={'edit'}
                            style={{ width: "48%", height: 32, backgroundColor: colors.secondary, borderRadius: 5 }}
                            textStyle={{ color: colors.black }}
                            onPress={() => navigation.navigate('AddNewCardScreen')}
                        /> */}
                        <CustomButton
                            title={'delete'}
                            style={{ width: "100%", backgroundColor: colors.red2, }}
                            onPress={() => dispatch(deleteCard(item?.id))}
                            textStyle={{ color: colors.red }}
                        />
                    </View>

                    {
                        cards?.length - 1 === index &&
                        <CustomButton
                            title={'addNewCard'}
                            style={{ marginTop: 20 }}
                            onPress={() => navigation.navigate('AddNewCardScreen')}
                        />
                    }

                </View>
            </View>
        )
    }

    const handleExpandTab = (text) => {
        setExpandTab((prev) => {
            if (prev.includes(text)) {
                return prev.filter((item) => item !== text);
            }
            return [...prev, text];
        });
    };

    return (
        <CustomScreenView>
            <HeaderBox
                title={'paymentAddress'}
            />

            <ShadowWrapper style={[{ padding: 0, paddingHorizontal: 15 },]} >
                <TouchableOpacity onPress={() => handleExpandTab('address')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>
                    <CustomText medium>address</CustomText>
                    <Ionicons name={expandTab.includes('address') ? 'arrow-up-outline' : 'arrow-down-outline'} size={15} color={colors.gray1} />
                </TouchableOpacity>
                {
                    expandTab.includes('address') &&
                    <FlatList
                        data={addresses}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={renderItem}
                        ItemSeparatorComponent={<BorderLine mv style={{ marginVertical: 30 }} />}
                        scrollEnabled={false}
                        contentContainerStyle={{ marginBottom: 10 }}
                        ListEmptyComponent={
                            <CustomButton
                                title={'addAddress'}
                                style={{}}
                                onPress={() => navigation.navigate('AddNewAddressScreen')}
                            />
                        }
                    />
                }



            </ShadowWrapper>

            <ShadowWrapper style={[{ padding: 0, paddingHorizontal: 15 },]} >
                <TouchableOpacity onPress={() => handleExpandTab('payment')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 }}>

                    <CustomText medium>paymentMethod</CustomText>
                    <Ionicons name={expandTab.includes('payment') ? 'arrow-up-outline' : 'arrow-down-outline'} size={15} color={colors.gray1} />
                </TouchableOpacity>


                {
                    expandTab.includes('payment') &&
                    <FlatList
                        data={cards}
                        keyExtractor={(item, index) => index?.toString()}
                        renderItem={renderPaymentItem}
                        contentContainerStyle={{ marginBottom: 10 }}
                        ItemSeparatorComponent={<BorderLine mv style={{ marginVertical: 30 }} />}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <CustomButton
                                title={'addNewCard'}
                                style={{}}
                                onPress={() => navigation.navigate('AddNewCardScreen')}
                            />
                        }
                    />
                }

            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default PaymentAddress

const styles = StyleSheet.create({})