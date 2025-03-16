import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import {useStore} from '../store/store';
import GradientBGIcon from '../components/GradientBGIcon';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import axios from '../services/api';
import validator from 'card-validator';

const isEmptyString = (str: string) => {
  return str === undefined || str === null || str.length === 0;
};

const UserDetails = ({navigation, route}: any) => {
  const User = useStore((state: any) => state.User);
  const AccessToken = useStore((state: any) => state.AccessToken);

  const [address, setAddress] = useState<string>('');
  const [otherDetails, setOtherDetails] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const [initialCard, setInitalCard] = useState<any>({});
  const [card, setCard] = useState<any>({});
  const [editCard, setEditCard] = useState<boolean>(false);

  useEffect(() => {
    const readUserAddress = async () => {
      const data = await database()
        .ref(`/users/addresses/${User.uid}`)
        .once('value');

      const value = data.val();

      if (value === null) {
        return;
      }

      setAddress(value.address);
      setOtherDetails(value.otherDetails);
      setCity(value.city);
    };

    const readUserCard = async () => {
      const response = await axios.get('/card', {
        headers: {
          Authorization: `Bearer ${AccessToken}`,
        },
      });

      setInitalCard(response.data);
    };

    readUserAddress();
    readUserCard();
  }, []);

  const BackHandler = () => {
    navigation.pop();
  };

  // don't leave empty info about user
  const handleSaveAddress = async () => {
    if (isEmptyString(city) || isEmptyString(address)) {
      ToastAndroid.showWithGravity(
        `City and address details are required.`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      return;
    }

    await database().ref(`/users/addresses/${User.uid}`).set({
      city,
      address,
      otherDetails,
    });

    ToastAndroid.showWithGravity(
      `New address saved`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const onToggleCardEdit = () => {
    setEditCard(prevEditCard => !prevEditCard);

    if (editCard) {
      setInitalCard({});
    }
  };

  const handleSaveNewCard = async () => {
    if (
      isEmptyString(card.allDigits) ||
      isEmptyString(card.holderName) ||
      isEmptyString(card.expiryDate) ||
      isEmptyString(card.cvv)
    ) {
      ToastAndroid.showWithGravity(
        `All filds are required.`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      return;
    }

    // Sanitize inputs (removing spaces or special characters)
    const sanitizedCardNumber = card.allDigits.replace(/\D/g, '');
    const sanitizedExpirationDate = card.expiryDate.replace(/\D/g, '');
    const sanitizedCvv = card.cvv.replace(/\D/g, '');

    const cardNumberValidation = validator.number(sanitizedCardNumber);
    const expiryDateValidation = validator.expirationDate(
      sanitizedExpirationDate,
    );
    const cvvValidation = validator.cvv(sanitizedCvv);

    // Card Number Validation: Only digits, and it should pass Luhn's algorithm
    if (!cardNumberValidation.isValid) {
      ToastAndroid.showWithGravity(
        `Invalid credit card number`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      return;
    }

    if (!expiryDateValidation.isValid) {
      // Expiration Date Validation: MM/YY format, valid expiration date
      if (!/^\d{2}\/\d{2}$/.test(card.expiryDate)) {
        ToastAndroid.showWithGravity(
          `Invalid expiration date format. Use MM/YY.`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

        return;
      }

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expMonth = parseInt(sanitizedExpirationDate.slice(0, 2), 10);
      const expYear = 2000 + parseInt(sanitizedExpirationDate.slice(2, 4), 10);

      if (
        expYear < currentYear ||
        (expYear === currentYear && expMonth < currentMonth)
      ) {
        ToastAndroid.showWithGravity(
          `Expiration date is in the past.`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

        return;
      }

      ToastAndroid.showWithGravity(
        `Invalid expiration date.`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    if (!cvvValidation.isValid) {
      // CVV Validation: Should be 3 or 4 digits
      if (!/^\d{3,4}$/.test(sanitizedCvv)) {
        ToastAndroid.showWithGravity(
          `Invalid CVV. It should be 3 or 4 digits.`,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );

        return;
      }

      ToastAndroid.showWithGravity(
        `Invalid CVV.`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }

    const newCard = {
      lastDigits: card.allDigits.slice(-4),
      holderName: card.holderName,
      expiryDate: card.expiryDate,
    };

    await axios.post('/card', newCard, {
      headers: {
        Authorization: `Bearer ${AccessToken}`,
      },
    });

    setInitalCard(newCard);
    setEditCard(false);

    ToastAndroid.showWithGravity(
      `New card saved`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.BackButton}>
          <TouchableOpacity
            onPress={() => {
              BackHandler();
            }}>
            <GradientBGIcon
              name="left"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_16}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.UserHeaderText}>Hi, {User.displayName}!</Text>
        <View style={styles.Separator} />
        <View style={styles.AddressContainer}>
          <Text style={styles.YourAddressText}>Your address</Text>
          <TextInput
            placeholder="City*"
            value={city}
            onChangeText={text => {
              setCity(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          <TextInput
            placeholder="Street, number, floor, unit*"
            value={address}
            onChangeText={text => {
              setAddress(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />

          <TextInput
            placeholder="Other details"
            value={otherDetails}
            onChangeText={text => {
              setOtherDetails(text);
            }}
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          <TouchableOpacity
            style={styles.SaveButton}
            onPress={() => handleSaveAddress()}>
            <Text style={styles.ButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Separator} />
        <View style={styles.CardContainer}>
          <Text style={styles.YourAddressText}>Your card </Text>
          <TouchableOpacity
            onPress={() => {
              onToggleCardEdit();
            }}>
            <View style={styles.CreditCardBG}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.LinearGradientStyle}
                colors={[COLORS.primaryGreyHex, COLORS.primaryBlackHex]}>
                <View style={styles.CreditCardRow}>
                  <CustomIcon
                    name="chip"
                    size={FONTSIZE.size_20 * 2}
                    color={COLORS.primaryOrangeHex}
                  />
                  <CustomIcon
                    name="visa"
                    size={FONTSIZE.size_30 * 2}
                    color={COLORS.primaryWhiteHex}
                  />
                </View>
                <View style={styles.CreditCardNumberContainer}>
                  <Text style={styles.CreditCardNumber}>****</Text>
                  <Text style={styles.CreditCardNumber}>****</Text>
                  <Text style={styles.CreditCardNumber}>****</Text>
                  <Text style={styles.CreditCardNumber}>
                    {initialCard === null ||
                    initialCard.lastDigits === undefined
                      ? '****'
                      : initialCard.lastDigits}
                  </Text>
                </View>
                <View style={styles.CreditCardRow}>
                  <View style={styles.CreditCardNameContainer}>
                    <Text style={styles.CreditCardNameSubitle}>
                      Card Holder Name
                    </Text>
                    <Text style={styles.CreditCardNameTitle}>
                      {initialCard?.holderName}
                    </Text>
                  </View>
                  <View style={styles.CreditCardDateContainer}>
                    <Text style={styles.CreditCardNameSubitle}>
                      Expiry Date
                    </Text>
                    <Text style={styles.CreditCardNameTitle}>
                      {initialCard?.expiryDate}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          {editCard && (
            <View style={styles.CardEditContainer}>
              <Text style={styles.YourAddressText}>New card</Text>
              <TextInput
                placeholder="Card number*"
                value={card.allDigits}
                onChangeText={text => {
                  setCard((prevCard: any) => ({...prevCard, allDigits: text}));
                }}
                placeholderTextColor={COLORS.primaryLightGreyHex}
                style={styles.TextInputContainer}
              />
              <TextInput
                placeholder="Card holder name*"
                value={card.holderName}
                onChangeText={text => {
                  setCard((prevCard: any) => ({...prevCard, holderName: text}));
                }}
                placeholderTextColor={COLORS.primaryLightGreyHex}
                style={styles.TextInputContainer}
              />

              <TextInput
                placeholder="Expiry date*"
                value={card.expiryDate}
                onChangeText={text => {
                  setCard((prevCard: any) => ({...prevCard, expiryDate: text}));
                }}
                placeholderTextColor={COLORS.primaryLightGreyHex}
                style={styles.TextInputContainer}
              />
              <TextInput
                placeholder="CVV*"
                value={card.cvv}
                onChangeText={text => {
                  setCard((prevCard: any) => ({...prevCard, cvv: text}));
                }}
                placeholderTextColor={COLORS.primaryLightGreyHex}
                style={styles.TextInputContainer}
              />
              <TouchableOpacity
                style={styles.SaveButton}
                onPress={() => handleSaveNewCard()}>
                <Text style={styles.ButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Separator: {
    height: 1,
    width: '50%',
    backgroundColor: COLORS.secondaryLightGreyHex,
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex: {
    padding: SPACING.space_20,
    flexGrow: 1,
    alignItems: 'center',
    gap: 10,
  },
  UserHeaderText: {
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },
  BackButton: {
    alignSelf: 'flex-start',
  },
  YourAddressText: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
    marginBottom: SPACING.space_10,
    marginTop: SPACING.space_10,
  },
  AddressContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginBottom: SPACING.space_10,
  },
  TextInputContainer: {
    flex: 1,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    width: '80%',
    padding: SPACING.space_10,
  },
  SaveButton: {
    marginTop: SPACING.space_10,
    backgroundColor: COLORS.primaryOrangeHex,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_36,
    borderRadius: BORDERRADIUS.radius_20,
    width: SPACING.space_36 * 3,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  CardContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  CreditCardBG: {
    backgroundColor: COLORS.primaryGreyHex,
    borderRadius: BORDERRADIUS.radius_25,
  },
  LinearGradientStyle: {
    borderRadius: BORDERRADIUS.radius_25,
    gap: SPACING.space_36,
    paddingHorizontal: SPACING.space_15,
    paddingVertical: SPACING.space_10,
  },
  CreditCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  CreditCardNumberContainer: {
    flexDirection: 'row',
    gap: SPACING.space_10,
    alignItems: 'center',
  },
  CreditCardNumber: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
    letterSpacing: SPACING.space_4 + SPACING.space_2,
  },
  CreditCardNameSubitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.secondaryLightGreyHex,
  },
  CreditCardNameTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
  CreditCardNameContainer: {
    alignItems: 'flex-start',
  },
  CreditCardDateContainer: {
    alignItems: 'flex-end',
  },
  CardEditContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
});

export default UserDetails;
