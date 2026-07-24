import { Dimensions, FlatList, StyleSheet, Text, View, I18nManager } from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import RemoteImage from './RemoteImage'
import CustomText from './CustomText'
import { colors } from '../constants/color'
const { width } = Dimensions.get('screen')

const isRTL = I18nManager.isRTL;

const SliderProductImage = ({ imagesArray, tag, isNew, onIndexChanged, activeIndex = 0 }) => {

    const flatListRef = useRef(null)
    // Fixed: Initialize currentIndex to 0 instead of 1 so it matches array indices (0-based)
    const [currentIndex, setCurrentIndex] = useState(0)
    
    const isProgrammaticScroll = useRef(false)

    useEffect(() => {
        if (activeIndex >= 0 && activeIndex < imagesArray?.length && flatListRef.current) {
            isProgrammaticScroll.current = true;
            
            flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
            setCurrentIndex(activeIndex); // Fixed: set to activeIndex directly

            const timer = setTimeout(() => {
                isProgrammaticScroll.current = false;
            }, 350);

            return () => clearTimeout(timer);
        }
    }, [activeIndex]);

    const onScroll = (e) => {
        if (isProgrammaticScroll.current) return;

        const contentOffsetWidth = e.nativeEvent.contentOffset.x;
        
        let index;
        if (isRTL) {
            const totalContentWidth = imagesArray?.length * width;
            const rtlOffset = totalContentWidth - contentOffsetWidth - width;
            index = Math.round(rtlOffset / width);
        } else {
            index = Math.round(contentOffsetWidth / width);
        }

        index = Math.max(0, Math.min(index, imagesArray?.length - 1));
        
        if (index !== currentIndex && index >= 0 && index < imagesArray?.length) {
            setCurrentIndex(index); // Fixed: update with 0-based index value
            if (onIndexChanged) {
                onIndexChanged(index);
            }
        }
    }

    const renderItem = ({ item, index }) => {
        return (
            <View style={{}}>
                <RemoteImage
                    uri={item?.image || item}
                    style={{ width: width - 30, height: 350, borderRadius: 10 ,backgroundColor:colors.white}}
                    resizeMode='stretch'
                />

                {
                    tag &&
                    <View style={[
                        styles.tag,
                        { backgroundColor: isNew ? colors.secondary : colors.red }
                    ]}>
                        <CustomText xs medium style={{
                            color: isNew ? colors.black : colors.white
                        }}>
                            {tag}
                        </CustomText>
                    </View>
                }
            </View>
        )
    }

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={imagesArray}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ marginTop: 20 }}
                onScrollToIndexFailed={(info) => {
                    const wait = new Promise(resolve => setTimeout(resolve, 50));
                    wait.then(() => {
                        flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
                    });
                }}
            />

            <View style={styles.paginationContainer}>
                {imagesArray?.map((_, index) => {
                    const isActive = currentIndex === index;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                isActive ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    );
                })}
            </View>
        </View>
    )
}

export default SliderProductImage

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
        alignSelf: "flex-start",
        position: "absolute",
        top: 20,
        right: 15
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 25,
        alignSelf: 'center',
        zIndex: 100,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: colors.outForDeliver,
    },
    inactiveDot: {
        width: 8,
        backgroundColor: '#7FD5B4',
    },
})

// import { Dimensions, FlatList, StyleSheet, Text, View, I18nManager } from 'react-native'
// import React, { useRef, useState, useEffect } from 'react'
// import RemoteImage from './RemoteImage'
// import CustomText from './CustomText'
// import { colors } from '../constants/color'
// const { width } = Dimensions.get('screen')

// // Detect if the app is currently running in Right-to-Left (Arabic) layout
// const isRTL = I18nManager.isRTL;

// const SliderProductImage = ({ imagesArray, tag, isNew, onIndexChanged, activeIndex = 0 }) => {

