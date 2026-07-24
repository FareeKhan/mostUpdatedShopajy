import { I18nManager } from "react-native";

export const fonts = {
    light:I18nManager.isRTL ?'Cairo-Light' :'Roboto-Light',
    regular:I18nManager.isRTL ?'Cairo-Regular' :'Roboto-Regular',
    medium:I18nManager.isRTL ?'Cairo-Medium' :'Roboto-Medium',
    semiBold:I18nManager.isRTL ?'Cairo-SemiBold' :'Roboto-SemiBold',
    bold:I18nManager.isRTL ?'Cairo-Bold' :'Roboto-Bold',
    black:I18nManager.isRTL ?'Cairo-Black' :'Roboto-Black',

}