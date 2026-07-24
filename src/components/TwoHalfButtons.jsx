import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../components/CustomButton'
import { colors } from '../constants/color'

const TwoHalfButtons = ({ leftOnPress, rightOnPress, selectedBtn, leftButtonTitle, rightButtonTitle, black, leftBtnIcon, rightBtnIcon }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 25 }}>
            <CustomButton
                title={leftButtonTitle}
                style={[{ width: "48%", height: 35, backgroundColor: colors.secondary, borderRadius: 5, }, selectedBtn == leftButtonTitle && { borderWidth: 2, borderColor: colors.gray7 }]}
                onPress={leftOnPress}
                textStyle={{ color: colors.black, fontSize: 17 }}
                rightIcon={leftBtnIcon}

            />
            <CustomButton
                title={rightButtonTitle}
                style={[{ width: "48%", height: 35, backgroundColor: colors.red2, borderRadius: 5 }, black && { backgroundColor: colors.black }, selectedBtn == rightButtonTitle && { borderWidth: 2, borderColor: colors.gray2 }]}
                onPress={rightOnPress}
                textStyle={{ fontSize: 17 }}
                rightIcon={rightBtnIcon}

            />
        </View>

    )
}

export default TwoHalfButtons

const styles = StyleSheet.create({})