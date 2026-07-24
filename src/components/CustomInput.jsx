import { I18nManager, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/color'
import CustomText from './CustomText'
import { useTranslation } from 'react-i18next'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native'
import { fonts } from '../constants/fonts'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomInput = ({ label, rightPhone, disabled, leftIcon,onPress, iconColor, steric, eye, mt, flat, additional, home, rightIcon, location, onPressEye, isEye, heart, building, mail, phone, info, user, borderInput, onChangeText, value, placeholder, searchIcon, micIcon, inputStyle, style, tag, inputContainer, ...props }) => {
    const { t } = useTranslation()
    const navigation = useNavigation()

    return (
        <View style={[{ gap: 8, marginTop: 25 }, mt && { marginTop: 15 }, style]} >
            {
                label &&
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <CustomText style={{ color: colors.gray21 }} medium >{label}</CustomText>
                    {
                        steric &&
                        <CustomText style={{ color: colors.gray21 }}>*</CustomText>
                    }
                </View>
            }

            <TouchableOpacity
                onPress={onPress}
                disabled={!disabled}
                activeOpacity={0.7}
                style={[{
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    backgroundColor: colors.white,
                    elevation: 5,
                    flexDirection: "row",
                    alignItems: "center",
                    borderColor: colors.gray,
                    height: 50,
                    borderRadius: 17,
                    paddingHorizontal: 10,
                    gap: 8
                }, borderInput && { borderRadius: 10, borderWidth: 1 }, inputContainer]}
            >
                {
                    heart &&
                    <TouchableOpacity onPress={() => navigation.navigate('FavoriteScreen')} style={{ marginRight: 5 }}>
                        <Octicons name={'heart'} size={22} color={colors.gray7} />
                    </TouchableOpacity>
                }

                {
                    searchIcon &&
                    <Ionicons name={'search'} size={23} color={iconColor ? iconColor : colors.gray7} />
                }
                {
                    eye &&
                    <Feather name={'eye'} size={18} color={colors.gray4} />
                }


                {
                    tag &&
                    <Ionicons name={'pricetag-outline'} size={22} color={colors.gray4} />
                }

                {
                    user &&
                    <Feather name={'users'} size={20} color={colors.gray4} />
                }

                {
                    mail &&

                    <Ionicons name={'mail-outline'} size={20} color={colors.gray4} />
                }

                {
                    phone &&

                    <Feather name={'phone'} size={20} color={colors.gray4} />
                }

                {
                    leftIcon &&
                    <View >
                        {leftIcon}
                    </View>
                }



                {
                    disabled ?
                        <CustomText
                            placeholder={t(placeholder)}
                            placeholderTextColor={colors.gray1}
                            value={value}
                            onChangeText={onChangeText}
                            style={[{ fontSize: 15, width: "90%", color: colors.gray7 }, inputStyle]}
                        >{placeholder}</CustomText>
                        :
                        <>
                            <TextInput
                                placeholder={t(placeholder)}
                                placeholderTextColor={colors.gray1}
                                value={value}

                                onChangeText={onChangeText}
                                style={[{ color: colors.black, fontSize: 15, width: "90%", zIndex: -999, textAlign: I18nManager.isRTL ? 'right' : 'left', fontFamily: fonts.regular }, inputStyle]}
                                {...props}
                            />



                        </>


                }

                {/* {
                    micIcon &&
                    <TouchableOpacity>
                        <Feather name={'mic'} size={20} color={colors.gray4} style={{ marginLeft: "auto" }} />
                    </TouchableOpacity>
                } */}

                {
                    info &&
                    <Octicons name={'question'} size={25} color={colors.gray7} style={{ marginLeft: "auto", right: 15 }} />
                }

                {
                    rightIcon &&
                    <View style={{ marginLeft: "auto", }}>
                        {rightIcon}
                    </View>
                }
                {
                    location &&
                    <Ionicons name={'location-outline'} size={23} color={colors.gray7} />
                }
                {
                    building &&

                    <FontAwesome name={'building-o'} size={17} color={colors.gray7} />
                }
                {
                    flat &&
                    <MaterialIcons name={'layers'} size={20} color={colors.gray7} />
                }
                {
                    home &&
                    <Feather name="home" size={17} color={colors.gray7} />
                }

                {
                    rightPhone &&

                    <Feather name={'phone'} size={20} color={colors.gray4} />
                }

                {
                    additional &&
                    <Feather name="edit-3" size={17} color={colors.gray7} />
                }
                {
                    eye &&
                    <TouchableOpacity style={{ marginLeft: "auto", right: 15 }} onPress={onPressEye} >
                        <Feather name={isEye ? 'eye-off' : 'eye'} size={18} color={colors.black} />
                    </TouchableOpacity>
                }


            </TouchableOpacity>
        </View>
    )
}

export default CustomInput

const styles = StyleSheet.create({})