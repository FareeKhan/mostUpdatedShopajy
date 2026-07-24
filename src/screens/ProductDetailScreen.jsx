import { I18nManager, Image, Linking, Share, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import HeaderBox from '../components/HeaderBox'
import CustomScreenView from '../components/CustomScreenView'
import SliderProductImage from '../components/SliderProductImage'
import CustomText from '../components/CustomText'
import StarRating from 'react-native-star-rating-widget';
import PriceSymbol from '../components/PriceSymbol'
import { fonts } from '../constants/fonts'
import { colors } from '../constants/color'
import TitleViewAll from '../components/TitleViewAll'
import OptionTabs from '../components/OptionTabs'
import QuantityCounter from '../components/QuantityCounter'
import BorderLine from '../components/BorderLine'
import ProductCardData from '../components/ProductCardData'
import PriceWithUsdValue from '../components/PriceWithUsdValue'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import CustomButton from '../components/CustomButton'
import PriceComp from '../components/PriceComp'
import CustomLoader from '../components/CustomLoader'
import { useDispatch, useSelector } from 'react-redux'
import { addCartRemote, productToCart } from '../redux/reducers/CartProduct'
import { mapProduct, mapSingleProduct } from '../api/mappers'
import { fetchProductById } from '../redux/reducers/Home'
import { addToFavorites, toggleFavoriteRemote } from '../redux/reducers/AddFavorite'
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next'
import RemoteImage from '../components/RemoteImage'
import { height, width } from '../constants/data'
import Whatapp from '../assets/svg/whatapp'

const ProductDetailScreen = ({ navigation, route }) => {
    const { productId } = route?.params || {};
    const { t } = useTranslation()

    const dispatch = useDispatch()
    const { similar } = useSelector(s => s.products)
    const { selectedProduct } = useSelector(s => s.home);
    const token = useSelector(s => s?.auth?.token)
    const lang = useSelector(s => s?.language?.language) || 'en'
    const favoriteItems = useSelector((state) => state?.favorite?.favorites)
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [counter, setCounter] = useState(1)
    const [isLoading, setIsLoading] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const product = selectedProduct

    const isFavorite = useMemo(() => favoriteItems?.some((i) => i?.id === product?.id), [favoriteItems, product?.id]);

    useEffect(() => {
        const getProductDetail = async () => {
            if (productId) {
                try {
                    setIsLoading(true);
                    await dispatch(fetchProductById(productId)).unwrap();
                } catch (error) {
                    console.error("Failed to fetch product data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        getProductDetail();
    }, [productId,]);

    useEffect(() => {
        if (product) {
            if (product.colors?.length == 1) {
                setSelectedColor(product.colors[0]);
            } else {
                setSelectedColor('');
            }

            if (product.sizes?.length ==1) {
                setSelectedSize(product.sizes[0]);
            } else {
                setSelectedSize('');
            }
        }
    }, [product]);


    //     useEffect(() => {
    //     if (product) {
    //         const targetPrice = product.discount_price || product.price;

    //         const matchingVariant = product.variants?.find(
    //             (v) => v.price === targetPrice || v.discount_price === targetPrice
    //         );

    //         if (matchingVariant) {

    //             const foundColor = product.colors?.find(
    //                 (c) => (typeof c === 'object' ? c.label : c)?.toLowerCase() === matchingVariant.color?.toLowerCase()
    //             );
    //             const foundSize = product.sizes?.find(
    //                 (s) => (typeof s === 'object' ? s.label : s)?.toLowerCase() === matchingVariant.size?.toLowerCase()
    //             );

    //             setSelectedColor(foundColor || product.colors?.[0] || '');
    //             setSelectedSize(foundSize || product.sizes?.[0] || '');
    //         } else {
    //             // Fallback to defaults if no variant matches the base price directly
    //             setSelectedColor(product.colors?.length > 0 ? product.colors[0] : '');
    //             setSelectedSize(product.sizes?.length > 0 ? product.sizes[0] : '');
    //         }
    //     }
    // }, [product]);


    const similarItems = useMemo(
        () => similar.map(p => mapProduct(p, lang)),
        [similar, lang],
    )


    const activeVariant = useMemo(() => {
        if (!product?.variants || (!selectedColor && !selectedSize)) return null;

        return product.variants.find(variant => {
            const variantColor = variant?.color?.toLowerCase();
            const chosenColor = (typeof selectedColor === 'object' ? selectedColor?.label?.toLowerCase() : selectedColor);

            const variantSize = variant?.size?.toLowerCase();
            const chosenSize = (typeof selectedSize === 'object' ? selectedSize?.label?.toLowerCase() : selectedSize);

            const colorMatch = chosenColor ? variantColor === chosenColor : true;
            const sizeMatch = chosenSize ? variantSize === chosenSize : true;

            return colorMatch && sizeMatch;
        });
    }, [product?.variants, selectedColor, selectedSize]);

    // const filterImages = useMemo(() => {
    //     if (activeVariant?.images?.length > 0) return activeVariant.images;
    //     if (activeVariant?.image) return [activeVariant.image];

    //     return product?.images || [];
    // }, [product, activeVariant]);



    const filterImages = useMemo(() => {
        const baseImages = product?.images?.length > 0 ? [...product.images] : [];
        if (baseImages.length === 0 && product?.image) {
            baseImages.push(product.image);
        }

        const variantImages = [];
        if (product?.variants?.length > 0) {
            product.variants.forEach(v => {
                if (v.image && !variantImages.includes(v.image)) {
                    variantImages.push(v.image);
                }
            });
        }

        // Return a stable array of all unique images combined
        return Array.from(new Set([...baseImages, ...variantImages]));
    }, [product]);


    useEffect(() => {
        if (activeVariant?.image) {
            const variantIndex = filterImages.indexOf(activeVariant.image);
            if (variantIndex !== -1) {
                setActiveImageIndex(variantIndex);
            }
        }
    }, [activeVariant, filterImages]);


    // const handleCart = () => {
    //     const { id, title_en, title_ar, weight, description_ar, description_en, discount_price_syp, price_syp, image, price, discount_price, } = product
    //     dispatch(productToCart({
    //         id,
    //         title_en,
    //         title_ar,
    //         description_ar,
    //         description_en,
    //         image,
    //         price,
    //         discount_price,
    //         discount_price_syp,
    //         price_syp,
    //         color: selectedColor,
    //         size: selectedSize,
    //         quantity: counter,
    //         weight
    //     }))

    //     navigation.navigate('MyCartScreen')
    // }

    const handleCart = () => {
        const hasColors = product?.colors?.length > 0;
        const hasSizes = product?.sizes?.length > 0;

        if (hasColors && hasSizes && !selectedColor && !selectedSize) {
            showMessage({
                type: 'danger',
                message: t('pleaseSelectColorAndSize'),
            });
            return;
        }

        if (hasColors && !selectedColor) {
            showMessage({
                type: 'danger',
                message: t('pleaseSelectAColor'),
            });
            return;
        }

        if (hasSizes && !selectedSize) {
            showMessage({
                type: 'danger',
                message: t('pleaseSelectASize'),
            });
            return;
        }

        const { id, title_en, title_ar, weight, description_ar, description_en } = product;
        // const selectedVariantImage = filterImages?.[0] || product?.image;
        const selectedVariantImage =
            activeVariant?.image ||
            filterImages?.[0] ||
            product?.image;
        dispatch(productToCart({
            id,
            title_en,
            title_ar,
            description_ar,
            description_en,
            image: selectedVariantImage,
            price: activeVariant ? activeVariant.price : product?.price,
            discount_price: activeVariant ? null : product?.discount_price,
            discount_price_syp: activeVariant ? activeVariant.price_syp : product?.discount_price_syp,
            price_syp: activeVariant ? activeVariant.price_syp : product?.price_syp,
            color: selectedColor,
            size: selectedSize,
            quantity: counter,
            weight,
            variantId: activeVariant?.id || null
        }));

        navigation.navigate('MyCartScreen');
    };


    const handleFavorite = () => {
        if (!product) return;

        dispatch(addToFavorites({ ...product, quantity: 1 }))
        if (token) {
            dispatch(toggleFavoriteRemote({ productId: product.id, isFavorite: isFavorite }))
        }

        const productTitle = I18nManager.isRTL ? product?.title_ar : product?.title_en || t('product');


        if (isFavorite) {
            showMessage({
                type: 'success',
                message: t('hasBeenRemovedFromYourFavorites', { productTitle }),
            })
        } else {
            showMessage({
                type: 'success',
                message: t('hasBeenAddedToYourFavorites', { productTitle }),
            })
        }



    }

    const handleWhatsApp = async () => {
        const message = `Checkout this product: ${product?.title_en}! Price: ${product?.price}`;
        const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert("WhatsApp is not installed");
        }
    };
    const handleShare = async () => {
        try {
            // You can customize the message text using your product titles
            const productTitle = I18nManager.isRTL ? product?.title_ar : product?.title_en;

            const result = await Share.share({
                message: `Check out this product on ShopAjy: ${productTitle || 'Food storage container'}! Price: ${product?.discount_price ? product?.discount_price : product?.price || ''}$`,
                // Optional: If you have deep links setup, you can append a URL property:
                // url: `https://shopajy.com/product/${productData?.id}` 
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // Shared with a specific app activity type (iOS)
                } else {
                    // Shared successfully
                }
            } else if (result.action === Share.dismissedAction) {
                // Sharing modal dismissed
            }
        } catch (error) {
            console.error("Error sharing product:", error.message);
        }
    };


    // const allAvailableThumbnails = useMemo(() => {
    //     const list = [];

    //     // 1. Add base product images first
    //     if (product?.images?.length > 0) {
    //         product.images.forEach(img => list.push({ url: img, isVariant: false }));
    //     } else if (product?.image) {
    //         list.push({ url: product.image, isVariant: false });
    //     }

    //     // 2. Append all variant images
    //     if (product?.variants?.length > 0) {
    //         product.variants.forEach(v => {
    //             if (v.image && !list.some(item => item.url === v.image)) {
    //                 list.push({ url: v.image, isVariant: true, variant: v });
    //             }
    //         });
    //     }

    //     return list;
    // }, [product]);

    // Combines product images and unique variant images into one thumbnail collection
    const allAvailableThumbnails = useMemo(() => {
        const list = [];

        if (product?.images?.length > 0) {
            product.images.forEach(img => list.push({ url: img, isVariant: false }));
        } else if (product?.image) {
            list.push({ url: product.image, isVariant: false });
        }

        if (product?.variants?.length > 0) {
            product.variants.forEach(v => {
                if (v.image && !list.some(item => item.url === v.image)) {
                    list.push({ url: v.image, isVariant: true, variant: v });
                }
            });
        }

        return list;
    }, [product]);

    if (isLoading) {
        return (
            <CustomLoader center />
        )
    }


    console.log('showmerEPrddsad', product)

    return (
        <View style={{ flex: 1 }}>
            <CustomScreenView>
                <HeaderBox
                    title={'productDetail'}
                    share
                    sharePress={handleShare}
                />

                {/* <SliderProductImage imagesArray={filterImages} tag={product?.tag} isNew={product?.is_new} /> */}
                {/* <View style={styles.sliderWrapper}>

                    <SliderProductImage
                        imagesArray={filterImages}
                        tag={product?.tag}
                        isNew={product?.is_new}
                        onIndexChanged={(index) => {
                            const activeImageUrl = filterImages[index];
                            if (!activeImageUrl) return;

                            const matchingVariant = product?.variants?.find(v => v.image === activeImageUrl);

                            if (matchingVariant) {
                                const matchingColor = product.colors?.find(
                                    c => (typeof c === 'object' ? c.label : c)?.toLowerCase() === matchingVariant.color?.toLowerCase()
                                );
                                const matchingSize = product.sizes?.find(
                                    s => (typeof s === 'object' ? s.label : s)?.toLowerCase() === matchingVariant.size?.toLowerCase()
                                );

                                if (matchingColor) setSelectedColor(matchingColor);
                                if (matchingSize) setSelectedSize(matchingSize);
                            } else {
                                setSelectedColor('');
                                setSelectedSize('');
                            }
                        }}
                    />
                </View> */}
                <View style={styles.sliderWrapper}>
                    {/* <SliderProductImage
                        imagesArray={filterImages}
                        tag={product?.tag}
                        isNew={product?.is_new}
                        // Find the current active image index in our stable array
                        activeIndex={filterImages.indexOf(activeVariant?.image || product?.images?.[0] || product?.image)}
                        onIndexChanged={(index) => {
                            const activeImageUrl = filterImages[index];
                            if (!activeImageUrl) return;

                            const matchingVariant = product?.variants?.find(v => v.image === activeImageUrl);

                            if (matchingVariant) {
                                const matchingColor = product.colors?.find(
                                    c => (typeof c === 'object' ? c.label : c)?.toLowerCase() === matchingVariant.color?.toLowerCase()
                                );
                                const matchingSize = product.sizes?.find(
                                    s => (typeof s === 'object' ? s.label : s)?.toLowerCase() === matchingVariant.size?.toLowerCase()
                                );

                                if (matchingColor) setSelectedColor(matchingColor);
                                if (matchingSize) setSelectedSize(matchingSize);
                            } else {
                                setSelectedColor('');
                                setSelectedSize('');
                            }
                        }}
                    /> */}


                    <SliderProductImage
                        imagesArray={filterImages}
                        tag={product?.tag}
                        isNew={product?.is_new}
                        // 1. Pass down the state value directly
                        activeIndex={activeImageIndex}
                        onIndexChanged={(index) => {
                            // 2. Set the index state when swiped manually
                            setActiveImageIndex(index);
                            const activeImageUrl = filterImages[index];
                            if (!activeImageUrl) return;

                            const matchingVariant = product?.variants?.find(v => v.image === activeImageUrl);

                            if (matchingVariant) {
                                const matchingColor = product.colors?.find(
                                    c => (typeof c === 'object' ? c.label : c)?.toLowerCase() === matchingVariant.color?.toLowerCase()
                                );
                                const matchingSize = product.sizes?.find(
                                    s => (typeof s === 'object' ? s.label : s)?.toLowerCase() === matchingVariant.size?.toLowerCase()
                                );

                                if (matchingColor) setSelectedColor(matchingColor);
                                if (matchingSize) setSelectedSize(matchingSize);
                            } else {
                                setSelectedColor('');
                                setSelectedSize('');
                            }
                        }}
                    />
                </View>

                <View style={styles.variantThumbnailContainer}>
                    {allAvailableThumbnails?.map((item, index) => {
                        const isSelected = filterImages[activeImageIndex] === item.url;

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    const targetIdx = filterImages.indexOf(item.url);
                                    if (targetIdx !== -1) {
                                        setActiveImageIndex(targetIdx);
                                    }

                                    if (item.isVariant) {
                                        const v = item.variant;
                                        const matchingColor = product.colors?.find(
                                            c => (typeof c === 'object' ? c.label : c)?.toLowerCase() === v.color?.toLowerCase()
                                        );
                                        const matchingSize = product.sizes?.find(
                                            s => (typeof s === 'object' ? s.label : s)?.toLowerCase() === v.size?.toLowerCase()
                                        );

                                        if (matchingColor) setSelectedColor(matchingColor);
                                        if (matchingSize) setSelectedSize(matchingSize);
                                    } else {
                                        setSelectedColor('');
                                        setSelectedSize('');
                                    }
                                }}
                                style={[
                                    styles.thumbnailWrapper,
                                ]}
                            >
                                <RemoteImage
                                    uri={item.url}
                                    style={styles.thumbnailImage}
                                />
                            </TouchableOpacity>
                        );
                    })}
                </View>




                <TitleViewAll title={I18nManager.isRTL ? product?.title_ar : product?.title_en} extraLarge semiBold mv={false} />

                <View style={{ marginTop: 10, alignItems: "flex-end" }}>
                    {

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                            marginBottom: 10,
                            justifyContent: "flex-end"
                        }}>
                            <CustomText xs medium translate={false}>({product?.review_count})</CustomText>

                            <StarRating
                                rating={parseInt(product?.rating)}
                                starSize={25}
                                starStyle={{ marginHorizontal: 0 }}
                                onChange={() => { }}

                            />
                        </View>
                    }



                    {/* {
                        product?.discount_price ?
                            <PriceComp
                                // discountPrice={product?.discount_price}
                                // price={product?.price}
                                // equalent={product?.discount_price_syp ? product?.discount_price_syp : product?.price_syp}
                                // style={{ marginBottom: 15 }}


                                discountPrice={activeVariant ? activeVariant.price : (product?.discount_price || product?.price)}
                                price={activeVariant ? null : product?.price} // Hide original price comparison if variant selected
                                equalent={activeVariant ? activeVariant.price_syp : (product?.discount_price_syp || product?.price_syp)}
                                style={{ marginBottom: 15 }}
                            />
                            :
                            <PriceComp
                                discountPrice={product?.price}
                                equalent={product?.discount_price_syp ? product?.discount_price_syp : product?.price_syp}
                                style={{ marginBottom: 15 }}
                            />
                    } */}
                    <PriceComp
                        discountPrice={
                            activeVariant
                                ? activeVariant.price
                                : (product?.discount_price || product?.price)
                        }

                        price={
                            activeVariant
                                ? null
                                : (product?.discount_price ? product?.price : null)
                        }

                        equalent={
                            activeVariant
                                ? activeVariant.price_syp
                                : (product?.discount_price_syp || product?.price_syp)
                        }
                        style={{ marginBottom: 20 }}
                        discountStyle={{ fontSize: 25 }}
                        approxStyle={{ alignSelf: "flex-end" }}
                        priceBoxStyle={{ flexDirection: "row-reverse" }}
                        innerPriceStyle={{ marginTop: "auto" }}
                        showDiscount

                    />




                    {/* <View style={{backgroundColor:"red"}}>
                 <CustomText>sss</CustomText>
                </View> */}


                </View>


                {
                    product?.colors?.length > 0 &&
                    <OptionTabs
                        data={product?.colors}
                        title={'color'}
                        setSelectedItem={setSelectedColor}
                        selectedItem={selectedColor}
                    />
                }

                {
                    product?.sizes?.length > 0 &&
                    <OptionTabs
                        data={product?.sizes}
                        title={'size'}
                        setSelectedItem={setSelectedSize}
                        selectedItem={selectedSize}
                    />
                }

                <QuantityCounter
                    counter={counter}
                    setCounter={setCounter}
                />

                <BorderLine centerLine mv />

                <TitleViewAll title={'description'} xxxl semiBold mv={false} />

                <CustomText style={{ marginVertical: 10, color: colors.gray3 }}>{I18nManager.isRTL ? product?.description_ar : product?.description_en}</CustomText>

                {
                    similar?.length > 0 &&
                    <>
                        <TitleViewAll title={'similarProducts'} xxxl semiBold mv={false} style={{ marginBottom: 10, marginTop: 20 }} />
                        <ProductCardData
                            data={similarItems}
                        />

                    </>
                }


            </CustomScreenView>


            <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: colors.gray5, paddingTop: 20, zIndex: 999, gap: 15, alignItems: "center", backgroundColor: colors.white, position: "absolute", width: "100%", bottom: 0, height: 100, paddingHorizontal: 20, paddingBottom: 45 }}>
                {/* <TouchableOpacity onPress={handleFavorite} style={{ width: 50, height: 50, borderRadius: 50, alignItems: "center", justifyContent: "center", backgroundColor: isFavorite ? colors.black : colors.secondary }} > */}
                <TouchableOpacity onPress={handleFavorite} style={{ width: 55, height: 55, borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth:3,borderColor:colors.gray24}} >
                    <FontAwesome
                        name={isFavorite ? 'heart' : 'heart-o'}
                        color={colors.red}
                        size={25}
                    /> 
                    
                </TouchableOpacity>



                 <TouchableOpacity onPress={handleShare} style={{ width: 55, height: 55, borderRadius: 50, alignItems: "center", justifyContent: "center", borderWidth:3,borderColor:colors.gray24}} >
                    <FontAwesome
                        name={'whatsapp'}
                        color={'#6ABC6D'}
                        size={32}
                        style={{zIndex:999}}
                    />
                    
                </TouchableOpacity>

            

                <CustomButton
                    title={'addToCart'}
                    style={{ height: 50, width: "40%", borderRadius: 50 }}
                    textStyle={{ fontSize: 18 }}
                    onPress={handleCart}
                />
                <View style={{ marginLeft: "auto" }}>
                    <PriceComp
                        // discountPrice={product?.discount_price ? (product?.discount_price * counter)?.toLocaleString() : (product?.price * counter)?.toLocaleString()}
                        // discountStyle={{ fontSize: 25 }}
                        // equalent={product?.discount_price_syp ? (product?.discount_price_syp * counter) : (product?.price_syp * counter)}
                        // discountCont={{ marginLeft: "auto" }}



                        discountPrice={
                            activeVariant
                                ? (activeVariant.price * counter)?.toLocaleString()
                                : ((product?.discount_price || product?.price) * counter)?.toLocaleString()
                        }
                        discountStyle={{ fontSize: 25 }}
                        equalent={
                            activeVariant
                                ? (activeVariant.price_syp * counter)
                                : ((product?.discount_price_syp || product?.price_syp) * counter)
                        }
                        discountCont={{ marginLeft: "auto" }}
                    />
                </View>

            </View>
        </View>
    )
}

export default ProductDetailScreen

const styles = StyleSheet.create({
    variantThumbnailContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 7,
        marginBottom: 17,
        paddingHorizontal: 4,
        marginTop:20
    },
    thumbnailWrapper: {
        width: 70,
        height: 70,
        borderRadius: 0,
        borderColor: colors.gray5,
        overflow: 'hidden',
    },
    thumbnailSelected: {
        borderColor: colors.black,
        borderWidth: 2,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        borderRadius: 6,
        resizeMode: 'cover',
    },
})