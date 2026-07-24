import { StyleSheet, View, Image } from 'react-native'
import CustomText from '../components/CustomText'
import { colors } from '../constants/color'
import i18next from 'i18next'
import CustomButton from './CustomButton'
import { height } from '../constants/data'

const EmptyData = ({ imagePath, title, colorText, subTitle, semiBold, style,button,containerStyle,bold,onPress,arrow}) => {
    return (
        <View style={containerStyle}>
            {/* <Image source={require('../assets/images/emptyCart.png')} /> */}
            {
                imagePath &&
                <View style={{ alignSelf: "center" }}>
                    <Image source={imagePath} />
                </View>
            }


            <View style={{ }}>
                <View style={[{ alignSelf: "center", marginTop: 30 }, style]}>
                    <CustomText translate={false} style={{ textAlign: 'center', fontSize: 26 ,lineHeight:40}} semiBold={semiBold} bold={bold}>{i18next.t(title)} <CustomText translate={false} style={{ fontSize: 26, color: colors.secondary }} semiBold={semiBold} bold={bold}>{i18next.t(colorText)}</CustomText></CustomText>
                </View>

                <View style={[{ marginTop: 18, marginBottom: 15,alignSelf:"center" },style]} >
                    <CustomText style={{ textAlign: 'center', color: colors.gray21, }} s semiBold={semiBold} bold>{subTitle}</CustomText>
                </View>
            </View>


            {
                button &&
                <CustomButton
                    title={'exploreCategory'}
                    style={{ borderRadius: 50, width: "75%", alignSelf: "center",height:45 ,marginTop:20}}
                    arrow={arrow}
                    onPress={onPress}
                />
            }
        </View>
    )
}

export default EmptyData

const styles = StyleSheet.create({})