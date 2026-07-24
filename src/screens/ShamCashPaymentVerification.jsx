

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import CustomScreenView from '../components/CustomScreenView';
import { colors } from '../constants/color';
import ShadowWrapper from '../components/ShadowWrapper';
import CustomButton from '../components/CustomButton';
import DarkTitleWithNotes from '../components/DarkTitleWithNotes';
import SuccessModal from '../components/SuccessModal';
import BgIconWithTitle from '../components/BgIconWithTitle';
import CustomText from '../components/CustomText';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import i18next from 'i18next';
import CustomInput from '../components/CustomInput';
import { useTranslation } from 'react-i18next';
// import DocumentPicker from 'react-native-document-picker';
import { DocumentPicker } from '@react-native-documents/picker';
import HeaderBox from '../components/HeaderBox';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { submitPaymentProof } from '../redux/reducers/Orders';
import { pick, types } from '@react-native-documents/picker'
import { emptyCart } from '../redux/reducers/CartProduct';



const ShamCashPaymentVerification = () => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const order = useSelector(s => s?.orders?.current)
    const [transactionId, setTransactionId] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false)
    const [submitting, setSubmitting] = useState(false)

    const orderNumber = order?.id || '—'

    console.log('heyyadas333d', order)

    const handleVerify = async () => {
        if (submitting) return
        if (!order?.id) {
            showMessage({ type: 'danger', message: 'No order found' })
            return
        }
        if (!transactionId?.trim() && !selectedFile) {
            showMessage({ type: 'warning', message: t('enterTransacationId') })
            return
        }
        setSubmitting(true)
        const res = await dispatch(submitPaymentProof({
            orderId: order.id,
            transactionId: transactionId?.trim() || undefined,
            file: selectedFile || undefined,
        }))

        dispatch(emptyCart())


        setSubmitting(false)
        if (submitPaymentProof.fulfilled.match(res)) {
            setModalVisible(true)
        } else {
            showMessage({ type: 'danger', message: res.payload?.message || 'Verification failed' })
        }
    }


    const pickDocument = async () => {
        try {
            const res = await pick({
                allowMultiSelection: false,
                type: [types.pdf, types.images],
            });

            const file = res[0];

            if (file.hasRequestedType) {
                console.log('File selected:', file.name);
                setSelectedFile(file);
            } else {
                showMessage({ type: 'warning', message: 'Please select a valid PDF or Image file.' });
            }
        } catch (err) {
            console.log('User cancelled or error:', err);
        }
    };



    return (
        <CustomScreenView>
            <HeaderBox
                title={'verifyPayment'}
            />

            <BgIconWithTitle
                icon={<Feather name="check-circle" size={60} color={colors.secondary} />
                }
                title={'paymentVerification'}
                subTitle={'enterTransacationId'}
            />



            {/* Order Number Card */}
            <ShadowWrapper style={styles.orderCard}>
                <CustomText style={styles.orderLabel} bold>orderNumber</CustomText>
                <CustomText translate={false} style={styles.orderValue}>#{orderNumber}</CustomText>
            </ShadowWrapper>

            {/* Input Section */}
            <View style={styles.inputSection}>
                <CustomText bold >transactionId</CustomText>
                <CustomInput
                    placeholder={i18next.t('shamCashreceipt')}
                    borderInput
                    inputStyle={styles.input}
                    value={transactionId}
                    onChangeText={setTransactionId}
                    style={{ marginTop: 10 }}
                />
                <CustomText style={styles.exampleText}>Example: SC-1234567890-2024</CustomText>
            </View>

            <DarkTitleWithNotes
                darkTitle={'whreToFind'}
                note={'rcvTransactionId'}
            />

            {/* Verify Button */}
            <CustomButton
                title={'verifyPayment'}
                style={styles.verifyBtn}
                onPress={handleVerify}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
                <View style={styles.line} />
                <CustomText style={styles.orText}>or</CustomText>
                <View style={styles.line} />
            </View>

            {/* Upload Section */}

            {
                selectedFile ?

                    <View style={{ borderWidth: 1, padding: 10, borderRadius: 10, borderColor: colors.gray }}>
                        <CustomText>{selectedFile?.name}</CustomText>

                        <TouchableOpacity onPress={() => setSelectedFile('')} style={{ position: "absolute", right: -10, borderWidth: 1, borderRadius: 50, borderColor: colors.gray, top: -10, backgroundColor: colors.white }}>
                            <Entypo name={'cross'} size={20} color={colors.red} />
                        </TouchableOpacity>
                    </View>
                    :

                    <View style={styles.uploadContainer}>
                        <Feather name="upload" size={32} color={colors.gray19} style={{ marginBottom: 12 }} />
                        <CustomText style={styles.uploadTitle} bold>uploadRcpt</CustomText>
                        <CustomText style={styles.uploadSubtitle}>backupVerification</CustomText>

                        <TouchableOpacity onPress={pickDocument} style={styles.chooseFileBtn}>
                            <CustomText style={styles.chooseFileText} bold>chooseFile</CustomText>
                        </TouchableOpacity>
                    </View>

            }



            <SuccessModal
                hideLine={false}
                modalViewStyle={{ borderRadius: 15 }}
                innerStyle={{ borderRadius: 15 }}
                setModalVisible={setModalVisible}
                modalVisible={modalVisible}
            />



        </CustomScreenView>
    );
};

export default ShamCashPaymentVerification;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.secondary4, // Using the transparent green from your theme
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.gray23,
    },
    subtitle: {
        fontSize: 12,
        color: colors.gray23,
        marginTop: 4,
        opacity: 0.7,
    },
    orderCard: {
        backgroundColor: colors.white,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 25,
    },
    orderLabel: {
        fontSize: 18,
        color: colors.gray21,
        marginBottom: 8,
    },
    orderValue: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.black,
    },
    inputSection: {
        marginBottom: 16,
    },

    input: {
        color: colors.gray23,
        textAlign: 'center',
    },
    exampleText: {
        fontSize: 10,
        color: colors.gray21,
        textAlign: 'center',
        marginTop: 8,
    },
    infoBox: {
        backgroundColor: colors.purple4, // Light blue/purple tint
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.purple3,
        marginBottom: 25,
    },
    infoText: {
        fontSize: 12,
        lineHeight: 18,
        textAlign: 'center',
        color: colors.gray21,
    },
    verifyBtn: {
        backgroundColor: colors.gray23,
        marginBottom: 20,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.gray13,
    },
    orText: {
        paddingHorizontal: 10,
        color: colors.gray21,
    },
    uploadContainer: {
        borderWidth: 1,
        borderColor: colors.gray24,
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 25,
        alignItems: 'center',
        backgroundColor: colors.gray15,
    },
    uploadTitle: {
        color: colors.gray23,
    },
    uploadSubtitle: {
        fontSize: 11,
        color: colors.gray21,
        marginTop: 4,
        marginBottom: 15,
    },
    chooseFileBtn: {
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray24,
        backgroundColor: colors.gray15,
    },
    chooseFileText: {
        color: colors.gray23,
    },
});