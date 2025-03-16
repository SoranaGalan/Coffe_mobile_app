import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import GradientBGIcon from './GradientBGIcon';
import ProfilePic from './ProfilePic';
import auth from '@react-native-firebase/auth';
import {useStore} from '../store/store';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';

interface HeaderBarProps {
  title?: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({title}) => {
  const navigation = useNavigation();

  const setUser = useStore((state: any) => state.setUser);

  const handleSignOut = async () => {
    try {
      await auth().signOut();

      await GoogleSignin.signOut();

      setUser(null);

      console.log('User signed out successfully!');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleNavigateToUserDetails = () => {
    navigation.navigate('User' as never);
  };

  return (
    <View style={styles.HeaderContainer}>
      <TouchableOpacity onPress={handleNavigateToUserDetails}>
        <ProfilePic />
      </TouchableOpacity>
      <Text style={styles.HeaderText}>{title}</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <GradientBGIcon
          name="left"
          color={COLORS.primaryLightGreyHex}
          size={FONTSIZE.size_16}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  HeaderContainer: {
    padding: SPACING.space_30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  Image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
});

export default HeaderBar;
