import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors } from '../constants/color'
import CustomText from '../components/CustomText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const BottomSocialIcon = ({ showCopyrightText = true, mt }) => {


  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    console.log('--->>>',supported)

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening URL:', error);
    }
  };



  return (
    <View style={[styles.footerSection, mt && { marginTop: 20 }]}>

      <View style={styles.divider} />

      <CustomText semiBold gray style={styles.followText}>Follow us on</CustomText>
      <View style={styles.socialRow}>
        <TouchableOpacity onPress={() => openLink('https://www.facebook.com/shopajy.sy')} style={[styles.iconPlaceholder, { backgroundColor: colors.lightPurple }]}>
          <SimpleLineIcons name={'social-facebook'} size={25} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://www.tiktok.com/@shopajy.sy')} style={[styles.iconPlaceholder, { backgroundColor: colors.gray6 }]}>
          <MaterialIcons name={'tiktok'} size={27} color={colors.black} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/shopajy.sy/')} style={[styles.iconPlaceholder, { backgroundColor: colors.red3 }]}>
          <Ionicons name={'logo-instagram'} size={23} color={colors.insta} />
        </TouchableOpacity>
      </View>

      <CustomText xs gray semiBold style={styles.versionText} translate={false}>v1.0.0</CustomText>


      {
        showCopyrightText &&
        <>
          {/* <View style={styles.divider} /> */}

          {/* <CustomText xs gray style={styles.copyright} translate={false}>
          © 2026 Shopajy. All rights reserved.
        </CustomText>

        <View style={styles.madeWithRow}>
          <CustomText xs gray translate={false} semiBold>Made with ❤️ in Syria</CustomText>
        </View> */}
        </>
      }
    </View>
  )
}

export default BottomSocialIcon

const styles = StyleSheet.create({
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
    width: 48,
    height: 48,
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
    marginBottom: 25,
    marginTop: 10
  },
  copyright: {
    marginBottom: 5,
  },
  madeWithRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
})