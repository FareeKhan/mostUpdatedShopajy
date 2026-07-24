import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import RemoteImage from './RemoteImage'
import CustomText from './CustomText'
import PriceSymbol from './PriceSymbol'
import { colors } from '../constants/color'
import CustomButton from './CustomButton'
import { height, width } from '../constants/data'
import { useDispatch, useSelector } from 'react-redux'
import { productToCart } from '../redux/reducers/CartProduct'
import PriceComp from './PriceComp'

const RecentlyViewed = ({ data }) => {
    const cartData = useSelector((state) => state.cart.cart) || [];
    const cartIds = new Set(cartData.map(item => item.id));
    const uniqueData = (data || []).filter(item => !cartIds.has(item.id));


    const dispatch = useDispatch()

    const handleCart = (item) => {
        const { id, title_en, title_ar, weight,description_ar, description_en, discount_price_syp, price_syp, image, price, discount_price, } = item
        const selectedColor = item?.colors?.length > 0 ? item?.colors[0] : ''
        const selectedSize = item?.sizes?.length > 0 ? item?.sizes[0] : ''
        dispatch(productToCart({
            id,
            title_en,
            title_ar,
            description_ar,
            description_en,
            image,
            price,
            discount_price,
            discount_price_syp,
            price_syp,
            color: selectedColor,
            size: selectedSize,
            quantity: 1,
            weight
        }))
    }

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                disabled
                style={{
                    flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 8, paddingHorizontal: 14,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: colors.gray5,
                    backgroundColor: colors.white

                }}

            >
                <RemoteImage
                    uri={item?.image}
                    style={styles.image}
                />

                <View style={{ gap: 3,width:'65%' }}>
                    <CustomText s numberOfLines={2}>{I18nManager.isRTL ? item?.title_ar : item?.title_en}</CustomText>

                    {
                        item?.discount_price ?
                            <PriceComp
                                discountPrice={item?.discount_price}
                                price={item?.price}
                                equalent={item?.discount_price_syp || item?.price_syp}
                                small
                            />
                            :
                            <PriceComp
                                discountPrice={item?.price}
                                equalent={item?.discount_price_syp || item?.price_syp}
                                small
                            />
                    }
                </View>

                <TouchableOpacity onPress={() => handleCart(item)} style={{ marginLeft: "auto", width: 60, height: 30, borderRadius: 5, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" }}>
                    <CustomText l medium>add</CustomText>
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <FlatList
                data={uniqueData}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    )
}

export default RecentlyViewed

const styles = StyleSheet.create({
    image: {
        width: 48,
        height: 48,
        borderRadius: 8
    },
    listContainer: {
        gap: 15,
    }
})