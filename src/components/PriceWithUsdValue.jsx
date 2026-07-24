import { StyleSheet, View } from 'react-native'
import CustomText from '../components/CustomText'
import PriceComp from './PriceComp'
import { useConvertPrice } from '../constants/helper'

const PriceWithUsdValue = ({ textEnd, price, approxPrice,discountSymbol, themeColor,priceText ,approxColor}) => {

    const convertPrice = useConvertPrice();
    const finalPrice = convertPrice(price);

    return (
        <View style={textEnd && { alignItems: 'flex-end' }}>


            {
                price == 'free' ?
                    <CustomText style={themeColor} medium>free</CustomText>
                    :

                    <>
                        {
                            approxPrice ?
                                <PriceComp
                                    discountPrice={price}
                                    equalent={finalPrice}
                                    discountCont={{ marginLeft: "auto" }}
                                    discountStyle={priceText}
                                    approxColor={approxColor}
                                    discountSymbol={discountSymbol}
                                />
                                :
                                <PriceComp
                                    discountPrice={price}
                                              discountStyle={priceText}
                                    approxColor={approxColor}
                                    discountSymbol={discountSymbol}

                                />

                        }

                    </>
            }

        </View>
    )
}

export default PriceWithUsdValue

const styles = StyleSheet.create({})