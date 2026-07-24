import { Alert, Image, Linking, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitSupportTicket } from '../redux/reducers/Content'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import { height, width } from '../constants/data'
import ShadowWrapper from '../components/ShadowWrapper'
import TitleIcon from '../components/TitleIcon'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SwitchWithText from '../components/SwitchWithText'
import BorderLine from '../components/BorderLine'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import BottomSocialIcon from '../components/BottomSocialIcon'
import { useTranslation } from 'react-i18next'
import { handleNoTagsInput } from '../constants/helper'
import HighLogo from '../components/HighLogo'

const HelpAndSupport = () => {
    const dispatch = useDispatch()
    const submitting = useSelector(s => s?.content?.submitting)

    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const handleSendTicket = async () => {
        if (!name || !email || !subject || !message) {
            Alert.alert(
                t('Missing fields'),
                t('Please Fill all the fields'),
            ); return
        }



        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            Alert.alert(
                t('validationTitle') || 'Invalid Email',
                t('validationEmailInvalid') || 'Please enter a valid email address'
            )
            return
        }




        const res = await dispatch(submitSupportTicket({ name, email, subject, message }))
        if (submitSupportTicket.fulfilled.match(res)) {
            Alert.alert('Sent', 'Support ticket submitted')
            setName(''); setEmail(''); setSubject(''); setMessage('')
        } else {
            Alert.alert('Failed', res.payload?.message || 'Try again')
        }
    }




    const handleEmailOption = async () => {
        const url = 'mailto:Support@Shopajy.com?subject=Support%20Request&body=Hello';

        try {
            await Linking.openURL(url);
        } catch (error) {
            console.log('Error opening URL:', error);
        }
    };


    const handleRate = () => {
        Alert.alert(
            t('soon'),
            t('Ratings will be available after the app is published. Thanks for supporting us!')
        )
    }

    return (
        <CustomScreenView>
            <HeaderBox
                title={'helpSupport'}
            />


            <HighLogo />



            <ShadowWrapper>
                <TitleIcon
                    leftTitle={'privacySetting'}
                    icon={<MaterialIcons name={'mail-outline'} size={20} color={colors.secondary} />}
                />
                <BorderLine centerLine mv style={{ height: 2 }} />
                <SwitchWithText
                    switchTitle={'contactOption'}
                    icon={<MaterialIcons name={'mail-outline'} size={16} color={colors.secondary} />}
                    arrow
                    subTitle={'Support@Shopajy.com'}
                    onPress={() => handleEmailOption()}
                />
                <SwitchWithText
                    switchTitle={'rateApp'}
                    arrow
                    icon={<Feather name={'star'} size={16} color={colors.secondary} />}
                    subTitle={'rateAppStore'}
                    mb
                    onPress={() => handleRate()}

                />
            </ShadowWrapper>



            <ShadowWrapper >
                <TitleIcon
                    leftTitle={'contactForm'}
                    icon={<MaterialIcons name={'mail-outline'} size={20} color={colors.secondary} />}
                />
                <BorderLine centerLine mv style={{ height: 2 }} />

                <CustomText l medium>personalInfo</CustomText>


                <CustomInput
                    label={'fullName'}
                    placeholder={'enterName'}
                    style={{ marginTop: 20 }}
                    borderInput
                    user
                    value={name}
                    onChangeText={(text) => handleNoTagsInput(text, setName)}

                />


                <CustomInput
                    label={'emailAddress'}
                    placeholder={'email@gmail.com'}
                    style={{ marginTop: 20 }}
                    borderInput
                    mail
                    value={email}
                    onChangeText={setEmail}
                />

                <CustomInput
                    label={'subject'}
                    placeholder={'writeSubject'}
                    style={{ marginTop: 20 }}
                    borderInput
                    value={subject}
                    onChangeText={(text) => handleNoTagsInput(text, setSubject)}

                />

                <CustomInput
                    label={'message'}
                    placeholder={'writeMsg'}
                    style={{ marginTop: 20 }}
                    borderInput
                    multiline
                    textAlignVertical='top'
                    inputStyle={{ height: 80 }}
                    inputContainer={{ height: 100 }}
                    value={message}
                    onChangeText={setMessage}
                />

                <CustomButton
                    style={{ marginTop: 40, height: 50 }}
                    title={submitting ? 'loading' : 'sendMsg'}
                    leftIcon={<Feather name={'send'} size={20} color={colors.white} />}
                    disabled={submitting}
                    onPress={handleSendTicket}
                />
            </ShadowWrapper>



            <BottomSocialIcon
                showCopyrightText={false}
                mt
            />
        </CustomScreenView>
    )
}

export default HelpAndSupport

const styles = StyleSheet.create({})