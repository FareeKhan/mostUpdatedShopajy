import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    Image,
    I18nManager,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux'

import CustomText from '../components/CustomText'
import CustomButton from '../components/CustomButton'
import { colors } from '../constants/color';
import { fetchOnboarding } from '../redux/reducers/Content';
import { handleOnboard } from '../redux/reducers/Language';
import { height } from '../constants/data';
import TitleWithChangeColor from '../components/TitleWithChangeColor';
import { fonts } from '../constants/fonts';

const { width } = Dimensions.get('window');

const FALLBACK_DATA = [
    { id: '1', title_en: 'Welcome', title_ar: 'أهلاً', subtitle_en: 'Discover amazing features', subtitle_ar: 'اكتشف ميزات رائعة' },
    { id: '2', title_en: 'Track', title_ar: 'تتبع', subtitle_en: 'Track everything in real time', subtitle_ar: 'تتبع كل شيء في الوقت الحقيقي' },
    { id: '3', title_en: 'Get Started', title_ar: 'لنبدأ', subtitle_en: 'Let’s get you started quickly', subtitle_ar: 'لنبدأ بسرعة' },
];

const LOCAL_IMAGES = [
    require('../assets/images/Logo.png'),
    require('../assets/images/firstBoard.png'),
    require('../assets/images/secondBoard.png'),
];

export default function OnBoardingScreen({ navigation }) {
    const dispatch = useDispatch()
    const slides = useSelector(s => s?.content?.onboarding) || []
    const lang = useSelector(s => s?.language?.language) || 'en'
    const [activeIndex, setActiveIndex] = useState(0);


    const settings = useSelector(state => state.settings?.values);


    useEffect(() => { dispatch(fetchOnboarding()) }, [dispatch])

    const data = slides

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            const index = viewableItems[0].index;
            if (index !== null && index !== undefined) {
                setActiveIndex(index);
            }
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
    }).current;


    const handleStartNow = () => {
        dispatch(handleOnboard())
        navigation.navigate('DrawerNavigation')
    }


    const heroSubText = I18nManager.isRTL ? settings?.hero_subtitle_ar : settings?.hero_subtitle_en

    const heroText = I18nManager.isRTL
        ? settings?.hero_title_ar
        : settings?.hero_title_en;

    const words = heroText?.split(' ') || [];
    const lastWord = words.pop();
    const remainingText = words.join(' ');

    const renderItem = ({ item, index }) => {
        const title = lang === 'ar' ? (item.title_ar || item.title_en) : (item.title_en || item.title_ar)
        const subtitle = lang === 'ar' ? (item.subtitle_ar || item.subtitle_en) : (item.subtitle_en || item.subtitle_ar)
        const isLast = index === data.length - 1
        const imageSource = item.image ? { uri: item.image } : LOCAL_IMAGES[index % LOCAL_IMAGES.length]

        return (

            <View style={styles.itemContainer}>
                <View style={{ gap: 13, alignItems: 'center', width: '90%', top: index === 1 ? -50 : 0 }}>
                    <Image source={imageSource} style={{ marginBottom: 18, width: "80%", height: 200, resizeMode: 'contain' }} />

                    {
                        index == 0 ?
                            <TitleWithChangeColor
                                title={remainingText}
                                colorText={lastWord}
                                semiBold
                                style={{ width: '70%', marginTop: -65 }}
                                subTitleStyle={{ width: '80%', alignSelf: 'center' }}
                                textStyle={{ fontSize: 22, lineHeight: 30, fontFamily: fonts.bold }}
                                colorTextStyle={{ fontSize: 22 }}

                            />

                            :
                            <>
                                <CustomText translate={false} semiBold style={{ fontSize: 30 }}>{title}</CustomText>
                                <CustomText translate={false} style={{ textAlign: 'center', fontSize: 16, lineHeight: 25 ,width:"80%"}} light>{subtitle}</CustomText>
                            </>

                    }



                </View>
                {isLast && (
                    <CustomButton
                        title={'startNow'}
                        style={{ width: '70%', height: 50, borderRadius: 16, bottom: -40 }}
                        arrow
                        onPress={() => handleStartNow()}
                    />
                )}
            </View>


        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => String(item.id || index)}
                renderItem={renderItem}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            {
                // activeIndex !== data.length - 1 &&
                <View style={styles.dotsContainer}>
                    {data.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                activeIndex === index && styles.activeDot,
                                activeIndex === index && activeIndex !== 0 && { backgroundColor: colors.secondary },
                            ]}
                        />
                    ))}
                </View>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: '#fff'

    },

    itemContainer: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,

    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },

    desc: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 20,
    },

    dotsContainer: {
        position: 'absolute',
        bottom: 180,
        flexDirection: 'row',
        alignSelf: 'center',
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 50,
        backgroundColor: colors.gray,
        marginHorizontal: 3,
    },

    activeDot: {
        backgroundColor: '#000',
        width: 32,
    },
});