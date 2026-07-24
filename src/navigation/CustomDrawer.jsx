import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, I18nManager } from 'react-native';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { colors } from '../constants/color';
import { fonts } from '../constants/fonts';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../redux/reducers/Language';
import i18next from 'i18next';
import RNRestart from 'react-native-restart';
import RemoteImage from '../components/RemoteImage';
import BottomSocialIcon from '../components/BottomSocialIcon';


const CustomDrawer = ({ navigation, state }) => {
    const [showLanguage, setShowLanguage] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('English');
    const user = useSelector(s => s?.auth?.user)

    const token = useSelector(s => s?.auth?.token)


    const route = state.routes[state.index];
    const activeRouteName =
        getFocusedRouteNameFromRoute(route) ?? 'HomeScreen';

    const dispatch = useDispatch();
    const currentLanguage = useSelector(
        state => state.language.language
    );

    const changeLanguage = async (lang) => {
        if (lang === currentLanguage) return;

        // 1. Redux update (auto persisted by redux-persist)
        dispatch(setLanguage(lang));

        // 2. i18n update
        await i18next.changeLanguage(lang);

        // 3. RTL handling
        const isRTL = lang === 'ar';

        if (I18nManager.isRTL !== isRTL) {
            I18nManager.allowRTL(isRTL);
            I18nManager.forceRTL(isRTL);

            RNRestart.restart();
        }
    };




    const MenuItem = ({ icon, label, routeName, isTab }) => {
        const isActive = activeRouteName === routeName;
        return (
            (
                <TouchableOpacity
                    style={[styles.menuItem, isActive && styles.activeMenuItem]}
                    onPress={() => {
                        if (isTab) {
                            navigation.navigate('BottomTabNavigation', {
                                screen: routeName,
                            });

                        } else if (routeName == 'TermsAndCondition') {
                            navigation.navigate('TermsAndCondition', {
                                screen: 'terms',
                            });

                        }
                        else {
                            navigation.navigate(routeName);
                        }
                        navigation.closeDrawer();

                    }}
                >
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                            <MaterialIcons name={icon} size={20} color={isActive ? "#3BE7AD" : "#fff"} />
                        </View>
                        <CustomText style={[styles.menuLabel, isActive && styles.activeMenuLabel]}>{label}</CustomText>
                    </View>
                    <Entypo name={I18nManager.isRTL ? "chevron-small-left" : "chevron-small-right"} size={24} color="#C4C4C4" />
                </TouchableOpacity>
            )
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.profileRow}>


                        {
                            user?.avatar ?
                                <RemoteImage
                                    uri={user?.avatar}
                                    style={styles.avatarCircle}
                                />
                                :
                                <View style={styles.avatarCircle}>
                                    <Entypo name="user" size={40} color="#fff" />
                                </View>
                        }


                        <View style={styles.profileInfo}>
                            <CustomText style={styles.userName}>{user?.name || 'Guest'}</CustomText>
                            <CustomText style={styles.userEmail}>{user?.email || 'guest@gmail.com'}</CustomText>
                        </View>
                    </View>

                    <CustomButton
                        title="View Profile"
                        style={styles.profileBtn}
                        textStyle={styles.profileBtnText}
                        onPress={() => navigation.navigate('EditProfileScreen')}
                    />
                    {/* <CustomButton
                        title="View Influencer Profile"
                        style={styles.influencerBtn}
                        textStyle={styles.influencerBtnText}
                        onPress={() => navigation.navigate('')}
                    /> */}
                </View>


                <View style={styles.divider} />
                <View style={styles.menuSection}>
                    <MenuItem icon="home" label="home" routeName={'HomeScreen'} isTab />
                    {/* <MenuItem icon="grid-view" label="categories" routeName="CategoryScreen" isTab /> */}
                    <MenuItem icon="shopping-cart" label="cart" routeName={'MyCartScreen'} />
                    <MenuItem icon="favorite-outline" label="favorite" routeName={'FavoriteScreen'} />
                    {/* <MenuItem icon="search" label="search" routeName={'SearchScreen'} isTab /> */}

                    <View style={styles.lightDivider} />

                    {/* <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => setShowLanguage(!showLanguage)}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="language" size={20} color="#fff" />
                            </View>
                            <CustomText style={styles.menuLabel}>Language</CustomText>
                        </View>

                        <Entypo
                            name={showLanguage ? 'chevron-small-up' : 'chevron-small-down'}
                            size={24}
                            color="#C4C4C4"
                        />
                    </TouchableOpacity> */}

                    {/* {showLanguage && (
                        <View style={styles.languageContainer}>
                            <TouchableOpacity
                                style={styles.languageItem}
                                onPress={() => {
                                    setSelectedLanguage('English');
                                    changeLanguage('en');
                                    setShowLanguage(false);
                                }}
                            >
                                <CustomText
                                    style={[
                                        styles.languageText,
                                        selectedLanguage === 'English' && styles.activeLanguage,
                                    ]}
                                >
                                    English
                                </CustomText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.languageItem}
                                onPress={() => {
                                    setSelectedLanguage('Arabic');
                                    changeLanguage('ar');
                                    setShowLanguage(false);
                                }}
                            >
                                <CustomText
                                    style={[
                                        styles.languageText,
                                        selectedLanguage === 'Arabic' && styles.activeLanguage,
                                    ]}
                                >
                                    Arabic
                                </CustomText>
                            </TouchableOpacity>
                        </View>
                    )} */}

                    <MenuItem icon="settings" label="setting" routeName={'SettingScreen'} />
                    <View style={styles.lightDivider} />




                    <CustomButton
                        leftIcon={
                            token ?
                                <SimpleLineIcons name={'logout'} size={16} color={colors.red} />
                                :
                                <MaterialIcons name={'logout'} size={22} color={colors.red} />}
                        title={token ? 'logout' : "login"}
                        style={styles.logoutBtn}
                        textStyle={styles.logoutText}
                        onPress={() => {
                            dispatch(logout())
                            navigation.navigate('LoginScreen')
                        }}
                    />

                    <BottomSocialIcon />


                    {/* <MenuItem icon="description" label="termsCondition" routeName={'TermsAndCondition'} />
                    <MenuItem icon="info-outline" label="aboutUs" routeName={'AboutApp'} />
                    <MenuItem icon="headset-mic" label="contactUs" routeName={'HelpAndSupport'} /> */}
                </View>
            </ScrollView>
        </View>
    );
};

