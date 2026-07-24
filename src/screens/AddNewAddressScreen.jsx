import { Image, StyleSheet, TouchableOpacity, View, Dimensions, I18nManager } from 'react-native'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import ShadowWrapper from '../components/ShadowWrapper'
import CustomText from '../components/CustomText'
import CustomInput from '../components/CustomInput'
import TwoHalfButtons from '../components/TwoHalfButtons'
import CustomDropDown from '../components/CustomDropDown'
import CustomButton from '../components/CustomButton'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import { colors } from '../constants/color'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker';
import { height } from '../constants/data'
import MapView, { Marker } from 'react-native-maps'
import { getAddressFromCoordinates, GOOGLE_API, handleNoTagsInput, handleSafeInputChange, locationPermission } from '../constants/helper'
import { showMessage } from 'react-native-flash-message'
import i18next from 'i18next'
import { createAddressRemote, fetchGovernorates, updateAddressRemote } from '../redux/reducers/StoreAddress'
import Geolocation from '@react-native-community/geolocation';

const AddNewAddressScreen = ({ navigation, route }) => {
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const { loading } = useSelector(s => s.address || {})
    const editAddress = route?.params?.address || null
    const governorates = useSelector(state => state.address?.governorates);
    const addresses = useSelector(s => s?.address?.address) || []


    const [selectedAddressType, setSelectedAddressType] = useState(editAddress?.type || 'home')
    const [buildingImage, setBuildingImage] = useState(editAddress?.photo || '')
    const [address, setAddress] = useState(editAddress?.full_address || '')
    const [street, setStreet] = useState(editAddress?.street || '')
    const [building, setBuilding] = useState(editAddress?.building || '')
    const [floor, setFloor] = useState(editAddress?.floor || '')
    const [instruction, setInstruction] = useState(editAddress?.instruction || '')
    const [phone, setPhone] = useState(editAddress?.phone || '')
    const [isLoader, setIsLoader] = useState(false)

    const [selectedGovernorate, setSelectedGovernorate] = useState(editAddress?.governorate_id || null);
    const [selectedCity, setSelectedCity] = useState(editAddress?.city_id || null);
    const [selectedArea, setSelectedArea] = useState(editAddress?.area_id || null);


    const governorateData = governorates?.map(g => ({
        label: I18nManager.isRTL ? g.name_ar : g.name_en,
        value: g.id,
        raw: g
    }));

    const cityData =
        selectedGovernorate?.raw?.cities?.map(c => ({
            label: I18nManager.isRTL ? c.name_ar : c.name_en,
            value: c.id,
            raw: c
        })) || [];


    const areaData =
        selectedCity?.raw?.areas?.map(a => ({
            label: I18nManager.isRTL ? a.name_ar : a.name_en,
            value: a.id,
            raw: a
        })) || [];


    const [region, setRegion] = useState({
        latitude: Number(editAddress?.latitude) || 40.7128,
        longitude: Number(editAddress?.longitude) || -74.0060,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    })
    const [isLocationReady, setIsLocationReady] = useState(!!editAddress);

    
    const skipGeocode = useRef(!!editAddress)

    useEffect(() => {
        if (skipGeocode.current) {
            skipGeocode.current = false;
            return;
        }
        // Only fetch address if we actually have determined a position
        if (isLocationReady) {
            getAddressFromCoords();
        }
    }, [region?.latitude]);


    useEffect(() => {
        if (!editAddress || !governorates?.length) return;

        const gov = governorates.find(
            g => g.id === editAddress.governorate_id
        );

        if (gov) {
            const formattedGov = {
                label: gov.name_en,
                value: gov.id,
                raw: gov
            };

            setSelectedGovernorate(formattedGov);
        }
    }, [governorates, editAddress]);

    useEffect(() => {
        if (!selectedGovernorate || !editAddress) return;

        const city = selectedGovernorate.raw?.cities?.find(
            c => c.id === editAddress.city_id
        );

        if (city) {
            const formattedCity = {
                label: city.name_en,
                value: city.id,
                raw: city
            };

            setSelectedCity(formattedCity);
        }
    }, [selectedGovernorate]);

    useEffect(() => {
        if (!selectedCity || !editAddress) return;

        const area = selectedCity.raw?.areas?.find(
            a => a.id === editAddress.area_id
        );

        if (area) {
            const formattedArea = {
                label: area.name_en,
                value: area.id,
                raw: area
            };

            setSelectedArea(formattedArea);
        }
    }, [selectedCity]);



    useEffect(() => {
        dispatch(fetchGovernorates());
    }, [dispatch]);


    useEffect(() => {
        if (!editAddress) {
            fetchUserCurrentLocation()
        }
    }, [editAddress])

    

    const fetchUserCurrentLocation = async () => {
        try {
            const result = await locationPermission();
            
            // Handle all cases: uppercase strings or boolean trues depending on helper return
            const isGranted = result === true || 
                              (typeof result === 'string' && result.toLowerCase() === 'granted');
    
            if (isGranted) {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const { longitude, latitude } = position.coords;
                        
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        });
                        
                        setIsLocationReady(true); // Mount the map *after* state is populated
    
                        const addressData = await getAddressFromCoordinates(longitude, latitude);
                        if (addressData?.results?.length > 0) {
                            setAddress(addressData.results[0].formatted_address);
                        }
                    },
                    (error) => {
                        console.log('Error getting position:', error);
                        setIsLocationReady(true); // Fallback to let the map render regardless
                    },
                    { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
                );
            } else {
                // User denied or dismissed permission dialog
                setIsLocationReady(true); 
            }
        } catch (error) {
            console.log('Permission execution error', error);
            setIsLocationReady(true);
        }
    };


    const fallbackLowAccuracyLocation = () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                const { longitude, latitude } = position.coords;
                setRegion(prev => ({ ...prev, latitude, longitude }));
            },
            (error) => console.log('Fallback location error:', error),
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 }
        );
    };


    // const fetchUserCurrentLocation = async () => {
    //     try {
    //         const result = await locationPermission()
    //         if (result == 'granted') {
    //             Geolocation.getCurrentPosition(
    //                 async (position) => {
    //                     const { longitude, latitude } = position.coords
    //                     setRegion({
    //                         latitude,
    //                         longitude,
    //                         latitudeDelta: 0.005,
    //                         longitudeDelta: 0.005,
    //                     });
    //                     const addressData = await getAddressFromCoordinates(longitude, latitude)
    //                     if (addressData.results && addressData.results.length > 0) {
    //                         const formattedAddress = addressData.results[0].formatted_address;
    //                         setAddress(formattedAddress)
    //                     }
    //                 },
    //                 (error) => console.log('Error getting physical position details:', error),
    //                 { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    //             )
    //         }
    //     } catch (error) {
    //         console.log('error', error)
    //     }
    // }

    const handlePhoto = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            setBuildingImage(image?.path)
        });
    }

    const getAddressFromCoords = async () => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region?.latitude},${region?.longitude}&key=${GOOGLE_API}`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
            }
        } catch (error) {
            console.log("Geocoding error:", error);
        }
    };


  
    const handleAddress = async () => {
        if (!token) {
            showMessage({
                type: 'danger',
                message: i18next.t('authRequired'),
                description: i18next.t('loginRequiredMsg'),
            });
            return;
        }

        if (!selectedGovernorate) {
            showValidationError(i18next.t('validationGovernorateRequired'));
            return;
        }

        if (!selectedCity) {
            showValidationError(i18next.t('validationCityRequired'));
            return;
        }

        if (!selectedArea) {
            showValidationError(i18next.t('validationAreaRequired'));
            return;
        }

        if (!phone) {
            showValidationError(i18next.t('pleasePhone'));
            return;
        }

        if (phone?.length < 9) {
            showValidationError(i18next.t('phoneWrong'));
            return;
        }


        if (!street?.trim()) {
            showValidationError(i18next.t('validationStreetRequired'));
            return;
        }
        if (!building?.trim()) {
            showValidationError(i18next.t('validationBuildingRequired'));
            return;
        }
        if (!floor?.trim()) {
            showValidationError(i18next.t('floorSelection'));
            return;
        }
        if (!address?.trim()) {
            showValidationError(i18next.t('validationAddressRequired'));
            return;
        }


        if (!selectedAddressType) {
            showValidationError(i18next.t('validationTypeRequired'));
            return;
        }

        if (!region?.latitude || !region?.longitude) {
            showValidationError(i18next.t('validationLocationRequired'));
            return;
        }

        setIsLoader(true);
        try {

            const payload = {
                type: selectedAddressType,
                street,
                building,
                floor: floor || '',
                full_address: address,
                instruction: instruction || '',
                latitude: region.latitude,
                longitude: region.longitude,
                phone: phone,
                governorate_id: selectedGovernorate?.value,
                city_id: selectedCity?.value,
                area_id: selectedArea?.value,


            };
            if (!editAddress) {
                payload.is_default = addresses?.length === 0;
            }


            if (buildingImage && !buildingImage?.startsWith('https')) {
                payload.photo = {
                    uri: buildingImage.startsWith('file://') ? buildingImage : `file://${buildingImage}`,
                    name: 'photo.jpg',
                    type: 'image/jpeg'
                };


            }

            const action = editAddress
                ? updateAddressRemote({ id: editAddress.id, payload })
                : createAddressRemote(payload);

            const res = await dispatch(action);
            console.log('sddasdsasds', res)

            if (createAddressRemote.fulfilled.match(res) || updateAddressRemote.fulfilled.match(res)) {
                showMessage({
                    type: 'success',
                    message: i18next.t('successTitle'),
                    description: i18next.t('addressSave'),
                    duration: 3000,
                });
                navigation?.goBack?.();
            } else {
                const serverMessage = res.payload?.message || i18next.t('saveFailed');
                showMessage({
                    type: 'danger',
                    message: i18next.t('failedTitle'),
                    description: serverMessage,
                });
            }
        } catch (error) {
            console.log('error', error);
            showMessage({
                type: 'danger',
                message: i18next.t('failedTitle'),
                description: i18next.t('somethingWentWrong'),
            });
        } finally {
            setIsLoader(false);
        }
    };

    const showValidationError = (message) => {
        showMessage({
            type: 'danger',
            message: i18next.t('validationTitle'),
            description: message,
            duration: 4000,
        });
    };


    return (
        <CustomScreenView>
            <HeaderBox title={'addNewAddress'} />

            <ShadowWrapper>
                <CustomText l medium>addAddresss</CustomText>
                {isLocationReady ? (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        region={region}
                        onPress={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setRegion((prev) => ({
                                ...prev,
                                latitude,
                                longitude,
                            }));
                        }}
                    >
                        <Marker
                            coordinate={{
                                latitude: region.latitude,
                                longitude: region.longitude,
                            }}
                            draggable
                            onDragEnd={(e) => {
                                const { latitude, longitude } = e.nativeEvent.coordinate
                                setRegion((prev) => ({
                                    ...prev,
                                    latitude,
                                    longitude,
                                }))
                            }}
                        />
                    </MapView>
                </View>): (
        <View style={[styles.mapContainer, { height: height / 5, justifyContent: 'center', alignItems: 'center' }]}>
            <CustomText>Loading Map...</CustomText>
        </View>
    )}


                <CustomDropDown
                    label={'governate'}
                    steric
                    data={governorateData}
                    value={selectedGovernorate?.value}
                    setValue={(val, item) => {
                        setSelectedGovernorate(item);
                        setSelectedCity(null);
                        setSelectedArea(null);
                    }}
                    placeholder="Select Governorate"

                />


                {
                    cityData?.length > 0 &&
                    <CustomDropDown
                        label={'city'}
                        data={cityData}
                        steric
                        value={selectedCity?.value}
                        setValue={(val, item) => {
                            setSelectedCity(item);
                            setSelectedArea(null);
                        }}
                        placeholder="Select City"
                    />
                }


                {
                    areaData?.length > 0 &&
                    <CustomDropDown
                        label={'area'}
                        data={areaData}
                        steric
                        value={selectedArea?.value}
                        setValue={(val, item) => {
                            setSelectedArea(item);
                        }}
                        placeholder="Select Area"
                    />
                }

                <View style={{ marginTop: -20 }} />


                <CustomInput
                    label={'phone'}
                    placeholder={'enterMobile'}
                    borderInput
                    rightPhone
                    value={phone}
                    onChangeText={(text) => {
                        const cleaned = text.replace(/[^0-9]/g, '');
                        setPhone(cleaned);
                    }}
                    keyboardType='phone-pad'

                />


                <CustomInput
                    label={'streetName'}
                    placeholder={'addStreet'}
                    borderInput
                    location
                    value={street}
                    // onChangeText={setStreet}
                    onChangeText={(text) => handleNoTagsInput(text, setStreet)}

                />

                <CustomInput
                    label={'buildingName'}
                    placeholder={'AddbuildingName'}
                    borderInput
                    building
                    value={building}
                    // onChangeText={setBuilding}
                    onChangeText={(text) => handleNoTagsInput(text, setBuilding)}

                />

                <CustomInput
                    label={'floorName'}
                    placeholder={'AddfloorName'}
                    flat
                    borderInput
                    value={floor}
                    // onChangeText={setFloor}
                    onChangeText={(text) => handleNoTagsInput(text, setFloor)}
                />

                <CustomInput
                    label={'fullAddress'}
                    placeholder={'fullAddress'}
                    borderInput
                    home
                    value={address}
                    // onChangeText={setAddress}
                    onChangeText={(text) => handleNoTagsInput(text, setAddress)}

                />



                <TwoHalfButtons
                    leftButtonTitle={'home'}
                    rightButtonTitle={'office'}
                    selectedBtn={selectedAddressType}
                    leftOnPress={() => setSelectedAddressType('home')}
                    rightOnPress={() => setSelectedAddressType('office')}
                    black
                    leftBtnIcon={<Ionicons name={'home-outline'} size={20} color={colors.black} />}
                    rightBtnIcon={<Entypo name={'text-document'} size={20} color={colors.white} />}
                />

                <CustomInput
                    label={'additionalInstruction'}
                    placeholder={'addInstructionCourier'}
                    style={{ marginTop: 20 }}
                    borderInput
                    additional
                    value={instruction}
                    // onChangeText={setInstruction}
                    onChangeText={(text) => handleNoTagsInput(text, setInstruction)}

                />

                <View>
                    <CustomText medium style={{ color: colors.gray21, marginTop: 20 }}>attatchPhoto</CustomText>
                    {buildingImage ? (
                        <View>
                            <Image borderRadius={10} source={{ uri: buildingImage }} style={{ width: "100%", height: 200, marginTop: 10 }} resizeMode='stretch' />
                            <TouchableOpacity onPress={() => setBuildingImage('')} style={{ borderWidth: 1, borderRadius: 50, position: "absolute", right: 0, borderColor: colors.secondary, backgroundColor: colors.white }}>
                                <Entypo name={'cross'} color={colors.red} size={20} />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handlePhoto} style={{ borderWidth: 1, borderColor: colors.gray24, marginTop: 10, alignItems: "center", justifyContent: "center", height: 120, borderRadius: 10 }}>
                            <View style={{ alignItems: "center", alignSelf: "center", gap: 10 }}>
                                <Feather name={'upload'} color={colors.gray3} size={30} />
                                <CustomText medium style={{ textAlign: 'center' }} l>clickUpload</CustomText>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>

                <CustomButton
                    style={{ marginTop: 40, height: 50 }}
                    title={isLoader ? 'loading' : 'saveChanges'}
                    disabled={isLoader}
                    rightIcon={<Ionicons name={'save-outline'} size={20} color={colors.white} />}
                    onPress={handleAddress}
                />
            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default AddNewAddressScreen

const styles = StyleSheet.create({
    mapContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 15,
        marginBottom: 20
    },
    map: {
        height: height / 5,
        width: "100%",
    },
})

