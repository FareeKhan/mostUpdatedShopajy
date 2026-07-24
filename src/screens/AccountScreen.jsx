import { Alert, DevSettings, FlatList, I18nManager, InteractionManager, Platform, Share, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import CustomButton from '../components/CustomButton'
import TitleViewAll from '../components/TitleViewAll'
import { dashboardData, height, orderButton, referalData } from '../constants/data'
import BorderLine from '../components/BorderLine'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Clipboard from '@react-native-clipboard/clipboard'
import { showMessage } from 'react-native-flash-message'
import i18next from 'i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { fetchMe, logout } from '../redux/reducers/Auth'
import { fetchEarningsSummary, fetchInfluencerMe } from '../redux/reducers/Influencer'
import RemoteImage from '../components/RemoteImage'
import SwitchWithText from '../components/SwitchWithText'
import RNRestart from 'react-native-restart';
import { languageSelection, setLanguage } from '../redux/reducers/Language'

const AccountScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const user = useSelector(s => s?.auth?.user)
    const referral = useSelector(s => s?.influencer?.referral)
    const shareUrl = useSelector(s => s?.settings?.values?.app_share_url) || 'https://shopajy.com'
    const referralCode = referral?.code
    const summary = useSelector(s => s?.influencer?.summary)
    const currentLanguage = useSelector(
        state => state.language.language
    );
    console.log('dsdsdsd', currentLanguage)


    const [isLanguage, setIsLanguage] = useState(currentLanguage == 'ar')
    console.log('fasfasda', isLanguage)

    const dashData = dashboardData.map((d) => {
        switch (d.id) {
            case 1: return { ...d, label: 'Total Earnings', value: `$${summary?.total ?? 10}` }
            case 2: return { ...d, label: 'Paid', value: `$${summary?.paid ?? 0}` }
            case 3: return { ...d, label: 'Referrals', value: `${referral?.click_count ?? 0}` }
            case 4: return { ...d, label: 'Pending', value: `$${summary?.pending ?? 0}` }
            default: return d
        }
    })

    useFocusEffect(
        React.useCallback(() => {
            if (token) {
                dispatch(fetchMe())
                dispatch(fetchInfluencerMe())
                dispatch(fetchEarningsSummary())
            }
        }, [dispatch, token])

    )
    console.log('sss', typeof isLanguage)

    useEffect(() => {
        setIsLanguage(currentLanguage == 'ar')
    }, [currentLanguage])

    const handleReferalLinks = (name) => {
        if (name == 'referalLink') {
            navigation.navigate('ReferalLinkScreen')
        } else if (name == 'earningHistory') {
            navigation.navigate('EarningHistory')
        } else {
            navigation.navigate('')
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.card, { backgroundColor: item?.themeColor, borderColor: item?.borderColor }]}>
                <View style={styles.row}>
                    <CustomText xl style={{ color: colors.gray3 }}>{item?.label}</CustomText>
                    {item?.icon}
                </View>
                <CustomText bold style={{ color: item.color, fontSize: 20 }}>{item?.value}</CustomText>
            </View>
        )
    }

    const renderReferalData = ({ item }) => {


        return (
            <TouchableOpacity onPress={() => handleReferalLinks(item?.name)} style={styles.referralRow}>
                <Ionicons name={'chevron-forward-outline'} size={17} color={colors.black} />
                <CustomText medium>{item?.name}</CustomText>

                <View style={styles.referralIcon}>
                    {item?.icon}
                </View>
            </TouchableOpacity>
        )
    }

    const handleMainNavigation = (name) => {
        if (name == 'myOrder') {
            navigation.navigate('MyOrdersScreen')
        } else if (name == 'paymentAddress') {
            navigation.navigate('PaymentAddress')
        } else if (name == 'setting') {
            navigation.navigate('SettingScreen')
        } else {
            navigation.navigate('FavoriteScreen')
        }
    }

    const handleClipboard = () => {
        if (!referral?.code) return
        Clipboard.setString(referral.code);
        showMessage({
            type: "success",
            message: i18next.t('yourCodeisCopied'),
        })
    }

    const handleShareLink = async () => {
        try {
            const result = await Share.share({
                message: `Check out this awesome app! Use my referral code: ${referralCode} ${referral?.link || shareUrl}`,
                url: referral?.link || shareUrl,
                title: 'Referral Link',
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {

                } else {
                    // Shared
                    Alert.alert('Success', 'Link shared successfully!');
                }
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    }


    const changeLanguage = async (lang) => {
        try {
            if (lang === currentLanguage) return;

            // 1. Update Redux/Local State and i18next first
            dispatch(setLanguage(lang));
            await i18next.changeLanguage(lang);

            const isRTL = lang === 'ar';

            // 2. Check if RTL layout needs a hard toggle
            if (I18nManager.isRTL !== isRTL) {
                I18nManager.allowRTL(isRTL);
                I18nManager.forceRTL(isRTL);

                // 3. Restart immediately without setTimeout to prevent Android from hanging
                // setTimeout(() => {
                //     RNRestart.restart();

                //     }, 1500);

            }
        } catch (e) {
            console.log("Language change error:", e);
        }
    };

    // const toggleLanguage = () => {
    //     // setIsLanguage(!isLanguage)
    //     // changeLanguage(currentLanguage == 'en' ? 'ar' : 'en')


    //     dispatch(languageSelection(currentLanguage == 'en' ? 'ar' : 'en'))

    // };


    const toggleLanguages = async => {
        const isChangeLanguage = currentLanguage == 'en' ? 'ar' : 'en'
        dispatch(setLanguage(isChangeLanguage));

        if (isChangeLanguage == 'ar') {
            I18nManager.allowRTL(true);
            I18nManager.forceRTL(true);
        } else {
            I18nManager.allowRTL(false);
            I18nManager.forceRTL(false);
        }

        //     setTimeout(() => {
        //         RNRestart.Restart();
        //     }, 800);
    };


    // const toggleLanguage = async () => {
    //     const nextLang = currentLanguage === 'en' ? 'ar' : 'en';
    //     const isRTL = nextLang === 'ar';

    //     try {
    //         await i18next.changeLanguage(nextLang);

    //         dispatch(setLanguage(nextLang));

    //         if (I18nManager.isRTL !== isRTL) {
    //             I18nManager.allowRTL(isRTL);
    //             I18nManager.forceRTL(isRTL);

    //             setTimeout(() => {
    //                 DevSettings.reload();
    //             }, 350);
    //         }

    //     } catch (e) {
    //         console.log("Language layout compilation execution failure:", e);
    //     }
    // };

const toggleLanguage = async () => {
    const nextLang = currentLanguage === 'en' ? 'ar' : 'en';
    const shouldBeRTL = nextLang === 'ar';

    try {
        // 1. Update i18next and Redux state
        await i18next.changeLanguage(nextLang);
        dispatch(setLanguage(nextLang));

        // // 2. Set Layout
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);

        // 3. IMPORTANT: Delay the restart slightly 
        // This gives Redux-Persist a moment to finish writing the new language to storage
        setTimeout(() => {
            RNRestart.restart();
        }, 500); 

    } catch (e) {
        console.log("Error switching language:", e);
    }
};
    return (
        <CustomScreenView >
            <HeaderBox title={'profile'} />

            <View style={styles.profileBox}>
                <View style={styles.profileHeader}>
                    {
                        user?.avatar ?
                            <RemoteImage
                                uri={user?.avatar}
                                style={styles.avatar}
                            />
                            :
                            <View style={styles.avatar}>
                                <FontAwesome name={'user-circle'} size={40} color={colors.white} />
                            </View>
                    }

                    <View style={[styles.profileText, !user?.email && { marginTop: 22 }]}>
                        <CustomText translate={false} semiBold >{user?.name || 'Guest'}</CustomText>
                        <CustomText translate={false} light style={{ color: colors.gray23 }}>{user?.phone || user?.email || ''}</CustomText>
                    </View>

                </View>

                {/* <CustomButton
                    title={'editProfile'}
                    style={{ backgroundColor: colors.purple2 }}
                    textStyle={{ color: colors.purple }}
                    onPress={() => navigation.navigate('EditProfileScreen')}
                /> */}


                <CustomButton
                    title={'editProfile'}
                    style={{ backgroundColor: colors.secondary2 }}
                    textStyle={{ color: colors.secondary }}
                    disabled={!token}
                    onPress={() => navigation.navigate('EditProfileScreen')}
                />
            </View>
            {/* 
            {referralCode && <View style={styles.referralBox}>
                <CustomText style={{ color: colors.gray26, }}>referralCode</CustomText>
                <View style={styles.referralInner}>
                    <TouchableOpacity onPress={handleClipboard} style={styles.copyBtn}>
                        <Feather name={'copy'} size={20} color={colors.white} />
                    </TouchableOpacity>

                    <View style={styles.codeBox}>
                        <CustomText translate={false}>{referralCode}</CustomText>
                    </View>
                </View>

                <CustomButton
                    bag
                    title={'shareLink'}
                    style={{ borderColor: colors.purple?.concat('20') }}
                    transparent
                    textStyle={{ color: colors.purple }}
                    onPress={handleShareLink}
                />
            </View>} */}

            {/* <TitleViewAll title={'earningOverview'} />

            <FlatList
                data={dashData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                columnWrapperStyle={styles.gridRow}
                scrollEnabled={false}
            /> */}

            {/* <BorderLine centerLine style={{ marginTop: 30 }} />

            <FlatList
                data={referalData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderReferalData}
                contentContainerStyle={styles.referralList}
                scrollEnabled={false}

            /> */}

            {
                orderButton?.map((item, index) => (
                    <TouchableOpacity onPress={() => handleMainNavigation(item?.name)} key={index} style={styles.orderItem}>
                        <View style={styles.orderIcon}>
                            <Feather name={item?.icon} size={20} color={colors.secondary} />
                        </View>

                        <CustomText xl semiBold>{item?.name}</CustomText>
                        <Ionicons
                            name={I18nManager.isRTL ? 'chevron-back' : 'chevron-forward'}
                            style={{ marginLeft: "auto" }}
                            size={18}
                            color={colors.gray}
                        />
                    </TouchableOpacity>

                ))
            }


            <View style={styles.orderItem}>
                <View style={styles.orderIcon}>
                    <Feather name={'globe'} size={20} color={colors.secondary} />
                </View>

                <CustomText xl semiBold>Language</CustomText>


                <View style={{ marginLeft: "auto", flexDirection: Platform.OS == 'android' ? 'row' : I18nManager.isRTL ? 'row-reverse' : 'row', alignItems: "center" }}>
                    <CustomText>EN</CustomText>
                    <Switch
                        trackColor={{ false: colors.gray24, true: colors.gray2 }}
                        thumbColor={isLanguage ? colors.white : '#f4f3f4'}
                        // ios_backgroundColor={colors.gray24}
                        onValueChange={toggleLanguage}
                        value={currentLanguage === 'ar'}
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                    />


                    <CustomText style={Platform.OS == 'ios' && { marginLeft: 9, marginRight: 9 }}>AR</CustomText>

                </View>

            </View>













            <CustomButton
                leftIcon={
                    token ?
                        I18nManager?.isRTL ?
                            <MaterialIcons name={'logout'} size={22} color={colors.red} />
                            :
                            <SimpleLineIcons name={'logout'} size={16} color={colors.red} />

                        :

                        I18nManager?.isRTL ?
                            <SimpleLineIcons name={'logout'} size={16} color={colors.red} />

                            :
                            <MaterialIcons name={'logout'} size={22} color={colors.red} />


                }
                title={token ? 'logout' : "login"}
                style={styles.logoutBtn}
                textStyle={styles.logoutText}
                onPress={() => {
                    dispatch(logout())
                    navigation.navigate('LoginScreen')
                }}
            />


            {
                token &&
                <CustomButton
                    leftIcon={<EvilIcons name={'trash'} size={22} color={colors.red} />}
                    title={"deleteAccount"}
                    style={styles.logoutBtn}
                    textStyle={styles.logoutText}
                    onPress={() => {
                        dispatch(logout())
                        navigation.navigate('LoginScreen')
                    }}
                />
            }

        </CustomScreenView>
    )
}

export default AccountScreen

const styles = StyleSheet.create({
    card: {
        width: "48%",
        alignItems: "flex-end",
        paddingVertical: 22,
        paddingHorizontal: 20,
        gap: 10,
        borderRadius: 16,
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: "center",
        gap: 7
    },
    profileBox: {
        borderWidth: 1,
        padding: 15,
        borderRadius: 10,
        borderColor: colors.gray24,
        marginVertical: 15
    },
    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        // justifyContent: "space-between",
        marginBottom: 15,
        gap: 25

    },
    profileText: {
        // margin: "auto",
        // left: 35,
        gap: 5,
        width: "75%"
    },
    avatar: {
        width: 64,
        height: 64,
        backgroundColor: colors.black,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    referralBox: {
        marginBottom: 12,
        backgroundColor: colors.purple1,
        gap: 15,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.purple2
    },
    referralInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%"
    },
    copyBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.purple
    },
    codeBox: {
        backgroundColor: colors.white,
        height: 40,
        width: "85%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    gridContainer: {
        gap: 12
    },
    gridRow: {
        justifyContent: "space-between"
    },
    referralRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    referralIcon: {
        marginLeft: "auto",
        width: 28,
        height: 28,
        borderRadius: 50,
        backgroundColor: colors.purple1,
        alignItems: "center",
        justifyContent: "center"
    },
    referralList: {
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        backgroundColor: colors.white,
        elevation: 3,
        margin: 3,
        padding: 20,
        borderRadius: 16,
        marginVertical: 30
    },
    orderItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        backgroundColor: colors.white,
        elevation: 3,
        margin: 3,
        padding: 20,
        borderRadius: 16,
        marginBottom: 10
    },
    orderIcon: {
        width: 40,
        height: 40,
        backgroundColor: colors.gray23,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    logoutBtn: {
        backgroundColor: colors.red2,
        // height: 50,
        marginTop: 20
    },
    logoutText: {
        color: colors.red,
        fontSize: 17
    }
})