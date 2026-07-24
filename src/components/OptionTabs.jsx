import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import TitleViewAll from './TitleViewAll'
import CustomText from './CustomText'
import { colorArray, namedColors } from '../constants/data'
import { colors } from '../constants/color'

const OptionTabs = ({ data, title, style, setSelectedItem, selectedItem }) => {

    const isValidColor = (colorStr) => {
        if (!colorStr) return false;
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        const cleanColor = colorStr.toLowerCase().trim();

        return hexRegex.test(cleanColor) || namedColors.includes(cleanColor);
    };

    const isLightColor = (colorStr) => {
        if (!colorStr) return false;
        const color = colorStr.toLowerCase().trim();

        // List of known light CSS keywords
        const lightColors = ['white', 'yellow', 'lightgray', 'lightgrey', 'beige', 'ivory', 'pink'];
        if (lightColors.includes(color)) return true;

        // Check Hex colors for brightness
        const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (hexRegex.test(color)) {
            let hex = color.replace('#', '');
            if (hex.length === 3) {
                hex = hex.split('').map(char => char + char).join('');
            }
            // Convert to RGB
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // Calculate YIQ brightness (standard formula)
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return yiq >= 128; // Returns true if the color is light
        }

        return false;
    };

    const renderItem = ({ item, index }) => {
        const selectedTab = selectedItem?.label == item?.label
        const colorLabel = item?.label?.toLowerCase() || '';
        const isColorValid = isValidColor(colorLabel);
        const finalBackgroundColor = isColorValid ? colorLabel : colors.black;
        const dynamicTextColor = isLightColor(finalBackgroundColor) ? colors.black : colors.white;
        if (title == 'size') {
            const selectedTab = selectedItem?.label == item?.label
            return (
                <TouchableOpacity
                    onPress={() => setSelectedItem(item)}
                    style={[styles.sizeBtn, selectedTab && { backgroundColor: colors.black }]}
                >
                    <CustomText style={styles.sizeText} medium l>
                        {I18nManager.isRTL ? item?.label_ar || item?.label : item?.label}
                    </CustomText>
                </TouchableOpacity>
            )
        }

        return (
            <TouchableOpacity
                onPress={() => setSelectedItem(item)}
                style={[styles.colorBtn, { borderWidth: 2, justifyContent: "center", borderColor: colors.white, backgroundColor: finalBackgroundColor }, selectedTab && { borderColor: colors.secondary }]}
            >
                <CustomText style={[styles.colorText, { color: dynamicTextColor }]} medium l>
                    {I18nManager.isRTL ? item?.label_ar || item?.label : item?.label}
                </CustomText>
            </TouchableOpacity>
        )
    }

    return (
        <View style={[styles.container, style]}>
            <View style={{ marginRight: 20 }}>
                <TitleViewAll title={title} xxxl semiBold mv={false} />
            </View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                horizontal
                contentContainerStyle={styles.list}
                showsHorizontalScrollIndicator={false}

            />
        </View>
    )
}

export default OptionTabs

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    sizeBtn: {
        backgroundColor: colors.gray24,
        paddingVertical: 4,
        paddingHorizontal: 25,
        borderRadius: 5,
    },
    sizeText: {
        color: colors.white,
        textTransform: "capitalize",
    },
    colorBtn: {
        paddingVertical: 4,
        borderRadius: 5,
        width: 80,

    },
    colorText: {
        color: colors.white,
        textTransform: "capitalize",
        textAlign: "center"
    },
    list: {
        gap: 10,
        marginLeft: "auto",
    }
})