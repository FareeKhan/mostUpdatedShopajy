import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomInput from '../components/CustomInput'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import ProductCardData from '../components/ProductCardData'
import { addRecentSearch, searchProducts } from '../redux/reducers/Products'
import { fetchHome } from '../redux/reducers/Home'
import { mapProduct } from '../api/mappers'
import Entypo from 'react-native-vector-icons/Entypo'

const SearchScreen = () => {
    const dispatch = useDispatch()
    const { searchResults, recentSearches } = useSelector(s => s.products)
    const { featuredProducts } = useSelector(s => s.home)
    const lang = useSelector(s => s?.language?.language) || 'en'


    console.log('fareerads', recentSearches)

    const [search, setSearch] = useState('')
    const debounceRef = useRef(null)

    useEffect(() => {
        if (!featuredProducts?.length) dispatch(fetchHome())
    }, [dispatch, featuredProducts?.length])


    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        const term = search.trim()
        if (!term) return

        debounceRef.current = setTimeout(() => {
            dispatch(addRecentSearch(term))

            dispatch(searchProducts({ q: term, per_page: 30 }))
        }, 350)

        return () => clearTimeout(debounceRef.current)
    }, [search, dispatch])



    const onSubmitSearch = () => {
        const term = search.trim()
        if (!term) return
        dispatch(addRecentSearch(term))
        dispatch(searchProducts({ q: term, per_page: 30 }))
    }

    // const resultsItems = useMemo(
    //     () => searchResults.map(p => mapProduct(p, lang)),
    //     [searchResults, lang],
    // )


    const resultsItems = searchResults


    const suggestItems = featuredProducts
    const renderRecent = ({ item }) => (
        <TouchableOpacity onPress={() => setSearch(item)} style={styles.searchItem}>
            <CustomText translate={false} semiBold style={{ color: colors.black1 }}>{item}</CustomText>
        </TouchableOpacity>
    )

    const showResults = search.trim().length > 0 && resultsItems.length > 0

    return (
        <CustomScreenView>
            <HeaderBox logo isBack={false} threeLines cart />

            {/* <CustomInput
                searchIcon={true}
                placeholder={'searchProduct'}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={onSubmitSearch}
                rightIcon={
                    search?.length !== 0 &&
                    <TouchableOpacity style={{ right: 22 }} onPress={() => setSearch('')}>
                        <Entypo name={'circle-with-cross'} size={22} color={colors.gray} />
                    </TouchableOpacity>
                }

            /> */}
            <CustomInput
                placeholder={'Search for a product...'}
                leftIcon={<Ionicons name={'search-outline'} size={22} color={colors.black} />}
                style={styles.searchInput}
                value={search}
                onChangeText={setSearch}
                onSubmitEditing={onSubmitSearch}
                iconColor={'black'}
                rightIcon={
                    search?.length !== 0 &&
                    <TouchableOpacity style={{ right: 22 }} onPress={() => setSearch('')}>
                        <Entypo name={'circle-with-cross'} size={22} color={colors.gray} />
                    </TouchableOpacity>
                }
            />

            {showResults ? (
                <ProductCardData data={resultsItems} />
            ) : (
                <>
                    {recentSearches.length > 0 && (
                        <>
                            <CustomText xxxl medium>recentSearch</CustomText>
                            <FlatList
                                data={recentSearches}
                                keyExtractor={(item, index) => `${item}-${index}`}
                                renderItem={renderRecent}
                                scrollEnabled={false}
                                numColumns={3}
                                contentContainerStyle={styles.recentList}
                                columnWrapperStyle={styles.columnWrapper}
                            />
                        </>
                    )}

                    <CustomText xxxl medium style={styles.suggestTitle}>
                        suggestProduct
                    </CustomText>

                    <ProductCardData data={suggestItems} />
                </>
            )}
        </CustomScreenView>
    )
}

export default SearchScreen

const styles = StyleSheet.create({
    searchItem: {
        backgroundColor: colors.gray18,
        marginRight: 10,
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 50,
    },

    recentList: { justifyContent: 'space-between', gap: 10, marginTop: 10 },
    columnWrapper: { justifyContent: 'flex-start' },
    suggestTitle: { marginTop: 25, marginBottom: 15 },
    searchInput: {
        marginTop: 20,
        marginBottom: 35,
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderWidth: 1.5,
        borderColor: '#E6FFFA',
        shadowColor: colors.secondary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.35,
        shadowRadius: 8.0,
        elevation: 6,
    },
})
