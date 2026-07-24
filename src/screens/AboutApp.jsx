// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import CustomScreenView from '../components/CustomScreenView'
// import HeaderBox from '../components/HeaderBox'
// import CustomText from '../components/CustomText'
// import { colors } from '../constants/color'

// const AboutApp = () => {
//   return (
//     <CustomScreenView>
//      <HeaderBox 
//      title={''}
//      />
//      <CustomText ></CustomText>
//     </CustomScreenView>
//   )
// }

// export default AboutApp

// const styles = StyleSheet.create({})




import { StyleSheet, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomScreenView from '../components/CustomScreenView'
import HeaderBox from '../components/HeaderBox'
import CustomText from '../components/CustomText'
import BottomSocialIcon from '../components/BottomSocialIcon'
import { colors } from '../constants/color'
import { width } from '../constants/data'
import { fetchPage } from '../redux/reducers/Content'
import Logo from '../assets/svg/Logo.svg'
import HighLogo from '../components/HighLogo'


const AboutApp = () => {
  const dispatch = useDispatch()
  const page = useSelector(s => s?.content?.pages?.about)
  const lang = useSelector(s => s?.language?.language) || 'en'

  useEffect(() => { dispatch(fetchPage('about')) }, [dispatch])

  const aboutData = (lang === 'ar' ? page?.sections_ar : page?.sections_en) || []

  console.log('ssss',page)
  const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};


  return (
    <CustomScreenView>
      <HeaderBox title={'aboutApp'} />



<HighLogo/>

      {aboutData.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <CustomText translate={false} bold xxl style={styles.cardTitle}>
            {item.title}
          </CustomText>

          {item.content && (
            <CustomText xs medium style={styles.cardContent} translate={false}>
                  {stripHtml(item.content)}
            </CustomText>
          )}

          {item.bullets && item.bullets.map((bullet, index) => (
            <CustomText key={index} xs medium style={styles.bulletItem} translate={false}>
              {`• ${bullet}`}
            </CustomText>
          ))}
        </View>
      ))}

      {/* Social Media Section */}
    <BottomSocialIcon />
    </CustomScreenView>
  )
}

export default AboutApp

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.gray25.concat(80),
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.gray24,
  },
  cardTitle: {
    color: colors.gray27,
    marginBottom: 15,
  },
  cardContent: {
    color: colors.gray20,
    lineHeight: 22,
  },
  bulletItem: {
    color: colors.gray21,
    lineHeight: 22,
    marginBottom: 10,
    paddingLeft: 5,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  followText: {
    marginBottom: 15,
  },
  socialRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 15
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  iconPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center"
  },
  versionText: {
    marginBottom: 30,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.gray13,
    marginBottom: 15,
  },
  copyright: {
    marginBottom: 5,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})