// import { Image, StyleSheet, TouchableOpacity, View, } from 'react-native'
// import CustomScreenView from '../components/CustomScreenView'
// import HeaderBox from '../components/HeaderBox'
// import ShadowWrapper from '../components/ShadowWrapper'
// import CustomText from '../components/CustomText'
// import CustomInput from '../components/CustomInput'
// import TwoHalfButtons from '../components/TwoHalfButtons'
// import CustomButton from '../components/CustomButton'
// import Feather from 'react-native-vector-icons/Feather'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import Entypo from 'react-native-vector-icons/Entypo'
// import { colors } from '../constants/color'
// import { useEffect, useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import ImagePicker from 'react-native-image-crop-picker';
// import { height } from '../constants/data'
// import MapView, { Marker } from 'react-native-maps'
// import { getAddressFromCoordinates, GOOGLE_API, locationPermission } from '../constants/helper'
// import { showMessage } from 'react-native-flash-message'
// import i18next from 'i18next'
// import { createAddressRemote, updateAddressRemote } from '../redux/reducers/StoreAddress'
// import Geolocation from '@react-native-community/geolocation';


// const AddNewAddressScreen = ({ navigation, route }) => {
//     const dispatch = useDispatch()
//     const token = useSelector(s => s?.auth?.token)
//     const { loading } = useSelector(s => s.address || {})
//     const editAddress = route?.params?.address || null

