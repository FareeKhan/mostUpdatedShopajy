import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, } from 'react-native';
import CustomScreenView from '../components/CustomScreenView';
import { colors } from '../constants/color';
import ShadowWrapper from '../components/ShadowWrapper';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import BgIconWithTitle from '../components/BgIconWithTitle';
import PriceWithUsdValue from '../components/PriceWithUsdValue';
import Clipboard from '@react-native-clipboard/clipboard';

import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { dollarSum, subTotalCalculation } from '../constants/helper';
import { fonts } from '../constants/fonts';
import { placeOrder } from '../redux/reducers/Orders';
import TotalAmountWithDelivery from '../components/TotalAmountWithDelivery';


const ShamCashScreen = () => {
    const dispatch = useDispatch()
    const cartData = useSelector((state) => state.cart.cart)
    const order = useSelector(s => s?.orders?.current)
    const placing = useSelector(s => s?.orders?.placing)
    const paymentCode = useSelector(s => s?.settings?.values?.sham_cash_payment_code) || 'PAY-456-2024'
    const methods = useSelector(s => s?.payments?.methods)

    const coupon = useSelector(s => s?.checkout?.coupon)
    const shippingQuote = useSelector(s => s?.cart?.shippingQuote)
    const { t } = useTranslation()
    const navigation = useNavigation()
    const placed = React.useRef(false)

    const shamCashData = methods?.find((item) => item?.code == 'sham_cash')


    React.useEffect(() => {
        if (placed.current) return
        placed.current = true
        dispatch(placeOrder({
            payment_method: 'sham_cash',
            promo_code: coupon?.code || null,
            shipping: Number(shippingQuote?.amount || 0),
        })).then(res => {
            if (!placeOrder.fulfilled.match(res) && cartData?.length == 0) {
                showMessage({ type: 'danger', message: res.payload?.message || 'Order failed' })
                navigation.goBack()
            }
        })
    }, [dispatch, navigation, coupon?.code, shippingQuote?.amount])

    const orderNumber = order?.id || '-'

    const handleClipboard = () => {
        Clipboard.setString(paymentCode);
        showMessage({
            type: "success",
            message: t('yourCodeisCopied'),
        })
    }

    return (
        <CustomScreenView>

            <BgIconWithTitle
                icon={<MaterialIcons name={'qr-code-2'} color={colors.blue} size={40} />}
                iconStyle={styles.logoCircle}
                title={'completePayment'}
                subTitle={'scanQrSham'}

            />
            {/* Order Details Card */}
            <ShadowWrapper>
                <View style={styles.row}>
                    <CustomText style={{ color: colors.gray22 }} l medium  >orderNumber</CustomText>
                    <Text style={styles.valueBold}>#{orderNumber}</Text>
                </View>
            <View style={styles.divider} />

                <View style={[styles.row, {  }]}>
                    <CustomText style={{ color: colors.black }} l medium >totalAmount</CustomText>
                    <PriceWithUsdValue
                        price={subTotalCalculation(cartData) +shippingQuote?.amount }
                        usdRight
                        usdPrice={dollarSum(cartData)}
                        priceStyle={styles.amountText}
                        approxPrice
                        priceText={{fontSize:20}}
                        approxColor={{color:colors.gray21}}
                    />
                </View>
            <View style={styles.divider} />

                <View style={styles.row}>
                    <CustomText style={{ color: colors.gray22 }} l  medium >delFee</CustomText>
                    <PriceWithUsdValue
                        price={shippingQuote?.amount ? String(shippingQuote?.amount) : 'free'}
                        discountSymbol={{color:colors.gray21,fontFamily:fonts.regular}}
                        priceText={{color:colors.gray21,fontFamily:fonts.regular}}

                    />
                </View>
            </ShadowWrapper>



            {/* <ShadowWrapper>
                <View style={styles.qrPlaceholder}>
                    <MaterialIcons name={'qr-code-2'} color={colors.gray2} size={180} />
                </View>
                <CustomText style={styles.refHint} medium>scanToPay</CustomText>

            </ShadowWrapper> */}


            <ShadowWrapper>
                <View style={styles.qrContainer}>
                    {shamCashData?.qr_image_url ? (
                        <Image
                            source={{ uri: shamCashData.qr_image_url }}
                            style={styles.qrImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <MaterialIcons name={'qr-code-2'} color={colors.gray2} size={180} />
                    )}
                </View>
                <CustomText style={styles.refHint} medium>scanToPay</CustomText>
            </ShadowWrapper>

            <ShadowWrapper>
                <View style={styles.row}>
                    <CustomText style={styles.refLabel} bold>paymentReference</CustomText>
                    <Ionicons name={'sparkles-outline'} size={15} color={colors.blue} />
                </View>

                <View style={styles.copyContainer}>
                    <TouchableOpacity onPress={handleClipboard} style={styles.copyButton}>
                        <Feather name={'copy'} size={20} color={colors.white} />
                    </TouchableOpacity>
                    <View style={styles.refValueContainer}>
                        <Text style={styles.refText}>{paymentCode}</Text>
                    </View>
                </View>
                <CustomText style={styles.refHint} medium>referncePaymentNotes</CustomText>
            </ShadowWrapper>

            {/* Instructions Section */}
            <View style={styles.instructionCard}>
                <Text style={styles.instructionTitle}>تعليمات الدفع:</Text>
                <Text style={styles.instructionItem}>1- Scan the QR code using the Sham Cash app</Text>
                <Text style={styles.instructionItem}>{`2- Enter the amount: ${order?.total ? order.total : subTotalCalculation(cartData)} $`}</Text>
                <Text style={styles.instructionItem}>{`3- Add the reference: ${paymentCode}`}</Text>
                <Text style={styles.instructionItem}>4- Enter the transaction ID in the next screen</Text>
                <Text style={styles.instructionItem}>5- Complete the payment process</Text>
            </View>


            <CustomButton
                title={'haveCompletePayment'}
                style={styles.primaryButton}
                textStyle={{ fontSize: 16 }}
                arrow
                disabled={placing || !order?.id}
                onPress={() => navigation.navigate('ShamCashPaymentVerification')}
            />


            <CustomButton
                title={'Back'}
                style={[styles.primaryButton, { backgroundColor: colors.gray25, marginTop: 20 }]}
                textStyle={{ fontSize: 16 }}
                transparent
                onPress={() => navigation.goBack()}
            />



        </CustomScreenView>
    );
};

export default ShamCashScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.lightPurple,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    placeholderLogo: {
        width: 50,
        height: 50,
        backgroundColor: colors.blue,
        borderRadius: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.gray23,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 12,
        color: colors.gray23,
        opacity: 0.8,
    },
    card: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.gray13,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: colors.gray21,
        fontWeight: '500',
    },
    valueBold: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.gray23,
    },
    amountText: {
        fontSize: 20,

        color: colors.gray23,
    },
    usdText: {
        fontSize: 12,
        color: colors.gray19,
    },
    deliveryFee: {
        color: colors.gray21,
    },
    qrCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: colors.gray13,
    },
    qrPlaceholder: {
        width: '100%',
        aspectRatio: 1.2,
        backgroundColor: colors.gray15,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    placeholderLogoLarge: {
        width: 80,
        height: 80,
        backgroundColor: colors.gray2,
        borderRadius: 10,
        opacity: 0.5
    },
    qrFooterText: {
        fontSize: 11,
        color: colors.gray23,
        textAlign: "center"
    },
    refLabel: {
        color: colors.gray23,
    },
    copyContainer: {
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 15,
    },
    copyButton: {
        backgroundColor: colors.blue1,
        height: 50,
        width: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center"
    },
    refValueContainer: {
        flex: 1,
        backgroundColor: colors.gray14,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderRadius: 10,
        height: 50,
        width: 50,
    },
    refText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.blue,
        letterSpacing: 1,
    },
    refHint: {
        fontSize: 11,
        color: colors.gray21,
        textAlign: 'center',
    },
    instructionCard: {
        backgroundColor: colors.brown2,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.lightYellow,
        marginVertical: 20,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'right',
        marginBottom: 10,
        color: colors.black,
    },
    instructionItem: {
        fontSize: 12,
        color: colors.gray22,
        marginBottom: 6,
        fontWeight: '500',
    },
    primaryButton: {
        height: 50
    },
    primaryButtonText: {
        color: colors.white,
        fontWeight: '700',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: colors.gray25,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.purple3,
    },
    secondaryButtonText: {
        color: colors.gray23,
        fontWeight: '700',
        fontSize: 16,
    },
    qrContainer: {
        width: '100%',
        aspectRatio: 1, // Keeps the QR square
        backgroundColor: colors.white,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: 12,
        overflow: 'hidden', // Ensures image fits the radius
    },
    qrImage: {
        width: '90%',
        height: '90%',
    },
     divider: {
        height: 1,
        backgroundColor: colors.gray13,
        marginTop: 25,
        marginBottom: 10,
    },
});