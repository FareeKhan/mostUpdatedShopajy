import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { width } from '../constants/data'
import Logo from '../assets/svg/Logo.svg'
const HighLogo = () => {
    return (
        <View style={{ alignSelf: "center", marginVertical: 40 }}>
            <Logo
                width={width / 1.6}
                height={80}
            />
        </View>

    )
}

export default HighLogo

const styles = StyleSheet.create({})