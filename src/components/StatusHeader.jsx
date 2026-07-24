import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Image,
    Dimensions,
    I18nManager,
} from "react-native";
import { colors } from "../constants/color";
import CustomText from "./CustomText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import { viewStory } from "../redux/reducers/Stories";
import RemoteImage from "./RemoteImage";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const StatusHeader = ({ }) => {
    const dispatch = useDispatch();
    const stories = useSelector((state) => state.stories.stories);

    const navigation = useNavigation();

    const [activeStory, setActiveStory] = useState(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(5000);

    const handlePress = (story) => {
        setActiveStory(story);
        dispatch(viewStory(story.id));
    };

    const onVideoLoad = (data) => {
        const videoDuration = data.duration * 1000;
        setDuration(videoDuration);
    };

    useEffect(() => {
        let timer;
        if (activeStory) {
            setProgress(0);
            const intervalTime = 100;

            timer = setInterval(() => {
                setProgress((prev) => {
                    const nextProgress = prev + intervalTime / duration;
                    console.log;
                    if (nextProgress >= 1) {
                        setActiveStory(null);
                        return 1;
                    }
                    return nextProgress;
                });
            }, intervalTime);
        }
        return () => clearInterval(timer);
    }, [activeStory, duration]);

    const handleProduct = () => {
        setActiveStory(null)
        navigation.navigate("ProductDetailScreen", {
            productId: activeStory?.product?.id,
        })
    }
    return (
        <View style={styles.headerContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {stories?.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.avatarContainer}
                        onPress={() => handlePress(item)}
                    >

                        {
                            item?.isViewed ?
                                <View style={styles.outerRing}>
                                    <LinearGradient
                                        colors={['#CFD6DF90', '#A4B0C0']}
                                        start={{ x: 0.0, y: 1 }}
                                        end={{ x: 1.0, y: 1 }}
                                        style={styles.gradientButton}
                                    >
                                        <Feather name={I18nManager.isRTL ? "arrow-right" : "arrow-left"} size={32} color="#4A5D73" />
                                    </LinearGradient>
                                </View>
                                :
                                <View
                                    style={[
                                        styles.circle,
                                        { borderColor: colors.secondary },
                                    ]}
                                >
                                    <View
                                        style={[
                                            styles.innerCircle, { backgroundColor: colors.white }
                                        ]}
                                    >
                                        <Feather name={'shopping-bag'} size={30} color={colors.secondary} />
                                    </View>
                                </View>

                        }
                        <CustomText s style={[styles.label, !item?.isViewed && { color: colors.black }]}>
                            {item?.isViewed ? 'Viewed' : 'New Story'}
                        </CustomText>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Modal visible={!!activeStory} transparent animationType="fade">
                <View style={styles.modalContainer}>

                    <View style={styles.closeButton}>
                        <TouchableOpacity
                            onPress={() => setActiveStory(null)}
                            style={{ left: 20 }}
                        >
                            <Ionicons
                                name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
                                size={30}
                                color={colors.secondary}
                            />
                        </TouchableOpacity>
                        <View style={{ width: "70%" }}>
                            <CustomText
                                numberOfLines={2}
                                style={{
                                    color: colors.secondary,
                                    right: 20,
                                    textAlign: "right",
                                }}
                                bold
                                xl
                            >
                                {I18nManager.isRTL
                                    ? activeStory?.title_ar
                                    : activeStory?.title_en}
                            </CustomText>
                        </View>
                    </View>

                    <View style={styles.progressBarContainer}>
                        <View
                            style={[styles.progressBar, { width: `${progress * 100}%` }]}
                        />
                    </View>

                    {activeStory?.product && (
                        <View
                            style={{
                                backgroundColor: colors.white,
                                padding: 18,
                                borderRadius: 16,
                                position: "absolute",
                                zIndex: 999,
                                width: "90%",
                                alignSelf: "center",
                                bottom: 50,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() =>
                                    handleProduct()
                                }
                                activeOpacity={0.8}
                                style={{ flexDirection: "row", alignItems: "center", gap: 9 }}
                            >
                                <RemoteImage
                                    uri={activeStory?.product?.image}
                                    style={{
                                        width: 55,
                                        height: 55,
                                        backgroundColor: colors.gray30,
                                    }}
                                />

                                <View>
                                    <CustomText xl medium>
                                        {I18nManager.isRTL
                                            ? activeStory?.product?.title_ar
                                            : activeStory?.product?.title_en}
                                    </CustomText>
                                    <CustomText style={{ color: colors.gray20 }} xs>
                                        tapView
                                    </CustomText>
                                </View>

                                <Feather
                                    name={I18nManager.isRTL ? "chevron-left" : "chevron-right"}
                                    size={26}
                                    color={colors.gray19}
                                    style={{ marginLeft: "auto" }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}

                    {activeStory?.type === "image" ? (
                        <Image
                            source={{ uri: activeStory.mediaUrl }}
                            style={styles.fullMedia}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.videoPlaceholder}>
                            {activeStory != null && (
                                <Video
                                    source={{ uri: activeStory.mediaUrl }}
                                    //  source={require('../assets/naat.mp4')}
                                    style={{ width: "100%", height: height / 1.5 }}
                                    resizeMode="contain"
                                    onLoad={onVideoLoad}
                                    paused={!activeStory}
                                />
                            )}
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
};
export default StatusHeader;

const styles = StyleSheet.create({
    headerContainer: { paddingVertical: 15 },
    avatarContainer: { alignItems: "center", marginHorizontal: 10 },
    circle: {
        width: 72,
        height: 72,
        borderRadius: 50,
        borderWidth: 3,
        padding: 3,
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        width: "100%",
        height: "100%",
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    label: { marginTop: 5, color: colors.gray1, },

    modalContainer: {
        flex: 1,
        backgroundColor: colors.gray23,
        justifyContent: "center",
    },
    progressBarContainer: {
        position: "absolute",
        top: 130,
        left: 20,
        right: 20,
        height: 3,
        backgroundColor: "#ffffff30",
        borderRadius: 2,
    },
    progressBar: {
        height: "100%",
        backgroundColor: colors.white,
        borderRadius: 2,
    },
    // closeButton: { position: 'absolute', top: 60, right: 20, zIndex: 10 },
    closeButton: {
        position: "absolute",
        top: 70,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
    },
    fullMedia: { width: width, height: height * 0.8 },
    videoPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },

    outerRing: {
        width: 68,
        height: 68,
        borderRadius: 70,
        backgroundColor: 'rgba(218, 226, 236, 0.6)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5, // Creates the separation between the outer ring and the inner gradient
    },
    // The core circular gradient button
    gradientButton: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

// const StatusHeader = () => {
//     const [stories, setStories] = useState(storiesData);
//     const [activeStory, setActiveStory] = useState(null);
//     const [progress, setProgress] = useState(0);

//     const handlePress = (story) => {
//         setActiveStory(story);

//         setStories(prev => prev.map(s => s.id === story.id ? { ...s, isViewed: true } : s));
//     };

//     useEffect(() => {
//         let timer;
//         if (activeStory) {
//             setProgress(0);
//             timer = setInterval(() => {
//                 setProgress((prev) => {
//                     if (prev >= 1) {
//                         setActiveStory(null); // Close when finished
//                         return 1;
//                     }
//                     return prev + (1 / 300); // 30 seconds = 300 intervals of 100ms
//                 });
//             }, 100);
//         }
//         return () => clearInterval(timer);
//     }, [activeStory]);

//     console.log('ssssss',progress)

//     return (
//         <View style={styles.headerContainer}>
// <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//     {stories.map((item) => (
//         <TouchableOpacity key={item.id} style={styles.avatarContainer} onPress={() => handlePress(item)}>
//             <View style={[
//                 styles.circle,
//                 { borderColor: item.isViewed ? colors.gray2 : colors.green }
//             ]}>
//                 <View style={[styles.innerCircle, { backgroundColor: item.isViewed ? colors.gray29 : colors.green2 }]}>
//                     <Ionicons
//                         name={item.isViewed ? I18nManager.isRTL ? "arrow-back" : "arrow-forward" : "bag-handle-outline"}
//                         size={24}
//                         color={item.isViewed ? colors.gray1 : colors.green}
//                     />
//                 </View>
//             </View>
//             <CustomText xs style={styles.label}>{item.userName}</CustomText>
//         </TouchableOpacity>
//     ))}
// </ScrollView>

//             <Modal visible={!!activeStory} transparent animationType="fade">
//                 <View style={styles.modalContainer}>
//                     {/* Progress Bar */}
//                     <View style={styles.progressBarContainer}>
//                         <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
//                     </View>

//                     <TouchableOpacity style={styles.closeButton} onPress={() => setActiveStory(null)}>
//                         <Ionicons name="close" size={30} color={colors.white} />
//                     </TouchableOpacity>

//                     {activeStory?.type === 'image' ? (
//                         <Image source={{ uri: activeStory.mediaUrl }} style={styles.fullMedia} resizeMode="contain" />
//                     ) : (
//                         <View style={styles.videoPlaceholder}>
//                             {
//                                 activeStory != null &&
//                                 <Video
//                                     // source={require('../assets/naat.mp4')}
//                                     source={{ uri: activeStory.mediaUrl }}
//                                     style={{ width: '100%', height: height / 1.5 }}
//                                     controls
//                                 />
//                             }
//                         </View>
//                     )}
//                 </View>
//             </Modal>
//         </View>
//     );
// };
// export default StatusHeader
