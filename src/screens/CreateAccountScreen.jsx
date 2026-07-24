import { Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import BorderLine from '../components/BorderLine'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import RemoteImage from '../components/RemoteImage'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { fonts } from '../constants/fonts'
import HeaderBox from '../components/HeaderBox'
import { register } from '../redux/reducers/Auth'
import { useTranslation } from 'react-i18next'
import { handleNoTagsInput } from '../constants/helper'

const CreateAccountScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { loading } = useSelector(s => s.auth)
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [isEye, setIsEye] = useState(false)
    const [confirmIsEye, setConfirmIsEye] = useState(false)

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert(
                t('Missing fields'),
                t('Enter email and password')
            )
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

        if (password !== passwordConfirmation) {
            Alert.alert(
                t('Passwords mismatch'),
                t('Confirmation does not match')
            )
            return
        }

        const res = await dispatch(register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
        }))


        if (register.fulfilled.match(res)) {
            navigation.reset({ index: 0, routes: [{ name: 'DrawerNavigation' }] })
        } else {
            const errs = res.payload?.errors
            const first = errs ? Object.values(errs)[0]?.[0] : null
            Alert.alert('Registration failed', first || res.payload?.message || 'Try again')
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>

            <CustomScreenView>
                <HeaderBox title={'createAcc'} />

                <ShadowWrapper>
                    <CustomText style={styles.title} semiBold>createAccount</CustomText>
                    <CustomText style={styles.subtitle}>regNewAccount</CustomText>

                    <BorderLine centerLine mv />

                    <CustomText bold xl style={styles.sectionTitle}>personalInfo</CustomText>

                    <CustomInput
                        label={'fullName'}
                        placeholder={'writeNameHere'}
                        borderInput
                        user
                        value={name}
                        onChangeText={(text) => handleNoTagsInput(text, setName)}

                    />

                    <CustomInput
                        label={'emailAddress'}
                        placeholder={'email@gmail.com'}
                        borderInput
                        mail
                        value={email}
                    onChangeText={(text) => handleNoTagsInput(text, setEmail)}

                    />

                    <CustomInput
                        label={'password'}
                        placeholder={'password'}
                        borderInput
                        eye
                        secureTextEntry={!isEye}
                        value={password}
                        onChangeText={setPassword}
                        isEye={isEye}
                        onPressEye={() => setIsEye(!isEye)}
                    />

                    <CustomInput
                        label={'confirmPassword'}
                        placeholder={'confirmPassword'}
                        borderInput
                        eye
                        secureTextEntry={!confirmIsEye}
                        inputContainer={{ marginBottom: 20 }}
                        value={passwordConfirmation}
                        onChangeText={setPasswordConfirmation}
                        isEye={confirmIsEye}
                        onPressEye={() => setConfirmIsEye(!confirmIsEye)}
                    />




                    <CustomButton
                        title={loading ? 'loading' : 'createAcc'}
                        disabled={loading}
                        onPress={handleRegister}
                    />

                    <View style={styles.dividerRow}>
                        <View style={styles.line} />
                        <CustomText medium style={styles.orText}>or</CustomText>
                        <View style={styles.line} />
                    </View>

                    {/* <View style={styles.socialRow}>
                    <TouchableOpacity style={styles.socialBtn}>
                        <RemoteImage
                            uri={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWIl8zC8WAMHi5JVmKUb3YVvZd5gvoCdy-NQ&s'}
                            style={styles.socialImage}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialBtn}>
                        <SimpleLineIcons name={'social-facebook'} size={30} color={colors.blue} />
                    </TouchableOpacity>
                </View>

                <CustomButton
                    leftIcon={<FontAwesome5 name={'chess-queen'} size={20} color={colors.purple} />}
                    style={styles.influencerBtn}
                    title={'regInfluencer'}
                    textStyle={styles.influencerText}
                    onPress={() => navigation.navigate('InfluencerRegisterationScreen')}
                /> */}

                    <View style={styles.bottomRow}>
                        <CustomText medium>alreadyAccount</CustomText>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <CustomText medium style={styles.loginText}>login</CustomText>
                        </TouchableOpacity>
                    </View>

                </ShadowWrapper>

            </CustomScreenView>
        </KeyboardAvoidingView>

    )
}

export default CreateAccountScreen

const styles = StyleSheet.create({
    title: { fontSize: 22, textAlign: 'center', marginBottom: 5 },
    subtitle: { color: colors.black3, textAlign: 'center' },
    sectionTitle: { marginBottom: 15 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 },
    line: { width: '46%', height: 1, backgroundColor: colors.gray4 },
    orText: { color: colors.secondary },
    socialRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    socialBtn: {
        width: '48%',
        backgroundColor: colors.gray25,
        borderWidth: 1,
        borderColor: colors.gray5,
        borderRadius: 10,
        padding: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    socialImage: { width: 30, height: 30 },
    influencerBtn: { backgroundColor: colors.purple2, height: 50, marginTop: 20, marginBottom: 30 },
    influencerText: { fontFamily: fonts.semiBold, fontSize: 16, color: colors.purple },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
    loginText: { color: colors.secondary },
})
