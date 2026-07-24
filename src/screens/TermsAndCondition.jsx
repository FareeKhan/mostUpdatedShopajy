import { ActivityIndicator, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import { fetchPage } from '../redux/reducers/Content'
import { colors } from '../constants/color'

const TermsAndCondition = ({ route }) => {
    const { screen } = route?.params || ''
    const slug = screen
    const dispatch = useDispatch()
    const page = useSelector(s => s?.content?.pages?.[slug])
    const lang = useSelector(s => s?.language?.language) || 'en'

    useEffect(() => { dispatch(fetchPage(slug)) }, [slug, dispatch])

    if (!page) {
        return <View style={styles.loading}><ActivityIndicator color={colors.black} /></View>
    }

    const sections = lang === 'ar' ? (page.sections_ar || []) : (page.sections_en || [])

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

    return (
        <CustomScreenView>
            <HeaderBox
                title={slug}
                style={{ marginBottom: 25 }}
            />

            {sections.map((item, idx) => (
                <View key={idx} style={styles.section}>
                    <CustomText translate={false} style={styles.sectionTitle} bold>{item.title}</CustomText>
                    <CustomText translate={false} style={styles.sectionContent}>
                        {stripHtml(item.content)}
                    </CustomText>
                    {item.bullets && item.bullets.map((bullet, i) => (
                        <CustomText translate={false} key={i} style={styles.bulletItem}>{`• ${bullet}`}</CustomText>
                    ))}
                </View>
            ))}
        </CustomScreenView>
    )
}

export default TermsAndCondition

const styles = StyleSheet.create({
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 16, marginBottom: 8 },
    sectionContent: { fontSize: 14, color: '#4A5568', lineHeight: 20, textAlign: 'left' },
    bulletItem: { fontSize: 14, color: '#4A5568', lineHeight: 22, marginLeft: 10, marginTop: 4 },
})
