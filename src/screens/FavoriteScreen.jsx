import { StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import EmptyData from '../components/EmptyData'
import { height } from '../constants/data'
import CartData from '../components/CartData'
import CustomButton from '../components/CustomButton'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFavoritesRemote } from '../redux/reducers/AddFavorite'
import { mapProduct } from '../api/mappers'

const FavoriteScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const favoriteItems = useSelector((state) => state?.favorite?.favorites)
    const token = useSelector(s => s?.auth?.token)
    const lang = useSelector(s => s?.language?.language) || 'en'

    useEffect(() => {
        if (token) dispatch(fetchFavoritesRemote())
    }, [token, dispatch])

    // const items = useMemo(
    //     () => (favoriteItems || []).map(p =>
    //         p?.title_en !== undefined ? mapProduct(p, lang) : p,
    //     ),
    //     [favoriteItems, lang],
    // )
    const items = favoriteItems

    return (
        <View style={{ flex: 1 }}>
            <CustomScreenView>
                <HeaderBox
                    title={'favorite'}
                    // share
                    style={{ marginBottom: 20 }}
                />

                {
                    items?.length > 0 ?
                        <CartData
                            data={items}
                            isFavorite
                            removeCounter={false}
                            disabled={false}
                        // onPress={() => navigation.navigate('ProductDetailScreen', {
                        //     productData: item
                        // })}

                        />

                        :

                        <EmptyData
                            imagePath={require('../assets/images/emptyHeart.png')}
                            title={'foundSomthing'}
                            colorText={'loveYet'}
                            subTitle={'saveProduct'}
                            style={{ width: "80%" }}
                            button
                            semiBold
                            containerStyle={{ marginTop: height / 10 }}
                            onPress={() => {
                                navigation.navigate('DrawerNavigation', {
                                    screen: 'BottomTabNavigation',
                                    params: {
                                        screen: 'CategoryScreen',
                                    },
                                });
                            }}

                        />
                }

                {/* {
                    items?.length > 0 &&

                    <CustomButton
                        title={'addAll'}
                        arrow
                        style={{ width: '90%', borderRadius: 50, height: 50, alignSelf: 'center' }}
                    />
                } */}


            </CustomScreenView>
        </View>
    )
}

export default FavoriteScreen

const styles = StyleSheet.create({})