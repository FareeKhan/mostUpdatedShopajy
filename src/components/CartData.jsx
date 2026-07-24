import { FlatList, I18nManager, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import RemoteImage from './RemoteImage'
import CustomText from './CustomText'
import PriceSymbol from './PriceSymbol'
import { fonts } from '../constants/fonts'
import { colors } from '../constants/color'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { useDispatch, useSelector } from 'react-redux'
import {
    addCartRemote,
    clearCartRemote,
    decrementQuanity,
    incrementQuanity,
    productToCart,
    removeCartProduct,
    removeCartRemote,
    updateCartRemote,
} from '../redux/reducers/CartProduct'
import EmptyData from './EmptyData'
import ShadowWrapper from './ShadowWrapper'
import { addToFavorites, toggleFavoriteRemote } from '../redux/reducers/AddFavorite'
import { useNavigation } from '@react-navigation/native'
import { clearCoupon } from '../redux/reducers/Checkout'
import PriceComp from './PriceComp'
import StarRating from 'react-native-star-rating-widget';
import CustomInput from './CustomInput'
import { width } from '../constants/data'
import { submitOrderReview } from '../redux/reducers/Orders'
import CustomButton from './CustomButton'
import { showMessage } from 'react-native-flash-message'
import i18next from 'i18next'


const CartData = ({ data, removeCounter = true, arrow,isFavorite, isRating, cartIcon = true, onPress, disabled = true, showQuantity }) => {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const cart = useSelector(s => s?.cart?.cart) || []
    const token = useSelector(s => s?.auth?.token)
    const favoriteItems = useSelector(s => s?.favorite?.favorites) || []

    const { reviewing } = useSelector((state) => state.orders || {});

    const [ratings, setRatings] = useState({});
    const [comments, setComments] = useState({});

    const findCartItem = (id) => cart.find(i => i.id === id)

    const handleDecrement = (id) => {
        dispatch(decrementQuanity(id))
        if (token) {
            const item = findCartItem(id)
            if (item?.cartItemId && (item.quantity || 1) > 1) {
                dispatch(updateCartRemote({ id: item.cartItemId, quantity: (item.quantity || 1) - 1 }))
            }
        }
    }

    const handleIncrement = (id) => {
        dispatch(incrementQuanity(id))
        if (token) {
            const item = findCartItem(id)
            if (item?.cartItemId) {
                dispatch(updateCartRemote({ id: item.cartItemId, quantity: (item.quantity || 1) + 1 }))
            }
        }
    }

    const handleDelete = (id) => {
        const isLastItem = data?.length === 1;

        console.log('fareedqqlejta', id)

        // if (token) {
        //     const item = findCartItem(id)
        //     if (item?.cartItemId) dispatch(removeCartRemote(item.cartItemId))
        // }

        dispatch(removeCartProduct(id))

        if (isLastItem) {
            dispatch(clearCoupon());
        }

    }


    const handleReviewSubmit = (orderItemId, targetRating, currentComment, productName) => {
        console.log('////', orderItemId, targetRating, currentComment, productName)

        const ratingValue = targetRating || ratings[orderItemId] || 0;
        const commentValue = currentComment !== undefined ? currentComment : (comments[orderItemId] || '');

        if (ratingValue === 0) return;
        dispatch(submitOrderReview({
            orderItemId,
            rating: ratingValue,
            comment: commentValue
        }))
            .unwrap()
            .then(() => {
                showMessage({
                    type: 'success',
                    message: i18next.t('successTitle'),
                    description: `${productName} review is submitted`,
                });
            })
            .catch((err) => {
                console.log("Review submission failed:", err);

                showMessage({
                    type: 'danger',
                    message: i18next.t('Review submission failed:'),
                    description: `${productName} review is failed`,
                });
            });
    };


    const handleFavorite = (item) => {
        const isFav = favoriteItems.some(i => i.id === item.id)
        dispatch(addToFavorites(item))
        if (token) dispatch(toggleFavoriteRemote({ productId: item.id, isFavorite: isFav }))
    }

    const handleCart = (item) => {
        const { id, title_en, title_ar, weight, description_ar, description_en, discount_price_syp, price_syp, image, price, discount_price, } = item
        const selectedColor = item?.colors?.length > 0 ? item?.colors[0] : ''
        const selectedSize = item?.sizes?.length > 0 ? item?.sizes[0] : ''
        dispatch(productToCart({
            id,
            title_en,
            title_ar,
            description_ar,
            description_en,
            image,
            price,
            discount_price,
            discount_price_syp,
            price_syp,
            color: selectedColor,
            size: selectedSize,
            quantity: 1,
            weight
        }))
        navigation.navigate('MyCartScreen')
    }


    const renderItem = ({ item, index }) => {
        // const isFavorite = favoriteItems?.some((i) => i?.id == item?.id)
        const title = I18nManager.isRTL ? item?.title_ar : item?.title_en
        const review = item?.reviewData || item?.review || null;

        const ratingValue =
            ratings[item.id] ?? review?.rating ?? 0;

        const commentValue =
            comments[item.id] ?? review?.comment ?? '';

        const isReviewed = !!review?.rating;

        return (
            <View style={{
                borderWidth: 1,
                padding: 12,
                paddingBottom: 16,
                borderColor: colors.gray5,
                borderRadius: 12,
                backgroundColor: colors.white,
            }}>

                <TouchableOpacity
                    onPress={() => navigation.navigate('ProductDetailScreen', {
                        productData: item
                    })}

                    disabled={disabled} style={styles.container}>

                    <View>
                        <RemoteImage
                            uri={item?.image}
                            style={[styles.image, isRating && { width: 130 }]}
                        />
                    </View>

                    <View style={{ width: "60%" }}>
                        <CustomText bold xl style={{ marginBottom: 3 }}>{title || item?.title}</CustomText>
                        {/* {title || item?.title} */}
                        {
                            item?.discount_price ?
                                <PriceComp
                                    discountPrice={item?.discount_price}
                                    price={item?.price}
                                    equalent={item?.discount_price_syp || item?.price_syp}
                                />

                                :
                                <PriceComp
                                    discountPrice={item?.price}
                                    equalent={item?.discount_price_syp || item?.price_syp}
                                />
                        }

                        {
                            showQuantity &&
                            <CustomText translate={false}>x {item?.quantity}</CustomText>
                        }

                        {console.log('ssss', item)}

                        {
                            item?.color &&
                            <View style={{ flexDirection: "row", marginTop: 4 }}>
                                <CustomText>color</CustomText>
                                <CustomText translate={false}>:</CustomText>
                                <CustomText translate={false}> {typeof item?.color === 'object' ? I18nManager.isRTL ? item?.color?.label_ar || item?.color?.label : item?.color?.label : item?.color}</CustomText>
                            </View>

                        }

                        {
                            item?.size &&
                            <View style={{ flexDirection: "row", }}>
                                <CustomText>size</CustomText>
                                <CustomText translate={false}>:</CustomText>
                                <CustomText translate={false} > {typeof item?.size === 'object' ? I18nManager.isRTL ? item?.size?.label_ar || item?.size?.label : item?.size?.label : item?.size}</CustomText>

                            </View>

                        }




                        {
                            removeCounter &&
                            <View style={styles.qtyRow} >
                                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleDecrement(item?.id)}>
                                    <Feather name={'minus'} />
                                </TouchableOpacity>

                                <CustomText>{item?.quantity}</CustomText>

                                <TouchableOpacity style={styles.qtyBtn} onPress={() => handleIncrement(item?.id)} >
                                    <Feather name={'plus'} />
                                </TouchableOpacity>
                            </View>
                        }

                    </View>




                    {
                        removeCounter &&
                        <View style={styles.rightActions}>
                            <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                                <Ionicons name={'trash-outline'} size={20} color={colors.red} />
                            </TouchableOpacity>
                        </View>
                    }

                    {
                        isFavorite &&
                        <View style={styles.rightActions}>

                            <TouchableOpacity style={styles.cartBtn} onPress={() => handleFavorite(item)}>
                                <FontAwesome
                                    name={'heart'}
                                    size={15}
                                    color={colors.red}
                                />
                            </TouchableOpacity>
                            {
                                cartIcon &&

                                <TouchableOpacity style={styles.cartBtn} onPress={() => handleCart(item)}>
                                    <Ionicons name={'cart-outline'} size={20} color={colors.white} />
                                </TouchableOpacity>
                            }
                        </View>
                    }



                </TouchableOpacity>

                {
                    isRating &&

                    <View>
                        <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                            <View>
                                <CustomText medium xl>rateThisProduct</CustomText>
                                <StarRating

                                    rating={ratingValue}

                                    onChange={(newRating) => {
                                        if (isReviewed) return;

                                        setRatings(prev => ({
                                            ...prev,
                                            [item.id]: Math.round(newRating)
                                        }));
                                    }}
                                    starSize={25}
                                    starStyle={{ marginHorizontal: 1, paddingHorizontal: 0 }}
                                    style={{ alignSelf: 'flex-start', marginTop: 10, marginHorizontal: 0 }}
                                />



                            </View>
                            <CustomInput
                                placeholder={'yourComment'}
                                style={{ width: width / 2, marginTop: "auto" }}
                                inputContainer={{ borderRadius: 10 }}
                                value={commentValue}
                                onChangeText={(text) =>
                                    setComments(prev => ({
                                        ...prev,
                                        [item.id]: text
                                    }))
                                }
                                editable={!isReviewed}
                            />

                        </View>


                        <TouchableOpacity
                            disabled={isReviewed}
                            onPress={() =>
                                handleReviewSubmit(
                                    item.id,
                                    ratings[item.id] ?? review?.rating ?? 0,
                                    comments[item.id] ?? review?.comment ?? '',
                                    item.title || item.title_en
                                )
                            }
                            style={{ alignItems: "center", marginTop: 15 }}>
                            <CustomText style={{ color: isReviewed ? colors.gray : colors.secondary }}>Submit Review</CustomText>
                        </TouchableOpacity>
                    </View>

                }
            </View>

        )
    }

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={(item, index) => index?.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<EmptyData
                    imagePath={require('../assets/images/emptyCart.png')}
                    title={'nextChoice'}
                    colorText={'here'}
                    subTitle={'withEasily'}
                    semiBold={true}
                    style={{ width: "80%" }}
                    button
                    arrow={arrow}
                    // onPress={() => navigation.navigate('DrawerNavigation')}
                    onPress={() => {
                        navigation.navigate('DrawerNavigation', {
                            screen: 'BottomTabNavigation',
                            params: {
                                screen: 'CategoryScreen',
                            },
                        });
                    }}

                />}
            />
        </View>
    )
}

export default CartData

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 12,

    },
    image: {
        width: 90,
        height: 90,
        marginVertical: "auto"
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
        marginTop: 2,
        marginBottom: 3
    },
    priceSymbol: {
        fontFamily: fonts.bold,
        fontSize: 16
    },
    oldPrice: {
        textDecorationLine: 'line-through'
    },
    usdText: {
        color: colors.gray20
    },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 10,
        marginTop: 5
    },
    qtyBtn: {
        width: 30,
        height: 28,
        borderRadius: 50,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: colors.white,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    rightActions: {
        marginLeft: "auto",
        gap: 12
    },
    deleteBtn: {
        width: 32,
        height: 32,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: colors.red1,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    cartBtn: {
        width: 32,
        height: 32,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: colors.secondary,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    listContainer: {
        gap: 10,
        marginBottom: 15
    }
})