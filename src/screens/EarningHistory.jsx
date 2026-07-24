import { Alert, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../constants/color';
import CustomText from '../components/CustomText';
import { monthsData, width } from '../constants/data';
import CustomButton from '../components/CustomButton';
import DateData from '../components/DateData';
import ShadowWrapper from '../components/ShadowWrapper';
import MonthlySummary from '../components/MonthlySummary';
import Feather from 'react-native-vector-icons/Feather'
import { fetchCommissions, fetchEarningsSummary, requestWithdraw } from '../redux/reducers/Influencer'


const EarningHistory = () => {
    const dispatch = useDispatch()
    const token = useSelector(s => s?.auth?.token)
    const summary = useSelector(s => s?.influencer?.summary) || { paid: 0, pending: 0, total: 0 }
    const commissions = useSelector(s => s?.influencer?.commissions) || []

    const [selectedDate, setSelectedDate] = useState('all')

    useEffect(() => { if (token) dispatch(fetchEarningsSummary()) }, [token, dispatch])
    useEffect(() => { if (token) dispatch(fetchCommissions(selectedDate)) }, [token, selectedDate, dispatch])

    console.log('summarysummary', commissions)

    const handleWithdraw = async () => {
        if (!summary.pending) { Alert.alert('Nothing to withdraw'); return }
        const res = await dispatch(requestWithdraw(summary.pending))
        if (requestWithdraw.fulfilled.match(res)) {
            Alert.alert('Requested', 'Withdrawal request submitted')
        }
    }

    return (
        <CustomScreenView>
            <HeaderBox title={'earningHistory'} />

            <LinearGradient
                colors={['#00BC7D', '#007A55',]}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.linearGradient}
            >
                <View style={styles.containerPadding}>
                    <CustomText style={styles.whiteText} xl medium>
                        availableBlnc
                    </CustomText>

                    <CustomText translate={false} style={{ fontSize: 22, color: colors.white, textAlign: "center", marginTop: 10, marginBottom: 10 }} bold>${Number(summary.total || 0).toFixed(2)}</CustomText>

                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ borderWidth: 1, borderColor: colors.secondary2, height: 70, width: width / 2.6, gap: 5, backgroundColor: '#007A5540', borderRadius: 10, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 10 }}>
                            <CustomText style={{ color: colors.white }}>paid</CustomText>
                            <CustomText translate={false} bold xxl style={{ color: colors.white }}>${Number(summary.paid || 0).toFixed(2)}</CustomText>
                        </View>
                        <View style={{ borderWidth: 1, borderColor: colors.secondary2, height: 70, width: width / 2.6, gap: 5, backgroundColor: '#007A5540', borderRadius: 10, alignItems: "flex-end", justifyContent: "center", paddingHorizontal: 10 }}>
                            <CustomText style={{ color: colors.white }}>Pending</CustomText>
                            <CustomText translate={false} bold xxl style={{ color: colors.white }}>${Number(summary.pending || 0).toFixed(2)}</CustomText>
                        </View>
                    </View>

                    <CustomButton
                        title={'requestWithdraw'}
                        style={{ height: 50, backgroundColor: colors.white, marginTop: 15 }}
                        textStyle={{ color: colors.secondary, fontSize: 17 }}
                        onPress={handleWithdraw}
                    />
                </View>
            </LinearGradient>

            {
                commissions?.length > 0 &&
                <DateData
                    data={monthsData}
                    setSelectedDate={setSelectedDate}
                    selectedDate={selectedDate}
                />
            }




            {
                commissions?.map((item) => {
                    return (
                        <ShadowWrapper key={item?.id} style={{ top: -40 }}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                                <View style={{ gap: 8 }}>
                                    <CustomText translate={false} style={{ color: colors.green, textAlign: "center" }} xl semiBold>${Number(item?.amount || 0).toFixed(2)}</CustomText>
                                    <View style={{ backgroundColor: colors.secondary, padding: 5, paddingHorizontal: 10, borderRadius: 10 }}>
                                        <CustomText translate={false} xs medium>{item?.status}</CustomText>
                                    </View>
                                </View>
                                <View style={{ gap: 5 }}>
                                    <CustomText translate={false} medium>{item?.date ? new Date(item.date).toLocaleDateString() : ''}</CustomText>
                                    <CustomText translate={false} style={{ color: colors.gray2, textAlign: "center" }} s>{item?.order_count} orders</CustomText>
                                </View>
                            </View>


                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 20 }}>
                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                    <CustomText xs style={{ color: colors.gray1 }}>commisionRate</CustomText>
                                    <CustomText translate={false} xs style={{ color: colors.gray1 }}>: {item?.rate}%</CustomText>
                                </View>
                                <Feather name={'trending-up'} size={15} color={colors.green} />
                            </View>
                        </ShadowWrapper>
                    )
                })
            }

            {
                commissions?.length > 0 &&
                <MonthlySummary />
            }

        </CustomScreenView>
    )
}

export default EarningHistory
const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        borderRadius: 15,
        marginTop: 20
    },

    containerPadding: {
        padding: 25
    },

    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
    },

    whiteText: {
        color: colors.white,
        textAlign: "center"
    },

    whiteBox: {
        height: 190,
        width: "100%",
        backgroundColor: colors.white,
        alignSelf: "center",
        borderRadius: 10,
        justifyContent: "center"
    },

    blackBox: {
        height: 160,
        width: 160,
        backgroundColor: "black",
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    image: {
        width: 60,
        height: 60
    },

    purpleCard: {
        backgroundColor: colors.purple2,
        alignItems: "center",
        paddingVertical: 16,
        gap: 8,
        borderRadius: 16,
        marginTop: 16
    },

    lightPurpleText: {
        color: '#F3E8FF'
    },

    purpleText: {
        color: colors.purple
    },

    grayText: {
        color: colors.gray27
    },

    referralInner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20
    },

    copyBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.purple
    },

    copyBtnBlue: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        backgroundColor: colors.blue
    },

    codeBox: {
        backgroundColor: '#F9FAFB',
        height: 40,
        width: "85%",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    centerText: {
        textAlign: "center"
    },

    socialRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 10
    },

    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center"
    },

    analyticsBox: {
        padding: 20,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: colors.purple1,
        borderColor: colors.purple2,
        marginTop: 20
    },

    analyticsRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-around'
    },

    analyticsNumber: {
        textAlign: "center",
        color: colors.purple
    },

    marginBottom10: {
        marginBottom: 10
    }
})