//     const [selectedAddressType, setSelectedAddressType] = useState(editAddress?.type || 'home')
//     const [buildingImage, setBuildingImage] = useState(editAddress?.photo || '')
//     const [address, setAddress] = useState(editAddress?.full_address || '')
//     const [street, setStreet] = useState(editAddress?.street || '')
//     const [building, setBuilding] = useState(editAddress?.building || '')
//     const [floor, setFloor] = useState(editAddress?.floor || '')
//     const [instruction, setInstruction] = useState(editAddress?.instruction || '')
//     const [isLoader, setIsLoader] = useState(false)
//     const [region, setRegion] = useState({
//         latitude: Number(editAddress?.latitude) || 37.78825,
//         longitude: Number(editAddress?.longitude) || -122.4324,
//         latitudeDelta: 0.0922,
//         longitudeDelta: 0.0421,
//     })



//     const skipGeocode = useRef(!!editAddress)
//     useEffect(() => {
//         if (skipGeocode.current) {
//             skipGeocode.current = false
//             return
//         }
//         getAddressFromCoords()
//     }, [region?.latitude])

//     useEffect(() => {
//         if (!editAddress) {
//             fetchUserCurrentLocation()
//         }
//     }, [editAddress])


//     const fetchUserCurrentLocation = async () => {
//         try {
//             const result = await locationPermission()
//             if (result == 'granted') {
//                 Geolocation.getCurrentPosition(async (position) => {
//                     const { longitude, latitude } = position.coords
//                     setRegion({
//                         latitude,
//                         longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     });
//                     const addressData = await getAddressFromCoordinates(longitude, latitude)
//                     if (addressData.results && addressData.results.length > 0) {
//                         const formattedAddress = addressData.results[0].formatted_address;
//                         setAddress(formattedAddress)
//                     }
//                 })
//             }
//         } catch (error) {
//             console.log('error', error)
//         }
//     }


