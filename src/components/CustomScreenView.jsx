import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'


const CustomScreenView = ({children,refreshing, onRefresh}) => {
  return (
    <ScrollView 
    refreshControl={
                onRefresh ? (
                    <RefreshControl refreshing={refreshing || false} onRefresh={onRefresh} />
                ) : undefined
            }
    
    showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:160}} style={{flex:1,backgroundColor:"#F7FAFD",paddingTop:Platform.OS == 'ios' ? 60:35}}>
      <View style={{marginHorizontal:15}}>
         {children}
      </View>
    </ScrollView>
  )
}

export default CustomScreenView

const styles = StyleSheet.create({})