//     const flatListRef = useRef(null)
//     const [currentIndex, setCurrentIndex] = useState(1)
    
//     // This flag prevents the scroll callback loop from triggering on programmatic clicks
//     const isProgrammaticScroll = useRef(false)

//     // Listen for thumbnail/variant taps from the parent screen
//     useEffect(() => {
//         if (activeIndex >= 0 && activeIndex < imagesArray?.length && flatListRef.current) {
//             // Block onScroll reporting during automated scroll animation
//             isProgrammaticScroll.current = true;
            
//             flatListRef.current.scrollToIndex({ index: activeIndex, animated: true });
//             setCurrentIndex(activeIndex + 1);

//             // Release the scroll block after the animation finishes
//             const timer = setTimeout(() => {
//                 isProgrammaticScroll.current = false;
//             }, 350);

//             return () => clearTimeout(timer);
//         }
//     }, [activeIndex]);

//     const onScroll = (e) => {
//         // Exit early if the scroll was programmatically triggered by a thumbnail click
//         if (isProgrammaticScroll.current) return;

//         const contentOffsetWidth = e.nativeEvent.contentOffset.x;
        
//         let index;
//         if (isRTL) {
//             // In RTL, scroll starting point is reversed.
//             // Calculate the absolute width offset of the scroll container to find the correct index.
//             const totalContentWidth = imagesArray?.length * width;
//             const rtlOffset = totalContentWidth - contentOffsetWidth - width;
//             index = Math.round(rtlOffset / width);
//         } else {
//             // Standard English/LTR calculation
//             index = Math.round(contentOffsetWidth / width);
//         }

//         // Clamp index bounds safely between 0 and the max index
//         index = Math.max(0, Math.min(index, imagesArray?.length - 1));
//         const newIndex = index + 1;
        
//         if (newIndex !== currentIndex && newIndex > 0 && newIndex <= imagesArray?.length) {
//             setCurrentIndex(newIndex);
//             if (onIndexChanged) {
//                 onIndexChanged(index);
//             }
//         }
//     }

//     const renderItem = ({ item, index }) => {
//         return (
//             <View style={{}}>
//                 <RemoteImage
//                     uri={item?.image || item}
//                     style={{ width: width - 30, height: 350, borderRadius: 10 ,backgroundColor:colors.white}}
//                     resizeMode='stretch'
//                 />

//                 {
//                     tag &&
//                     <View style={[
//                         styles.tag,
//                         { backgroundColor: isNew ? colors.secondary : colors.red }
//                     ]}>
//                         <CustomText xs medium style={{
//                             color: isNew ? colors.black : colors.white
//                         }}>
//                             {tag}
//                         </CustomText>
//                     </View>
//                 }
//             </View>
//         )
//     }

//     return (
//         <View>
//             <FlatList
//                 ref={flatListRef}
//                 data={imagesArray}
//                 keyExtractor={(item, index) => index?.toString()}
//                 renderItem={renderItem}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 onScroll={onScroll}
//                 scrollEventThrottle={16}
//                 contentContainerStyle={{ marginTop: 20 }}
//                 onScrollToIndexFailed={(info) => {
//                     const wait = new Promise(resolve => setTimeout(resolve, 50));
//                     wait.then(() => {
//                         flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
//                     });
//                 }}
//             />

//             <View style={{ backgroundColor: colors.black, top: -40, zIndex: 100, paddingHorizontal: 10, borderRadius: 50, paddingVertical: 5, alignSelf: "flex-end", marginRight: 15 }}>
//                 <CustomText translate={false} style={{ color: colors.white, fontSize: 13 }}>{currentIndex + '/' + imagesArray?.length}</CustomText>
//             </View>
//         </View>
//     )
// }

// export default SliderProductImage

// const styles = StyleSheet.create({
//     tag: {
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderRadius: 50,
//         alignSelf: "flex-start",
//         position: "absolute",
//         top: 20,
//         right: 15
//     },
// })

