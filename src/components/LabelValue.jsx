import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import { colors } from '../constants/color'
import { currency } from '../constants/data'
import PriceSymbol from './PriceSymbol'
import { fonts } from '../constants/fonts'
import PriceWithUsdValue from './PriceWithUsdValue'

const LabelValue = ({ label, value, black, percentage, style,approxColor, approxPrice, grayBold,priceText,discountSymbol,percentageStyle }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <CustomText style={[{ color: colors.gray22, fontSize: 15 }, black && { color: colors.black }, grayBold && { color: colors.gray19, fontFamily: fonts.medium }, style]}>{label}</CustomText>
            {/* <CustomText style={{ fontSize: 16 }} semiBold  translate={false} >{value} {percentage ? '' : <PriceSymbol style={{ fontFamily: fonts.medium }} />}</CustomText> */}
            {
                percentage ?
                    <CustomText style={[{ fontSize: 16 },percentageStyle]} semiBold translate={false} >{value} {''}</CustomText>
                    :

                    <PriceWithUsdValue
                        price={value}
                        approxPrice={approxPrice}
                        priceText={priceText}
                        discountSymbol={discountSymbol}
                        approxColor={approxColor}
                    />
            }


        </View>
    )
}

export default LabelValue

const styles = StyleSheet.create({})