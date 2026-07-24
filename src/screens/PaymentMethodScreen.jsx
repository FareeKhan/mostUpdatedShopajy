import { StyleSheet, View, TouchableOpacity, I18nManager, ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import CustomScreenView from '../components/CustomScreenView'
import ShadowWrapper from '../components/ShadowWrapper'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import BorderLine from '../components/BorderLine'
import CustomButton from '../components/CustomButton'
import PriceWithUsdValue from '../components/PriceWithUsdValue'
import { dollarSum, subTotalCalculation } from '../constants/helper'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { fetchPaymentMethods } from '../redux/reducers/Payments'
import { addCartRemote, clearCartRemote, getShippingQuote, fetchShippingMethods } from '../redux/reducers/CartProduct'
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next'
import { fetchAddressesRemote } from '../redux/reducers/StoreAddress'
import AddressSection from '../components/AddressCard'

const PaymentMethodScreen = ({ route }) => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const token = useSelector(s => s?.auth?.token)
  const addresses = useSelector(s => s?.address?.address) || []
  const cartData = useSelector((state) => state.cart.cart)
  const methods = useSelector(s => s?.payments?.methods)
  const lang = useSelector(s => s?.language?.language) || 'en'

  const coupon = useSelector(s => s?.checkout?.coupon)
  const shippingQuote = useSelector(s => s?.cart?.shippingQuote)
  const shippingLoading = useSelector(s => s?.cart?.shippingLoading)

  const shippingMethodsData = useSelector(s => s?.cart?.shippingMethodsData)
  const shippingMethodsLoading = useSelector(s => s?.cart?.shippingMethodsLoading)

  const [shippingMethod, setShippingMethod] = useState(null)
  const [selectedMethod, setSelectedMethod] = useState(null)

  const subTotal = subTotalCalculation(cartData)
  const shippingAmount = Number(shippingQuote?.amount || 0)
  const discount = Math.min(Number(coupon?.discount_amount || 0), subTotal)
  const total = Math.max(subTotal + shippingAmount - discount, 0)

  useEffect(() => {
    dispatch(fetchPaymentMethods())
    dispatch(fetchShippingMethods())
    dispatch(fetchAddressesRemote())
  }, [dispatch])


  console.log('addresses11111', addresses)



  const availableMethods = useMemo(() => {
    if (!shippingMethodsData || addresses.length === 0) {
      return { door_to_door: null, al_qadmus: null };
    }

    const defaultAddress = addresses.find(addr => addr.is_default) || addresses[0];
    const targetAreaId = defaultAddress?.area_id;

    if (!targetAreaId) return { door_to_door: null, al_qadmus: null };

    const findAreaIdInTree = (treeData) => {
      if (!Array.isArray(treeData)) return null;
      for (const gov of treeData) {
        if (gov?.cities) {
          for (const city of gov.cities) {
            if (city?.areas) {
              for (const area of city.areas) {
                if (area?.id === targetAreaId) {
                  return area.id;
                }
              }
            }
          }
        }
      }
      return null;
    };

    return {
      door_to_door: findAreaIdInTree(shippingMethodsData?.door_to_door),
      al_qadmus: findAreaIdInTree(shippingMethodsData?.al_qadmus)
    };
  }, [shippingMethodsData, addresses]);

  useEffect(() => {
    if (!shippingMethod) {
      if (availableMethods.door_to_door) {
        setShippingMethod('door_to_door');
      } else if (availableMethods.al_qadmus) {
        setShippingMethod('al_qadmus');
      }
    }
  }, [availableMethods, shippingMethod]);

  useEffect(() => {
    if (shippingMethod && availableMethods[shippingMethod] && cartData.length > 0) {
      const totalWeight = cartData.reduce((acc, item) => acc + (Number(item.weight || 0) * item.quantity), 0);
      const productIds = cartData.map(item => item.id);

      const payload = {
        area_id: availableMethods[shippingMethod],
        subtotal: subTotal,
        product_ids: productIds,
        method: shippingMethod,
      };

      if (totalWeight > 0) {
        payload.weight = totalWeight;
      }

      dispatch(getShippingQuote(payload));
    }
  }, [shippingMethod, availableMethods, cartData, dispatch, subTotal]);


  useEffect(() => {
    const syncCart = async () => {
      if (!token || cartData.length === 0) return;
      await dispatch(clearCartRemote());
      for (const item of cartData) {
        await dispatch(addCartRemote({
          product_id: item.id,
          color: item.color?.label || null,
          size: item.size?.label || null,
          quantity: item.quantity,
          product_variant_id: item.variantId,
        }));
      }
    };
    syncCart();
  }, []);

  useEffect(() => {
    if (!selectedMethod && methods?.length) setSelectedMethod(methods[1].id)
  }, [methods, selectedMethod])

  const renderIcon = (library, name, color) => {
    switch (library) {
      case 'MaterialCommunityIcons': return <MaterialCommunityIcons name={name} size={24} color={color} />;
      case 'FontAwesome5': return <FontAwesome5 name={name} size={22} color={color} />;
      case 'Ionicons': return <Ionicons name={name} size={24} color={color} />;
      default: return null;
    }
  };

  const handlePayment = () => {
    if (addresses?.length == 0) {
      showMessage({ type: 'warning', message: t('PleaseAdddADdress') })
      navigation.navigate('AddNewAddressScreen')
      return
    }

    const method = (methods || []).find(m => m.id === selectedMethod)
    const checkoutParams = { shippingMethod, shippingQuote };

    switch (method?.code) {
      case 'sham_cash': return navigation.navigate('ShamCashScreen', checkoutParams)
      case 'cod': return navigation.navigate('CashOnDeliveryScreen', checkoutParams)
      case 'card': return navigation.navigate('CardPaymentScreen', checkoutParams)
      case 'apple_pay': return navigation.navigate('ApplePayScreen', checkoutParams)
      default: return
    }
  }

  const handleShippingChange = (methodType) => {
    if (shippingLoading) return;
    setShippingMethod(methodType);
  };

  const selectedAddress = addresses?.find((item) => item?.is_default)


  // "Choose Address":"Choose Address",
  // "Saved Address":"Saved Address",

  return (
    <CustomScreenView>


      <View style={styles.headerTextContainer}>
        <CustomText style={styles.mainTitle} bold xxxl>Choose Address</CustomText>
      </View>

      <CustomText bold gray21 style={{ marginBottom: 8, paddingHorizontal: 4 }}>
        Saved Address
      </CustomText>

      <AddressSection />


      <View style={styles.headerTextContainer}>
        <CustomText style={styles.mainTitle} bold xxxl>Select Payment Method</CustomText>
      </View>




      <CustomText bold gray21 style={{ marginBottom: 8, paddingHorizontal: 4 }}>
        Shipping Method
      </CustomText>

      {shippingMethodsLoading ? (
        <View style={styles.loaderSpacing}>
          <ActivityIndicator size="small" color={colors.secondary} />
        </View>
      ) : (
        <View style={styles.shippingToggleContainer}>
          {!!availableMethods.door_to_door && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.toggleButton, shippingMethod === 'door_to_door' && styles.activeToggle]}
              onPress={() => handleShippingChange('door_to_door')}
            >
              <MaterialCommunityIcons
                name="truck-delivery"
                size={20}
                color={shippingMethod === 'door_to_door' ? '#FFF' : colors.gray23}
              />
              <CustomText bold style={[styles.toggleText, shippingMethod === 'door_to_door' && styles.activeToggleText]}>
                Door to Door
              </CustomText>
            </TouchableOpacity>
          )}

          {!!availableMethods.al_qadmus && (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.toggleButton, shippingMethod === 'al_qadmus' && styles.activeToggle]}
              onPress={() => handleShippingChange('al_qadmus')}
            >
              <FontAwesome5
                name="box-open"
                size={18}
                color={shippingMethod === 'al_qadmus' ? '#FFF' : colors.gray23}
              />
              <CustomText bold style={[styles.toggleText, shippingMethod === 'al_qadmus' && styles.activeToggleText]}>
                Al Qadmus
              </CustomText>
            </TouchableOpacity>
          )}



          {/* {!availableMethods.door_to_door && !availableMethods.al_qadmus && (
            <View style={styles.unsupportedContainer}>
              <CustomText bold style={styles.unsupportedText}>
                {lang === 'ar' ? 'عذراً، الشحن غير متوفر لهذه المنطقة الحالية' : 'Sorry, delivery is unavailable for this location'}
              </CustomText>
            </View>
          )} */}
        </View>
      )}


      <CustomText bold gray21 style={{ marginBottom: 8, marginTop: 20, paddingHorizontal: 4 }}>
        Address
      </CustomText>

      <View style={{ flexDirection: "row", alignItems: "center", }}>
        {
          selectedAddress?.type == 'home' ?
            <Ionicons name={'home-outline'} size={20} color={colors.secondary} />
            :
            <Entypo name={'text-document'} size={20} color={colors.secondary} />
        }

        <CustomText style={{ marginLeft: 15, marginRight: 4 }} l semiBold>{selectedAddress?.type}</CustomText>
        <CustomText style={{ marginRight: 10 }} semiBold l >-</CustomText>
        <CustomText medium>{selectedAddress?.full_address}</CustomText>
      </View>


      {/* Total Amount Card */}
      <ShadowWrapper style={{ marginBottom: 12 }}>
        <View style={styles.innetTotalBox}>
          <CustomText bold gray21>totalAmount</CustomText>
          {shippingLoading ? (
            <ActivityIndicator size="small" color={colors.secondary} />
          ) : (
            <View style={{ alignItems: 'flex-end' }}>
              <PriceWithUsdValue
                price={total?.toLocaleString()}
                usdPrice={dollarSum(cartData)}
                approxPrice
              />

              {shippingQuote?.charge_mode === 'collected' && (
                <CustomText s bold style={{ color: colors.orange3, marginTop: 4 }}>
                  {lang === 'ar'
                    ? `يدفع للمكتب عند الاستلام: $${shippingQuote?.rate_displayed}`
                    : `Pay carrier on delivery: $${shippingQuote?.rate_displayed}`
                  }

                </CustomText>
              )}
            </View>
          )}
        </View>


        {
          shippingQuote?.amount &&
          <View style={[styles.innetTotalBox, { marginTop: 10 }]}>
            <CustomText bold gray21>shippingFee</CustomText>
            <PriceWithUsdValue
              price={shippingQuote?.amount?.toLocaleString()}
            />

          </View>
        }


      </ShadowWrapper>



      {/* 
      <CustomText bold gray21 style={{ marginTop: 15, marginBottom: 5, paddingHorizontal: 4 }}>
        {lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
      </CustomText> */}

      {(methods?.filter((item) => item?.code) || []).map((item) => {
        const title = lang === 'ar' ? item.title_ar : item.title_en
        const sub = lang === 'ar' ? item.subtitle_ar : item.subtitle_en
        const feeLabel = lang === 'ar' ? item.fee_label_ar : item.fee_label_en
        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() => setSelectedMethod(item.id)}
            style={{ marginBottom: 12 }}
          >
            <ShadowWrapper style={[
              styles.methodCard,
              selectedMethod === item.id && styles.selectedBorder
            ]}>
              <View style={styles.methodTopRow}>
                <View style={{ flex: 1 }}>
                  <CustomText translate={false} bold xl style={{ color: colors.gray23 }}>{title}</CustomText>
                  <CustomText translate={false} s gray21 style={{ marginTop: 4 }}>{sub}</CustomText>
                </View>
                <View style={[styles.iconContainer, { backgroundColor: item.icon_bg }]}>
                  {renderIcon(item.icon_library, item.icon_name, item.icon_color)}
                </View>
              </View>
              <BorderLine centerLine mv />
              <View style={styles.methodBottomRow}>
                <CustomText translate={false} s gray21>{feeLabel}</CustomText>
                <CustomText translate={false} bold s style={{ color: item.fee_value === 'free' ? colors.green1 : colors.orange3 }}>
                  {/* {item.fee_value} */}
                  free
                </CustomText>
              </View>
            </ShadowWrapper>
          </TouchableOpacity>
        )
      })}

      <CustomButton
        title={selectedMethod == 2 ? "Complete" : 'proceedPayment'}
        increaseHeight
        style={{ marginVertical: 25 }}
        onPress={handlePayment}
      />

      <CustomButton
        title={'back'}
        increaseHeight
        transparent
        onPress={() => navigation.goBack()}
      />
    </CustomScreenView>
  )
}

