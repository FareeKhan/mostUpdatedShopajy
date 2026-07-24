import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'

const TitleIcon = ({ leftTitle,icon }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <CustomText medium xxxl>{leftTitle}</CustomText>
            {
                icon &&
                 <View style={{ backgroundColor: colors.secondary3, width: 35, height: 35, alignItems: "center", justifyContent: "center", borderRadius: 50 }} >
               {icon}
            </View>

            }
           
        </View>
    )
}

export default TitleIcon

const styles = StyleSheet.create({})