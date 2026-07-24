import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomModal from './CustomModal'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color'
import CustomText from './CustomText'
import CustomButton from './CustomButton'
import { useDispatch } from 'react-redux'
import { emptyCart } from '../redux/reducers/CartProduct'
import { useNavigation } from '@react-navigation/native'

const SuccessModal = ({ hideCross, hideLine, modalVisible, setModalVisible, modalViewStyle, innerStyle }) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const handleButton = () => {
        dispatch(emptyCart())
        setModalVisible(false)
        navigation.replace('DrawerNavigation')
    }
    return (
        <CustomModal
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            animationType={'fade'}
            hideCross={hideCross}
            hideLine={hideLine}
            style={{
                justifyContent: "center",
                backgroundColor: '#00000090',
                paddingHorizontal: 20,
            }}
            backStyle={false}
            modalViewStyle={modalViewStyle}
            innerStyle={innerStyle}
        >
            <View style={{ alignSelf: "center", borderRadius: 50 }}>
                <Ionicons name={'checkmark-circle-outline'} size={60} color={colors.green} style={{ backgroundColor: colors.green?.concat(20), borderRadius: 50 }} />
            </View>
            <CustomText style={{ fontSize: 18, textAlign: 'center', marginTop: 20, marginBottom: 10 }} medium>congratulation</CustomText>
            <CustomText style={{ color: colors.gray1, textAlign: 'center' }} >orderPlaced</CustomText>
            <CustomButton
                title={'continue'}
                style={{ marginVertical: 20 }}
                onPress={() => {
                    // setModalVisible(false)
                    handleButton()
                }}
            />
        </CustomModal>
    )
}

export default SuccessModal

const styles = StyleSheet.create({})