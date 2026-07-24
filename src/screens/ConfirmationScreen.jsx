import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import ShadowWrapper from '../components/ShadowWrapper'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'
import Feather from 'react-native-vector-icons/Feather'
import CustomButton from '../components/CustomButton'


const ConfirmationScreen = ({ navigation }) => {
    const order = useSelector(s => s?.orders?.current)
    return (
        <CustomScreenView>

            <ShadowWrapper>
                <View style={styles.centerBox}>
                    <View style={styles.iconCircle}>
                        <Feather name={'check-circle'} size={55} color={colors.secondary} />
                    </View>
                    <CustomText style={styles.title} bold>thankyou</CustomText>
                    <CustomText style={{ textAlign: 'center',width:"80%" }} xs light>teamReview</CustomText>
                    {order?.id && (
                        <CustomText translate={false} medium>#{order.invoice_number || order.id}</CustomText>
                    )}
                </View>

                <View style={{ backgroundColor: colors.lightYellow1, paddingVertical: 7, borderRadius: 50, marginTop: 25, marginBottom: 10 }}>
                    <CustomText style={{ color: colors.brown3, textAlign: 'center' }} s medium >statusUnderReview</CustomText>
                </View>


                <CustomButton
                    title={'continueHome'}
                    style={{ marginVertical: 10, height: 45 }}
                    onPress={() => navigation?.reset?.({ index: 0, routes: [{ name: 'DrawerNavigation' }] })}
                />

                <View style={{ borderWidth: 1, borderColor: colors.purple3, borderRadius: 20, padding: 15, backgroundColor: colors.purple4, marginTop: 15,  }}>
                    <CustomText style={{ marginBottom: 15, textAlign: 'center' }} bold xxl>nextStep</CustomText>

                 <View style={{gap:8}}>
                       <CustomText semiBold xs style={{ color: colors.gray27 }}>ourTeamWillCheck</CustomText>
                    <CustomText semiBold xs style={{ color: colors.gray27 }}>verifySocialMedia</CustomText>
                    <CustomText semiBold xs style={{ color: colors.gray27 }}>emailNextStep</CustomText>
                    <CustomText semiBold xs style={{ color: colors.gray27 }}>uponApproval</CustomText>
                 </View>

                </View>

            </ShadowWrapper>
        </CustomScreenView>
    )
}

export default ConfirmationScreen

const styles = StyleSheet.create({
    centerBox: {
        alignItems: "center",
        gap: 10,
    },
    iconCircle: {
        width: 100,
        height: 100,
        backgroundColor: colors.secondary2,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
    },
    resendContainer: {
        alignItems: "center",
        marginTop: 10,
    },
    resendBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 7,
        marginBottom: 25,
    },
    resendTextColor: {
        color: colors.secondary,
    },

    button: {
        height: 50,
    },
    buttonText: {
        fontSize: 16,
    },

    backBtn: {
        marginTop: 15,
        alignItems: "center",
    },
    backText: {
        color: colors.secondary,
    },
})