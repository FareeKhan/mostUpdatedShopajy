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

            <View style={{ flexDirection: "row", alignItems: "center", gap: 15, borderWidth: 1, paddingVertical: 6, paddingHorizontal: 6, borderColor: colors.gray35, borderRadius: 7 }}>
                <TouchableOpacity onPress={handleDecrement} style={{ width: 35, height: 35, backgroundColor: colors.gray35, alignItems: "center", justifyContent: "center" }}>
                    <Feather name={'minus'} size={20} color={colors.black} />
                </TouchableOpacity>
                <CustomText bold style={{ fontSize: 17 }}>{counter}</CustomText>

                <TouchableOpacity onPress={handleIncrement} style={{ width: 35, height: 35, backgroundColor: colors.gray35, alignItems: "center", justifyContent: "center" }}>
                    <Feather name={'plus'} size={20} color={colors.black} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default QuantityCounter

const styles = StyleSheet.create({})