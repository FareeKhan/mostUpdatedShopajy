import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleViewAll from './TitleViewAll'
import CustomText from './CustomText'
import { colorArray } from '../constants/data'
import { colors } from '../constants/color'

const DateData = ({ data, title,style ,setSelectedDate,selectedDate}) => {
    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={()=>setSelectedDate(item?.name)} style={{ backgroundColor: selectedDate == item?.name ? colors.purple:  colors.gray, paddingVertical: 4, paddingHorizontal: 20, borderRadius: 5 }}>
                <CustomText style={{ color: colors.white }} medium l>{item?.name}</CustomText>
            </TouchableOpacity>
        )
    }
    return (
        <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" ,marginBottom:20},style]}>
           {
            title && 
            <TitleViewAll title={title} xxxl semiBold mv={false} />
           }
            <View>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index?.toString()}
                    renderItem={renderItem}
                    horizontal
                    contentContainerStyle={{ gap: 10,marginVertical:15 }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        </View>
    )
}

export default DateData

const styles = StyleSheet.create({})