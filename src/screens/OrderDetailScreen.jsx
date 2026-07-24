import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Dimensions, ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomScreenView from '../components/CustomScreenView';
import TrackingOrderMap from '../components/TrackingOrderMap';
import OrderDetail from '../components/OrderDetail';
import HeaderBox from '../components/HeaderBox';
import { colors } from '../constants/color';
import { fetchOrder } from '../redux/reducers/Orders';

const { height } = Dimensions.get('window');

const OrderDetailScreen = ({ route }) => {
    const dispatch = useDispatch();
    const orderId = route?.params?.orderId;
    const { discount, isRating } = route?.params || ''
    const current = useSelector(s => s?.orders?.current);



    const shopLatitude = current?.shop_location?.latitude;
    const shopLongitude = current?.shop_location?.longitude;
    const estimatedDelivery = current?.estimated_delivery;
    const isOutForDelivery = current?.status === 'out_for_delivery';



    console.log('heyareyoudasd',current)


    useEffect(() => {
        if (orderId) dispatch(fetchOrder(orderId));
    }, [orderId, dispatch]);

    const items = useMemo(
        () => (current?.items || []).map(it => ({
            id: it.id,
            title: it.title_en,
            image: it.image,
            price: it.unit_price,
            discountPrice: it.unit_price,
            color: it.color,
            size: it.size,
            usdEquivalent: it.usd_equivalent,
            quantity: it.quantity,
            reviewData: it.review,
            isReview: it.is_reviewed,
        })),
        [current],
    );




    const initialRegion = {
        latitude: shopLatitude || 33.5138,
        longitude: shopLongitude || 36.2765,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const showDetail = current?.status === 'pending' || current?.status === 'accepted' || current?.status === 'delivered'


    console.log('currentcurrent=====???',current)


    return (
        <CustomScreenView>
            <HeaderBox title={isOutForDelivery ? "trackOrder" : 'orderDetail'} />

            {!current ? (
                <View style={styles.loading}>
                    <ActivityIndicator color={colors.black} />
                </View>
            ) : isOutForDelivery ? (
                // <TrackingOrderMap
                //     initialRegion={initialRegion}
                //     estimatedDelivery={estimatedDelivery}
                // />

                <TrackingOrderMap
                    shopLocation={{
                        latitude: current?.shop_location?.latitude || 33.5138,
                        longitude: current?.shop_location?.longitude || 36.2765,
                    }}
                    customerLocation={{
                        latitude: current?.address_snapshot?.latitude,
                        longitude: current?.address_snapshot?.longitude,
                    }}
                    estimatedDelivery={current?.estimated_delivery}
                />
            ) : (
                <OrderDetail
                    data={items}
                    orderId={orderId}
                    orderDate={current?.created_at}
                    discount={discount}
                    showQuantity={true}
                    isRating={isRating}
                    shipping={current?.shipping}
                />
            )}
        </CustomScreenView>
    );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
    loading: { paddingVertical: 40, alignItems: 'center' },
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

