import { useSelector } from 'react-redux';
import DirhamSymbol from '../components/DirhamSymbol'
export const GOOGLE_API = 'AIzaSyBJVhlenAMsRkF2yHARSey2mtIFEW2_rfo'

import { request, PERMISSIONS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import i18next from 'i18next';


export const currencySymbol = (currency, size, top, red) => {
    switch (currency) {
        case 'AED': return { type: 'component', value: <DirhamSymbol size={size} top={top} red={red} /> }
        case 'USD': return { type: 'text', value: '$' };
        case 'SYP': return { type: 'text', value: 'SYP' };
        default: return { type: 'text', value: 'SYP' }
    }
}

const conversionRates = {
    AED: 1,
    USD: 0.27,
    SYP: 3500,
};

export const useConvertPrice = () => {
    const rate = useSelector(
        state => state.settings?.values?.usd_to_syp_rate
    );

    return (price) => {
        const numericPrice = Number(String(price).replace(/,/g, ''));
        return Number((numericPrice * rate).toFixed(2));
    };
};
// export const subTotalCalculation = (data) => {
//     const subTotal = data?.reduce((total, item) => {
//         const price = item?.discountPrice ? item?.discountPrice : item?.price
//         return total + price * item?.quantity
//     }, 0)
//     return subTotal
// }

export const subTotalCalculation = (data) => {
    const subTotal = data?.reduce((total, item) => {
        const price = item?.discount_price ? item?.discount_price : item?.price
        return total + price * item?.quantity
    }, 0)
    return subTotal
}


// export const dollarSum = (data) => {
//     const total = data?.reduce((total, item) => (total + item?.usdEquivalent * item?.quantity), 0)
//     return total?.toFixed(2)
// }

export const dollarSum = (data) => {
    const total = data?.reduce((sum, item) => {
        return sum + (Number(item?.usdEquivalent) * Number(item?.quantity || 0));
    }, 0);

    return Number(total).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};


export const locationPermission = async () => {
    try {
        if (Platform.OS == 'ios') {
            const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            return result
        } else {
            const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            return result
        }
    } catch (error) {
        console.log('locationError', error)
    }
}


export const getAddressFromCoordinates = async (longitude, latitude) => {
    try {
        const apiKey = GOOGLE_API;
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        return data

    } catch (error) {
        console.log('error', error);
        return null;
    }
};



export const containsHtmlTags = (text = '') => {
    // detects any <tag> like HTML/XML
    return /<[^>]*>/g.test(text);
};

export const stripHtmlTags = (text = '') => {
    // removes all tags if user tries to paste them
    return text.replace(/<[^>]*>/g, '');
};

export const handleSafeInputChange = (text, setValue) => {
    const cleaned = text.replace(/[<>]/g, ''); // block tags instantly

    if (cleaned !== text) {
        showMessage({
            type: 'danger',
            message: 'Invalid input',
            description: 'HTML tags are not allowed',
        });
    }

    setValue(cleaned);
};

export const handleNoTagsInput = (text, setValue) => {
    const cleaned = text.replace(/[<>{}\[\]]/g, '');

    setValue(cleaned);
};

