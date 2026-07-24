import { ActivityIndicator, I18nManager, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomCarousel from '../components/CustomCarousel'
import TitleViewAll from '../components/TitleViewAll'
import CategoriesSection from '../components/CategoriesSection'
import SubCategories from '../components/SubCategories'
import ProductCardData from '../components/ProductCardData'
import AdverismentCard from '../components/AdverismentCard'
import StatusHeader from '../components/StatusHeader'
import { colors } from '../constants/color'
import TitleWithChangeColor from '../components/TitleWithChangeColor'
import { fetchCategories, fetchHome, fetchSubCategoryProducts } from '../redux/reducers/Home'
import { mapProduct, pickLang } from '../api/mappers'
import { fetchStories } from '../redux/reducers/Stories'
import { fetchSettings } from '../redux/reducers/SettingsSlicer'
import CustomText from '../components/CustomText'
import { handleOnboard } from '../redux/reducers/Language'

const HomeScreen = ({ route, navigation }) => {
    // const isHomeScreen = route?.name === 'HomeScreen'
    // const isCategoryScreen = route?.name === 'CategoryScreen'

    const isCategoryScreen = route?.name === 'CategoryScreen' || route?.params?.isCategoryView === true;
    const isHomeScreen = route?.name === 'HomeScreen' && !route?.params?.isCategoryView;

    const dispatch = useDispatch()
    const { banners, featuredProducts, promotion, loading } = useSelector(s => s.home)
    const { allCategories, categoriesLoading } = useSelector(state => state.home,);
    const { stories, loading: storiesLoading, } = useSelector(state => state.stories);
    const { subCategories } = useSelector(state => state.home);
    const selectedCategory = useSelector(state => state.home.selectedCategoryId);
    const { subCategoryProducts, subCategoryProductsLoading, } = useSelector(state => state.home);

    const settings = useSelector(state => state.settings?.values);
    const lang = useSelector(s => s?.language?.language) || 'en'
    const get = pickLang(lang)

    const [selectedSubcategory, setSelectedSubCategory] = useState(null)
    const [subCatData, setSubCatData] = useState([])

    useEffect(() => {
        dispatch(fetchHome())
        dispatch(fetchStories());
        dispatch(fetchSettings());
        dispatch(fetchCategories());
    }, [dispatch])

    useEffect(() => {
        if (subCategories && subCategories.length > 0) {
            const firstSubCat = subCategories[0];
            const firstSubCatTitle = I18nManager.isRTL
                ? firstSubCat?.title_ar
                : firstSubCat?.title_en;

            setSelectedSubCategory(firstSubCatTitle);
        } else {
            setSelectedSubCategory(null);
        }
    }, [subCategories]);

    useEffect(() => {
        if (subCategories?.length > 0 && selectedSubcategory) {
            const activeSubCatObj = subCategories.find(item =>
                (I18nManager.isRTL ? item?.title_ar : item?.title_en) === selectedSubcategory
            );
            console.log('sdasda', activeSubCatObj)

            if (activeSubCatObj?.id) {
                dispatch(fetchSubCategoryProducts(activeSubCatObj.id));
            }
        }
    }, [selectedSubcategory, subCategories, dispatch]);



    const heroSubText = I18nManager.isRTL ? settings?.hero_subtitle_ar : settings?.hero_subtitle_en

    const heroText = I18nManager.isRTL
        ? settings?.hero_title_ar
        : settings?.hero_title_en;

    const words = heroText?.split(' ') || [];
    const lastWord = words.pop();
    const remainingText = words.join(' ');

    const carouselSlides = useMemo(
        () => banners.map(b => ({
            id: String(b.id),
            title: I18nManager.isRTL ? b.title_ar : b.title_en,
            image: b.image,
            target_type: b.target_type,
            category_id: b.category_id,
            product_id: b.product_id,
            badge: b.badge,
        })),
        [banners, lang],
    )


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
    );

    // const productItems = useMemo(
    //     () => featuredProducts.map(p => mapProduct(p, lang)),
    //     [featuredProducts, lang],
    // )


    const productItems = featuredProducts

    // const categoryProducts = useMemo(
    //     () => subCategoryProducts.map(p => mapProduct(p, lang)),
    //     [subCategoryProducts, lang]
    // );


    const categoryProducts = subCategoryProducts


    const productsToShow = isCategoryScreen
        ? categoryProducts
        : productItems;

    const selectedCat = categoryItems?.find((item) => item?.id == selectedCategory)

    return (
        <CustomScreenView>
            <HeaderBox logo isBack={false} threeLines cart />

            <View style={{ marginTop: -20, marginBottom: 10 }}>
                {isHomeScreen && <StatusHeader
                    data={stories}
                />}
            </View>

            {/* {isHomeScreen && (
                <TitleWithChangeColor
                    title={remainingText}
                    colorText={lastWord}
                    subTitle={heroSubText}
                    semiBold
                    style={{ width: '90%' }}
                    subTitleStyle={{ width: '80%', alignSelf: 'center' }}
                />
            )} */}


            {isCategoryScreen && <TitleViewAll title={'specialForYou'} extraLarge />}

           <View style={{marginHorizontal:-15,paddingLeft:10}}> 
             <CustomCarousel
                data={carouselSlides}
            />
           </View>

            <TitleViewAll
                title={'categories'}
                extraLarge
                viewAll
                viewPress={() => navigation.navigate('AllCategoriesScreen')}

            />

           <View style={{marginHorizontal:-15}}>
             {
                categoriesLoading ?
                    <View style={{ height: 100, justifyContent: "center" }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                    :
              
                     <CategoriesSection
                        data={categoryItems}
                        selectedCategory={selectedCategory}
                        setSubCatData={setSubCatData}
                    />
        

            }
           </View>


            {isHomeScreen && promotion && (
                <AdverismentCard
                    data={promotion}
                    headTitle={get(promotion, 'head_title') || 'specialOffer'}
                    discount={get(promotion, 'discount_text') || 'discount'}
                    subTitle={get(promotion, 'sub_title') || 'wallBoards'}
                />
            )}

            {isCategoryScreen && selectedCategory && (
                <SubCategories
                    data={subCategories}
                    title={selectedCat?.title}
                    setSelectedSubCategory={setSelectedSubCategory}
                    selectedSubcategory={selectedSubcategory}
                />
            )}

            {
                productsToShow?.length > 0 &&
                <TitleViewAll title={isCategoryScreen ? selectedSubcategory : ''} extraLarge />

            }

            {(isCategoryScreen
                ? subCategoryProductsLoading
                : loading) ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator color={colors.black} />
                </View>
            ) : (
                <ProductCardData data={productsToShow} />
            )}

        </CustomScreenView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    loadingBox: { paddingVertical: 30, alignItems: 'center' },
})
