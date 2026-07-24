import { Alert, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'
import CustomButton from '../components/CustomButton'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { fonts } from '../constants/fonts'
import Feather from 'react-native-vector-icons/Feather'
import { requestPasswordReset, verifyOtp } from '../redux/reducers/Auth'
import { useTranslation } from 'react-i18next'

const CELL_COUNT = 6;

const OTPScreen = ({ navigation }) => {
        const { t } = useTranslation()
    
    const dispatch = useDispatch()
    const { loading, resetEmail } = useSelector(s => s.auth)

    const [value, setValue] = useState('');
    const [timer, setTimer] = useState(45);
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    useEffect(() => {
        if (timer <= 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        if (!resetEmail) {
          Alert.alert(t('missingEmail'), t('restartPasswordResetFlow'));
            return
        }
        if (value.length !== CELL_COUNT) {
         Alert.alert(t('incompleteCode'), t('enterSixDigitCode'));
            return
        }
        const res = await dispatch(verifyOtp({ email: resetEmail, code: value, purpose: 'password_reset' }))
        if (verifyOtp.fulfilled.match(res)) {
            navigation.navigate('PasswordResetScreen')
        } else {
            Alert.alert('Verification failed', res.payload?.message || 'Invalid or expired code')
        }
    }

    const handleResend = async () => {
        if (!resetEmail) return
        await dispatch(requestPasswordReset({ email: resetEmail }))
        setTimer(45)
    }

    return (
        <CustomScreenView>
            <HeaderBox title={'verifyCode'} />

            <ShadowWrapper>
                <View style={styles.centerBox}>
                    <View style={styles.iconCircle}>
                        <Feather name={'shield'} size={55} color={colors.secondary} />
                    </View>
                    <CustomText style={styles.title} bold>enterCode</CustomText>
                    <CustomText style={styles.subtitle} xs light>verificationCode</CustomText>
                    <CustomText translate={false} style={styles.email} xs medium>{resetEmail || ''}</CustomText>
                </View>

                <CodeField
                    ref={ref}
                    {...props}
                    value={value}
                    onChangeText={setValue}
                    cellCount={CELL_COUNT}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <View
                            key={index}
                            style={[styles.cell, isFocused && styles.focusCell]}
                        >
                            <Text
                                style={styles.cellTxt}
                                onLayout={getCellOnLayoutHandler(index)}
                            >
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                    )}
                />

                <View style={styles.resendContainer}>
                    <CustomText s>didntRcvCode</CustomText>
                    <TouchableOpacity
                        style={styles.resendBtn}
                        disabled={timer > 0}
                        onPress={handleResend}
                    >
                        <CustomText medium s style={styles.resendTextColor}>resend</CustomText>
                        <CustomText translate={false} s medium style={styles.resendTextColor}>({timer})</CustomText>
                        <Feather name={'refresh-ccw'} color={colors.secondary} size={17} />
                    </TouchableOpacity>
                </View>

                <CustomButton
                    title={loading ? 'loading' : 'verifyCode'}
                    style={styles.button}
                    textStyle={styles.buttonText}
                    disabled={loading}
                    onPress={handleVerify}
                />
            </ShadowWrapper>

            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('LoginScreen')}>
                <CustomText medium style={styles.backText}>backtoLogin</CustomText>
            </TouchableOpacity>
        </CustomScreenView>
    )
}

export default OTPScreen

const styles = StyleSheet.create({
    centerBox: { alignItems: 'center', gap: 10 },
    iconCircle: {
        width: 100,
        height: 100,
        backgroundColor: colors.secondary2,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontSize: 18 },
    subtitle: {},
    email: {},
    codeFieldRoot: {
        marginBottom: 16,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
        justifyContent: 'center',
        gap: 15,
        marginVertical: 35,
    },
    cell: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.gray4,
        paddingBottom: 5,
        borderRadius: 10,
        paddingTop: 5,
    },
    cellTxt: { fontSize: 25, color: colors.black, fontFamily: fonts.regular },
    focusCell: { borderWidth: 1, borderColor: colors.secondary },
    resendContainer: { alignItems: 'center', marginTop: 10 },
    resendBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7, marginBottom: 25 },
    resendTextColor: { color: colors.secondary },
    button: { height: 50 },
    buttonText: { fontSize: 16 },
    backBtn: { marginTop: 15, alignItems: 'center' },
    backText: { color: colors.secondary },
})
