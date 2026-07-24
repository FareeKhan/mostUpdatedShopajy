import { Linking, PermissionsAndroid, Platform, StyleSheet, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { check, PERMISSIONS, RESULTS, request } from 'react-native-permissions' //  FIXED (Added curly braces around check)
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import SwitchWithText from '../components/SwitchWithText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'

const androidVersion = parseInt(Platform.Version, 10);

// Cross-Platform Permission Mapping
const PLATFORM_PERMS = {
    location: Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    }),
    camera: Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PermissionsAndroid.PERMISSIONS.CAMERA,
    }),
    storage: Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY, // iOS uses Photo Library instead of file storage
        android: androidVersion >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    }),
};

const SystemPermission = () => {
    const [isLocation, setIsLocation] = useState(false)
    const [isCamera, setIsCamera] = useState(false)
    const [isStorage, setIsStorage] = useState(false)

    // Helper to abstract checking across platforms
    const checkPermissionStatus = async (permission) => {
        if (!permission) return false;
        if (Platform.OS === 'android') {
            return await PermissionsAndroid.check(permission);
        } else {
            const res = await check(permission);
            return res === RESULTS.GRANTED || res === RESULTS.LIMITED;
        }
    };

    const refreshStatus = useCallback(async () => {
        try {
            const locStatus = await checkPermissionStatus(PLATFORM_PERMS.location);
            const camStatus = await checkPermissionStatus(PLATFORM_PERMS.camera);
            const storeStatus = await checkPermissionStatus(PLATFORM_PERMS.storage);

            setIsLocation(locStatus)
            setIsCamera(camStatus)
            setIsStorage(storeStatus)
        } catch (e) {
            console.log("Error updating permissions:", e)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            refreshStatus()
        }, [refreshStatus])
    )

    const handleToggle = (key) => async () => {
        const permission = PLATFORM_PERMS[key];
        const alreadyGranted = await checkPermissionStatus(permission);

        // iOS rule: If permission was denied once or already granted, you MUST send them to settings.
        if (Platform.OS === 'ios') {
            const currentRes = await check(permission);
            if (currentRes === RESULTS.BLOCKED || currentRes === RESULTS.GRANTED || currentRes === RESULTS.LIMITED) {
                Linking.openSettings();
                return;
            }
            // Requesting for the very first time on iOS
            const newRes = await request(permission);
            if (newRes === RESULTS.GRANTED || newRes === RESULTS.LIMITED) {
                refreshStatus();
            }
            return;
        }

        // Android Logic
        if (alreadyGranted) {
            Linking.openSettings()
            return
        }
        const result = await PermissionsAndroid.request(permission)
        if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            Linking.openSettings()
        }
        setTimeout(() => { refreshStatus() }, 200)
    }

    return (
        <CustomScreenView>
            <HeaderBox title={'systemPermission'} />
            <ShadowWrapper>
                <SwitchWithText
                    setIsEnabled={handleToggle('location')}
                    isEnabled={isLocation}
                    switchTitle={'location'}
                    subTitle={'accurateAddress'}
                    icon={<Ionicons name={'location-outline'} size={18} color={colors.secondary} />}
                />
                <SwitchWithText
                    setIsEnabled={handleToggle('camera')}
                    isEnabled={isCamera}
                    switchTitle={'camera'}
                    subTitle={'photoProduct'}
                    icon={<Feather name={'camera'} size={15} color={colors.secondary} />}
                />
                <SwitchWithText
                    setIsEnabled={handleToggle('storage')}
                    isEnabled={isStorage}
                    switchTitle={'storage'}
                    subTitle={'savePhoto'}
                    mb
                    icon={<Feather name={'inbox'} size={15} color={colors.secondary} />}
                />
            </ShadowWrapper>
            <View style={styles.modifyBox}>
                <CustomText style={styles.modifyText} bold xl>modifyTime</CustomText>
            </View>
        </CustomScreenView>
    )
}

export default SystemPermission;

const styles = StyleSheet.create({
    modifyBox: {
        backgroundColor: colors.secondary4,
        paddingVertical: 10,
        paddingHorizontal: 50,
        marginTop: 25,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.secondary2,
    },
    modifyText: {
        textAlign: 'center',
        lineHeight: 23,
    }
})