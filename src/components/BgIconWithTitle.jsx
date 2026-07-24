import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'

const BgIconWithTitle = ({icon,title,subTitle,style,iconStyle}) => {
    return (
        <View style={[styles.header,style]}>
            <View style={[styles.iconCircle,iconStyle]}>
              {icon && icon}
            </View>
            <CustomText bold style={{ fontSize: 25 }}>{title}</CustomText>
            <CustomText style={styles.subtitle}>{subTitle}</CustomText>
        </View>
    )
}

export default BgIconWithTitle

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginTop: 20,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.secondary4,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.gray23,
    },
    subtitle: {
        color: colors.gray23,
        marginTop: 4,
        opacity: 0.7,


    },
})