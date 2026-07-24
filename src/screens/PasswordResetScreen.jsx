import { Alert, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import Feather from 'react-native-vector-icons/Feather'
import CustomText from '../components/CustomText'
import CustomButton from '../components/CustomButton'
import { colors } from '../constants/color'
import CustomInput from '../components/CustomInput'
import { resetPassword } from '../redux/reducers/Auth'
import { useTranslation } from 'react-i18next'

const PasswordResetScreen = ({ navigation, route }) => {
const {t} = useTranslation()
    const { screenName } = route?.params || ''
    const dispatch = useDispatch()
    const { loading, resetEmail, resetToken } = useSelector(s => s.auth)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isPasswordStrong, setIsPasswordStrong] = useState('')


    const [isEye, setIsEye] = useState(false)
    const [confirmIsEye, setConfirmIsEye] = useState(false)






    useEffect(() => {
        if (password?.length > 8) {
            setIsPasswordStrong('strong');
        } else if (password?.length > 5) {
            setIsPasswordStrong('medium');
        } else {
            setIsPasswordStrong('weak');
        }
    }, [password]);


    const getStrengthConfig = (strength) => {
        switch (strength) {
            case 'strong':
                return { width: '100%', color: 'green' };
            case 'medium':
                return { width: '60%', color: 'orange' };
            default:
                return { width: '30%', color: 'red' };
        }
    };

    const { width, color } = getStrengthConfig(isPasswordStrong);

    return (
        <CustomScreenView>
            <HeaderBox
                title={'newPassword'}
            />
            <ShadowWrapper>
                <View style={styles.centerBox}>
                    <View style={styles.iconCircle}>
                        <Feather name={'lock'} size={55} color={colors.purple} />
                    </View>
                    <CustomText style={styles.title} bold>newPassword</CustomText>
                    <CustomText style={styles.subtitle} xs light>chooseStrongPass</CustomText>
                </View>



                <CustomInput
                    label={'newPassword'}
                    placeholder={'enterNewPassword'}
                    eye
                    borderInput
                    value={password}
                    onChangeText={setPassword}


                    secureTextEntry={!isEye}
                    isEye={isEye}
                    onPressEye={() => setIsEye(!isEye)}
                />
                <View>
                    <View style={{ height: 7, borderRadius: 10, backgroundColor: colors.gray, marginTop: 10 }}>
                        <View style={{ height: "100%", backgroundColor: color, width: width, borderRadius: 10 }} />
                    </View>
                    <CustomText style={{ color: color, textAlign: "right", marginTop: 5, textTransform: "capitalize" }} l semiBold>{isPasswordStrong}</CustomText>
                </View>


                <CustomInput
                    label={'confirmPassword'}
                    placeholder={'enterConfirmPassword'}
                    eye
                    borderInput
                    security
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}


                    secureTextEntry={!confirmIsEye}
                    isEye={confirmIsEye}
                    onPressEye={() => setConfirmIsEye(!confirmIsEye)}
                />



                <View style={{ borderWidth: 1, borderColor: colors.purple3, borderRadius: 20, padding: 15, backgroundColor: colors.purple4, marginTop: 15, marginBottom: 30 }}>
                    <CustomText style={{ marginBottom: 15 }}>passwordRequirment</CustomText>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Feather name={'check-circle'} size={18} color={colors.green} />
                        <CustomText medium s style={{ color: colors.gray27 }}>leastCharacter</CustomText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginVertical: 9 }}>
                        <Feather name={'check-circle'} size={18} color={colors.green} />
                        <CustomText medium s style={{ color: colors.gray27 }}>upperCase</CustomText>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Feather name={'check-circle'} size={18} color={colors.green} />
                        <CustomText medium s style={{ color: colors.gray27 }}>oneNumber</CustomText>
                    </View>
                </View>


                <CustomButton
                    title={loading ? 'loading' : (screenName == 'createAccount' ? 'confirm' : 'resetPasword')}
                    style={styles.button}
                    textStyle={styles.buttonText}
                    disabled={loading}
                    onPress={async () => {
                        if (!resetEmail || !resetToken) {
                            Alert.alert('Missing token', 'Restart the password reset flow')
                            return
                        }
                        if (!password || password !== confirmPassword) {
                           Alert.alert(t('mismatch'), t('passwordsDoNotMatch'));
                            return
                        }
                        const res = await dispatch(resetPassword({
                            email: resetEmail,
                            token: resetToken,
                            password,
                            password_confirmation: confirmPassword,
                        }))
                        if (resetPassword.fulfilled.match(res)) {
                            navigation.reset({ index: 0, routes: [{ name: 'BottomTabNavigation' }] })
                        } else {
                            Alert.alert('Reset failed', res.payload?.message || 'Try again')
                        }
                    }}
                />
            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default PasswordResetScreen

const styles = StyleSheet.create({
    centerBox: {
        alignItems: "center",
        gap: 10,
    },
    iconCircle: {
        width: 100,
        height: 100,
        backgroundColor: colors.purple2,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
    },
    resendContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    resendBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
        marginBottom: 25,
    },
    resendTextColor: {
        color: colors.secondary,
    },

    button: {
        height: 50,
    },
    buttonText: {
        fontSize: 16,
    },

    backBtn: {
        marginTop: 15,
        alignItems: "center",
    },
    backText: {
        color: colors.secondary,
    },
})