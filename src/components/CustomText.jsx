import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { colors } from '../constants/color'
import { fonts } from '../constants/fonts'

const CustomText = ({ children, xxs, xs, s, l, xl, xxl, extraLarge, xxxl, medium, numberOfLines, semiBold, bold, style, light, gray, translate = true, ...props }) => {
    const { t } = useTranslation()


    // Determine fontFamily based on props
    let fontFamily = fonts.regular
    if (medium) fontFamily = fonts.medium
    if (semiBold) fontFamily = fonts.semiBold
    if (bold) fontFamily = fonts.bold
    if (light) fontFamily = fonts.light


    let fontSize = 14
    if (xxs) fontSize = 10
    if (xs) fontSize = 12
    if (s) fontSize = 13
    if (l) fontSize = 15
    if (xl) fontSize = 16
    if (xxl) fontSize = 16
    if (xxxl) fontSize = 17
    if (extraLarge) fontSize = 20

    const text = translate ? t(children) : children
    return (
        <Text numberOfLines={numberOfLines} style={[styles.title, { fontFamily }, { fontSize }, gray && { color: colors.gray19 }, style]}  {...props} >{text}</Text>
    )
}

export default CustomText

const styles = StyleSheet.create({
    title: {
        color: colors.black,
        textAlign: "left",

    }
})