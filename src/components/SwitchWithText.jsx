import { I18nManager, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/color'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import CustomText from './CustomText'

const SwitchWithText = ({ setIsEnabled, isEnabled, switchTitle, mb, icon, arrow, subTitle ,onPress}) => {

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.4} style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 25 }, mb && { marginBottom: 0 }]}>
            <View style={{ width: 28, height: 28, backgroundColor: colors.black, borderRadius: 50, alignItems: "center", justifyContent: "center" }}>
                {icon}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{gap:5}}>
                    <CustomText medium l style={{textAlign:"right"}}>{switchTitle}</CustomText>
                    {
                        subTitle &&
                        <CustomText medium xs style={{color:colors.black1}}>{subTitle}</CustomText>
                    }
                </View>
                {
                    arrow ?
                        <Entypo name={I18nManager.isRTL ? 'chevron-thin-left' : 'chevron-thin-right'} size={14} style={{ marginLeft: 8 }} />
                        :
                        <Switch
                            trackColor={{ false: colors.gray24, true: colors.gray2 }}
                            thumbColor={isEnabled ? colors.white : '#f4f3f4'}
                            ios_backgroundColor={colors.gray24}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                            style={[{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }]} ,I18nManager.isRTL && {marginLeft:10}]}
                        />
                }
            </View>
        </TouchableOpacity>
    )
}

export default SwitchWithText

const styles = StyleSheet.create({})