export default PaymentMethodScreen

const styles = StyleSheet.create({
  headerTextContainer: { alignItems: 'center', marginVertical: 20 },
  mainTitle: { color: colors.gray23, fontSize: 26 },
  subTitleAr: { marginTop: 5 },
  shippingToggleContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  toggleButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: colors.gray14, backgroundColor: '#FFF', gap: 8 },
  activeToggle: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  toggleText: { color: colors.gray23, fontSize: 15 },
  activeToggleText: { color: '#FFF' },
  totalBox: {

    marginBottom: 10,
    paddingVertical: 25

  },
  innetTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  methodCard: { marginTop: 10, padding: 15, borderWidth: 2, borderColor: 'transparent' },
  selectedBorder: { borderColor: colors.secondary },
  methodTopRow: { flexDirection: 'row', alignItems: 'center', justifyxContent: 'space-between' },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  loaderSpacing: { paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  unsupportedContainer: { flex: 1, padding: 16, backgroundColor: '#FFF5F5', borderRadius: 12, borderWidth: 1, borderColor: '#FEB2B2', alignItems: 'center' },
  unsupportedText: { color: '#C53030', fontSize: 14, textAlign: 'center' },
  methodBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
})


// this code is working without shipping fine
// import { StyleSheet, View, TouchableOpacity, I18nManager } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import CustomScreenView from '../components/CustomScreenView'
// import ShadowWrapper from '../components/ShadowWrapper'
// import { colors } from '../constants/color'
// import CustomText from '../components/CustomText'
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
// import Ionicons from 'react-native-vector-icons/Ionicons'
// import BorderLine from '../components/BorderLine'
// import CustomButton from '../components/CustomButton'
// import PriceWithUsdValue from '../components/PriceWithUsdValue'
// import { dollarSum, subTotalCalculation } from '../constants/helper'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigation } from '@react-navigation/native'
// import { fetchPaymentMethods } from '../redux/reducers/Payments'
// import { addCartRemote, clearCartRemote } from '../redux/reducers/CartProduct'
// import { showMessage } from 'react-native-flash-message'
// import { useTranslation } from 'react-i18next'