//     const handlePhoto = () => {
//         ImagePicker.openPicker({
//             width: 300,
//             height: 400,
//             cropping: true,
//         }).then(image => {
//             setBuildingImage(image?.path)
//         });
//     }

//     const getAddressFromCoords = async () => {
//         try {
//             const response = await fetch(
//                 `https://maps.googleapis.com/maps/api/geocode/json?latlng=${region?.latitude},${region?.longitude}&key=${GOOGLE_API}`
//             );

//             const data = await response.json();

//             if (data.results && data.results.length > 0) {
//                 const formattedAddress = data.results[0].formatted_address;
//                 setAddress(formattedAddress);
//             }
//         } catch (error) {
//             console.log("Geocoding error:", error);
//         }
//     };


//     const handleAddress = async () => {
//         if (!token) {
//             showMessage({
//                 type: 'danger',
//                 message: i18next.t('authRequired'),
//                 description: i18next.t('loginRequiredMsg'),
//             });
//             return;
//         }

//         if (!selectedAddressType) {
//             showValidationError(i18next.t('validationTypeRequired'));
//             return;
//         }
//         if (!street?.trim()) {
//             showValidationError(i18next.t('validationStreetRequired'));
//             return;
//         }
//         if (!building?.trim()) {
//             showValidationError(i18next.t('validationBuildingRequired'));
//             return;
//         }

