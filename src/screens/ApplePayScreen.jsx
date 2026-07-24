
import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import CustomScreenView from '../components/CustomScreenView';
import { colors } from '../constants/color';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import BgIconWithTitle from '../components/BgIconWithTitle';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ShadowWrapper from '../components/ShadowWrapper';
import PriceWithUsdValue from '../components/PriceWithUsdValue';
import i18next from 'i18next';
import BorderLine from '../components/BorderLine';
import { dollarSum, subTotalCalculation } from '../constants/helper';
import { useDispatch, useSelector } from 'react-redux';
import SuccessModal from '../components/SuccessModal';
import { placeOrder } from '../redux/reducers/Orders';
import { showMessage } from 'react-native-flash-message';

const ApplePayScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false)

    const cartData = useSelector((state) => state.cart.cart)
    const placing = useSelector(s => s?.orders?.placing)
    const coupon = useSelector(s => s?.checkout?.coupon)
    const shippingQuote = useSelector(s => s?.checkout?.shipping)

    const handlePayNow = async () => {
        if (placing) return
        const res = await dispatch(placeOrder({
            payment_method: 'apple_pay',
            promo_code: coupon?.code || null,
            shipping: Number(shippingQuote?.amount || 0),
        }))
        if (placeOrder.fulfilled.match(res)) {
            setModalVisible(true)
        } else {
            showMessage({ type: 'danger', message: res.payload?.message || 'Order failed' })
        }
    }

    return (
        <CustomScreenView>

            <BgIconWithTitle
                title="applePay"
                subTitle="fastSecure"
                icon={<FontAwesome5 name="apple-pay" size={70} color={colors.black} />}
                iconStyle={{ backgroundColor: colors.gray18 }}
            />

            <ShadowWrapper style={styles.summaryCard}>
                <View style={styles.row}>
                    <CustomText bold xl>totalAmount</CustomText>
                    <PriceWithUsdValue
                        price={subTotalCalculation(cartData)}
                        usdPrice={dollarSum(cartData)}
                        usdRight
                    />
                </View>

                <BorderLine centerLine moreTopSpace />
                <View style={styles.row}>
                    <CustomText semiBold gray>orderValue</CustomText>
                    <PriceWithUsdValue
                        price={subTotalCalculation(cartData)}
                        priceStyle={{ fontSize: 14 }}
                    />
                </View>
                <BorderLine centerLine moreTopSpace />
                <View style={[styles.row, {}]}>
                    <CustomText semiBold gray>delFee</CustomText>
                    <PriceWithUsdValue
                        price={'free'}
                        priceStyle={{ fontSize: 14 }}
                    />
                </View>

            </ShadowWrapper>

            <View style={styles.securityInfoCard}>
                <Feather name="shield" size={20} color={colors.gray21} style={{ marginRight: 12 }} />
                <CustomText xs style={styles.securityText} translate={false}>
                    <CustomText style={{ color: colors.gray23 }} semiBold >{i18next.t('completeScure')}</CustomText>
                    {i18next.t('applePayProtected')}
                </CustomText>
            </View>

            <CustomButton
                title="payNow"
                increaseHeight
                style={styles.applePayBtn}
                disabled={placing}
                onPress={handlePayNow}
                leftIcon={<FontAwesome5 name="apple" size={18} color={colors.white} style={{ marginRight: 5 }} />}
            />

            <CustomButton
                title="back"
                transparent
                increaseHeight
                style={styles.backBtn}
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

export default ApplePayScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.gray13,
        marginVertical: 20,
    },
    securityInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray13,
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
    },
    securityText: {
        flex: 1,
        color: colors.gray21,
        lineHeight: 16,
    },
    applePayBtn: {
        backgroundColor: colors.black,
        marginBottom: 12,
        borderRadius: 12,
    },
    backBtn: {
        borderColor: colors.purple3,
        borderRadius: 12,
    },
});