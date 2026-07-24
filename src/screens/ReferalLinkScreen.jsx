import { Image, StyleSheet, View, TouchableOpacity, Alert, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { colors } from '../constants/color'
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { socialIcons } from '../constants/data'
import Clipboard from '@react-native-clipboard/clipboard'
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next'
import { fetchInfluencerMe } from '../redux/reducers/Influencer'

const ReferalLinkScreen = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const referral = useSelector(s => s?.influencer?.referral)

    useEffect(() => { if (token) dispatch(fetchInfluencerMe()) }, [token, dispatch])

    const code = referral?.code || '—'
    const link = referral?.link || ''

    const handleClipboard = () => {
        if (code === '' || code === '-') {
            return Alert.alert('Referral Code is not Correct');
        }
        Clipboard.setString(code)
        showMessage({ type: 'success', message: t('yourCodeisCopied') })
    }

    const handleLinkToClipboard = () => {
        if (!link) return Alert.alert('Link is not Correct')
        Clipboard.setString(link)
        showMessage({ type: 'success', message: t('linkCopied') })
    }



    const handleSocialShare = async (platform) => {
        if (!link) {
            return Alert.alert(t('linkIsIncorrect') || 'Link is not Correct');
        }

        const encodedLink = encodeURIComponent(link);
        const shareText = encodeURIComponent(`${t('checkOutMyReferralLink') || 'Check out my referral link!'} `);

        let url = '';

        switch (platform) {
            case 'whatsapp':
                url = `whatsapp://send?text=${shareText}${encodedLink}`;
                break;
            case 'instagram':
                // Instagram doesn't support direct text pre-filling via URL scheme.
                // The industry standard approach is opening the app or falling back to the store.
                url = `instagram://camera`;
                break;
            case 'facebook':
                url = `fb://facewebmodal/f?href=https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                break;
            case 'twitter':
                url = `twitter://post?message=${shareText}${encodedLink}`;
                break;
            default:
                return;
        }


        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                // Fallback to web browser versions if the native application isn't installed on the device
                let webFallbackUrl = '';
                if (platform === 'whatsapp') webFallbackUrl = `https://api.whatsapp.com/send?text=${shareText}${encodedLink}`;
                if (platform === 'instagram') webFallbackUrl = `https://www.instagram.com`;
                if (platform === 'facebook') webFallbackUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
                if (platform === 'twitter') webFallbackUrl = `https://twitter.com/intent/tweet?text=${shareText}${encodedLink}`;

                if (webFallbackUrl) {
                    await Linking.openURL(webFallbackUrl);
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open the application');
        }
    };


    return (
        <CustomScreenView>
            <HeaderBox title={'referalLinks'} />

            <LinearGradient
                colors={['#AD46FF', '#AD46FF', '#8200DB']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
            >
                <View style={styles.containerPadding}>
                    <View style={styles.rowBetween}>
                        <CustomText style={styles.whiteText} xl medium>
                            yourReferalCode
                        </CustomText>
                        <FontAwesome5 name={'chess-queen'} color={colors.white} size={20} />
                    </View>

                    <View style={styles.whiteBox}>
                        <View style={styles.blackBox}>
                            <Image
                                source={require('../assets/images/whiteDots.png')}
                                style={styles.image}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.purpleCard} onPress={handleClipboard}>
                        <CustomText style={styles.lightPurpleText} xxl semiBold>
                            referalCode
                        </CustomText>
                        <CustomText translate={false} xxxl semiBold style={styles.whiteText}>
                            {code}
                        </CustomText>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* <ShadowWrapper>
                <View style={styles.rowBetween}>
                    <CustomText medium>referalCode</CustomText>
                    <Feather name={'link'} size={15} color={colors.purple} />
                </View>

                <View style={styles.referralInner}>
                    <View style={styles.codeBox}>
                        <CustomText translate={false} style={styles.purpleText} medium>
                            {code}
                        </CustomText>
                    </View>
                    <TouchableOpacity onPress={handleClipboard} style={styles.copyBtn}>
                        <Feather name={'copy'} size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <CustomText style={styles.centerText} xs>
                    customerCheckout
                </CustomText>
            </ShadowWrapper> */}

            <ShadowWrapper>
                <View style={styles.rowBetween}>
                    <CustomText medium>referalLinks</CustomText>
                    <Ionicons name={'share-social-outline'} size={20} color={colors.blue} />
                </View>

                <View style={styles.referralInner}>
                    <View style={styles.codeBox}>
                        <CustomText style={styles.grayText} translate={false}>
                            {link}
                        </CustomText>
                    </View>
                    <TouchableOpacity onPress={handleLinkToClipboard} style={styles.copyBtnBlue}>
                        <Feather name={'copy'} size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>

                <CustomText style={styles.centerText} xs>
                    shareThisLink
                </CustomText>
            </ShadowWrapper>

            <ShadowWrapper>
                <View style={styles.rowBetween}>
                    <CustomText medium>shareVia</CustomText>
                    <Ionicons name={'share-social-outline'} size={20} color={colors.blue} />
                </View>

                {/* <View style={styles.socialRow}>
                    {socialIcons?.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={[styles.socialBtn, { backgroundColor: item?.color }]}>
                                {item?.icon}
                            </TouchableOpacity>
                        )
                    })}
                </View> */}

                <View style={styles.socialRow}>
                    {socialIcons?.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.7}
                                onPress={() => handleSocialShare(item?.type)} // 🌟 Added click action
                                style={[styles.socialBtn, { backgroundColor: item?.color }]}
                            >
                                {item?.icon}
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ShadowWrapper>

            <View style={styles.analyticsBox}>
                <View style={[styles.rowBetween, styles.marginBottom10]}>
                    <CustomText medium>linkAnalytics</CustomText>
                    <Ionicons name={'share-social-outline'} size={20} color={colors.blue} />
                </View>

                <View style={styles.analyticsRow}>
                    <View>
                        <CustomText translate={false} style={styles.analyticsNumber} semiBold xxxl>
                            {referral?.click_count ?? 0}
                        </CustomText>
                        <CustomText xxs>clicks</CustomText>
                    </View>

                    <View>
                        <CustomText translate={false} style={styles.analyticsNumber} semiBold xxxl>
                            {referral?.conversion_count ?? 0}
                        </CustomText>
                        <CustomText xxs>conversion</CustomText>
                    </View>

                    <View>
                        <CustomText translate={false} style={styles.analyticsNumber} semiBold xxxl>
                            {referral?.conversion_rate ?? 0}%
                        </CustomText>
                        <CustomText xxs>rate</CustomText>
                    </View>
                </View>
            </View>
        </CustomScreenView>
    )
}

