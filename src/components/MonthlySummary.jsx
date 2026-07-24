import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ShadowWrapper from './ShadowWrapper';
import CustomText from './CustomText';
import { colors } from '../constants/color';
import { fetchMonthly } from '../redux/reducers/Influencer';

const MonthlySummary = () => {
  const dispatch = useDispatch();
  const token = useSelector(s => s?.auth?.token);
  const monthly = useSelector(s => s?.influencer?.monthly);
  const commissions = useSelector(s => s?.influencer?.commissions);
  const goal = Number(useSelector(s => s?.settings?.values?.monthly_earning_goal)) || 500;


  useEffect(() => {
    if (token) dispatch(fetchMonthly());
  }, [token, dispatch]);

  const { total, orders, average, progress } = useMemo(() => {
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
    const row = (monthly || []).find(m => m?.period === currentPeriod);
    const monthTotal = Number(row?.total || 0);
    const monthOrders = (commissions || [])
      .filter(c => (c?.date || '').slice(0, 7) === currentPeriod)
      .reduce((sum, c) => sum + Number(c?.order_count || 0), 0);
    return {
      total: monthTotal,
      orders: monthOrders,
      average: monthOrders > 0 ? monthTotal / monthOrders : 0,
      progress: goal > 0 ? Math.min(monthTotal / goal, 1) : 0,
    };
  }, [monthly, commissions, goal]);





  return (
    <ShadowWrapper style={styles.card}>
      <CustomText bold xxl style={{ marginBottom: 25 }}>This Month Summary</CustomText>

      <View style={styles.row}>
        <CustomText semiBold gray>Total Earnings</CustomText>
        <CustomText bold xxxl translate={false}>${total.toFixed(2)}</CustomText>
      </View>

      <View style={styles.row}>
        <CustomText semiBold gray>Orders</CustomText>
        <CustomText bold xxl translate={false}>{orders}</CustomText>
      </View>

      <View style={styles.row}>
        <CustomText semiBold gray>Average Commission</CustomText>
        <CustomText bold xxl translate={false}>${average.toFixed(2)}</CustomText>
      </View>

      <View style={styles.divider} />

      <View style={styles.progressHeader}>
        <CustomText semiBold gray>Progress Toward Goal</CustomText>
        <CustomText bold xxl style={{ color: colors.blue }} translate={false}>{Math.round(progress * 100)}%</CustomText>
      </View>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>



      <CustomText semiBold gray s style={{ textAlign: 'center', marginTop: 12 }} translate={false}>
        Goal: ${goal} / Month
      </CustomText>
    </ShadowWrapper>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, padding: 20, borderRadius: 10,top:-20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  divider: { height: 1, backgroundColor: colors.blue4, marginVertical: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  progressBarBg: { height: 10, backgroundColor: colors.blue4, borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.blue, borderRadius: 5 }
});

export default MonthlySummary;
