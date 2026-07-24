import { I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from './CustomText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color'
import { useDispatch } from 'react-redux'
import { fetchCategoryById, fetchProductById, setSelectedCategoryId } from '../redux/reducers/Home'
import { useNavigation } from '@react-navigation/native'

const AdverismentCard = ({ headTitle, discount, subTitle, data }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const handlePromotion = () => {
        if (data?.target_type === 'category' && data?.category_id) {
            dispatch(fetchCategoryById(data.category_id));
            dispatch(setSelectedCategoryId(data.category_id));
            navigation.navigate('CategoryScreen')
        }


        if (data?.target_type === 'product' && data?.product_id) {
            console.log(' data.product_id', data.product_id)
            navigation.navigate('ProductDetailScreen', {
                productId: data.product_id,
            });
        }
    }


    return (
        <View style={{ flexDirection: "row", marginTop: 15, marginBottom: 25, alignItems: "center", justifyContent: "space-between", paddingHorizontal: 13, overflow: "hidden", paddingVertical: 16, borderRadius: 32, backgroundColor: colors.secondary }}>
            <View style={{ gap: 12 }}>
                <View style={{ backgroundColor: colors.secondary1, zIndex: 999, alignItems: "center", paddingVertical: 7, borderRadius: 50 ,alignSelf:"flex-start",marginLeft:10,paddingVertical:10,paddingHorizontal:16}}>
                    <CustomText semiBold xs>{headTitle}</CustomText>
                </View>
                <CustomText bold style={{fontSize:25}}>{discount}</CustomText>
                <CustomText style={{fontSize:18}} semiBold>{subTitle}</CustomText>
            </View>



            <TouchableOpacity onPress={handlePromotion} style={{ width: 46, height: 46, backgroundColor: colors.black, zIndex: 999, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={I18nManager.isRTL ? 'arrow-back' :'arrow-forward'} size={25} color={colors.white} />
            </TouchableOpacity>




            <View style={{ width: 110, height: 110, backgroundColor: colors.black4, position: "absolute", borderRadius: 100, left: -24, top: 55 }} />
            <View style={{ width: 110, height: 3, backgroundColor: colors.secondary, position: "absolute", borderRadius: 100, left: -24, bottom:0 ,zIndex:999}} />
            <View style={{ width: 110, height: 110, borderWidth: 8, borderColor: colors.black4, position: "absolute", borderRadius: 100, top: -65, right: 60 }} />
        </View>
    )
}

export default AdverismentCard

const styles = StyleSheet.create({})