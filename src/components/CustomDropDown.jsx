import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import CustomText from './CustomText';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/color';
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { useTranslation } from 'react-i18next';


const CustomDropDown = ({ data, setValue, value, titleStyle, placeholder, steric,label, dropTitle, maxHeight, style, dropDownBox }) => {
const {t} = useTranslation()
    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={{ gap: 8 }}>

          
               {
                label &&
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                     <CustomText style={{ color: colors.gray21 }} medium >{label}</CustomText>
                   {
                    steric &&
                     <CustomText style={{ color: 'red' }} >*</CustomText>
                   }
                </View>

            }

            <View style={[dropTitle && { paddingVertical: 8 }, styles.dropdown, dropDownBox]}>
                {
                    dropTitle &&
                    <CustomText style={{ fontSize: 12, color: colors.gray.concat(60) }}>{dropTitle}</CustomText>
                }

                <Dropdown
                    renderLeftIcon={() => {
                        return (
                            value ?
                                <TouchableOpacity onPress={() => setValue(null)} >
                                    <EvilIcons name={'close'} size={18} color={colors.red} />
                                </TouchableOpacity>
                                : null
                        )
                    }}
                    style={[!dropTitle && { height: 50, paddingHorizontal: 15, }, style]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    iconStyle={styles.iconStyle}
                    iconColor={colors.black}
                    data={data}
                    maxHeight={maxHeight ? maxHeight : 200}
                    labelField="label"
                    valueField="value"
                    // valueField="id"
                    placeholder={t(placeholder)}
                    searchPlaceholder="Search..."
                    value={value}
                    renderItem={(item) => {
                        return (
                            <View style={{ paddingVertical: 7, paddingHorizontal: 10 }}>
                                <CustomText  >{item?.label}</CustomText>
                            </View>
                        )
                    }}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item?.value, item);
                        // setIsFocus(false);
                    }}
                />
            </View>

        </View>
    )
}

export default CustomDropDown

const styles = StyleSheet.create({
    title: {
        marginBottom: 8,
        color: colors.black,
        fontFamily: fonts.medium,
        marginTop: 15
    },
    inputBox: {
        marginTop: 30,
    },
    container: {
        // backgroundColor: 'red',
        padding: 16,
    },
    dropdown: {
        borderRadius: 8,
        // width: "100%",
        // backgroundColor: 'green',
        // width:100,
        marginRight: 10,
        width: "100%",
        // paddingHorizontal: 19,
        borderRadius: 10,
        marginBottom: 18,
        backgroundColor: colors.gray5?.concat(70)
    },

    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
        // backgroundColor: 'green',
    },
    placeholderStyle: {
        fontSize: 14,
        color: colors.black,
        textAlign: 'left',
        paddingLeft: 5,
        fontFamily:fonts.regular
    },
    selectedTextStyle: {
        fontSize: 13,
        color: colors.black,
        textAlign: 'left',
        paddingLeft: 5,
        fontFamily: fonts.regular
    },
    iconStyle: {
        width: 20,
        height: 20,

    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,

    },
})