import {StyleSheet, TouchableOpacity, Text, View, Image} from 'react-native';
import {BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE} from '../theme/theme';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useStore} from '../store/store';

GoogleSignin.configure({
  webClientId:
    '996770404020-jc3rnirvth20mb2usaq69q7b29knh3c1.apps.googleusercontent.com',
});

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
  // Get the users ID token
  const signInResult: any = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  let idToken = signInResult.data?.idToken;

  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = signInResult.idToken;
  }
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

export const AuthScreen = () => {
  const setUser = useStore((state: any) => state.setUser);
  const setAccessToken = useStore((state: any) => state.setAccessToken);

  const handleGoogleSignIn = async () => {
    const data = await onGoogleButtonPress();
    const accessToken = await data.user.getIdToken();

    setUser(data.user);
    setAccessToken(accessToken);
  };

  return (
    <View style={styles.ScreenContainer}>
      <Text style={styles.TitleText}>Coffee shop</Text>
      <Image
        source={require('../assets/app_images/logo.png')}
        style={styles.LogoImage}
      />
      <TouchableOpacity
        style={styles.SignInButton}
        onPress={handleGoogleSignIn}>
        <Image
          source={require('../assets/app_images/google.png')}
          style={styles.GoogleImage}
        />
        <Text style={styles.Text}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBlackHex,
    paddingBottom: 100,
    gap: 10,
  },

  SignInButton: {
    backgroundColor: COLORS.secondaryGreyHex,
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 60,
    padding: 10,
    borderRadius: BORDERRADIUS.radius_20,
    marginTop: 20,
  },
  Text: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  TitleText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryWhiteHex,
  },
  LogoImage: {
    height: 120,
    width: 120,
    borderRadius: 100,
    backgroundColor: COLORS.primaryDarkGreyHex,
  },
  GoogleImage: {
    height: 40,
    width: 40,
    marginRight: 5,
  },
});
