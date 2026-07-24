import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomLoader = ({ center  ,white}) => {
    return (
        <View style={center && { flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size={'large'}   />
        </View>
    )
}

export default CustomLoader

const styles = StyleSheet.create({})