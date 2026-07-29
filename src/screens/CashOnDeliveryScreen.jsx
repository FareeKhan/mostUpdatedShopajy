import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import CustomScreenView from '../components/CustomScreenView';
import { colors } from '../constants/color';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import BgIconWithTitle from '../components/BgIconWithTitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { useTranslation } from 'react-i18next';
import DarkTitleWithNotes from '../components/DarkTitleWithNotes';
import SuccessModal from '../components/SuccessModal';
import { useDispatch, useSelector } from 'react-redux';
import { subTotalCalculation } from '../constants/helper';
import TotalAmountWithDelivery from '../components/TotalAmountWithDelivery';
import { placeOrder } from '../redux/reducers/Orders';
import { showMessage } from 'react-native-flash-message';
import i18next from 'i18next';

const CashOnDeliveryScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const cartData = useSelector((state) => state.cart.cart);
    const placing = useSelector((s) => s?.orders?.placing);
    const coupon = useSelector((s) => s?.checkout?.coupon);
    const shippingQuote = useSelector((s) => s?.cart?.shippingQuote);
    
    // Address Selection from Redux
    const addresses = useSelector((s) => s?.address?.address) || [];
    const selectedAddress = addresses.find((addr) => addr?.is_default) || addresses[0];

    // Shipping Method Handling
    const shippingMethod = route?.params?.shippingMethod || 'door_to_door';
    const isAlQadmus = shippingMethod === 'al_qadmus';
    const shippingAmount = isAlQadmus ? 0 : Number(shippingQuote?.amount || 0);

    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleConfirm = async () => {
        if (placing) return;
        const res = await dispatch(
            placeOrder({
                payment_method: 'cod',
                promo_code: coupon?.code || null,
                shipping: shippingAmount,
                shipping_method: shippingMethod,
            })
        );
        if (placeOrder.fulfilled.match(res)) {
            setModalVisible(true);
        } else {
            showMessage({
                type: 'danger',
                message: res.payload?.message || t('orderFailed'),
            });
        }
    };

    const getAddressIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'home':
                return 'home-outline';
            case 'office':
                return 'business-outline';
            default:
                return 'location-outline';
        }
    };

    return (
        <CustomScreenView>
            <BgIconWithTitle
                iconStyle={styles.iconCircles}
                icon={
                    <Image
                        source={require('../assets/images/Cash.png')}
                        style={{ width: 70, height: 45 }}
                    />
                }
                title={'cashOnDel'}
                subTitle={'الدفع عند الاستلام'}
            />

            {/* 1. SHIPPING ADDRESS SECTION */}
            <View style={styles.sectionHeaderRow}>
                <CustomText bold style={styles.sectionHeaderTitle}>
                    Shipping Address
                </CustomText>
                <TouchableOpacity onPress={() => navigation.navigate('ShippingAddressScreen')}>
                    <CustomText bold style={styles.changeBtnText}>
                        Change
                    </CustomText>
                </TouchableOpacity>
            </View>

            {selectedAddress ? (
                <View style={styles.activeCardContainer}>
                    <View style={styles.cardRow}>
                        <View style={styles.circleWrapper}>
                            <View style={[styles.outerCircle, { borderColor: colors.secondary }]}>
                                <View style={styles.innerCircle} />
                            </View>
                        </View>

                        <View style={styles.textContainer}>
                            <View style={styles.titleRow}>
                                <CustomText style={styles.addressType} bold>
                                    {selectedAddress?.type || 'Home'}
                                </CustomText>
                                {selectedAddress?.is_default && (
                                    <View style={styles.defaultBadge}>
                                        <CustomText style={styles.defaultBadgeText} bold>
                                            Default
                                        </CustomText>
                                    </View>
                                )}
                            </View>

                            <CustomText
                                style={styles.addressDetailText}
                                semiBold
                                numberOfLines={1}
                                translate={false}
                            >
                                {selectedAddress?.street}
                            </CustomText>

                            <CustomText
                                style={styles.addressDetailText}
                                semiBold
                                numberOfLines={1}
                                translate={false}
                            >
                                {selectedAddress?.building ? `Building no ${selectedAddress.building}` : ''}
                                {selectedAddress?.floor ? ` ${selectedAddress.floor}` : ''}
                            </CustomText>
                        </View>

                        <View style={styles.iconCircle}>
                            <Ionicons
                                name={getAddressIcon(selectedAddress?.type)}
                                size={22}
                                color={colors.gray23}
                            />
                        </View>
                    </View>
                </View>
            ) : null}

            {/* 2. SHIPPING METHOD SECTION */}
            <View style={styles.sectionHeaderRow}>
                <CustomText bold style={styles.sectionHeaderTitle}>
                    Shipping Method
                </CustomText>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CustomText bold style={styles.changeBtnText}>
                        Change
                    </CustomText>
                </TouchableOpacity>
            </View>

            <View style={styles.activeCardContainer}>
                <View style={styles.cardRow}>
                    <View style={styles.methodIconCircle}>
                        {isAlQadmus ? (
                            <MaterialIcons name="local-shipping" size={24} color={colors.secondary} />
                        ) : (
                            <MaterialIcons name="two-wheeler" size={24} color={colors.secondary} />
                        )}
                    </View>

                    <View style={styles.textContainer}>
                        <CustomText style={styles.addressType} bold>
                            {isAlQadmus ? 'Al Qadmous Shipping' : 'Home Delivery'}
                        </CustomText>
                        <CustomText style={styles.addressDetailText} semiBold numberOfLines={1}>
                            {isAlQadmus
                                ? 'Pickup from nearest branch'
                                : 'Delivery To Your Door'}
                        </CustomText>
                        <View style={styles.timeRow}>
                            <Feather name="clock" size={12} color={colors.gray34} style={{ marginRight: 4 }} />
                            <CustomText style={styles.addressDetailText} semiBold>
                                {isAlQadmus ? '3-5 business days' : '1 - 2 Business Days'}
                            </CustomText>
                        </View>
                    </View>

                    <View style={styles.circleWrapper}>
                        <View style={[styles.outerCircle, { borderColor: colors.secondary }]}>
                            <View style={styles.innerCircle} />
                        </View>
                    </View>
                </View>

                {/* Shipping Fee Summary */}
                <View style={styles.shippingFeeRow}>
                    <CustomText bold style={styles.shippingFeeLabel}>
                        Shipping Fee
                    </CustomText>
                    <CustomText bold style={styles.shippingFeeValue} translate={false}>
                        {isAlQadmus ? t('Paid at pickup') : `${shippingAmount}$`}
                    </CustomText>
                </View>
            </View>

            {/* TOTAL AMOUNT BREAKDOWN CARD */}
            <TotalAmountWithDelivery
                themeColor={{ color: colors.orange3 }}
                cod={true}
                shippingMethod={shippingMethod}
            />

            {/* Instructions Section */}
            <View style={styles.instructionCard}>
                <View style={styles.instructionHeader}>
                    <MaterialIcons name="delivery-dining" size={20} color={colors.orange3} />
                    <CustomText style={styles.instructionTitle}>cashPaymentInst</CustomText>
                </View>

                <View style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <CustomText style={styles.bulletText}>
                        {isAlQadmus
                            ? 'Your order will be sent to the nearest Al Qadmous branch within 3-5 business days'
                            : 'The order will be delivered to your address within 1-2 business days'}
                    </CustomText>
                </View>
                <View style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <CustomText translate={false} style={styles.bulletText}>
                        {`${
                            t('preparefullCash') !== 'preparefullCash'
                                ? t('preparefullCash')
                                : i18next.t('Please prepare the full amount in cash')
                        } (${subTotalCalculation(cartData)} $)`}
                    </CustomText>
                </View>
                <View style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <CustomText style={styles.bulletText}>
                        {isAlQadmus
                            ? 'Pay the shipping fee directly to Al Qadmous upon pickup'
                            : 'Pay the courier upon receiving the order'}
                    </CustomText>
                </View>
                <View style={styles.bulletItem}>
                    <View style={styles.bullet} />
                    <CustomText style={styles.bulletText}>
                        Ensure you inspect the products before paying
                    </CustomText>
                </View>
            </View>

            <DarkTitleWithNotes darkTitle={'impNote'} note={'delIncludeCashonDel'} />

            <CustomButton
                title={'confirmOrder'}
                textStyle={{ fontSize: 16 }}
                style={styles.confirmBtn}
                leftIcon={<Feather name="check-circle" size={20} color={colors.white} />}
                disabled={placing}
                onPress={handleConfirm}
            />

            <CustomButton
                title={'Back'}
                style={[styles.primaryButton, { backgroundColor: colors.gray25, height: 50 }]}
                textStyle={{ fontSize: 16 }}
                transparent
                onPress={() => navigation.goBack()}
            />

            <SuccessModal
                hideLine={false}
                modalViewStyle={{ borderRadius: 15 }}
                innerStyle={{ borderRadius: 15 }}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
            />
        </CustomScreenView>
    );
};