export default ReferalLinkScreen

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        borderRadius: 15,
        marginTop: 20
    },

    containerPadding: {
        padding: 25
    },

    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
    },

    whiteText: {
        color: colors.white
    },

    whiteBox: {
        height: 190,
        width: "100%",
        backgroundColor: colors.white,
        alignSelf: "center",
        borderRadius: 10,
        justifyContent: "center"
    },

    blackBox: {
        height: 160,
        width: 160,
        backgroundColor: "black",
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    image: {
        width: 60,
        height: 60
    },

    purpleCard: {
        backgroundColor: colors.purple2,
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
        borderRadius: 16,
        marginTop: 16
    },

    lightPurpleText: {
        color: '#F3E8FF'
    },

    purpleText: {
        color: colors.purple
    },

    grayText: {
        color: colors.gray27
    },

    referralInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20
    },

    copyBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.purple
    },

    copyBtnBlue: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.blue
    },

    codeBox: {
        backgroundColor: '#F9FAFB',
        height: 40,
        width: "85%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    centerText: {
        textAlign: "center"
    },

    socialRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    },

    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    analyticsBox: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.purple1,
        borderColor: colors.purple2,
        marginTop: 20
    },

    analyticsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-around'
    },

    analyticsNumber: {
        textAlign: "center",
        color: colors.purple
    },

    marginBottom10: {
        marginBottom: 10
    }
})