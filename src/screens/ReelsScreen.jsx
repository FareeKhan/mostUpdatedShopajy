import { FlatList, StyleSheet, TouchableOpacity, View, ActivityIndicator, Text, Share, Dimensions, I18nManager, Platform } from 'react-native'
import React, { useEffect, useState, memo } from 'react'
import Video from 'react-native-video';
import CustomText from '../components/CustomText';
import { colors } from '../constants/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Fontisto from 'react-native-vector-icons/Fontisto'
import CustomButton from '../components/CustomButton';
import ReelCommentsModal from '../components/ReelCommentsModal';
import { productToCart } from '../redux/reducers/CartProduct';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { fetchReels, toggleReelLike } from '../redux/reducers/Reels';
import { fonts } from '../constants/fonts';
import { showMessage } from 'react-native-flash-message';
import { useTranslation } from 'react-i18next';
import PriceComp from '../components/PriceComp';
import { width } from '../constants/data';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

// 🌟 OPTIMIZED MEMOIZED REEL ITEM
const ReelItem = memo(({ item, index, isFocused, handleShare, handleComment, screenKey, isScreenFocused, lang, handleLike, handleCart, navigation, reelHeight }) => {
    const [showViewMore, setShowViewMore] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [muted, setMuted] = useState(false);

    const title = I18nManager.isRTL ? item?.title_ar : item?.title_en
    const desc = I18nManager.isRTL ? item?.description_ar : item?.description_en
    const product = item?.product;

    return (
        <View style={{ height: reelHeight, width: '100%', position: 'relative', backgroundColor: colors.black }}>
            {/* 
              FIX: Unmounting the video when not focused forces the native player 
              to instantly release its frame buffer, ensuring the previous video disappears completely.
            */}
            {isScreenFocused && isFocused && item?.video_url ? (
                <Video
                    key={`${screenKey}-${index}-active`}
                    source={{ uri: item.video_url }}
                    style={[StyleSheet.absoluteFillObject]}
                    resizeMode="cover"
                    controls={true}
                    paused={!isFocused}
                    repeat={true}
                    muted={muted}
                    shutterColor="transparent"
                />
            ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.black }]} />
            )}

            {/* Content Overlays */}
            <View style={styles.titleBox}>
                <TouchableOpacity style={{ backgroundColor: colors.secondary5, width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 50 }} onPress={() => navigation.goBack()} >
                    <MaterialIcons name={I18nManager.isRTL ? 'arrow-forward' : 'arrow-back'} size={27} color={colors.black} />
                </TouchableOpacity>
                <View style={{ right: 10, width: width / 1.5, marginLeft: "auto" }}>
                    <CustomText translate={false} bold style={{ fontSize: 20, color: colors.black, textAlign: "left", marginBottom: 5 }}>{title}</CustomText>

                    <CustomText
                        numberOfLines={2}
                        s
                        style={{ color: colors.white, fontFamily: fonts.regular }}
                    >
                        {desc}
                    </CustomText>

                </View>

            </View>

            <View style={styles.actions}>
                <TouchableOpacity activeOpacity={0.5} onPress={() => handleLike(item)}>
                    <FontAwesome name={item?.is_liked ? 'heart' : 'heart-o'} size={25} color={item?.is_liked ? colors.red : colors.white} />
                    {/* <CustomText translate={false} xs style={{ color: colors.white, textAlign: 'center' }}>{item?.like_count || 0}</CustomText> */}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5} onPress={() => handleShare(item)}>
                    <Feather name={'send'} size={25} color={colors.white} style={{ transform: [{ rotate: I18nManager.isRTL ? '-90deg' : '0deg', }] }} />
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.5} onPress={() => handleComment(item)}>
                    <Fontisto name={'comment'} size={25} color={colors.white} />
                </TouchableOpacity> */}

                <TouchableOpacity activeOpacity={0.7} onPress={() => setMuted(!muted)} style={styles.actionItem}>
                    <Ionicons name={muted ? 'volume-mute-outline' : 'volume-high-outline'} size={28} color={colors.white} />
                </TouchableOpacity>
                {/* <TouchableOpacity activeOpacity={0.5} onPress={() => handleComment(item)}>
                    <Fontisto name={'comment'} size={25} color={colors.white} />
                </TouchableOpacity> */}
            </View>

            {product && (
                <View style={styles.bottomBar}>
                    <View style={styles.bottomRow}>
                        {product?.discount_price ?
                            <PriceComp
                                discountPrice={product?.discount_price}
                                price={product?.price}
                                priceText={{ fontSize: 18 }}
                                discountStyle={{ fontSize: 22 }}
                                approxColor={{ color: colors.gray23, fontFamily: fonts.light }}
                                equalent={product?.discount_price_syp ? product?.discount_price_syp : product?.price_syp}
                            />
                            :
                            <PriceComp
                                discountPrice={product?.price}
                                discountStyle={{ fontSize: 22 }}
                                approxColor={{ color: colors.gray23, fontFamily: fonts.light }}
                                equalent={product?.discount_price_syp ? product?.discount_price_syp : product?.price_syp}
                            />
                        }

                        <CustomButton
                            onPress={() => navigation.navigate('ProductDetailScreen', {
                                productId: product?.id
                            })}
                            title={'viewProduct'}
                            style={{ width: '45%', height: 50, backgroundColor: colors.gray23 }}
                            textStyle={{ fontSize: 18, fontFamily: fonts.bold }}
                        />
                        <TouchableOpacity style={styles.cartBtn} onPress={() => handleCart(product)}>
                            <Ionicons name={'cart-outline'} size={30} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
});