// const PaymentMethodScreen = ({ route }) => {

//   const { t } = useTranslation()

//   const token = useSelector(s => s?.auth?.token)
//   const addresses = useSelector(s => s?.address?.address) || []

//   console.log('showmEssadada',addresses)



//   const navigation = useNavigation()
//   const dispatch = useDispatch()
//   const cartData = useSelector((state) => state.cart.cart)
//   const methods = useSelector(s => s?.payments?.methods)
//   const lang = useSelector(s => s?.language?.language) || 'en'


//   const coupon = useSelector(s => s?.checkout?.coupon)
//   const shippingQuote = useSelector(s => s?.checkout?.shipping)

//   const subTotal = subTotalCalculation(cartData)
//   const shippingAmount = Number(shippingQuote?.amount || 0)
//   const discount = Math.min(Number(coupon?.discount_amount || 0), subTotal)
//   const total = Math.max(subTotal + shippingAmount - discount, 0)

//   // useEffect(() => {
//   //   if (token) {
//   //     dispatch(addCartRemote({
//   //       product_id: id,
//   //       color: selectedColor || null,
//   //       size: selectedSize || null,
//   //       quantity: counter,
//   //     }))
//   //     Alert()
//   //   }
//   // }, [cartData])


//   useEffect(() => {
//     const syncCart = async () => {
//       if (!token || cartData.length === 0) return;

