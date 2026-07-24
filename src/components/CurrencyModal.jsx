import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomModal from './CustomModal'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { colors } from '../constants/color'
import CustomText from './CustomText'
import CustomButton from './CustomButton'
import { useNavigation } from '@react-navigation/native'
import { currencies } from '../constants/data'
import DirhamSymbol from './DirhamSymbol'
import { useDispatch, useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'
import { changeCurrency } from '../redux/reducers/Currency'

const CurrencyModal = ({ hideLine, modalVisible, setModalVisible, innerStyle, }) => {
    const dispatch = useDispatch()
    const selectedCurrency = useSelector((state) => state?.currency?.currency)

    const handleCurrency = (value) => {
        dispatch(changeCurrency(value))
        setModalVisible(false)
    }

    return (
        <CustomModal
            animationType={'fade'}
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            hideLine={hideLine}
            style={{
                justifyContent: "center",
                backgroundColor: '#00000090',
                paddingHorizontal: 40,
            }}
            backStyle={false}
            innerStyle={innerStyle}
            title={'selectCurrency'}
        >
            {currencies.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() =>
                        handleCurrency(item?.value)
                    }
                    style={{
                        paddingVertical: 12,
                        borderBottomWidth: index !== currencies.length - 1 ? 1 : 0,
                        borderColor: '#ddd',
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}
                >
                    <Text style={{ fontSize: 16, color: colors.black }}>
                        {item.label} - {item.symbol == "AED" ? <DirhamSymbol top={3} /> : item.symbol}
                    </Text>
                    {
                        item.value == selectedCurrency &&
                        <Entypo name={'check'} size={12} color={colors.black} />
                    }
                </TouchableOpacity>
            ))}



        </CustomModal>
    )
}

export default CurrencyModal

const styles = StyleSheet.create({})