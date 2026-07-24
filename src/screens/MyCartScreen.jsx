import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import CartData from '../components/CartData'
import { colors } from '../constants/color'
import TitleViewAll from '../components/TitleViewAll'
import RecentlyViewed from '../components/RecentlyViewed'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import LabelValue from '../components/LabelValue'
import { fonts } from '../constants/fonts'
import BorderLine from '../components/BorderLine'
import { useDispatch, useSelector } from 'react-redux'
import { dollarSum, subTotalCalculation } from '../constants/helper'
import { useNavigation } from '@react-navigation/native'
import { showMessage } from 'react-native-flash-message'
import i18next from 'i18next'
import { clearCartRemote, emptyCart, fetchCartRemote } from '../redux/reducers/CartProduct'
import { fetchHome } from '../redux/reducers/Home'
import { mapProduct } from '../api/mappers'
import { clearCoupon, fetchShippingQuote, validateCoupon } from '../redux/reducers/Checkout'

const MyCartScreen = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const cartData = useSelector((state) => state.cart.cart)
  const token = useSelector(s => s?.auth?.token)
  const featuredProducts = useSelector(s => s?.home?.featuredProducts)
  const lang = useSelector(s => s?.language?.language) || 'en'
  const coupon = useSelector(s => s?.checkout?.coupon)
  const validatingCoupon = useSelector(s => s?.checkout?.validatingCoupon)
  const shippingQuote = useSelector(s => s?.checkout?.shipping)
  const isCheckDataInCart = cartData?.length > 0
  const [promoError, setPromoError] = useState('');
  const [promoCode, setPromoCode] = useState('')

  const subTotal = subTotalCalculation(cartData)
  const shippingAmount = Number(shippingQuote?.amount || 0)
  const discount = Math.min(Number(coupon?.discount_amount || 0), subTotal)
  const total = Math.max(subTotal + shippingAmount - discount, 0)

  // useEffect(() => {
  //   if (token) dispatch(fetchCartRemote())
  // }, [token, dispatch])

  useEffect(() => {
    if (isCheckDataInCart) dispatch(fetchShippingQuote({ subtotal: subTotal }))
  }, [isCheckDataInCart, subTotal, dispatch])

  useEffect(() => {
    if (!featuredProducts || featuredProducts.length === 0) dispatch(fetchHome())
  }, [featuredProducts, dispatch])

  useEffect(() => {
    if (coupon?.code && subTotal > 0) {
      dispatch(validateCoupon({ code: coupon.code, subtotal: subTotal }))
        .then((res) => {
          if (validateCoupon.rejected.match(res) || !res.payload?.valid) {
            dispatch(clearCoupon());
            setPromoError(i18next.t('promoInvalid', { defaultValue: 'Coupon no longer applicable' }));
          }
        });
    }
  }, [subTotal, dispatch]);

  // const recentlyViewed = useMemo(
  //   () => (featuredProducts || []).map(p => mapProduct(p, lang)),
  //   [featuredProducts, lang],
  // )

  const recentlyViewed = featuredProducts

  const cartIds = new Set(cartData.map(item => item.id));
  const uniqueData = (recentlyViewed || []).filter(item => !cartIds.has(item.id));

  const handlePromoCode = async () => {

    setPromoError('');

    if (promoCode == '') {
      showMessage({
        type: 'danger',
        message: i18next.t('pleaseEnterPromo'),
      })
      return
    }
    const res = await dispatch(validateCoupon({ code: promoCode.trim(), subtotal: subTotal }))
    if (validateCoupon.fulfilled.match(res) && res.payload?.valid) {
      setPromoCode('')
      showMessage({
        type: 'success',
        message: i18next.t('promoApplied'),
      })
    } else {
      dispatch(clearCoupon())
      // showMessage({
      //   type: 'danger',
      //   message: res.payload?.message || i18next.t('promoInvalid', { defaultValue: 'Invalid or expired promo code' }),
      // })

      const errorMsg = res.payload?.message || i18next.t('promoInvalid', { defaultValue: 'Invalidsdsd or expired promo code' });
      setPromoError(errorMsg);
    }
  }

  const handleRemovePromoCode = () => {
    dispatch(clearCoupon())
    setPromoCode('')
    setPromoError('')
    showMessage({
      type: 'success',
      message: i18next.t('promoRemoved', { defaultValue: 'Promo code removed' }),
    })
  }

  console.log('dasdas', coupon?.code)


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <CustomScreenView style={{ backgroundColor: 'red', flex: 1 }} >
        <HeaderBox
          title={'ShoppingCart'}
        />

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20, marginBottom: 10 }}>
          <CustomText xxl medium>ShoppingCart</CustomText>
          <View style={{ paddingHorizontal: 12, paddingVertical: 2, backgroundColor: colors.secondary, borderRadius: 10 }}>
            <CustomText s medium>{isCheckDataInCart > 0 ? cartData?.length : 0}</CustomText>
          </View>
        </View>

        <CartData
          data={cartData}
        />

        <BorderLine centerLine style={{ height: 0.8, marginTop: 15, marginBottom: 10 }} />

        {
          uniqueData?.length > 0 &&
          <TitleViewAll
            title={'recentlyView'}
          />
        }

        <RecentlyViewed
          data={uniqueData}

        />

      </CustomScreenView>

      {
        isCheckDataInCart &&
        <>
          <BorderLine style={{ height: 0.8, }} />

          <View style={styles.container}>
            <View style={styles.rowTop}>
              <CustomInput
                placeholder={'promoCode'}
                style={styles.input}
                borderInput
                inputContainer={styles.inputContainer}
                value={promoCode}
                onChangeText={setPromoCode}
              />
              {coupon ? (
                <CustomButton
                  title={'remove'}
                  style={[styles.applyButton, { backgroundColor: colors.red }]}
                  textStyle={[styles.applyText, { color: colors.white }]}
                  onPress={handleRemovePromoCode}
                />
              ) : (
                <CustomButton
                  title={validatingCoupon ? 'loading' : 'apply'}
                  style={[styles.applyButton, validatingCoupon || !!coupon && { backgroundColor: colors.gray }]}
                  textStyle={styles.applyText}
                  disabled={validatingCoupon || !!coupon}
                  onPress={handlePromoCode}

                />

              )}
            </View>

            <CustomText translate={false} xs style={{ marginTop: 5, color: !!promoError ? colors.red : colors.white, paddingLeft: 4 }}>
              {promoError}
            </CustomText>


            <View style={{ marginTop: 10 }}>

              <LabelValue
                label={'subTotal'}
                value={subTotal?.toLocaleString()}
              />
            </View>


              {
              !!coupon &&
              <LabelValue
                label={'code'}
                value={`${coupon?.code}`}
                percentageStyle={{ color: 'red' }}
                percentage
              />
            }

            {
              !!coupon &&
              <LabelValue
                label={'discountLabel'}
                value={`-${discount}`}
                priceText={{ color: 'red' }}
                discountSymbol={{ color: 'red' }}
              />
            }


          

            <LabelValue
              label={'shipping'}
              value={shippingAmount > 0 ? shippingAmount : '0'}
              percentage
            />


            <BorderLine centerLine style={styles.borderLine} />

            <LabelValue
              label={'total'}
              value={total?.toLocaleString()}
              black
              style={styles.totalText}
              usdPrice={dollarSum(cartData)}
              approxPrice
              approxColor={{ color: colors.gray20,fontFamily: fonts.regular }}
            />

            <View style={styles.rowBottom}>
              <CustomButton
                title={'proceed'}
                style={styles.bottomButton}
                textStyle={styles.bottomText}
                onPress={() => {
                  if (!token) {
                    showMessage({ type: 'warning', message: 'Please login to place an order' })
                    navigation.navigate('LoginScreen')
                    return
                  }
                  navigation.navigate('PaymentMethodScreen')
                }}
              />

              {/* <CustomButton
                title={'emptyState'}
                style={styles.bottomButton}
                textStyle={styles.bottomText}
                onPress={() => {
                  dispatch(emptyCart())
                  if (token) dispatch(clearCartRemote())
                }}
              /> */}
            </View>
          </View>

        </>
      }




    </KeyboardAvoidingView>
  )
}

export default MyCartScreen

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "73%",
    borderRadius: 10,
    marginTop: 0,
    backgroundColor: 'red',
  },
  inputContainer: {
    height: 45,
    backgroundColor: colors.gray28,
  },
  applyButton: {
    width: "25%",
    height: 45,
    backgroundColor: colors.secondary,
  },
  applyText: {
    fontFamily: fonts.semiBold,
    color: colors.black,
    fontSize: 17
  },
  borderLine: {
    marginBottom: 10,
  },
  totalText: {
    fontFamily: fonts.semiBold,
  },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 15,
  },
  bottomButton: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: colors.gray23,
    height: 50,
  },
  bottomText: {
    fontSize: 17,
  },
});