export default CashOnDeliveryScreen;

const styles = StyleSheet.create({
    iconCircles: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: colors.brown2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginBottom: 10,
    },
    sectionHeaderTitle: {
        fontSize: 15,
        color: colors.gray23,
    },
    changeBtnText: {
        fontSize: 14,
        color: colors.gray23,
        textDecorationLine: 'underline',
    },
    activeCardContainer: {
        width: '100%',
        backgroundColor: colors.secondary3,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: colors.secondary,
        marginBottom: 15,
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    circleWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    outerCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.secondary,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    addressType: {
        fontSize: 15,
        color: colors.gray23,
        textTransform: 'capitalize',
    },
    defaultBadge: {
        backgroundColor: colors.gray23,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    defaultBadgeText: {
        color: colors.secondary,
        fontSize: 10,
    },
    addressDetailText: {
        fontSize: 12,
        color: colors.gray34,
        marginTop: 1,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth:1,
        borderColor:colors.gray
    },
    methodIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.secondary2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    shippingFeeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: colors.black4,
    },
    shippingFeeLabel: {
        fontSize: 14,
        color: colors.gray23,
    },
    shippingFeeValue: {
        fontSize: 14,
        color: colors.gray23,
    },
    instructionCard: {
        backgroundColor: colors.brown2,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightYellow,
        marginVertical: 20,
    },
    instructionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    instructionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
        color: colors.gray23,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingRight: 10,
    },
    bullet: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.orange3,
        marginTop: 6,
        marginRight: 10,
    },
    bulletText: {
        fontSize: 11,
        lineHeight: 16,
        color: colors.gray22,
        fontWeight: '500',
        flex: 1,
    },
    confirmBtn: {
        flexDirection: 'row',
        backgroundColor: colors.orange3,
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButton: {
        marginBottom: 20,
    },
});


