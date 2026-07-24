import { ActivityIndicator, FlatList, I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import RemoteImage from '../components/RemoteImage'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import { fetchCategoryById, setSelectedCategoryId } from '../redux/reducers/Home'

const AllCategoriesScreen = () => {
    const navigation = useNavigation()
    const dispatch = useDispatch()

    const { allCategories, categoriesLoading } = useSelector(state => state.home)

    const categoryItems = useMemo(
        () =>
            allCategories.map(item => ({
                id: String(item.id),
                title: I18nManager.isRTL ? item.title_ar : item.title_en,
                image: item.image,
                subcategories: item.subcategories,
                children: item.children,
            })),
        [allCategories],
    )

    const handleCategoryPress = (id) => {
        dispatch(setSelectedCategoryId(id))
        dispatch(fetchCategoryById(id))
        navigation.goBack()
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handleCategoryPress(item.id)}
            style={styles.itemContainer}
        >
            <View style={styles.imageWrapper}>
                <RemoteImage
                    uri={item.image}
                    style={styles.image}
                />
            </View>
            <CustomText
                translate={false}
                style={styles.categoryTitle}
            >
                {item.title}
            </CustomText>
        </TouchableOpacity>
    )

    return (
        <CustomScreenView>
            <HeaderBox
                title={'category'}
                style={{ marginBottom: 20 }}
            />

            {categoriesLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary || colors.black} />
                </View>
            ) : (
                <FlatList
                    data={categoryItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={3} // Displays categories in a clean 3-column grid
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </CustomScreenView>
    )
}

export default AllCategoriesScreen

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 40,
    },
    row: {
        marginBottom: 20,
    },
    itemContainer: {
        alignItems: 'center',
        width: '33%', // Fits perfectly in 3 columns
        gap: 8,
    },
    imageWrapper: {
        width: 80,
        height: 80,
        backgroundColor: colors.black,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 27.5,
    },
    categoryTitle: {
        textAlign: 'center',
        flexWrap: 'wrap',
    },
})