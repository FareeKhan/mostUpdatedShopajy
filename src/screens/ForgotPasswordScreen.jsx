import { Alert, StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import { colors } from '../constants/color'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { requestPasswordReset, setResetEmail } from '../redux/reducers/Auth'
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next'
import { handleNoTagsInput } from '../constants/helper'

const ForgotPasswordScreen = ({ navigation }) => {
    
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const { loading } = useSelector(s => s.auth)
    const [email, setEmail] = useState('')

    const handleSend = async () => {
        if (!email) {
          Alert.alert(t('missingEmail'), t('enterYourEmail'));
            return
        }

            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
                if (!emailRegex.test(email.trim())) {
                    Alert.alert(
                        t('validationTitle') || 'Invalid Email',
                        t('validationEmailInvalid') || 'Please enter a valid email address'
                    )
                    return
                }


        const res = await dispatch(requestPasswordReset({ email }))
        console.log('resres',res)
        
        if (res?.payload?.otp) {
            showMessage({
                type:"success",
                message:`Your otp is ${res?.payload?.otp}`
            })
            dispatch(setResetEmail(email))
            navigation.navigate('OTPScreen')
        } else {
            Alert.alert('Error', res.payload?.message || t('Could not send reset code'))
        }
    }

    return (
        <CustomScreenView>
            <HeaderBox title={'forgotPass'} />

            <ShadowWrapper>
                <View style={{ alignItems: 'center', gap: 10 }}>
                    <View style={styles.iconCircle}>
                        <Ionicons name={'key-outline'} size={50} color={colors.secondary} />
                    </View>
                    <CustomText style={{ fontSize: 18 }} bold>forgotPassword</CustomText>
                    <CustomText xs light>resetPassword</CustomText>
                </View>

                <CustomInput
                    label={'emailAddress'}
                    placeholder={'email@gmail.com'}
                    borderInput
                    mail
                    style={{ marginVertical: 20 }}
                    value={email}
                    onChangeText={(text) => handleNoTagsInput(text, setEmail)}

                />

                <CustomButton
                    title={loading ? 'loading' : 'sendResetLink'}
                    style={{ height: 50 }}
                    textStyle={{ fontSize: 16 }}
                    disabled={loading}
                    onPress={handleSend}
                />
            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    iconCircle: {
        width: 100,
        height: 100,
        backgroundColor: colors.black,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
