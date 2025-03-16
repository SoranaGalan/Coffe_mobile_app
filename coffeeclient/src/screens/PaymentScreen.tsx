import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import GradientBGIcon from '../components/GradientBGIcon';
import PaymentFooter from '../components/PaymentFooter';
import LinearGradient from 'react-native-linear-gradient';
import CustomIcon from '../components/CustomIcon';
import {useStore} from '../store/store';
import PopUpAnimation from '../components/PopUpAnimation';
import axios from '../services/api';

const PaymentScreen = ({navigation, route}: any) => {
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const addToOrderHistoryListFromCart = useStore(
    (state: any) => state.addToOrderHistoryListFromCart,
  );

  const User = useStore((state: any) => state.User);
  const AccessToken = useStore((state: any) => state.AccessToken)
  const [card, setCard] = useState<any>(null);

  useEffect(() => {
    const readUserCard = async () => {
      const response = await axios.get("/card", {headers: {
        'Authorization': `Bearer ${AccessToken}`
      }})

      const value = response.data;

      if (value === null) {
        return;
      }

      setCard(value);
    };

    readUserCard();
  }, []);

  const [paymentMode, setPaymentMode] = useState('Credit Card');
  const [showAnimation, setShowAnimation] = useState(false);

  const buttonPressHandler = async () => {
    if (card === null) {
      ToastAndroid.showWithGravity(
        `Your card is not valid`,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );

      return;
    }

    setShowAnimation(true);

    await axios.post(`/orders/${User.uid}`);

    addToOrderHistoryListFromCart();
    calculateCartPrice();
    setShowAnimation(false);
    navigation.navigate('History');
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      {showAnimation ? (
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/successful.json')}
        />
      ) : (
        <></>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View style={styles.HeaderContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <GradientBGIcon
              name="left"
              color={COLORS.primaryLightGreyHex}
              size={FONTSIZE.size_16}
            />
          </TouchableOpacity>
          <Text style={styles.HeaderText}>Payments</Text>
          <View style={styles.EmptyView} />
        </View>

        <View style={styles.PaymentOptionsContainer}>
          {card === null ? (
            <Text style={styles.MessageText}>
              You don't have a Credit Card added
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setPaymentMode('Credit Card');
              }}>
              <View
                style={[
                  styles.CreditCardContainer,
                  {
                    borderColor:
                      paymentMode == 'Credit Card'
                        ? COLORS.primaryOrangeHex
                        : COLORS.primaryGreyHex,
                  },
                ]}>
                <Text style={styles.CreditCardTitle}>Credit Card</Text>
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
                        {card.lastDigits}
                      </Text>
                    </View>
                    <View style={styles.CreditCardRow}>
                      <View style={styles.CreditCardNameContainer}>
                        <Text style={styles.CreditCardNameSubitle}>
                          Card Holder Name
                        </Text>
                        <Text style={styles.CreditCardNameTitle}>
                          {card.holderName}
                        </Text>
                      </View>
                      <View style={styles.CreditCardDateContainer}>
                        <Text style={styles.CreditCardNameSubitle}>
                          {card.expiryDate}
                        </Text>
                        <Text style={styles.CreditCardNameTitle}>02/30</Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <PaymentFooter
        buttonTitle={`Pay with ${paymentMode}`}
        price={{price: route.params.amount, currency: '$'}}
        buttonPressHandler={buttonPressHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  MessageText: {
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_20,
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  LottieAnimation: {
    flex: 1,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  HeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  EmptyView: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
  PaymentOptionsContainer: {
    padding: SPACING.space_15,
    gap: SPACING.space_15,
  },
  CreditCardContainer: {
    padding: SPACING.space_10,
    gap: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_15 * 2,
    borderWidth: 3,
  },
  CreditCardTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginLeft: SPACING.space_10,
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
});

export default PaymentScreen;
