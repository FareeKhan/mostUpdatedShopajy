import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleViewAll from './TitleViewAll'
import CustomText from './CustomText'
import { colorArray } from '../constants/data'
import { colors } from '../constants/color'

const HorizontalTabs = ({ data, title, style,handlePress,selectedFilter }) => {


    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={()=>handlePress(item?.value)} style={{ borderWidth:item?.value == selectedFilter ?  2 : 2,borderColor:item?.value == selectedFilter   ? '#F564A9': item?.color,backgroundColor: item?.color, paddingVertical: 7, paddingHorizontal: 20, borderRadius: 50 }}>
                <CustomText style={{ color: colors.white }} medium l>{item?.label}</CustomText>
            </TouchableOpacity>
        )
    }
    return (
        <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between",marginTop:15 }, style]}>
            <TitleViewAll title={title} xxxl semiBold mv={false} />
            <View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index?.toString()}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ gap: 10 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default HorizontalTabs

const styles = StyleSheet.create({})