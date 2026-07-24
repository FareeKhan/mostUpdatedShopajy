import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { subCategories } from '../constants/data'
import CustomText from './CustomText'
import { colors } from '../constants/color'
import TitleViewAll from './TitleViewAll'
import { fonts } from '../constants/fonts'

const SubCategories = ({ selectedSubcategory, setSelectedSubCategory, title, data }) => {
    const renderItem = ({ item, index }) => {

        const selectedLang = I18nManager.isRTL ? item?.title_ar : item?.title_en
        const selectedItem = selectedSubcategory == selectedLang
        return (
            <TouchableOpacity onPress={() => setSelectedSubCategory(selectedLang)} style={[{ backgroundColor: colors.gray18,paddingVertical: 15,paddingHorizontal:20, borderRadius: 20 }, selectedItem && { backgroundColor: colors.secondary }]}>
                <CustomText style={[{ color: colors.black3,fontFamily:fonts.semiBold }, selectedItem && { color: colors.black }]}>{I18nManager.isRTL ? item?.title_ar : item?.title_en}</CustomText>
            </TouchableOpacity>
        )
    }
    return (
        <View>
            <TitleViewAll
                title={title}
            />
            <FlatList
                // data={subCategories}
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                horizontal
                contentContainerStyle={{ gap: 10, marginTop: 10, marginBottom: 20 }}
                showsHorizontalScrollIndicator={false}

            />
        </View>
    )
}

export default SubCategories

const styles = StyleSheet.create({})