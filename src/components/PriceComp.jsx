import { I18nManager, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import { fonts } from '../constants/fonts'
import { colors } from '../constants/color'

const PriceComp = ({ discountPrice, price, equalent, discountStyle, discountSymbol, approxColor,discountCont, showDiscount, small, priceText, priceDolar, approxStyle, priceBoxStyle, innerPriceStyle, style }) => {
    const percentage = (price && discountPrice)
        ? Math.round(((price - discountPrice) / price) * 100)
        : 0;

    return (
        <View style={[{ gap: 3 }, style]}>
            <View style={[{ flexDirection: "row", alignContent: "center", gap: 6 }, priceBoxStyle]}>
                {
                    discountPrice &&
                    <View style={[{ flexDirection: "row", alignItems: "center", gap: 3 }, discountCont]}>
                        <CustomText xxxl bold style={[small && { fontSize: 14, fontFamily: fonts.medium }, discountStyle]}>{discountPrice?.toLocaleString()}</CustomText>
                        <CustomText xxxl bold style={[small && { fontSize: 14, fontFamily: fonts.medium }, discountSymbol]}>$</CustomText>
                    </View>
                }
                {
                    price &&
                    <View style={[{ flexDirection: "row", alignItems: "center", gap: 3 }, innerPriceStyle]}>
                        <CustomText light xl gray style={[small && { fontSize: 14 }, { textDecorationLine: "line-through", }, priceText]}>{price?.toLocaleString()}</CustomText>
                        <CustomText light xl gray style={[small && { fontSize: 14 }, { textDecorationLine: "line-through", }, priceDolar]}>$</CustomText>
                    </View>
                }


                {
                    showDiscount && percentage !== 0 &&
                    <View style={{ backgroundColor: colors.red4, margin: "auto", paddingHorizontal: 5, paddingVertical: 3, }}>
                        <CustomText style={{ color: colors.red }} xs translate={false}>-{percentage}%</CustomText>
                    </View>
                }



            </View>

            {
                equalent &&
                <View style={[{ flexDirection: "row", alignItems: "center", gap: 2 }, approxStyle]}>
                    <CustomText xxl style={approxColor}>≈</CustomText>
                    <CustomText medium xs style={approxColor}>{equalent?.toLocaleString()}</CustomText>
                    <CustomText semiBold xs style={approxColor}>SYP</CustomText>
                </View>
            }





        </View>

    )
}

export default PriceComp

const styles = StyleSheet.create({})