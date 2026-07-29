import { StyleSheet, View } from 'react-native'
import React from 'react'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import PriceWithUsdValue from '../components/PriceWithUsdValue'
import { useSelector } from 'react-redux'
import { colors } from '../constants/color'
import { subTotalCalculation } from '../constants/helper'
import { useTranslation } from 'react-i18next'

const TotalAmountWithDelivery = ({ themeColor, cod, shippingMethod }) => {
    const { i18n } = useTranslation()
    const cartData = useSelector((state) => state.cart.cart)
    const coupon = useSelector(s => s?.checkout?.coupon)
    const shippingQuote = useSelector(s => s?.cart?.shippingQuote)

    const subTotal = subTotalCalculation(cartData)
    
    // Set shipping amount to 0 if method is Al Qadmous
    const isAlQadmus = shippingMethod === 'al_qadmus'
    const shippingAmount = isAlQadmus ? 0 : Number(shippingQuote?.amount || 0)
    
    const discount = Math.min(Number(coupon?.discount_amount || 0), subTotal)
    const total = Math.max(subTotal + shippingAmount - discount, 0)

    const lang = i18n.language || 'en'

    return (
        <ShadowWrapper style={styles.summaryCard}>
            <View style={styles.row}>
                <CustomText bold xl>totalAmount</CustomText>
                <View style={{ alignItems: 'flex-end' }}>
                    <PriceWithUsdValue
                        price={total}
                        approxPrice
                    />
                    {isAlQadmus && (
                        <CustomText s bold style={{ color: colors.orange3, marginTop: 4 }}>
                            {lang === 'ar'
                                ? `يدفع للمكتب عند الاستلام: $${shippingQuote?.rate_displayed || 0}`
                                : `Pay carrier on delivery: $${shippingQuote?.rate_displayed || 0}`
                            }
                        </CustomText>
                    )}
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
                <CustomText semiBold style={{ color: colors.gray22 }}>orderValue</CustomText>
                <PriceWithUsdValue
                    price={subTotal}
                    priceStyle={[{ fontSize: 14 }, themeColor]}
                    themeColor={themeColor}
                />
            </View>

            {discount > 0 && <View style={styles.divider} />}

            {discount > 0 && (
                <View style={styles.row}>
                    <CustomText semiBold style={{ color: colors.gray22 }}>discountLabel</CustomText>
                    <PriceWithUsdValue
                        price={`-${discount}`}
                        priceStyle={[{ fontSize: 14 }, themeColor]}
                        themeColor={themeColor}
                    />
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
                <CustomText semiBold style={{ color: colors.gray22 }}>delFee</CustomText>
                {isAlQadmus ? (
                    <CustomText bold style={{ fontSize: 14, color: colors.orange3 }}>
                        {/* {lang === 'ar' ? 'يدفع عند الاستلام' : 'Paid at pickup'} */}
                        0
                    </CustomText>
                ) : (
                    <PriceWithUsdValue
                        price={shippingAmount > 0 ? shippingAmount : 'free'}
                        priceStyle={[{ fontSize: 14 }]}
                        themeColor={themeColor}
                    />
                )}
            </View>

            {cod && (
                <>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <CustomText semiBold style={{ color: colors.gray22 }}>COD Fees</CustomText>
                        <PriceWithUsdValue
                            price={'free'}
                            priceStyle={[{ fontSize: 14 }]}
                            themeColor={themeColor}
                        />
                    </View>
                </>
            )}
        </ShadowWrapper>
    )
}

export default TotalAmountWithDelivery

const styles = StyleSheet.create({
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
        marginTop: 25,
        marginBottom: 10,
    }
});


// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import ShadowWrapper from '../components/ShadowWrapper'
// import CustomText from '../components/CustomText'
// import PriceWithUsdValue from '../components/PriceWithUsdValue'
// import { useSelector } from 'react-redux'
// import { colors } from '../constants/color'
// import { dollarSum, subTotalCalculation } from '../constants/helper'

// const TotalAmountWithDelivery = ({ themeColor, cod }) => {
//     const cartData = useSelector((state) => state.cart.cart)
//     const coupon = useSelector(s => s?.checkout?.coupon)
//     const shippingQuote = useSelector(s => s?.cart?.shippingQuote)
//     console.log('shippingQuoteshippingQuote',shippingQuote)

//     const subTotal = subTotalCalculation(cartData)
//     const shippingAmount = Number(shippingQuote?.amount || 0)
//     const discount = Math.min(Number(coupon?.discount_amount || 0), subTotal)
//     const total = Math.max(subTotal + shippingAmount - discount, 0)

//     return (

//         <ShadowWrapper style={styles.summaryCard}>
//             <View style={styles.row}>
//                 <CustomText bold xl>totalAmount</CustomText>
//                 <PriceWithUsdValue
//                     price={total}
//                     approxPrice
//                 />
//             </View>

//             <View style={styles.divider} />

//             <View style={styles.row}>
//                 <CustomText semiBold style={{ color: colors.gray22 }}>orderValue</CustomText>
//                 <PriceWithUsdValue
//                     price={subTotal}
//                     priceStyle={[{ fontSize: 14 }, themeColor]}
//                     themeColor={themeColor}
//                 />

//             </View>


//             {
//                 discount > 0 &&
//                 <View style={styles.divider} />

//             }


//             {
//                 discount > 0 &&
//                 <View style={[styles.row, {}]}>
//                     <CustomText semiBold style={{ color: colors.gray22 }}>discountLabel</CustomText>
//                     <PriceWithUsdValue
//                         price={`-${discount}`}
//                         priceStyle={[{ fontSize: 14 }, themeColor]}
//                         themeColor={themeColor}
//                     />
//                 </View>
//             }


//             <View style={styles.divider} />

//             <View style={[styles.row, {}]}>
//                 <CustomText semiBold style={{ color: colors.gray22 }}>delFee</CustomText>
//                 <PriceWithUsdValue
//                     price={shippingAmount > 0 ? shippingAmount : 'free'}
//                     priceStyle={[{ fontSize: 14, },]}
//                     themeColor={themeColor}
//                 />
//             </View>

//             {
//                 cod &&
//                 <>
//                     <View style={styles.divider} />
//                     <View style={[styles.row, {}]}>
//                         <CustomText semiBold style={{ color: colors.gray22 }}>COD Fees</CustomText>
//                         <PriceWithUsdValue
//                             price={'free'}
//                             priceStyle={[{ fontSize: 14, },]}
//                             themeColor={themeColor}
//                         />
//                     </View>
//                 </>
//             }

//         </ShadowWrapper>
//     )
// }

// export default TotalAmountWithDelivery

// const styles = StyleSheet.create({
//     container: {
//         padding: 20,
//     },
//     summaryCard: {
//         backgroundColor: colors.white,
//         padding: 20,
//         borderRadius: 16,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     divider: {
//         height: 1,
//         backgroundColor: colors.gray13,
//         marginTop: 25,
//         marginBottom: 10,
//     },
//     cardSelector: {
//         backgroundColor: colors.white,
//         padding: 16,
//         borderRadius: 16,
//         marginBottom: 20,
//     },
//     cardInputDisplay: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         backgroundColor: colors.gray14,
//         borderWidth: 1,
//         borderColor: colors.purple3,
//         borderRadius: 12,
//         padding: 15,
//     },
//     editBtn: {
//         marginTop: 10,
//         alignSelf: 'flex-start',
//     },
//     orDivider: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginVertical: 15,
//     },
//     line: {
//         flex: 1,
//         height: 1,
//         backgroundColor: colors.gray13,
//     },
//     addCardBtn: {
//         backgroundColor: colors.gray23,
//         height: 50,
//     },
//     securityBox: {
//         flexDirection: 'row',
//         backgroundColor: colors.secondary3,
//         borderWidth: 1,
//         borderColor: colors.secondary,
//         borderRadius: 10,
//         padding: 12,
//         alignItems: 'center',
//         marginBottom: 20,
//     },
//     securityText: {
//         marginLeft: 10,
//         color: colors.gray23,
//         flex: 1,
//     },
//     payNowBtn: {
//         backgroundColor: colors.purple,
//         marginBottom: 12,
//     },
//     backBtn: {
//         marginBottom: 30,
//         borderColor: colors.purple3,
//     },
//     footer: {
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     cardLogos: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         gap: 20
//     },
//     logoPlaceholder: {
//         padding: 5,
//         opacity: 0.8
//     }
// });