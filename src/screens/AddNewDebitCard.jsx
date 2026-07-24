import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomScreenView from '../components/CustomScreenView';
import { saveCard as saveCardThunk } from '../redux/reducers/Payments';
import HeaderBox from '../components/HeaderBox';
import ShadowWrapper from '../components/ShadowWrapper';
import CustomText from '../components/CustomText';
import CustomButton from '../components/CustomButton';
import { colors } from '../constants/color';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';


const AddNewDebitCard = ({ route, navigation }) => {
    const {t} = useTranslation()

    const { screenName } = route?.params || ''
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [ccv, setCcv] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    const handleAddCard = async () => {
        const digits = cardNumber.replace(/\D/g, '')
        const [mm, yy] = (expiryDate || '').split('/')
        if (digits.length < 12 || !cardHolder || !mm || !yy || !ccv) {
           Alert.alert(t('missingFields'), t('fillAllCardFields'));
            return
        }
        if (!saveCard || !token) {
            navigation?.goBack?.()
            return
        }
        const res = await dispatch(saveCardThunk({
            card_number: digits,
            holder: cardHolder,
            expiry_month: parseInt(mm, 10),
            expiry_year: 2000 + parseInt(yy, 10),
            cvv: ccv,
            type: 'debit',
        }))
        if (saveCardThunk.fulfilled.match(res)) {
            Alert.alert('Saved', 'Card saved')
            navigation?.goBack?.()
        } else {
            Alert.alert('Failed', res.payload?.message || 'Could not save card')
        }
    };

    return (
        <CustomScreenView>
            <HeaderBox title={screenName ? screenName : 'cardDetail'} />

            <LinearGradient
                colors={['#0F172A', '#1E293B']}
                style={styles.cardPreview}
            >
                <View style={{ paddingTop: 25, paddingHorizontal: 20 }}>
                    <View style={styles.cardTop}>
                        <View style={styles.chipContainer}>
                            <MaterialCommunityIcons name="integrated-circuit-chip" size={35} color={colors.gray2} />
                        </View>
                        <CustomText style={styles.cardType}>VISA</CustomText>
                    </View>

                    <CustomText bold xxl style={styles.previewNumber} translate={false}>
                        {cardNumber ? cardNumber.replace(/\d{4}(?=.)/g, '$& ') : '••••  ••••  ••••  ••••'}
                    </CustomText>

                    <View style={styles.cardBottom}>
                        <View>
                            <CustomText gray xs style={styles.cardLabel}>Card Holder</CustomText>
                            <CustomText bold style={styles.whiteText}>{cardHolder || 'YOUR NAME'}</CustomText>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <CustomText gray xs style={styles.cardLabel}>Expires</CustomText>
                            <CustomText bold style={styles.whiteText}>{expiryDate || 'MM/YY'}</CustomText>
                        </View>
                    </View>
                </View>
            </LinearGradient>

            <View style={styles.form}>
                <CustomText bold gray style={styles.inputLabel}>Card Number</CustomText>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="1234 5678 9101 1213"
                        keyboardType="numeric"
                        maxLength={16}
                        onChangeText={setCardNumber}
                    />
                    <MaterialCommunityIcons name="pound" size={20} color={colors.gray} />
                </View>

                <CustomText bold gray style={styles.inputLabel}>Cardholder Name</CustomText>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="John Peter"
                        onChangeText={setCardHolder}
                    />
                    <Ionicons name="person-outline" size={20} color={colors.gray} />
                </View>

                <View style={styles.rowBetween}>
                    <View style={{ width: '48%' }}>
                        <CustomText bold gray style={styles.inputLabel}>Expiry Date</CustomText>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="MM/YY"
                                onChangeText={setExpiryDate}
                            />
                            <Ionicons name="calendar-outline" size={20} color={colors.gray} />
                        </View>
                    </View>
                    <View style={{ width: '48%' }}>
                        <CustomText bold gray style={styles.inputLabel}>CCV</CustomText>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="123"
                                keyboardType="numeric"
                                maxLength={3}
                                onChangeText={setCcv}
                            />
                            <Ionicons name="lock-closed-outline" size={20} color={colors.gray} />
                        </View>
                    </View>
                </View>

                <ShadowWrapper style={styles.checkboxWrapper}>
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setSaveCard(!saveCard)}
                    >

                        <View style={{}}>
                            <CustomText bold s>Save card for future use</CustomText>
                            <CustomText gray xxs>حفظ البطاقة للاستخدام المستقبلي</CustomText>
                        </View>
                        <View style={[styles.checkbox, saveCard && styles.checked]}>
                            {saveCard && <Ionicons name="checkmark" size={16} color={colors.white} />}
                        </View>
                    </TouchableOpacity>
                </ShadowWrapper>

                <CustomButton
                    title="Add Card"
                    increaseHeight
                    style={styles.submitBtn}
                    onPress={handleAddCard}
                />
            </View>
        </CustomScreenView>
    );
};

export default AddNewDebitCard;

const styles = StyleSheet.create({
    container: { padding: 20 },
    cardPreview: {
        height: 200,
        borderRadius: 10,
        marginBottom: 30,
        marginTop: 20
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    chipContainer: {
        width: 45,
        height: 35,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardType: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 'bold',
        fontSize: 16
    },
    previewNumber: {
        color: colors.white,
        letterSpacing: 2,
        marginVertical: 20,
        textAlign: 'center'
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardLabel: {
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 4
    },
    whiteText: {
        color: colors.white
    },
    form: {

    },
    inputLabel: { marginBottom: 5 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 55
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.black
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    checkboxWrapper: {
        backgroundColor: colors.white,
        borderRadius: 12,
        marginTop: 10,
        padding: 15
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between"
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    checked: {
        backgroundColor: colors.blue,
        borderColor: colors.blue
    },
    submitBtn: {
        backgroundColor: '#0F172A',
        marginTop: 10
    }
});