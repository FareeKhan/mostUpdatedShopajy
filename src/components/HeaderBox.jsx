import { I18nManager, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color'
import CustomText from './CustomText'
import { fonts } from '../constants/fonts'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import Logo from '../assets/svg/Logo'

const HeaderBox = ({ title, logo, bell, cart, share, sharePress, threeLines, backPress, isBack = true, centerText = true, setting, style, onPressRightIcon, rightIcon }) => {
    const navigation = useNavigation()
    const cartData = useSelector((state) => state.cart.cart)
    const favoriteItems = useSelector((state) => state?.favorite?.favorites)


    const handleBellIcon = () => {
        navigation.navigate('NotificationScreen')
    }
    const handleSettingIcon = () => {
        navigation.navigate('HelpCenterScreen')
    }

    return (
        <View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, style]}>

            {
                isBack &&
                <TouchableOpacity style={{ backgroundColor: colors.secondary5, width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 50 }} onPress={backPress ? backPress : () => navigation.goBack()} >
                    <MaterialIcons name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'} size={27} color={colors.black} />
                </TouchableOpacity>
            }

            {
                threeLines &&
                // <TouchableOpacity onPress={() => navigation.openDrawer()}>
                //     <Ionicons name={'menu-outline'} size={30} color={colors.black} />
                // </TouchableOpacity>


                // <TouchableOpacity onPress={() => navigation.navigate('FavoriteScreen')}>
                //     <Ionicons name={'heart-outline'} size={30} color={colors.red} />
                // </TouchableOpacity>


                <TouchableOpacity
                    style={styles.iconContainer}
                    onPress={() => navigation.navigate('FavoriteScreen')}
                    activeOpacity={0.8}
                >
                    <Ionicons name={'heart-outline'} size={28} color={colors.red} />
                    {favoriteItems?.length > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{favoriteItems.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            }


            {
                title &&
                <CustomText style={[{ fontSize: 20, }, centerText && { margin: "auto", }, isBack && { right: 10 }]}>{title}</CustomText>
            }

            {
                logo &&
                <View>
                    <Logo height={100} width={150} />
                    {/* <Image source={require('../assets/images/smallLogo.png')} style={{ width: 150, height: 100, resizeMode: 'contain' }} /> */}
                </View>
            }

            {
                bell &&
                <TouchableOpacity onPress={handleBellIcon} hitSlop={10}>
                    <SimpleLineIcons name="bell" size={20} color={colors.black} />
                </TouchableOpacity>
            }

            {
                setting &&
                <TouchableOpacity onPress={handleSettingIcon} hitSlop={10} style={{ marginLeft: "auto" }}>
                    <Feather name="settings" size={20} color={colors.black} />
                </TouchableOpacity>
            }
            {
                rightIcon &&
                <TouchableOpacity onPress={onPressRightIcon} hitSlop={10} >
                    {rightIcon}
                </TouchableOpacity>
            }
            {
                cart &&
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('MyCartScreen')}>

                        <Ionicons name="cart-outline" size={25} color={colors.black} />

                        {cartData?.length > 0 && <View
                            style={styles.badge}
                        >
                            <CustomText style={styles.badgeText} >
                                {cartData?.length}
                            </CustomText>
                        </View>
                        }
                </TouchableOpacity>
            }

            {
                share &&
                <TouchableOpacity onPress={sharePress}>
                    <Feather name={'share-2'} size={25} color={colors.black} />
                </TouchableOpacity>
            }

        </View>
    )
}

export default HeaderBox

const styles = StyleSheet.create({

    iconContainer: {
        width: 55,
        height: 55,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // Soft shadow styling
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4, // Android shadow
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: colors.outForDeliver, // Bright teal/green matching your image
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: '#FFFFFF', // Creates clean separation ring
    },
    badgeText: {
        color: '#000000',
        fontSize: 11,
        fontWeight: 'bold',
    },
})