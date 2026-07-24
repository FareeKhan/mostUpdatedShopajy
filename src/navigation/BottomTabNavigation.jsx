// import React from 'react';
// import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import Feather from 'react-native-vector-icons/Feather';

// import HomeScreen from '../screens/HomeScreen';
// import SearchScreen from '../screens/SearchScreen';
// import AccountScreen from '../screens/AccountScreen';
// import CustomText from '../components/CustomText';
// import ReelsScreen from '../screens/ReelsScreen';

// const Tab = createBottomTabNavigator();

// const CustomTabBar = ({ state, descriptors, navigation }) => {
//     return (
//         <View style={styles.tabContainer}>
//             {state.routes.map((route, index) => {
//                 const isFocused = state.index === index;

//                 const onPress = () => {
//                     const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
//                     if (!isFocused && !event.defaultPrevented) {
//                         navigation.navigate(route.name);
//                     }
//                 };

//                 const getIcon = (name, focused) => {
//                     let iconName;
//                     if (name === 'HomeScreen') iconName = 'home-outline';
//                     else if (name === 'CategoryScreen') iconName = 'grid-outline';
//                     else if (name === 'SearchScreen') iconName = 'search-outline';
//                     else if (name === 'AccountScreen') iconName = 'person-outline';

//                     if(name == 'ReelsScreen'){
//                     return <Feather name={'youtube'} size={24} color={focused ? '#fff' : '#2D3748'} />;

//                     }
//                     return <Ionicons name={iconName} size={24} color={focused ? '#fff' : '#2D3748'} />;
//                 };

//                 const getName = (name, focused) => {
//                     let tabName;
//                     if (name === 'HomeScreen') tabName = 'home';
//                     else if (name === 'CategoryScreen') tabName = 'category';
//                     else if (name === 'SearchScreen') tabName = 'search';
//                     else if (name === 'AccountScreen') tabName = 'account';
//                     else if (name === 'ReelsScreen') tabName = 'Reels';
//                     return tabName;
//                 };

//                 if (isFocused) {
//                     return (
//                         <TouchableOpacity key={index} onPress={onPress} style={styles.activeTabWrapper}>

//                             <View style={styles.activeIconCircle}>
//                                 {getIcon(route.name, true)}
//                             </View>
//                             <CustomText style={styles.activeLabel}>{getName(route.name)}</CustomText>
//                         </TouchableOpacity>
//                     );
//                 }

//                 return (
//                     <TouchableOpacity key={index} onPress={onPress} style={styles.inactiveTab}>
//                         {getIcon(route.name, false)}
//                     </TouchableOpacity>
//                 );
//             })}
//         </View>
//     );
// };

// const BottomTabNavigation = () => {
//     return (
//         <Tab.Navigator
//             initialRouteName="HomeScreen"
//             tabBar={(props) => <CustomTabBar {...props} />}
//             screenOptions={{ headerShown: false }}
//         >
//             <Tab.Screen name="HomeScreen" component={HomeScreen} />
//             <Tab.Screen name="CategoryScreen" component={HomeScreen} />
//             <Tab.Screen name="SearchScreen" component={SearchScreen} />
//             <Tab.Screen name="ReelsScreen" component={ReelsScreen} />
//             <Tab.Screen name="AccountScreen" component={AccountScreen} />
//         </Tab.Navigator>
//     );
// };

// const styles = StyleSheet.create({
//     tabContainer: {
//         flexDirection: 'row',
//         backgroundColor: 'white',
//         borderTopWidth: 0,
//         elevation: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: -2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 10,
//         alignItems: 'center',
//         justifyContent: 'space-around',
//     },
//     inactiveTab: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     activeTabWrapper: {
//         flex: 1.5,
//         alignItems: 'center',
//         justifyContent: 'center',
//         height: 90,
//         bottom: 30,
//     },
//     svgGapFiller: {
//         position: 'absolute',
//         top: -10,
//     },
//     activeIconCircle: {
//         width: 55,
//         height: 55,
//         borderRadius: 30,
//         backgroundColor: '#10E3A5',
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 5,
//         marginBottom: 5,
//     },
//     activeLabel: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         color: '#0D1B2A',
//         marginTop: 2,
//     },
// });