//       await dispatch(clearCartRemote());

//       for (const item of cartData) {
//         await dispatch(addCartRemote({
//           product_id: item.id,
//           color: item.color || null,
//           size: item.size || null,
//           quantity: item.quantity,
//         }));
//       }
//     };

//     syncCart();
//   }, []);


//   const [selectedMethod, setSelectedMethod] = useState(null);

//   useEffect(() => { dispatch(fetchPaymentMethods()) }, [dispatch])

//   useEffect(() => {
//     if (!selectedMethod && methods?.length) setSelectedMethod(methods[1].id)
//   }, [methods, selectedMethod])


//   const renderIcon = (library, name, color) => {
//     switch (library) {
//       case 'MaterialCommunityIcons':
//         return <MaterialCommunityIcons name={name} size={24} color={color} />;
//       case 'FontAwesome5':
//         return <FontAwesome5 name={name} size={22} color={color} />;
//       case 'Ionicons':
//         return <Ionicons name={name} size={24} color={color} />;
//       default:
//         return null;
//     }
//   };



//   const handlePayment = () => {

//     if (addresses?.length == 0) {
//       showMessage({
//         type: 'warning',
//         message: t('PleaseAdddADdress')
//       })

//       navigation.navigate('AddNewAddressScreen')

//       return
//     }



