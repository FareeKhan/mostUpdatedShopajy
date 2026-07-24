import React, { useState, useCallback } from 'react';
import {
    Dimensions,
    I18nManager,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { carouselData, height } from '../constants/data';
import FastImage from 'react-native-fast-image';
import { colors } from '../constants/color';
import { useSharedValue } from 'react-native-reanimated';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import { useDispatch } from 'react-redux';
import { fetchCategoryById, setSelectedCategoryId } from '../redux/reducers/Home';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen');

const ITEM_WIDTH = width * 0.9;
const ITEM_SPACING = 10;

const CustomCarousel = React.memo(({ autoPlay = true, type, data, }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const isRtl = I18nManager.isRTL;
    const scrollOffsetValue = useSharedValue(isRtl ? -0 : 0);

    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = (data && data.length > 0) ? data : carouselData;

    const handleBanner = (item) => {
        if (item?.target_type === 'category' && item?.category_id) {
            dispatch(fetchCategoryById(item.category_id));
            dispatch(setSelectedCategoryId(item.category_id));
            navigation.navigate('CategoryScreen')
        }

        if (item?.target_type === 'product' && item?.product_id) {
            navigation.navigate('ProductDetailScreen', {
                productId: item.product_id,
            });
        }

    }


    const renderItem = useCallback(({ item }) => {
        return (
            <View style={styles.slideContainer}  >
                <FastImage
                    style={styles.image}
                    source={{ uri: item?.image }}
                    resizeMode={FastImage.resizeMode.cover}
                />

                <View style={{ position: "absolute", paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}>
                    {
                        item?.badge &&
                        <View style={{ backgroundColor: item?.badge?.toLowerCase() == 'new' ? colors.secondary : 'red', alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50 }}>
                            <CustomText xs medium style={{ color: item?.badge?.toLowerCase() == 'new' ? colors.black : colors.secondary}}>{item?.badge}</CustomText>
                        </View>
                    }
                    <CustomText  xl style={{ color: colors.white }} numberOfLines={2}>{item?.title}</CustomText>
                    {
                        item?.subTitle &&
                        <CustomText light l style={{ color: colors.white, width: "80%" }}>{item?.subTitle}</CustomText>

                    }

                </View>

                {
                    item?.target_type &&
                    <CustomButton
                        title={'Shop Now'}
                        style={{ backgroundColor: colors.secondary, height: 35, position: "absolute", bottom: 20,borderRadius:8, paddingHorizontal: 20, left: 20 }}
                        textStyle={{ color: colors.white, fontSize: 16 }}
                        onPress={() => handleBanner(item)}
                    />

                }

            </View>
        );
    }, []);


    return (
        <View style={styles.carouselContainer}>
            <Carousel
                width={ITEM_WIDTH}
                height={170}
                data={slides}
                loop
                snapEnabled
                pagingEnabled
                autoPlay={autoPlay}
                autoPlayInterval={2000}
                style={{ width }}
                defaultScrollOffsetValue={scrollOffsetValue}
                containerStyle={{
                    // marginBottom: 10,
                }}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.95,
                    parallaxScrollingOffset: ITEM_SPACING,
                }}
                renderItem={renderItem}
                onSnapToItem={setCurrentIndex}
            />


            <View style={styles.dotsBox}>
                {slides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index &&
                            {
                                backgroundColor: colors.white,
                                width: 25
                            },
                        ]}
                    />
                ))}
            </View>
        </View>
    );
});

export default CustomCarousel;

const styles = StyleSheet.create({
    carouselContainer: {
        marginHorizontal: -20,
        marginLeft: -10
    },
    slideContainer: {
        width: ITEM_WIDTH,
        paddingRight: ITEM_SPACING, // 👈 creates spacing feel between cards
    },
    image: {
        width: ITEM_WIDTH,
        height: 170,
        borderRadius: 12,
    },

    dotsBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 7,
        top: -25,
        left:-30
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: 10,
        backgroundColor: colors.gray33,
    },
});