//         if (!floor?.trim()) {
//             showValidationError(i18next.t('floorSelection'));
//             return;
//         }

//         if (!address?.trim()) {
//             showValidationError(i18next.t('validationAddressRequired'));
//             return;
//         }
//         if (!region?.latitude || !region?.longitude) {
//             showValidationError(i18next.t('validationLocationRequired'));
//             return;
//         }

//         setIsLoader(true);
//         try {
//             const payload = {
//                 type: selectedAddressType,
//                 street,
//                 building,
//                 floor: floor || '',
//                 full_address: address,
//                 instruction: instruction || '',
//                 latitude: region.latitude,
//                 longitude: region.longitude,
//             };

//             if (buildingImage) {
//                 payload.photo = {
//                     uri: buildingImage.startsWith('file://') ? buildingImage : `file://${buildingImage}`,
//                     name: 'photo.jpg',
//                     type: 'image/jpeg'
//                 };
//             }

//             const action = editAddress
//                 ? updateAddressRemote({ id: editAddress.id, payload })
//                 : createAddressRemote(payload);

//             const res = await dispatch(action);

//             if (createAddressRemote.fulfilled.match(res) || updateAddressRemote.fulfilled.match(res)) {
//                 showMessage({
//                     type: 'success',
//                     message: i18next.t('successTitle'),
//                     description: i18next.t('addressSave'),
//                     duration: 3000,
//                 });
//                 navigation?.goBack?.();
//             } else {
//                 const serverMessage = res.payload?.message || i18next.t('saveFailed');
//                 showMessage({
//                     type: 'danger',
//                     message: i18next.t('failedTitle'),
//                     description: serverMessage,
//                 });
//             }
//         } catch (error) {
//             console.log('error', error);
//             showMessage({
//                 type: 'danger',
//                 message: i18next.t('failedTitle'),
//                 description: i18next.t('somethingWentWrong'),
//             });
//         } finally {
//             setIsLoader(false);
//         }
//     };

