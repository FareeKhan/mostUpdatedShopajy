import React from 'react';
import CustomText from '../components/CustomText';
import { currencySymbol } from '../constants/helper';
import { useSelector } from 'react-redux';

const PriceSymbol = ({ size = 16, style, top, red }) => {
    const currency = useSelector((state) => state?.currency?.currency)
    // const symbol = currencySymbol("SYP", size, top, red);
    const symbol = currencySymbol("USD", size, top, red);

    if (symbol.type === 'component') return symbol.value;
    return <CustomText style={style}>{symbol.value}</CustomText>;
};

export default PriceSymbol;