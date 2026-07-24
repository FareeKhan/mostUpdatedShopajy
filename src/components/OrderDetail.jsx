import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import CartData from './CartData'
import LabelValue from './LabelValue'
import BorderLine from './BorderLine'
import { dollarSum, subTotalCalculation } from '../constants/helper'
import { colors } from '../constants/color'
import { fonts } from '../constants/fonts'
import PriceWithUsdValue from './PriceWithUsdValue'

const OrderDetail = ({ data, orderId, shipping, orderDate, discount = 0, showQuantity, isRating }) => {

    const formattedDate = new Date(orderDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });


    return (
        <View style={{ marginTop: 20 }}>
            <View style={{ alignItems: "flex-end", marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <CustomText semiBold >Order</CustomText>
                    <CustomText semiBold translate={false}>#{orderId}</CustomText>
                </View>
                <CustomText xxs semiBold style={{ color: colors.black1 }}>{formattedDate}</CustomText>
            </View>

            <CartData
                data={data}
                removeCounter={false}
                showQuantity
                isRating={isRating}
            />


            <LabelValue
                label={'subTotal'}
                value={subTotalCalculation(data)}
            />

            {
                !!discount &&
                <LabelValue
                    label={'discountLabel'}
                    value={`-${discount}`}
                />
            }



            <LabelValue
                label={'shipping'}
                value={
                    shipping ?
                        <PriceWithUsdValue
                            price={shipping}
                        /> : 'Free'}
                percentage
            />

            <BorderLine centerLine style={styles.borderLine} />

            <LabelValue
                label={'total'}
                value={subTotalCalculation(data) + (shipping || 0) - discount}
                black
                style={styles.totalText}
                approxPrice

            />
        </View>
    )
}

export default OrderDetail

const styles = StyleSheet.create({
    totalText: {
        fontFamily: fonts.semiBold,
    },
    borderLine: {
        marginBottom: 10,
    },
})