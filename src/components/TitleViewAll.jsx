import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import { fonts } from '../constants/fonts'

const TitleViewAll = ({ title, viewAll,xxxl,semiBold,mv =true,extraLarge ,viewPress,style}) => {
    return (
        <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" },style]}>
            <CustomText bold xxl style={[mv && { marginVertical: 10 }]} xxxl={xxxl} extraLarge={extraLarge} semiBold={semiBold}>{title}</CustomText>

            {
                viewAll &&
                <TouchableOpacity  onPress={viewPress}>
                    <CustomText  style={{ marginVertical: 10,color:colors.black ,fontSize:15,fontFamily:fonts.bold,textDecorationLine:"underline",textDecorationColor:colors.secondary}}>showAll</CustomText>
                </TouchableOpacity>
            }
        </View>
    )
}

export default TitleViewAll

const styles = StyleSheet.create({})