// import React, { useState } from 'react';
// import { StyleSheet, View, Image } from 'react-native';
// import CustomScreenView from '../components/CustomScreenView';
// import { colors } from '../constants/color';
// import CustomButton from '../components/CustomButton';
// import CustomText from '../components/CustomText';
// import BgIconWithTitle from '../components/BgIconWithTitle';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import { useTranslation } from 'react-i18next';
// import DarkTitleWithNotes from '../components/DarkTitleWithNotes';
// import SuccessModal from '../components/SuccessModal';
// import { useDispatch, useSelector } from 'react-redux';
// import { subTotalCalculation } from '../constants/helper';
// import TotalAmountWithDelivery from '../components/TotalAmountWithDelivery';
// import { placeOrder } from '../redux/reducers/Orders';
// import { showMessage } from 'react-native-flash-message';
// import i18next from 'i18next';

// const CashOnDeliveryScreen = ({ navigation, route }) => {
//     const dispatch = useDispatch()
//     const cartData = useSelector((state) => state.cart.cart)
//     const placing = useSelector(s => s?.orders?.placing)
//     const coupon = useSelector(s => s?.checkout?.coupon)
//     const shippingQuote = useSelector(s => s?.cart?.shippingQuote)

//     // Receive selected shippingMethod parameters from previous screen navigation
//     const shippingMethod = route?.params?.shippingMethod || 'door_to_door'
//     const isAlQadmus = shippingMethod === 'al_qadmus'

