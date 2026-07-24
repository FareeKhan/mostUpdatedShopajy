import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import MapView, { Marker, } from 'react-native-maps';
import ShadowWrapper from '../components/ShadowWrapper';
import CustomText from '../components/CustomText';
import { colors } from '../constants/color';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { height } from '../constants/data';
import { useTranslation } from 'react-i18next';

const TrackingOrderMap = ({
    shopLocation,
    customerLocation,
    estimatedDelivery,
}) => {
    const { t } = useTranslation()

    const region = {
        latitude: shopLocation?.latitude || 33.5138,
        longitude: shopLocation?.longitude || 36.2765,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    


    console.log('aaaa',shopLocation)
    return (
        <View style={styles.container}>
            <ShadowWrapper style={styles.courierCard}>
                {/* <View>
                    <CustomText gray xs>courier</CustomText>
                    <CustomText bold xl>Aramex Express</CustomText>
                </View> */}

                <View style={styles.iconCircle}>
                    <MaterialIcons
                        name="local-shipping"
                        size={24}
                        color={colors.white}
                    />
                </View>
            </ShadowWrapper>

            <MapView
                style={styles.map}
                initialRegion={region}
            >

                {/* Shop Marker */}
                {shopLocation?.latitude && shopLocation?.longitude && (
                    <Marker coordinate={region}>
                        <View style={styles.courierMarker}>
                            <MaterialIcons
                                name="store"
                                size={20}
                                color={colors.white}
                            />
                        </View>
                    </Marker>
                )}

                {/* Customer Marker */}
                {customerLocation?.latitude && customerLocation?.longitude && (
                    <Marker coordinate={customerLocation}>
                        <View style={styles.destMarker}>
                            <Ionicons
                                name="location"
                                size={20}
                                color={colors.white}
                            />
                        </View>
                    </Marker>
                )}

            </MapView>

            <View style={styles.overlayContainer}>
                <ShadowWrapper style={styles.orderSummaryCard}>
                    <View
                        style={[
                            styles.row,
                            {
                                justifyContent: 'space-between',
                                marginBottom: 15,
                            },
                        ]}
                    >
                        <View style={styles.statusBadge}>
                            <CustomText
                                xs
                                bold
                                style={{ color: colors.white }}
                            >
                                outForDel
                            </CustomText>
                        </View>
                    </View>

                    <View style={styles.deliveryEstimateBox}>
                        <View>
                            <CustomText gray s>
                                estimatedDel
                            </CustomText>

                            <CustomText bold xxl>
                                {estimatedDelivery || `2 ${t('day')}`}
                            </CustomText>
                        </View>

                        <View style={styles.timeCircle}>
                            <Ionicons
                                name="time-outline"
                                size={28}
                                color={colors.white}
                            />
                        </View>
                    </View>
                </ShadowWrapper>
            </View>
        </View>
    );
};

export default TrackingOrderMap

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: "100%",
        height: height / 4,
        borderRadius: 10,
        overflow: "hidden",
        marginTop: 10
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    courierCard: {
        backgroundColor: colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: colors.black, // Matching Aramex icon style
        justifyContent: 'center',
        alignItems: 'center',
        margin: "auto"
    },
    floatInfo: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        position: 'absolute',
        top: height * 0.4, // Positioned over map
    },
    orderSummaryCard: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
    },
    statusBadge: {
        backgroundColor: colors.green,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 12,
    },
    deliveryEstimateBox: {
        backgroundColor: '#E6F9F3', // Light green bg
        borderRadius: 18,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    },
    timeCircle: {
        width: 45,
        height: 45,
        borderRadius: 27,
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courierMarker: {
        backgroundColor: colors.green,
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
    },
    destMarker: {
        backgroundColor: colors.black,
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.white,
    }
});




// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react';
// import MapView, { Marker, } from 'react-native-maps';
// import ShadowWrapper from '../components/ShadowWrapper';
// import CustomText from '../components/CustomText';
// import { colors } from '../constants/color';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { height } from '../constants/data';

