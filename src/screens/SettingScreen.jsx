import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile } from '../redux/reducers/Auth'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import SwitchWithText from '../components/SwitchWithText'
import TitleIcon from '../components/TitleIcon'
import CustomText from '../components/CustomText'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { colors } from '../constants/color'
import BorderLine from '../components/BorderLine'
import { height } from '../constants/data'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { setEmailNotification, setPushNotification } from '../redux/reducers/notificationSlice'

const SettingScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const user = useSelector(s => s?.auth?.user)
    // const [isPushNotification, setIsPushNotification] = useState(user?.notify_push ?? true);
    // const [isEmailEnable, setIsEmailEnable] = useState(user?.notify_email ?? true);
    const version = useSelector(s => s?.settings?.values?.app_version) || '1.0.0'


    const isPushNotification = useSelector((state) => state.notificationSlice.isPushNotification);
    const isEmailEnable = useSelector((state) => state.notificationSlice.isEmailEnable);

    // useEffect(() => {
    //     if (user) {
    //         setIsPushNotification(user.notify_push ?? true)
    //         setIsEmailEnable(user.notify_email ?? true)
    //     }
    // }, [user?.notify_push, user?.notify_email])

    // SwitchWithText calls setIsEnabled with an updater fn (prev => !prev)
    // const togglePush = (updater) => {
    //     const value = typeof updater === 'function' ? updater(isPushNotification) : updater
    //     setIsPushNotification(value)
    //     if (token) dispatch(updateProfile({ notify_push: value }))
    // }

    // const toggleEmail = (updater) => {
    //     const value = typeof updater === 'function' ? updater(isEmailEnable) : updater
    //     setIsEmailEnable(value)
    //     if (token) dispatch(updateProfile({ notify_email: value }))
    // }


    const togglePush = () => {
        dispatch(setPushNotification(!isPushNotification));
    };

    const toggleEmail = () => {
        dispatch(setEmailNotification(!isEmailEnable));
    };

    return (
        <CustomScreenView>
            <HeaderBox
                title={'setting'}
            />

            <ShadowWrapper>
                <TitleIcon
                    leftTitle={'notification'}
                    icon={<EvilIcons name={'bell'} size={25} color={colors.secondary} />}
                />
                <BorderLine centerLine mv style={{ height: 2 }} />
                <SwitchWithText
                    setIsEnabled={togglePush}
                    isEnabled={isPushNotification}
                    switchTitle={'pushNotification'}
                    icon={<EvilIcons name={'bell'} size={18} color={colors.secondary} />}

                />

                <SwitchWithText
                    setIsEnabled={toggleEmail}
                    isEnabled={isEmailEnable}
                    switchTitle={'rcvViaMail'}
                    mb
                    icon={<MaterialIcons name={'forward-to-inbox'} size={15} color={colors.secondary} />}
                />

            </ShadowWrapper>

            <ShadowWrapper>
                <TitleIcon
                    leftTitle={'privacySetting'}
                    icon={<Feather name={'shield'} size={20} color={colors.secondary} />}
                />
                <BorderLine centerLine mv style={{ height: 2 }} />
                <SwitchWithText
                    switchTitle={'systemPermission'}
                    icon={<Feather name={'smartphone'} size={16} color={colors.secondary} />}
                    arrow
                    onPress={() => navigation.navigate('SystemPermission')}
                />

                <SwitchWithText
                    switchTitle={'termsCondition'}
                    arrow
                    icon={<Ionicons name={'document-text-outline'} size={16} color={colors.secondary} />}
                    onPress={() => navigation.navigate('TermsAndCondition', {
                        screen: "terms"
                    })}

                />


                <SwitchWithText
                    switchTitle={'Return & Exchange Policy'}
                    arrow

                    icon={<Ionicons name={'document-text-outline'} size={16} color={colors.secondary} />}
                    onPress={() => navigation.navigate('TermsAndCondition', {
                        screen: "returnpolicy"
                    })}

                />

                <SwitchWithText
                    switchTitle={'privacyPolicy'}
                    arrow
                    mb
                    icon={<Feather name={'unlock'} size={15} color={colors.secondary} />}
                     onPress={() => navigation.navigate('TermsAndCondition', {
                        screen: "privacy"
                    })}


                />



            </ShadowWrapper>

            <ShadowWrapper>
                <TitleIcon
                    leftTitle={'aboutApp'}
                    icon={<Feather name={'info'} size={20} color={colors.secondary} />}
                />
                <BorderLine centerLine mv style={{ height: 2 }} />
                <SwitchWithText
                    switchTitle={'aboutShopjy'}
                    icon={<Feather name={'info'} size={16} color={colors.secondary} />}
                    arrow
                    onPress={() => navigation.navigate('AboutApp')}
                />

                <SwitchWithText
                    switchTitle={'helpAndSupport'}
                    arrow
                    icon={<SimpleLineIcons name={'question'} size={16} color={colors.secondary} />}
                    mb
                    onPress={() => navigation.navigate('HelpAndSupport')}
                />

                <BorderLine centerLine mv />

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <CustomText medium>version</CustomText>
                    <CustomText translate={false} medium>{version}</CustomText>
                </View>
            </ShadowWrapper>

        </CustomScreenView>
    )
}

export default SettingScreen

const styles = StyleSheet.create({})
