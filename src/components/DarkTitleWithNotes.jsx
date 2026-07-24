import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import { useTranslation } from 'react-i18next'

const DarkTitleWithNotes = ({darkTitle,note,boxStyle =true,style}) => {
    const {t} = useTranslation()
    return (
        <View style={[boxStyle && styles.infoBox,style]}>
            <CustomText gray s style={{ textAlign: "center" }} translate={false}>
                <CustomText style={{ color: colors.gray23 }} bold>{darkTitle}</CustomText>
                {t(note)}
            </CustomText>
        </View>
    )
}

export default DarkTitleWithNotes

const styles = StyleSheet.create({
    infoBox: {
        backgroundColor: colors.purple4, // Light blue/purple tint
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.purple3,
        marginBottom: 25,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        color: colors.gray21,
    },
})