// 🌟 MAIN SCREEN LAYER
const ReelsScreen = () => {
    const isScreenFocused = useIsFocused();
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigation = useNavigation()

    const [calculatedHeight, setCalculatedHeight] = useState(WINDOW_HEIGHT);

    const reel = useSelector(s => s?.reels?.list) || []
    const loading = useSelector(s => s?.reels?.loading)
    const token = useSelector(s => s?.auth?.token)
    const lang = useSelector(s => s?.language?.language) || 'en'

    const reels = reel?.filter((item) => item?.video_url?.toLowerCase().includes('.mp4'))

    const [screenKey, setScreenKey] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedReelId, setSelectedReelId] = useState(null);

    useEffect(() => {
        dispatch(fetchReels())
    }, [dispatch])



    useEffect(() => {
        if (!isScreenFocused) {
            setScreenKey(prev => prev + 1);
        }
    }, [isScreenFocused]);

    const handleCart = (reelItem) => {
        const { id, title_en, title_ar, weight, description_ar, description_en, discount_price_syp, price_syp, image, price, discount_price } = reelItem
        const selectedColor = reelItem?.colors?.length > 0 ? reelItem?.colors[0] : ''
        const selectedSize = reelItem?.sizes?.length > 0 ? reelItem?.sizes[0] : ''

        dispatch(productToCart({
            id, title_en, title_ar, weight, description_ar, description_en,
            image, price, discount_price, discount_price_syp, price_syp,
            color: selectedColor, size: selectedSize, quantity: 1,
        }))
        navigation.navigate('MyCartScreen')
    }

    const handleComment = (reelItem) => {
        if (!token) return showMessage({ type: 'danger', message: t('loginRequired') })
        setSelectedReelId(reelItem.id);
        setCommentModalVisible(true);
    };

    const handleLike = (reelItem) => {
        if (!token) return showMessage({ type: 'danger', message: t('loginRequired') })
        dispatch(toggleReelLike({ reelId: reelItem.id, isLiked: reelItem.is_liked }))
    }

    // Configured for strict visibility tracking
    const viewConfigRef = React.useRef({
        itemVisiblePercentThreshold: 70
    });

    const onViewRef = React.useRef(({ viewableItems }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    });

    const handleShare = async (reelItem) => {
        try {
            const title = lang === 'ar' ? (reelItem?.title_ar || reelItem?.title_en) : (reelItem?.title_en || reelItem?.title_ar);
            await Share.share({
                message: `${title}\nCheck out this link: ${reelItem?.video_url}`,
            });
        } catch (error) {
            console.log('Error sharing reel data:', error);
        }
    };

    const onLayoutContainer = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0) {
            setCalculatedHeight(height);
        }
    };

    if (loading && reels.length === 0) {
        return <View style={styles.loading}><ActivityIndicator color={colors.white} size="large" /></View>
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.black }} onLayout={onLayoutContainer}>
            {reels?.length > 0 ? (
                <FlatList
                    data={reels}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item, index }) => (
                        <ReelItem
                            item={item}
                            index={index}
                            isFocused={index === currentIndex}
                            screenKey={screenKey}
                            isScreenFocused={isScreenFocused}
                            lang={lang}
                            handleLike={handleLike}
                            handleCart={handleCart}
                            handleShare={handleShare}
                            handleComment={handleComment}
                            navigation={navigation}
                            reelHeight={calculatedHeight}
                        />
                    )}
                    initialNumToRender={1}
                    maxToRenderPerBatch={1}
                    windowSize={2}
                    pagingEnabled={true}
                    removeClippedSubviews={true} // Unmounts components off-screen completely
                    snapToInterval={calculatedHeight}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    disableIntervalMomentum={true} // Prevents sliding through multiple reels at once
                    showsVerticalScrollIndicator={false}
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={viewConfigRef.current}
                    getItemLayout={(data, index) => ({
                        length: calculatedHeight,
                        offset: calculatedHeight * index,
                        index,
                    })}
                />
            ) : (
                !loading && (
                    <View style={styles.loading}>
                        <Text style={{ color: colors.white }}>No videos found.</Text>
                    </View>
                )
            )}

            <ReelCommentsModal
                visible={commentModalVisible}
                reelId={selectedReelId}
                onClose={() => {
                    setCommentModalVisible(false);
                    setSelectedReelId(null);
                }}
            />
        </View>
    )
}

export default ReelsScreen

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.black },
    titleBox: {
        // backgroundColor: '#00000060',
        zIndex: 100,
        position: 'absolute',
        width: '100%',
        top: 60,
        left: 10,
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"

    },
    actions: { gap: 15, position: 'absolute', backgroundColor: colors.tranparent, paddingHorizontal: 10, paddingVertical: 15, borderRadius: 20, bottom: Platform.OS == 'android' ? 190 : 160, right: 10, zIndex: 101 },
    bottomBar: {
        position: 'absolute',
        height: 69,
        marginHorizontal: 10,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: colors.tranparent,
        bottom: Platform.OS == 'android' ? 90 : 50,
        left: 0,
        right: 0,
        zIndex: 101
    },
    bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    cartBtn: {
        width: 50,
        height: 50,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: colors.secondary,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
