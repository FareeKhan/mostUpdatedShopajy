
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { height, mainCategories, width } from '../constants/data'
import RemoteImage from './RemoteImage'
import CustomText from './CustomText'
import { colors } from '../constants/color'
import { useNavigation } from '@react-navigation/native'
import { fetchCategoryById, setSelectedCategoryId } from '../redux/reducers/Home'
import { useDispatch } from 'react-redux'

const CategoriesSection = ({ selectedCategory, data, }) => {

    const navigation = useNavigation()
    const dispatch = useDispatch()
    const categories = (data && data.length > 0) ? data : mainCategories;


    const onpressCat = (id, subData) => {
        dispatch(setSelectedCategoryId(id));
        // setSubCatData(subData)
        dispatch(fetchCategoryById(id));
        navigation.navigate('CategoryScreen')
    }

    const renderItem = ({ item, index }) => {

const isActive = selectedCategory == item?.id;

        return (

        //     <TouchableOpacity onPress={() => onpressCat(item?.id, item?.subcategories)} style={[styles.itemContainer,]}>
        //         <View style={[
        //             styles.imageWrapper,
        //             isActive && {
        //                 borderColor: '#E6FFFA', 
        //                 shadowColor: colors.secondary,
        //                 width:95, 
        //                 height:95,
        //                 padding:10, 
        //                 shadowOffset: { width: 0, height: 0 },
        //                 shadowOpacity: 0.7,
        //                 shadowRadius: 10,
        //                 elevation: 8, 
        // borderWidth: 5,

        //             }
        //         ]}>
        //             <RemoteImage
        //                 uri={item?.image}
        //                 style={styles.image}
        //             />
        //         </View>
        //         <CustomText translate={false} style={[{
        //             textAlign: 'center',
        //             flexWrap: 'wrap',
        //             color: colors.gray3
        //         },
        //         isActive && {
        //             color: colors.black,
        //             marginTop:5
        //         }
        //         ]}>
        //             {item?.title}
        //         </CustomText>
        //     </TouchableOpacity>



        <TouchableOpacity onPress={() => onpressCat(item?.id, item?.subcategories)} style={[styles.itemContainer, isActive && styles.activeItemContainer]}>
    <View style={[
        styles.imageWrapper,
        isActive && styles.activeImageWrapper
    ]}>
        <RemoteImage
            uri={item?.image}
            style={[styles.image, isActive && styles.activeImage]}
        />
    </View>
    <CustomText translate={false} style={[{
        textAlign: 'center',
        flexWrap: 'wrap',
        color: colors.gray3
    },
    isActive && {
        color: colors.black,
        marginTop: 5
    }
    ]}>
        {item?.title}
    </CustomText>
</TouchableOpacity>
        )
    }

    return (
        <View>
            <FlatList
                data={categories}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                horizontal
                contentContainerStyle={styles.listContent}
                showsHorizontalScrollIndicator={false}
                pagingEnabled

            />
        </View>
    )
}

export default CategoriesSection

const styles = StyleSheet.create({
    itemContainer: {
        alignItems: "center",
        justifyContent: 'center',
        gap: 7,
        width: 95, // Standardized width to accommodate both normal and active states smoothly
    },
    activeItemContainer: {
        // Keeps alignment stable when active item grows
    },
    imageWrapper: {
        width: 80,
        height: 80,
        backgroundColor: colors.black,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.white,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 5,
    },
    activeImageWrapper: {
        width: 95,  // Exact size requested
        height: 95,
        borderRadius: 47.5, // Half of width/height for a perfect circle
        borderColor: '#E6FFFA',
        borderWidth: 5,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 8, 
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 50,
    },
    activeImage: {
        width: 65, // Scales up the inner image/icon proportionally with the wrapper
        height: 65,
    },
    listContent: {
        gap: 15,
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 10,
        paddingHorizontal: 15
    },
});





// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React from 'react'
// import { height, mainCategories, width } from '../constants/data'
// import RemoteImage from './RemoteImage'
// import CustomText from './CustomText'
// import { colors } from '../constants/color'
// import { useNavigation } from '@react-navigation/native'
// import { fetchCategoryById, setSelectedCategoryId } from '../redux/reducers/Home'
// import { useDispatch } from 'react-redux'

// const CategoriesSection = ({ selectedCategory, data, }) => {

//     const navigation = useNavigation()
//     const dispatch = useDispatch()
//     const categories = (data && data.length > 0) ? data : mainCategories;


//     const onpressCat = (id, subData) => {
//         dispatch(setSelectedCategoryId(id));
//         // setSubCatData(subData)
//         dispatch(fetchCategoryById(id));
//         navigation.navigate('CategoryScreen')
//     }


//     const renderItem = ({ item, index }) => {
//         return (
//             <TouchableOpacity onPress={() => onpressCat(item?.id, item?.subcategories)} style={[styles.itemContainer,]}>
//                 <View style={[styles.imageWrapper,
//                 selectedCategory == item?.id &&
//                 {
//                     backgroundColor: colors.secondary,
//                 }

//                 ]}>
//                     <RemoteImage
//                         uri={item?.image}
//                         style={styles.image}
//                     />
//                 </View>
//                 <CustomText translate={false} style={[{
//                     textAlign: 'center',
//                     flexWrap: 'wrap',
//                     color:colors.gray3
//                 },
                
//                   selectedCategory == item?.id &&
//                 {
//                     color: colors.black,
//                 }
                
                
//                 ]}>
//                     {item?.title}
//                 </CustomText>
//             </TouchableOpacity>
//         )
//     }

//     return (
//         <View>
//             <FlatList
//                 data={categories}
//                 keyExtractor={(item, index) => index?.toString()}
//                 renderItem={renderItem}
//                 horizontal
//                 contentContainerStyle={styles.listContent}
//                 showsHorizontalScrollIndicator={false}
//             />
//         </View>
//     )
// }

// export default CategoriesSection

// const styles = StyleSheet.create({
//     itemContainer: {
//         alignItems: "center",
//         gap: 7,
//         width: 90,
//     },
//     imageWrapper: {
//         width: 80,
//         height: 80,
//         backgroundColor: colors.black,
//         borderRadius: 50,
//         alignItems: "center",
//         justifyContent: "center",
//         borderWidth: 3,
//         borderColor: colors.white,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 0,
//         },
//         shadowOpacity: 0.2,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     image: {
//         width: 55,
//         height: 55,
//         borderRadius: 50,
//     },
//     listContent: {
//         gap: 15,
//         marginTop: 10,
//         marginBottom: 20,
//     },
// })