//     const method = (methods || []).find(m => m.id === selectedMethod)
//     switch (method?.code) {
//       case 'sham_cash': return navigation.navigate('ShamCashScreen')
//       case 'cod': return navigation.navigate('CashOnDeliveryScreen')
//       case 'card': return navigation.navigate('CardPaymentScreen')
//       case 'apple_pay': return navigation.navigate('ApplePayScreen')
//       default: return
//     }
//   }
//   return (
//     <CustomScreenView>

//       {/* Main Title Section */}
//       <View style={styles.headerTextContainer}>
//         {
//           I18nManager.isRTL ?
//             <CustomText style={styles.subTitleAr} bold gray xxxl> اختر طريقة الدفع</CustomText>

//             :
//             <CustomText style={styles.mainTitle} bold xxxl>Select Payment Method</CustomText>


//         }
//       </View>

//       {/* Total Amount Card */}
//       <ShadowWrapper style={styles.totalCard}>
//         <CustomText bold gray21>totalAmount</CustomText>
//         <PriceWithUsdValue
//           price={total?.toLocaleString()}
//           usdPrice={dollarSum(cartData)}
//           approxPrice
//         />

//       </ShadowWrapper>

//       {/* Payment Methods List */}
//       {(methods?.filter((item) => item?.code == 'cod') || []).map((item) => {
//         const title = lang === 'ar' ? item.title_ar : item.title_en
//         const sub = lang === 'ar' ? item.subtitle_ar : item.subtitle_en
//         const feeLabel = lang === 'ar' ? item.fee_label_ar : item.fee_label_en
//         return (
//           <TouchableOpacity
//             key={item.id}
//             activeOpacity={0.8}
//             onPress={() => setSelectedMethod(item.id)}
//           >
//             <ShadowWrapper style={[
//               styles.methodCard,
//               selectedMethod === item.id && styles.selectedBorder
//             ]}>
//               <View style={styles.methodTopRow}>
//                 <View style={{ flex: 1 }}>
//                   <CustomText translate={false} bold xl style={{ color: colors.gray23 }}>{title}</CustomText>
//                   <CustomText translate={false} s gray21 style={{ marginTop: 4 }}>{sub}</CustomText>
//                 </View>
//                 <View style={[styles.iconContainer, { backgroundColor: item.icon_bg }]}>
//                   {renderIcon(item.icon_library, item.icon_name, item.icon_color)}
//                 </View>
//               </View>

//               <BorderLine centerLine mv />

//               {/* <View style={styles.methodBottomRow}>
//                 <CustomText translate={false} s gray21>{feeLabel}</CustomText>
//                 <CustomText translate={false} bold s style={{ color: item.fee_value === 'free' ? colors.green1 : colors.orange3 }}>
//                   {item.fee_value}
//                 </CustomText>
//               </View> */}
//             </ShadowWrapper>
//           </TouchableOpacity>
//         )
//       })}


//       <CustomButton
//         title={'proceedPayment'}
//         increaseHeight
//         style={{ marginVertical: 25 }}
//         onPress={handlePayment}

//       />

//       <CustomButton
//         title={'back'}
//         increaseHeight
//         transparent
//         onPress={() => navigation.goBack()}
//       />
//     </CustomScreenView>
//   )
// }

// export default PaymentMethodScreen

// const styles = StyleSheet.create({
//   scrollContainer: {
//     paddingHorizontal: 20,
//     paddingBottom: 30,
//   },
//   headerTextContainer: {
//     alignItems: 'center',
//     marginVertical: 20,
//   },
//   mainTitle: {
//     color: colors.gray23,
//     fontSize: 26,
//   },
//   subTitleAr: {
//     marginTop: 5,
//   },
//   totalCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     paddingVertical: 25,
//   },
//   methodCard: {
//     marginTop: 15,
//     padding: 15,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   selectedBorder: {
//     borderColor: colors.secondary,
//   },
//   methodTopRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   iconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: colors.gray14,
//     marginVertical: 15,
//   },
//   methodBottomRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   }
// })