//     // Set shipping cost to 0 when Al Qadmous is selected
//     const shippingAmount = isAlQadmus ? 0 : Number(shippingQuote?.amount || 0)

//     const { t } = useTranslation();
//     const [modalVisible, setModalVisible] = useState(false)

//     const handleConfirm = async () => {
//         if (placing) return
//         const res = await dispatch(placeOrder({
//             payment_method: 'cod',
//             promo_code: coupon?.code || null,
//             shipping: shippingAmount,
//             shipping_method: shippingMethod,
//         }))
//         if (placeOrder.fulfilled.match(res)) {
//             setModalVisible(true)
//         } else {
//             showMessage({ type: 'danger', message: res.payload?.message || t('orderFailed') })
//         }
//     }

//     return (
//         <CustomScreenView>

            // <BgIconWithTitle
            //     iconStyle={styles.iconCircle}
            //     icon={<Image source={require('../assets/images/Cash.png')} style={{ width: 70, height: 45 }} />}
            //     title={'cashOnDel'}
            //     subTitle={'الدفع عند الاستلام'}
            // />

//             <TotalAmountWithDelivery
//                 themeColor={{ color: colors.orange3 }}
//                 cod={true}
//                 shippingMethod={shippingMethod}
//             />

//             {/* Instructions Section */}
//             <View style={styles.instructionCard}>
//                 <View style={styles.instructionHeader}>
//                     <MaterialIcons name="delivery-dining" size={20} color={colors.orange3} />
//                     <CustomText style={styles.instructionTitle}>cashPaymentInst</CustomText>
//                 </View>

//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>
//                         {isAlQadmus 
//                             ? 'Your order will be sent to the nearest Al Qadmous branch within 3-5 business days'
//                             : 'The order will be delivered to your address within 1-2 business days'
//                         }
//                     </CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText translate={false} style={styles.bulletText}>
//                         {`${t('preparefullCash') !== 'preparefullCash' ? t('preparefullCash') : i18next.t('Please prepare the full amount in cash')} (${subTotalCalculation(cartData)} $)`}
//                     </CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>
//                         {isAlQadmus 
//                             ? 'Pay the shipping fee directly to Al Qadmous upon pickup'
//                             : 'Pay the courier upon receiving the order'
//                         }
//                     </CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>Ensure you inspect the products before paying</CustomText>
//                 </View>
//             </View>

//             <DarkTitleWithNotes
//                 darkTitle={'impNote'}
//                 note={'delIncludeCashonDel'}
//             />

//             <CustomButton
//                 title={'confirmOrder'}
//                 textStyle={{ fontSize: 16 }}
//                 style={styles.confirmBtn}
//                 leftIcon={<Feather name="check-circle" size={20} color={colors.white} />}
//                 disabled={placing}
//                 onPress={handleConfirm}
//             />

//             <CustomButton
//                 title={'Back'}
//                 style={[styles.primaryButton, { backgroundColor: colors.gray25, height: 50 }]}
//                 textStyle={{ fontSize: 16 }}
//                 transparent
//                 onPress={() => navigation.goBack()}
//             />

//             <SuccessModal
//                 hideLine={false}
//                 modalViewStyle={{ borderRadius: 15 }}
//                 innerStyle={{ borderRadius: 15 }}
//                 setModalVisible={setModalVisible}
//                 modalVisible={modalVisible}
//             />

//         </CustomScreenView>
//     );
// };

// export default CashOnDeliveryScreen;

