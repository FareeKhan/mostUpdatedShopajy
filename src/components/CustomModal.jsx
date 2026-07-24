import { Animated, Dimensions, Keyboard, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import React, { useEffect, useRef } from 'react';
import CustomText from './CustomText';

import { useTranslation } from 'react-i18next';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { fonts } from '../constants/fonts';
import { colors } from '../constants/color';
const { height } = Dimensions.get('screen')

const CustomModal = ({
    modalVisible,
    setModalVisible,
    title,
    children,
    style,
    textStyle,
    animationType,
    modalHeight,
    hideLine = true,
    hideCross = true,
    backStyle = true,
    modalViewStyle, innerStyle
}) => {
    const { t } = useTranslation();

    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        if (animationType !== 'fade') return
        if (modalVisible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 6,
                    tension: 180,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [modalVisible]);

    return (
        <Modal
            animationType={animationType ? animationType : "slide"}
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : "height"}>
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <View style={[styles.centeredView, style]}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setModalVisible(false)}
                            style={[backStyle && styles.backdrop]}
                        />

                        <Animated.View style={[styles.modalView, modalViewStyle,

                        {
                            opacity: opacityAnim,
                            transform: [{ scale: scaleAnim }]
                        }

                        ]}>
                            <View style={[styles.innerModelView, innerStyle, modalHeight && { height: height / 1.2 }]}>
                                {
                                    hideLine &&
                                    <View style={styles.dragHandle} />
                                }
                                <View
                                    style={{
                                        marginTop: 18,
                                        marginBottom: hideLine ? 30 : 0,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        // width: '70%',
                                    }}
                                >
                                    <CustomText style={[styles.sortingTitle, textStyle]}>
                                        {title}
                                    </CustomText>
                                    {
                                        hideCross &&
                                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                                            <EvilIcons name={'close'} size={20} color={colors.black} />
                                        </TouchableOpacity>
                                    }

                                </View>
                                {children}
                            </View>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

        </Modal>
    );
};

export default CustomModal;

const styles = StyleSheet.create({
    inputBox: {
        marginTop: 30,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 25,
    },

    centeredView: {
        flex: 1,

    },
    backdrop: {
        backgroundColor: '#00000040',
        flex: 1,

    },
    modalView: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: '#00000040',

    },
    dragHandle: {
        width: 50,
        height: 4,
        backgroundColor: colors.gray,
        borderRadius: 10,
        marginTop: 10,
        alignSelf: 'center',
    },
    sortingTitle: {
        fontSize: 18,
        fontFamily: fonts.medium,
    },
    innerModelView: {
        backgroundColor: colors.white,
        paddingHorizontal: 25,
    },

    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