// export default BottomTabNavigation;
import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, I18nManager } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import AccountScreen from '../screens/AccountScreen';
import CustomText from '../components/CustomText';
import ReelsScreen from '../screens/ReelsScreen';
import { fonts } from '../constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const totalTabs = state.routes.length;
    const activeIndex = state.index;

    // 1. Handle RTL Mirroring for the SVG cutout position
    const tabWidth = SCREEN_WIDTH / totalTabs;
    const visualIndex = I18nManager.isRTL ? (totalTabs - 1 - activeIndex) : activeIndex; // 👈 FIX HERE
    const centerTabX = (visualIndex * tabWidth) + (tabWidth / 2);

    // 2. Widened cutout boundary to let the curve breathe organically
    const cutoutWidth = 130;
    const leftCurveStart = centerTabX - (cutoutWidth / 2);
    const rightCurveEnd = centerTabX + (cutoutWidth / 2);

    // 3. Perfected "Bell Curve" SVG pathing.
    // By pushing control handles outward and deeper, we eliminate the triangular drop.
    const dPath = `
        M 0 35
        L ${leftCurveStart} 35
        C ${leftCurveStart + 25} 35, ${centerTabX - 30} 78, ${centerTabX} 78
        C ${centerTabX + 30} 78, ${rightCurveEnd - 25} 35, ${rightCurveEnd} 35
        L ${SCREEN_WIDTH} 35
        L ${SCREEN_WIDTH} 120
        L 0 120
        Z
    `;

    return (
        <View style={styles.container}>
            {/* Dynamic White Smooth Mask */}
            <View style={StyleSheet.absoluteFill}>
                <Svg width={SCREEN_WIDTH} height={120} viewBox={`0 0 ${SCREEN_WIDTH} 120`}>
                    <Path d={dPath} fill="white" />
                </Svg>
            </View>

            {/* Interactive Items layer */}
            <View style={styles.tabItemsContainer}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const getIcon = (name, focused) => {
                        let iconName;
                        if (name === 'HomeScreen') iconName = 'home-outline';
                        else if (name === 'CategoryScreen') iconName = 'grid-outline';
                        else if (name === 'SearchScreen') iconName = 'search-outline';
                        else if (name === 'AccountScreen') iconName = 'person-outline';

                        if (name === 'DummyComponent') {
                            return <Feather name={'youtube'} size={24} color={focused ? '#000' : '#5A6C84'} />;
                        }
                        return <Ionicons name={iconName} size={24} color={focused ? '#000' : '#5A6C84'} />;
                    };

                    const getName = (name) => {
                        let tabName;
                        if (name === 'HomeScreen') tabName = 'Home';
                        else if (name === 'CategoryScreen') tabName = 'Categories';
                        else if (name === 'SearchScreen') tabName = 'Search';
                        else if (name === 'AccountScreen') tabName = 'Account';
                        else if (name === 'ReelsScreen') tabName = 'Reels';
                        return tabName;
                    };

                    if (isFocused) {
                        return (
                            <TouchableOpacity key={index} onPress={onPress} style={styles.activeTabWrapper}>
                                <View style={styles.activeIconCircle}>
                                    {getIcon(route.name, true)}
                                </View>
                                <CustomText style={styles.activeLabel}>{getName(route.name)}</CustomText>
                            </TouchableOpacity>
                        );
                    }

                    return (
                        <TouchableOpacity key={index} onPress={onPress} style={styles.inactiveTab}>
                            {getIcon(route.name, false)}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};


const DummyComponent = () => null;

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="CategoryScreen" component={HomeScreen} />
            <Tab.Screen name="SearchScreen" component={SearchScreen} />
            {/* <Tab.Screen name="ReelsScreen" component={ReelsScreen} /> */}
            <Tab.Screen
                // name="ReelsScreen" 
                name="DummyComponent"
                component={DummyComponent}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('ReelsScreen');
                    },
                })}
            />
            <Tab.Screen name="AccountScreen" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: SCREEN_WIDTH,
        height: 120,
        backgroundColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    tabItemsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 85,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'transparent',
    },
    inactiveTab: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 22,
    },
    activeTabWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 120,
        bottom: 26, // Lifts everything slightly so the text fits cleanly underneath
    },
    activeIconCircle: {
        width: 64, // Matches the premium large circle footprint from your target mockup
        height: 64,
        borderRadius: 32,
        backgroundColor: '#10E3A5',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#10E3A5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 6,
        bottom: 5, // Lifts everything slightly so the text fits cleanly underneath

    },
    activeLabel: {
        fontSize: 13,
        color: '#0D1B2A',
        fontFamily:fonts.regular
    },
});

export default BottomTabNavigation;