export default CustomDrawer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FBFF',
        paddingTop: 50,
    },
    headerSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#3BE7AD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInfo: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right'
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        textAlign: 'right'
    },
    profileBtn: {
        backgroundColor: '#D6F9EE',
        borderRadius: 8,
        marginVertical: 5,
        height: 45,
    },
    profileBtnText: {
        color: '#3BE7AD',
        fontWeight: 'bold',
    },
    influencerBtn: {
        backgroundColor: '#E6D7FF',
        borderRadius: 8,
        marginVertical: 5,
        height: 45,
    },
    influencerBtnText: {
        color: '#9D50FF',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 10,
    },
    lightDivider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    menuSection: {
        paddingBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#051139',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuLabel: {
        marginLeft: 15,
        fontSize: 16,
        color: '#051139',
        fontWeight: '500',
    },

    activeMenuItem: {
        backgroundColor: '#E8F5FE',
    },
    activeMenuLabel: {
        color: '#3BE7AD',
        fontWeight: 'bold',
    },

    activeIconContainer: {
        backgroundColor: '#051139',
    },





    languageContainer: {
        paddingLeft: 70,
        paddingBottom: 10,
    },

    languageItem: {
        paddingVertical: 8,
    },

    languageText: {
        fontSize: 15,
        color: '#666',
    },

    activeLanguage: {
        color: colors.secondary,
        fontFamily: fonts.semiBold
    },

    logoutBtn: {
        backgroundColor: colors.red2,
        // height: 50,
        marginTop: 20,
        width: "90%",
        alignSelf: "center"
    },
    logoutText: {
        color: colors.red,
        fontSize: 17
    }
});