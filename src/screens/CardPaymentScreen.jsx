


import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { placeOrder } from '../redux/reducers/Orders';
import { fetchCards } from '../redux/reducers/Payments';
import CustomScreenView from '../components/CustomScreenView';
import { colors } from '../constants/color';
import CustomButton from '../components/CustomButton';
import CustomText from '../components/CustomText';
import BgIconWithTitle from '../components/BgIconWithTitle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ShadowWrapper from '../components/ShadowWrapper';
import TotalAmountWithDelivery from '../components/TotalAmountWithDelivery';
import RemoteImage from '../components/RemoteImage';
import { height, width } from '../constants/data';
import SuccessModal from '../components/SuccessModal';

const CardPaymentScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [modalVisible, setModalVisible] = useState(false)
    const cards = useSelector(s => s?.payments?.cards) || []
    const placing = useSelector(s => s?.orders?.placing)
    const coupon = useSelector(s => s?.checkout?.coupon)
    const shippingQuote = useSelector(s => s?.checkout?.shipping)

    useEffect(() => { dispatch(fetchCards()) }, [dispatch])

    const defaultCard = cards.find(c => c.is_default) || cards[0]
    const cardMask = defaultCard?.last4 ? `**** **** **** ${defaultCard.last4}` : null

    const handlePayNow = async () => {
        if (placing) return
        if (!defaultCard) {
            showMessage({ type: 'warning', message: 'Please add a card first' })
            return
        }
        const res = await dispatch(placeOrder({
            payment_method: 'card',
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
        <CustomScreenView >

            <BgIconWithTitle
                title="Visa / Mastercard"
                subTitle="بطاقة فيزا / ماستركارد"
                icon={<MaterialIcons name="credit-card" size={60} color={colors.purple} />}
                iconStyle={{ backgroundColor: colors.purple4 }}
            />

            {/* Pricing Summary Card */}
            {/* <ShadowWrapper style={styles.summaryCard}>
                <View style={styles.row}>
                    <CustomText bold xl>totalAmount</CustomText>
                    <PriceWithUsdValue
                        price={'3,555,500'}
                        usdPrice={'$25.00'}
                    />
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                    <CustomText semiBold gray>orderValue</CustomText>
                    <PriceWithUsdValue
                        price={'3,555,500'}
                        priceStyle={{ fontSize: 14 }}
                    />
                </View>

                <View style={[styles.row, { marginTop: 15 }]}>
                    <CustomText semiBold gray>delFee</CustomText>
                    <PriceWithUsdValue
                        price={'3,555,500'}
                        priceStyle={{ fontSize: 14, color: colors.purple }}
                    />
                </View>
            </ShadowWrapper> */}
            <TotalAmountWithDelivery
                themeColor={{ color: colors.purple }}
            />

            <ShadowWrapper style={styles.cardSelector}>
                <CustomText semiBold s style={{ color: colors.gray21, marginBottom: 10 }}>cardNo</CustomText>

                <View style={styles.cardInputDisplay}>
                    <CustomText gray translate={false}>{cardMask || '— no saved card —'}</CustomText>
                    <FontAwesome name="hashtag" size={14} color={colors.gray21} />
                </View>

                <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AddNewCardScreen')}>
                    <CustomText semiBold style={{ color: colors.secondary }}>edit</CustomText>
                </TouchableOpacity>

                <View style={styles.orDivider}>
                    <View style={styles.line} />
                    <CustomText gray xs style={{ marginHorizontal: 10 }}>or</CustomText>
                    <View style={styles.line} />
                </View>

                <CustomButton
                    title={'addNewCard'}
                    style={styles.addCardBtn}
                    onPress={() => navigation.navigate('AddNewCardScreen')}
                />
            </ShadowWrapper>

            {/* Encryption Protection Box */}
            <View style={styles.securityBox}>
                <Feather name="check-circle" size={18} color={colors.secondary} />
                <CustomText xs style={styles.securityText} medium>
                    informationProtected
                </CustomText>
            </View>

            {/* Action Buttons */}
            <CustomButton
                title="payNow"
                increaseHeight
                style={styles.payNowBtn}
                disabled={placing}
                onPress={handlePayNow}
                leftIcon={<FontAwesome name="dollar" size={16} color={colors.white} style={{ marginRight: -5 }} />}
            />

            <CustomButton
                title="back"
                transparent
                increaseHeight
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            />

            {/* Accepted Cards Footer */}
            <View style={styles.footer}>
                <CustomText gray xs semiBold style={{ marginBottom: 15 }}>acceptedcard</CustomText>
                <View style={styles.cardLogos}>
                    <RemoteImage
                        uri={'https://static.vecteezy.com/system/resources/thumbnails/020/975/570/small_2x/visa-logo-visa-icon-transparent-free-png.png'}
                        style={{ width: 70, height: 40 }}
                        resizeMode='contain'
                    />

                    <RemoteImage
                        uri={'https://download.logo.wine/logo/Mastercard/Mastercard-Logo.wine.png'}
                        style={{ width: 70, height: 40 }}
                        resizeMode='contain'

                    />
                </View>
            </View>




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

export default CardPaymentScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    summaryCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 16,
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
    cardSelector: {
        backgroundColor: colors.white,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    cardInputDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.gray14,
        borderWidth: 1,
        borderColor: colors.purple3,
        borderRadius: 12,
        padding: 15,
    },
    editBtn: {
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray13,
    },
    addCardBtn: {
        backgroundColor: colors.gray23,
        height: 50,
    },
    securityBox: {
        flexDirection: 'row',
        backgroundColor: colors.secondary3,
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    securityText: {
        marginLeft: 10,
        color: colors.gray23,
        flex: 1,
    },
    payNowBtn: {
        backgroundColor: colors.purple,
        marginBottom: 12,
    },
    backBtn: {
        marginBottom: 30,
        borderColor: colors.purple3,
    },
    footer: {
        alignItems: 'center',
        marginTop: 10,
    },
    cardLogos: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20
    },
    logoPlaceholder: {
        padding: 5,
        opacity: 0.8
    }
});