//     const showValidationError = (message) => {
//         showMessage({
//             type: 'danger',
//             message: i18next.t('validationTitle'),
//             description: message,
//             duration: 4000,
//         });
//     };

//     return (
//         <CustomScreenView>
//             <HeaderBox
//                 title={'addNewAddress'}
//             />

//             <ShadowWrapper >
//                 <CustomText l medium>addAddresss</CustomText>
//                 <View style={styles.mapContainer}>
//                     <MapView
//                         style={styles.map}
//                         initialRegion={region}
//                         onPress={(e) => {
//                             const { latitude, longitude } = e.nativeEvent.coordinate;
//                             setRegion((prev) => ({
//                                 ...prev,
//                                 latitude,
//                                 longitude,
//                             }));
//                         }}
//                         // onRegionChangeComplete={(newRegion) => {
//                         //     setRegion(newRegion);
//                         // }}
//                     >
//                         <Marker
//                             coordinate={{
//                                 latitude: region.latitude,
//                                 longitude: region.longitude,
//                             }}
//                             draggable
//                             onDragEnd={(e) => {
//                                 const { latitude, longitude } = e.nativeEvent.coordinate
//                                 setRegion((prev) => ({
//                                     ...prev,
//                                     latitude,
//                                     longitude,
//                                 }))
//                             }}
//                         />
//                     </MapView>
//                 </View>


