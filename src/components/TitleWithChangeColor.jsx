import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import i18next from 'i18next'

const TitleWithChangeColor = ({ title, colorText, subTitle, semiBold, style, subTitleStyle ,textStyle,subTitleText,colorTextStyle}) => {
    return (
        <View>
            <View style={[{ alignSelf: "center", marginTop: 15, }, style]}>
                <CustomText translate={false} style={[{ textAlign: 'center', textTransform: "capitalize", fontSize: 30, },textStyle]} semiBold={semiBold}>{i18next.t(title)} <CustomText translate={false} style={[{ fontSize: 26, color: colors.secondary },colorTextStyle]} semiBold={semiBold}>{i18next.t(colorText)}</CustomText></CustomText>
            </View>

            <View style={[{ marginTop: 18, marginBottom: 15 }, subTitleStyle]} >
                <CustomText style={[{ textAlign: 'center', color: colors.gray19, lineHeight: 20 },subTitleText]} s >{subTitle}</CustomText>
            </View>
        </View>
    )
}

export default TitleWithChangeColor

const styles = StyleSheet.create({})