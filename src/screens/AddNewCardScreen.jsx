
import React, { useState } from 'react';
import { Alert, StyleSheet, View, TouchableOpacity, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CustomScreenView from '../components/CustomScreenView';
import { saveCard as saveCardThunk } from '../redux/reducers/Payments';
import ShadowWrapper from '../components/ShadowWrapper';
import CustomText from '../components/CustomText';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors } from '../constants/color';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { showMessage } from 'react-native-flash-message';
import i18next from 'i18next';
import { handleNoTagsInput } from '../constants/helper';
import { useTranslation } from 'react-i18next';
const AddNewCardScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const {t} = useTranslation()
    const token = useSelector(s => s?.auth?.token)
    const [saveCard, setSaveCard] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [ccv, setCcv] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleAddCard = async () => {
        const digits = cardNumber.replace(/\D/g, '')
        const [mm, yy] = (expiryDate || '').split('/')
        if (digits.length < 12 || !cardHolder || !mm || !yy || !ccv) {
         Alert.alert(t('missingFields'), t('fillAllCardFields'));
            return
        }
        if (!saveCard || !token) {
            showMessage({
                type: 'danger',
                message: i18next.t('loginRequired'),
                description: i18next.t('PleaseLogin'),
            });
            navigation.goBack()
            return
        }
        const res = await dispatch(saveCardThunk({
            card_number: digits,
            holder: cardHolder,
            expiry_month: parseInt(mm, 10),
            expiry_year: 2000 + parseInt(yy, 10),
            cvv: ccv,
            type: 'credit',
        }))
        if (saveCardThunk.fulfilled.match(res)) {
            navigation.goBack()
        } else {
            Alert.alert('Failed', res.payload?.message || 'Could not save card')
        }
    };