// const styles = StyleSheet.create({
//     iconCircle: {
//         width: 110,
//         height: 110,
//         borderRadius: 55,
//         backgroundColor: colors.brown2,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     instructionCard: {
//         backgroundColor: colors.brown2,
//         borderRadius: 16,
//         padding: 16,
//         borderWidth: 1,
//         borderColor: colors.lightYellow,
//         marginVertical: 20,
//     },
//     instructionHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     instructionTitle: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginLeft: 8,
//         color: colors.gray23,
//     },
//     bulletItem: {
//         flexDirection: 'row',
//         marginBottom: 10,
//         paddingRight: 10,
//     },
//     bullet: {
//         width: 4,
//         height: 4,
//         borderRadius: 2,
//         backgroundColor: colors.orange3,
//         marginTop: 6,
//         marginRight: 10,
//     },
//     bulletText: {
//         fontSize: 11,
//         lineHeight: 16,
//         color: colors.gray22,
//         fontWeight: '500',
//         flex: 1,
//     },
//     confirmBtn: {
//         flexDirection: 'row',
//         backgroundColor: colors.orange3,
//         height: 55,
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     primaryButton: {
//         marginBottom: 20,
//     },
// });



// import React, { useState } from 'react';
// import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
// import CustomScreenView from '../components/CustomScreenView';
// import { colors } from '../constants/color';
// import CustomButton from '../components/CustomButton';
// import CustomText from '../components/CustomText';
// import BgIconWithTitle from '../components/BgIconWithTitle';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Feather from 'react-native-vector-icons/Feather';
// import { useTranslation } from 'react-i18next';
// import ShadowWrapper from '../components/ShadowWrapper';
// import PriceWithUsdValue from '../components/PriceWithUsdValue';
// import DarkTitleWithNotes from '../components/DarkTitleWithNotes';
// import { height } from '../constants/data';
// import SuccessModal from '../components/SuccessModal';
// import { useDispatch, useSelector } from 'react-redux';
// import { dollarSum, subTotalCalculation } from '../constants/helper';
// import TotalAmountWithDelivery from '../components/TotalAmountWithDelivery';
// import { placeOrder } from '../redux/reducers/Orders';
// import { showMessage } from 'react-native-flash-message';
// import i18next from 'i18next';


// const CashOnDeliveryScreen = ({ navigation }) => {
//     const dispatch = useDispatch()
//     const cartData = useSelector((state) => state.cart.cart)
//     const placing = useSelector(s => s?.orders?.placing)
//     const placingg = useSelector(s => s?.orders)
//     const coupon = useSelector(s => s?.checkout?.coupon)
//     const shippingQuote = useSelector(s => s?.cart?.shippingQuote)
//     const shippingAmount = Number(shippingQuote?.amount || 0)


//     const { t } = useTranslation();
//     const [modalVisible, setModalVisible] = useState(false)

//     const handleConfirm = async () => {
//         if (placing) return
//         const res = await dispatch(placeOrder({
//             payment_method: 'cod',
//             promo_code: coupon?.code || null,
//             shipping: Number(shippingQuote?.amount || 0),
//         }))
//         if (placeOrder.fulfilled.match(res)) {
//             setModalVisible(true)
//         } else {
//             showMessage({ type: 'danger', message: res.payload?.message || t('orderFailed') })
//         }
//     }

//     return (
//         <CustomScreenView>

//             <BgIconWithTitle
//                 iconStyle={styles.iconCircle}
//                 icon={<Image source={require('../assets/images/Cash.png')}  style={{width:70,height:45}}/>}
//                 title={'cashOnDel'}
//                 subTitle={'لدفع عند الاستلام'}
//             />

//             <TotalAmountWithDelivery
//                 themeColor={{ color: colors.orange3 }}
//                 cod={true}
//             />

//             {/* Instructions Section */}
//             <View style={styles.instructionCard}>
//                 <View style={styles.instructionHeader}>
//                     <MaterialIcons name="delivery-dining" size={20} color={colors.orange3} />
//                     <CustomText style={styles.instructionTitle}>cashPaymentInst</CustomText>
//                 </View>

//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>The order will be delivered to your address within 3-5 business days</CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText translate={false} style={styles.bulletText}>{`${t('preparefullCash') !== 'preparefullCash' ? t('preparefullCash') : i18next.t('Please prepare the full amount in cash')} (${subTotalCalculation(cartData)} $)`}</CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>Pay the courier upon receiving the order</CustomText>
//                 </View>
//                 <View style={styles.bulletItem}>
//                     <View style={styles.bullet} />
//                     <CustomText style={styles.bulletText}>Ensure you inspect the products before paying</CustomText>
//                 </View>
//             </View>

//             <DarkTitleWithNotes
//                 darkTitle={'impNote'}
//                 note={'delIncludeCashonDel'}
//             />

//             <CustomButton
//                 title={'confirmOrder'}
//                 textStyle={{ fontSize: 16 }}
//                 style={styles.confirmBtn}
//                 leftIcon={<Feather name="check-circle" size={20} color={colors.white} />}
//                 disabled={placing}
//                 onPress={handleConfirm}
//             />

//             <CustomButton
//                 title={'Back'}
//                 style={[styles.primaryButton, { backgroundColor: colors.gray25, height: 50 }]}
//                 textStyle={{ fontSize: 16 }}
//                 transparent
//                 onPress={() => navigation.goBack()}
//             />



//             <SuccessModal
//                 hideLine={false}
//                 modalViewStyle={{ borderRadius: 15 }}
//                 innerStyle={{ borderRadius: 15 }}
//                 setModalVisible={setModalVisible}
//                 modalVisible={modalVisible}
//             />


//         </CustomScreenView>
//     );
// };

// export default CashOnDeliveryScreen;

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//         paddingBottom: 40,
//     },
//     header: {
//         alignItems: 'center',
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     iconCircle: {
//         width: 110,
//         height: 110,
//         borderRadius: 55,
//         backgroundColor: colors.brown2, // Matches the light orange/tan circle
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: '800',
//         color: colors.gray23,
//     },
//     subtitle: {
//         fontSize: 14,
//         color: colors.gray23,
//         marginTop: 2,
//         opacity: 0.8,
//     },
//     summaryCard: {
//         borderWidth: 2,
//         borderColor: colors.blue,
//         borderRadius: 8,
//         padding: 12,
//         backgroundColor: colors.white,
//         marginBottom: 20,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 12,
//     },
//     dottedBorderBottom: {
//         borderBottomWidth: 1,
//         borderBottomColor: colors.blue,
//         borderStyle: 'dashed',
//     },
//     label: {

//         color: colors.gray23,
//     },
//     totalAmount: {
//         fontSize: 18,
//         fontWeight: '800',
//         color: colors.gray23,
//     },
//     usdText: {
//         fontSize: 11,
//         color: colors.gray19,
//     },
//     value: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: colors.gray23,
//     },
//     feeValue: {
//         fontSize: 14,
//         fontWeight: '600',
//         color: colors.orange3,
//     },
//     instructionCard: {
//         backgroundColor: colors.brown2,
//         borderRadius: 16,
//         padding: 16,
//         borderWidth: 1,
//         borderColor: colors.lightYellow,
//         marginVertical: 20,
//     },
//     instructionHeader: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     instructionTitle: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         marginLeft: 8,
//         color: colors.gray23,
//     },
//     bulletItem: {
//         flexDirection: 'row',
//         marginBottom: 10,
//         paddingRight: 10,
//     },
//     bullet: {
//         width: 4,
//         height: 4,
//         borderRadius: 2,
//         backgroundColor: colors.orange3,
//         marginTop: 6,
//         marginRight: 10,
//     },
//     bulletText: {
//         fontSize: 11,
//         lineHeight: 16,
//         color: colors.gray22,
//         fontWeight: '500',
//         flex: 1,
//     },
//     noteBox: {
//         backgroundColor: colors.purple4,
//         padding: 15,
//         borderRadius: 12,
//         borderWidth: 1,
//         borderColor: colors.purple3,
//         marginBottom: 25,
//     },
//     noteText: {
//         fontSize: 12,
//         lineHeight: 18,
//         textAlign: 'center',
//         color: colors.gray21,
//     },
//     confirmBtn: {
//         flexDirection: 'row',
//         backgroundColor: colors.orange3,
//         height: 55,
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 12,
//     },
//     confirmBtnText: {
//         color: colors.white,
//         fontWeight: '700',
//         fontSize: 16,
//     },
//     backBtn: {
//         height: 55,
//         borderRadius: 12,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: colors.purple4,
//         borderWidth: 1,
//         borderColor: colors.purple3,
//     },
//     backBtnText: {
//         color: colors.gray23,
//         fontWeight: '700',
//         fontSize: 16,
//     },
// });