// const TrackingOrderMap = ({ initialRegion }) => {
//     return (
//         <View style={styles.container}>
//             <ShadowWrapper style={styles.courierCard}>
//                 <View>
//                     <CustomText gray xs>courier</CustomText>
//                     <CustomText bold xl>Aramex Express</CustomText>
//                 </View>
//                 <View style={styles.iconCircle}>
//                     <MaterialIcons name="local-shipping" size={24} color={colors.white} />
//                 </View>
//             </ShadowWrapper>

//             <MapView
//                 style={styles.map}
//                 initialRegion={initialRegion}
//             >
//                 <Marker coordinate={{ latitude: 33.5200, longitude: 36.2800 }}>
//                     <View style={styles.courierMarker}>
//                         <MaterialIcons name="delivery-dining" size={20} color={colors.white} />
//                     </View>
//                 </Marker>

//                 <Marker coordinate={{ latitude: 33.5100, longitude: 36.2700 }}>
//                     <View style={styles.destMarker}>
//                         <Ionicons name="location" size={20} color={colors.white} />
//                     </View>
//                 </Marker>
//             </MapView>

//             <View style={styles.overlayContainer}>
//                 <ShadowWrapper style={styles.orderSummaryCard}>
//                     <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 15 }]}>
//                         <View style={styles.statusBadge}>
//                             <CustomText xs bold style={{ color: colors.white }}>outForDel</CustomText>
//                         </View>
//                         <View style={{ alignItems: 'flex-end' }}>
//                             <CustomText bold>Order #12344</CustomText>
//                             <CustomText gray xxs>January 10, 2026</CustomText>
//                         </View>
//                     </View>

//                     <View style={styles.deliveryEstimateBox}>
//                         <View>
//                             <CustomText gray s>estimatedDel</CustomText>
//                             <CustomText bold xxl>1 - 2 Days</CustomText>
//                         </View>
//                         <View style={styles.timeCircle}>
//                             <Ionicons name="time-outline" size={28} color={colors.white} />
//                         </View>
//                     </View>
//                 </ShadowWrapper>

//             </View>
//         </View>
//     )
// }

// export default TrackingOrderMap

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     map: {
//         width: "100%",
//         height: height / 4,
//         borderRadius: 10,
//         overflow: "hidden",
//         marginTop: 10
//     },
//     overlayContainer: {
//         flex: 1,
//         justifyContent: 'space-between',
//     },
//     courierCard: {
//         backgroundColor: colors.white,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 10
//     },
//     iconCircle: {
//         width: 40,
//         height: 40,
//         borderRadius: 25,
//         backgroundColor: colors.black, // Matching Aramex icon style
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     floatInfo: {
//         backgroundColor: 'rgba(255, 255, 255, 0.95)',
//         paddingVertical: 10,
//         paddingHorizontal: 20,
//         borderRadius: 15,
//         alignSelf: 'center',
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '90%',
//         position: 'absolute',
//         top: height * 0.4, // Positioned over map
//     },
//     orderSummaryCard: {
//         backgroundColor: colors.white,
//         borderRadius: 24,
//         padding: 20,
//         marginBottom: 20,
//     },
//     statusBadge: {
//         backgroundColor: colors.green,
//         paddingHorizontal: 15,
//         paddingVertical: 8,
//         borderRadius: 12,
//     },
//     deliveryEstimateBox: {
//         backgroundColor: '#E6F9F3', // Light green bg
//         borderRadius: 18,
//         padding: 15,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 10
//     },
//     timeCircle: {
//         width: 45,
//         height: 45,
//         borderRadius: 27,
//         backgroundColor: colors.black,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     courierMarker: {
//         backgroundColor: colors.green,
//         padding: 8,
//         borderRadius: 20,
//         borderWidth: 2,
//         borderColor: colors.white,
//     },
//     destMarker: {
//         backgroundColor: colors.black,
//         padding: 8,
//         borderRadius: 20,
//         borderWidth: 2,
//         borderColor: colors.white,
//     }
// });