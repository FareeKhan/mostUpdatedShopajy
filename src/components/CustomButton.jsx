import { I18nManager, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { colors } from '../constants/color'
import { fonts } from '../constants/fonts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'

const CustomButton = ({ title, disabled, mh, rightIcon, increaseHeight, arrow, style, bag, onPress, plus, transparent, textStyle, iconStyle, leftIcon }) => {
    const { t } = useTranslation()
    return (
        <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[
                styles.button,
                mh && styles.marginHorizontal,
                transparent && { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.gray4 },
                disabled && { backgroundColor: colors.gray },
                increaseHeight && { height: 50 },
                style,
            ]}
        >
            {plus && <AntDesign name="plus" size={20} color={colors.black} style={iconStyle} />}
            {bag && <Feather name="shopping-bag" size={20} color={colors.purple} />}
            {leftIcon && leftIcon}

            <Text style={[styles.buttonText, transparent && { color: colors.black, fontSize: 17, fontFamily: fonts.regular }, increaseHeight && { fontSize: 17 }, textStyle]}>{t(title)}</Text>
            {arrow && <Ionicons name={I18nManager.isRTL ? "arrow-back-sharp" : "arrow-forward-sharp"} size={20} color={colors.white} />}
            {rightIcon && rightIcon}
        </TouchableOpacity>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: colors.primary,
        height: 40,
        borderRadius: 10,
    },
    marginHorizontal: {
        marginHorizontal: 20,
    },
    buttonText: {
        color: colors.white,
        fontFamily: fonts.bold,
    },
})