const handleExpiryChange = (text) => {
    let cleanText = text.replace(/\D/g, '');

    if (cleanText.length > 0) {
        if (cleanText[0] !== '0' && cleanText[0] !== '1') {
            cleanText = '0' + cleanText;
        }
        if (cleanText.length === 2 && cleanText[0] === '1') {
            if (!['0', '1', '2'].includes(cleanText[1])) {
                cleanText = cleanText[0];
            }
        }
    }

    // 🌟 Max 12 Years Validation Logic
    if (cleanText.length >= 4) {
        const inputMonth = parseInt(cleanText.slice(0, 2), 10);
        const inputYearShort = parseInt(cleanText.slice(2, 4), 10);
        
        const currentYearFull = new Date().getFullYear(); // 2026
        const maxYearFull = currentYearFull + 12; // 2038
        const maxYearShort = maxYearFull % 100; // 38

        if (inputYearShort > maxYearShort) {
            // Drop the invalid trailing year digit
            cleanText = cleanText.slice(0, 3);
        }
    }

    if (cleanText.length >= 3) {
        setExpiryDate(`${cleanText.slice(0, 2)}/${cleanText.slice(2, 4)}`);
    } else {
        setExpiryDate(cleanText);
    }
};
    const handleDateConfirm = (event, selectedDate) => {
        if (Platform.OS === 'android' || event.type === 'set') {
            setShowDatePicker(false);
        }

        if (selectedDate && event.type !== 'dismissed') {
            const currentYear = new Date().getFullYear();
            // Fallback protection check
            if (selectedDate.getFullYear() > currentYear + 12) {
                Alert.alert('Invalid Date', 'Expiry year cannot be more than 12 years ahead.');
                return;
            }

            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = String(selectedDate.getFullYear()).slice(-2);
            setExpiryDate(`${month}/${year}`);
        }
    };

    const openCalendar = () => {
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 12); // Maximum 12 years ahead

        if (Platform.OS === 'android') {
            DateTimePickerAndroid.open({
                value: new Date(),
                mode: 'date',
                display: 'calendar',
                minimumDate: new Date(),
                maximumDate: maxDate, // 👈 Restricts Android Picker navigation
                onChange: handleDateConfirm,
            });
        } else {
            setShowDatePicker(true);
        }
    };
    return (
        <CustomScreenView>

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



            <ShadowWrapper style={styles.formCard}>
                <CustomInput
                    label="Card Number"
                    placeholder="1234 5678 9101 12"
                    keyboardType="numeric"
                    borderInput
                    maxLength={16}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    rightIcon={<FontAwesome name="hashtag" size={18} color={colors.gray23} />}
                />


                <CustomInput
                    label="Cardholder Name"
                    placeholder="John Peter"
                    borderInput
                    rightIcon={<Feather name="user" size={18} color={colors.gray23} />}
                    value={cardHolder}
                    onChangeText={(text) => handleNoTagsInput(text, setCardHolder)}

                    maxLength={25}
                />

                <View style={styles.row}>
                    <View style={{ flex: 1 }}>
                        {/* <CustomInput
                            label="Expiry Date"
                            placeholder="MM/YY"
                            borderInput
                            rightIcon={<MaterialIcons name="date-range" size={18} color={colors.gray23} style={{ right: 10 }} />}
                        /> */}
                        <CustomInput
                            label="Expiry Date"
                            placeholder="MM/YY"
                            keyboardType="numeric"
                            maxLength={5} // MM/YY
                            value={expiryDate}
                            onChangeText={handleExpiryChange}
                            borderInput
                            rightIcon={
                                <TouchableOpacity onPress={openCalendar} activeOpacity={0.7}>
                                    <MaterialIcons name="date-range" size={18} color={colors.gray23} style={{ right: 10 }} />
                                </TouchableOpacity>
                            }
                        />

                    </View>
                    <View style={{ width: 15 }} />
                    <View style={{ flex: 1 }}>
                        <CustomInput
                            label="CCV"
                            placeholder="123"
                            keyboardType="numeric"
                            secureTextEntry
                            borderInput
                            maxLength={4}
                            value={ccv}
                            onChangeText={setCcv}
                            rightIcon={<Feather name="lock" size={18} color={colors.gray23} style={{ right: 10 }} />}
                        />
                    </View>
                </View>

                {/* Save Card Checkbox */}
                <TouchableOpacity
                    style={styles.checkboxRow}
                    activeOpacity={0.8}
                    onPress={() => setSaveCard(!saveCard)}
                >

                    <View style={styles.checkboxTextContainer}>
                        <CustomText bold xs style={styles.checkboxTitle}>Save card for future use</CustomText>
                        <CustomText xs style={styles.checkboxSubTitle}>حفظ البطاقة للاستخدام المستقبلي</CustomText>
                    </View>

                    <View style={[styles.checkbox, saveCard && styles.checkboxActive]}>
                        {saveCard && <Feather name="check" size={14} color={colors.white} />}
                    </View>
                </TouchableOpacity>

                <CustomButton
                    title="Add Card"
                    increaseHeight
                    style={styles.addBtn}
                    onPress={handleAddCard}
                />

                <CustomButton
                    title={'Back'}
                    style={[styles.primaryButton, { backgroundColor: colors.gray25, marginTop: 20 }]}
                    textStyle={{ fontSize: 16 }}
                    transparent
                    onPress={() => navigation.goBack()}

                />

            </ShadowWrapper>




            {Platform.OS === 'ios' && (
                <Modal
                    transparent={true}
                    visible={showDatePicker}
                    animationType="fade"
                    onRequestClose={() => setShowDatePicker(false)}
                >
                    {/* Semi-transparent backdrop overlay */}
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setShowDatePicker(false)}
                    >
                        <View style={styles.modalContent}>
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                               textColor="black" 
    themeVariant='light'
                                display="inline"
                                onChange={handleDateConfirm}
                                minimumDate={new Date()}
                                maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 12))}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

        </CustomScreenView>
    );
};

export default AddNewCardScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingTop: 30,
    },
    formCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 20,
        paddingBottom: 30,
        marginTop: 0
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
        padding: 15,
        borderWidth: 1,
        borderColor: colors.gray13,
        borderRadius: 15,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.purple3,
        backgroundColor: colors.purple4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },
    checkboxTextContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    checkboxTitle: {
        color: colors.gray23,
    },
    checkboxSubTitle: {
        color: colors.gray21,
        marginTop: 2,
    },
    addBtn: {
        backgroundColor: colors.gray23,
        borderRadius: 15,
    },
    primaryButton: {
        height: 50
    },



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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 15,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
});

