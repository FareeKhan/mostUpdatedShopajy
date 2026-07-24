import { Alert, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import BorderLine from '../components/BorderLine'
import CustomInput from '../components/CustomInput'
import { colors } from '../constants/color'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Feather from 'react-native-vector-icons/Feather'
import CustomButton from '../components/CustomButton'
import { applyInfluencer } from '../redux/reducers/Influencer'


const InfluencerRegisterationScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const { submitting } = useSelector(s => s.influencer || {})
    const token = useSelector(s => s?.auth?.token)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [city, setCity] = useState('')
    const [instagram, setInstagram] = useState('')
    const [facebook, setFacebook] = useState('')
    const [youtube, setYoutube] = useState('')
    const [other, setOther] = useState('')
    const [followerCount, setFollowerCount] = useState('')
    const [details, setDetails] = useState('')

    const handleSubmit = async () => {
        if (!token) { Alert.alert('Login required'); return }
        if (!fullName || !email) { Alert.alert('Missing fields', 'Name and email required'); return }
        const res = await dispatch(applyInfluencer({
            full_name: fullName, email, phone, city,
            instagram_url: instagram, facebook_url: facebook, youtube_url: youtube,
            other_platform: other, follower_count: followerCount, additional_details: details,
        }))
        console.log('resresres',res)
        if (applyInfluencer.fulfilled.match(res)) {
            Alert.alert('Submitted', 'Application received')
            navigation?.goBack?.()
        } else {
            Alert.alert('Failed', res.payload?.message || 'Try again')
        }
    }

    return (
        <CustomScreenView>
            <HeaderBox title={'influencerRegisteration'} />

            <ShadowWrapper>
                <CustomText semiBold style={styles.title}>influencerRegisterationRequest</CustomText>
                <BorderLine centerLine mv style={styles.dividerTop} />

                <CustomText semiBold>personalInfo</CustomText>

                <CustomInput
                    label={'fullName'}
                    placeholder={'writeNameHere'}
                    user
                    borderInput
                    security
                    steric
                    value={fullName}
                    onChangeText={setFullName}
                />

                <CustomInput
                    label={'emailAddress'}
                    placeholder={'email@gmail.com'}
                    mail
                    borderInput
                    security
                    mt
                    steric
                    value={email}
                    onChangeText={setEmail}
                />

                <CustomInput
                    label={'phoneNumber'}
                    placeholder={'+963 11223344'}
                    phone
                    borderInput
                    security
                    mt
                    steric
                    value={phone}
                    onChangeText={setPhone}
                />

                <CustomInput
                    label={'city'}
                    placeholder={'enterCity'}
                    location
                    borderInput
                    security
                    mt
                    steric
                    value={city}
                    onChangeText={setCity}
                />

                <BorderLine centerLine mv style={styles.divider} />
                <CustomText semiBold>socialMedia</CustomText>

                <CustomInput
                    label={'instagramLink'}
                    placeholder={'instagramLink'}
                    borderInput
                    mt
                    rightIcon={<Ionicons name={'logo-instagram'} size={20} color={colors.gray4} />}
                    value={instagram}
                    onChangeText={setInstagram}
                />

                <CustomInput
                    label={'facebookLink'}
                    placeholder={'facebookLink'}
                    borderInput
                    security
                    mt
                    rightIcon={<SimpleLineIcons name={'social-facebook'} size={20} color={colors.gray4} />}
                    value={facebook}
                    onChangeText={setFacebook}
                />

                <CustomInput
                    label={'youtubeLink'}
                    placeholder={'youtubeLink'}
                    borderInput
                    security
                    mt
                    rightIcon={<Feather name={'youtube'} size={20} color={colors.gray4} />}
                    value={youtube}
                    onChangeText={setYoutube}
                />

                <CustomInput
                    label={'otherPlatform'}
                    placeholder={'otherPlatform'}
                    borderInput
                    security
                    mt
                    rightIcon={<Feather name={'user'} size={20} color={colors.gray4} />}
                    value={other}
                    onChangeText={setOther}
                />

                <BorderLine centerLine mv style={styles.divider} />
                <CustomText semiBold>audienceActivity</CustomText>

                <CustomInput
                    label={'followerCount'}
                    placeholder={'100k'}
                    borderInput
                    security
                    mt
                    rightIcon={<Feather name={'star'} size={20} color={colors.gray4} />}
                    value={followerCount}
                    onChangeText={setFollowerCount}
                />

                <CustomInput
                    label={'additionalDetails'}
                    placeholder={'descriptionContent'}
                    borderInput
                    security
                    mt
                    multiline
                    textAlignVertical={'top'}
                    inputContainer={{ height: 100 }}
                    inputStyle={{ height: 90 }}
                    value={details}
                    onChangeText={setDetails}
                />

                <CustomButton
                    title={submitting ? 'loading' : 'submitRequest'}
                    style={styles.submitBtn}
                    textStyle={styles.submitText}
                    disabled={submitting}
                    onPress={handleSubmit}
                />

            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default InfluencerRegisterationScreen

const styles = StyleSheet.create({
    title: { fontSize: 17, textAlign: 'center' },
    dividerTop: { marginTop: 20, marginBottom: 25 },
    divider: { marginTop: 20 },
    submitBtn: { height: 50, backgroundColor: colors.purple2, marginTop: 30 },
    submitText: { color: colors.purple, fontSize: 16 },
})