//                 <CustomInput
//                     label={'streetName'}
//                     placeholder={'addStreet'}
//                     borderInput
//                     location
//                     value={street}
//                     onChangeText={setStreet}
//                 />


//                 <CustomInput
//                     label={'buildingName'}
//                     placeholder={'AddbuildingName'}
//                     borderInput
//                     building
//                     value={building}
//                     onChangeText={setBuilding}
//                 />

//                 <CustomInput
//                     label={'floorName'}
//                     placeholder={'AddfloorName'}
//                     borderInput
//                     value={floor}
//                     onChangeText={setFloor}
//                 />

//                 <CustomInput
//                     label={'fullAddress'}
//                     placeholder={'fullAddress'}
//                     borderInput
//                     value={address}
//                     onChangeText={setAddress}
//                 />


//                 <TwoHalfButtons
//                     leftButtonTitle={'home'}
//                     rightButtonTitle={'office'}
//                     selectedBtn={selectedAddressType}
//                     leftOnPress={() => setSelectedAddressType('home')}
//                     rightOnPress={() => setSelectedAddressType('office')}
//                     black
//                     leftBtnIcon={<Ionicons name={'home-outline'} size={20} color={colors.black} />}
//                     rightBtnIcon={<Entypo name={'text-document'} size={20} color={colors.white} />}
//                 />

//                 <CustomInput
//                     label={'additionalInstruction'}
//                     placeholder={'addInstructionCourier'}
//                     style={{ marginTop: 20 }}
//                     borderInput
//                     value={instruction}
//                     onChangeText={setInstruction}
//                 />


//                 <View>
//                     <CustomText medium style={{ color: colors.gray21, marginTop: 20 }}  >attatchPhoto</CustomText>
//                     {
//                         buildingImage ?
//                             <View>
//                                 <Image borderRadius={10} source={{ uri: buildingImage }} style={{ width: "100%", height: 200, marginTop: 10 }} resizeMode='stretch' />

//                                 <TouchableOpacity onPress={() => setBuildingImage('')} style={{ borderWidth: 1, borderRadius: 50, position: "absolute", right: 0, borderColor: colors.secondary, backgroundColor: colors.white }}>
//                                     <Entypo name={'cross'} color={colors.red} size={20} />
//                                 </TouchableOpacity>
//                             </View>
//                             :
//                             <TouchableOpacity onPress={handlePhoto} style={{ borderWidth: 1, borderColor: colors.gray24, marginTop: 10, alignItems: "center", justifyContent: "center", height: 120, borderRadius: 10 }}>
//                                 <View style={{ alignItems: "center", alignSelf: "center", gap: 10 }}>
//                                     <Feather name={'upload'} color={colors.gray3} size={30} />
//                                     <CustomText medium style={{ textAlign: 'center' }} l>clickUpload</CustomText>
//                                 </View>
//                             </TouchableOpacity>
//                     }

//                 </View>


//                 <CustomButton
//                     style={{ marginTop: 40, height: 50 }}
//                     title={isLoader ? 'loading' : 'saveChanges'}
//                     disabled={isLoader}
//                     rightIcon={<Ionicons name={'save-outline'} size={20} color={colors.white} />}
//                     onPress={handleAddress}
//                 />
//             </ShadowWrapper>


//         </CustomScreenView>
//     )
// }

// export default AddNewAddressScreen

// const styles = StyleSheet.create({
//     mapContainer: {
//         borderRadius: 10,
//         overflow: 'hidden', // 👈 IMPORTANT
//         marginTop: 15


//     },
//     map: {
//         height: height / 5,
//         width: "100%",

//     },
// })