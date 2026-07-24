import { Alert, StyleSheet, TouchableOpacity, Image, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { colors } from '../constants/color'
import { fetchMe, updateProfile } from '../redux/reducers/Auth'
import Feather from 'react-native-vector-icons/Feather'
import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next'
import { handleNoTagsInput } from '../constants/helper'

const EditProfileScreen = () => {
    const dispatch = useDispatch()
    const { user, loading, token } = useSelector(s => s.auth)
    const { t } = useTranslation()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [avatarImage, setAvatarImage] = useState('')

    useEffect(() => {
        if (token && !user) dispatch(fetchMe())
    }, [token, user, dispatch])

    useEffect(() => {
        if (user) {
            setName(user.name || '')
            setEmail(user.email || '')
            setPhone(user.phone || '')
            setAvatarImage(user.avatar || '')
        }
    }, [user])


    const handlePhoto = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            setAvatarImage(image)
        });
    }




    const handleSave = async () => {


        const nameRegex = /^[^\s][\p{Letter}\p{Mark}\s]*$/u;

        if (!name || name.trim().length === 0) {
            Alert.alert(
                t('Name is required'),
            )
            return
        }

        if (!nameRegex.test(name)) {
            Alert.alert(
                t('Please enter a valid name using only letters and spaces'),
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


        const formData = new FormData();

        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        if (avatarImage?.path) {
            formData.append('avatar', {
                uri: avatarImage.path,
                type: avatarImage.mime || 'image/jpeg',
                name: avatarImage.filename || 'avatar.jpg',
            });
        }

        const res = await dispatch(updateProfile(formData));

        if (updateProfile.fulfilled.match(res)) {
            Alert.alert('Saved', 'Profile updated');
        } else {
            const errs = res.payload?.errors;
                

console.log('fareed',res)
            const first = errs ? Object.values(errs)[0]?.[0] : null;
            Alert.alert('Update failed', first || res.payload?.message || 'Try again');
        }
    };
    return (
        <CustomScreenView>
            <HeaderBox title={'editProfile'} />

            <ShadowWrapper>
                <CustomText l medium>personalInfo</CustomText>


                {
                    avatarImage ?
                        <TouchableOpacity onPress={handlePhoto} style={{ marginTop: 10, borderWidth: 1, width: 80, height: 80, borderRadius: 50, alignSelf: "center", borderColor: colors.gray }}>
                            <Image borderRadius={10} source={{ uri: avatarImage.path ? avatarImage.path : avatarImage || 'https://png.pngtree.com/png-vector/20210910/ourmid/pngtree-unit-icon-of-upload-suitable-for-web-application-etc-png-image_3918840.jpg' }} style={{ height: 80, width: 80, borderRadius: 50, alignSelf: "center" }} resizeMode='stretch' />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={handlePhoto} style={{ borderWidth: 1, borderColor: colors.gray24, marginTop: 10, alignItems: "center", justifyContent: "center", height: 80, width: 80, borderRadius: 60, alignSelf: "center" }}>
                            <View style={{ alignItems: "center", alignSelf: "center", gap: 10 }}>
                                <Feather name={'upload'} color={colors.gray3} size={30} />
                            </View>
                        </TouchableOpacity>
                }


















                <CustomInput
                    label={'fullName'}
                    placeholder={'fullName'}
                    style={{ marginTop: 20 }}
                    borderInput
                    user
                    value={name}
                    onChangeText={(text) => handleNoTagsInput(text, setName)}

                />


                <CustomInput
                    label={'emailAddress'}
                    placeholder={'emailAddress'}
                    style={{ marginTop: 20 }}
                    borderInput
                    mail
                    value={email}
                    onChangeText={(text) => handleNoTagsInput(text, setEmail)}

                />

                <CustomInput
                    label={'phoneNumber'}
                    placeholder={'phoneNumber'}
                    style={{ marginTop: 20 }}
                    borderInput
                    phone
                    value={phone}
                    onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setPhone(cleaned);
                    }}
                    keyboardType='numeric'
                />

                <CustomButton
                    style={{ marginTop: 40, height: 50 }}
                    title={loading ? 'loading' : 'saveDetails'}
                    disabled={loading}
                    rightIcon={<Ionicons name={'save-outline'} size={20} color={colors.white} />}
                    onPress={handleSave}
                />
            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({})
