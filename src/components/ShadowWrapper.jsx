import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/color'

const ShadowWrapper = ({ children,style,reduceSpacing }) => {
    return (
        <View style={[{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            backgroundColor: colors.white,
            elevation: 3,
            padding: 20,
            borderRadius: 10,
            marginTop: 20
        },
        reduceSpacing && 
        {
            paddingHorizontal: 10,
            paddingTop:10,
            paddingBottom:5,
            marginHorizontal:2,
            marginTop: 15

        },
        style
        ]}>
            {children}
        </View>
    )
}

export default ShadowWrapper

const styles = StyleSheet.create({})