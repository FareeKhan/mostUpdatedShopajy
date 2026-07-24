import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'

const DollarText = ({usdPrice,usdRight}) => {
    return (
        <CustomText style={[{ color: colors.gray20, },usdRight && {textAlign:'right'}]} s translate={false}>≈ {usdPrice?.toLocaleString()} USD</CustomText>
    )
}

export default DollarText

const styles = StyleSheet.create({})