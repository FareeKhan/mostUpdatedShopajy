import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleViewAll from '../components/TitleViewAll'
import Feather from 'react-native-vector-icons/Feather'
import { colors } from '../constants/color'
import CustomText from './CustomText'

const QuantityCounter = ({ counter, setCounter }) => {

    const handleDecrement = () => {
        if (counter > 1) {
            setCounter(counter - 1)
        }

    }
    
    const handleIncrement = () => {
        setCounter(counter + 1)
    }

    return (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <TitleViewAll title={'quantity'} xxxl semiBold mv={false} />

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 12, borderColor: colors.gray5, borderRadius: 5 }}>
                <TouchableOpacity onPress={handleDecrement}>
                    <Feather name={'minus'} size={20} color={colors.black} />
                </TouchableOpacity>
                <CustomText>{counter}</CustomText>
                <TouchableOpacity onPress={handleIncrement}>
                    <Feather name={'plus'} size={20} color={colors.black} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default QuantityCounter

const styles = StyleSheet.create({})