import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/color'

const BorderLine = ({style,mv,centerLine,moreTopSpace}) => {
    return (
        <View style={[{ height: 2, width: "120%", backgroundColor: colors.gray5, marginHorizontal: -20 },mv && {marginVertical:15},centerLine && {width:"100%",marginHorizontal:0,height:1},moreTopSpace && {marginTop: 30, marginBottom: 10 },style]} />
    )
}

export default BorderLine

const styles = StyleSheet.create({})