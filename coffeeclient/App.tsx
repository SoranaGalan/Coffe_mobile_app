import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';
import {useStore} from './src/store/store';
import {AuthScreen} from './src/screens/AuthScreen';
import axios from './src/services/api';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {COLORS} from './src/theme/theme';
import UserDetails from './src/screens/UserDetails';
import database from '@react-native-firebase/database';

const Stack = createNativeStackNavigator();

const imageMap: any = {
  americano_pic_1_square: require('./src/assets/coffee_assets/americano/square/americano_pic_1_square.png'),
  americano_pic_1_portrait: require('./src/assets/coffee_assets/americano/portrait/americano_pic_1_portrait.png'),
  robusta_coffee_beans_square: require('./src/assets/coffee_assets/robusta_coffee_beans/robusta_coffee_beans_square.png'),
  robusta_coffee_beans_portrait: require('./src/assets/coffee_assets/robusta_coffee_beans/robusta_coffee_beans_portrait.png'),
  black_coffee_pic_1_square: require('./src/assets/coffee_assets/black_coffee/square/black_coffee_pic_1_square.png'),
  black_coffee_pic_1_portrait: require('./src/assets/coffee_assets/black_coffee/portrait/black_coffee_pic_1_portrait.png'),
};

const mapDbProductsToStoreProducts = (items: any) => {
  let productsDictionary: any = {};

  items.forEach((y: any) => {
    const priceObj = y.product.prices.find((p: any) => p.size === y.size);

    if (productsDictionary.hasOwnProperty(y.product.id)) {
      productsDictionary[y.product.id] = {
        ...productsDictionary[y.product.id],
        newPrices: [
          ...productsDictionary[y.product.id].newPrices,
          {
            size: y.size,
            currency: priceObj.currency,
            price: priceObj.price,
            quantity: y.quantity,
          },
        ],
      };
    } else {
      productsDictionary[y.product.id] = {
        ...y.product,
        newPrices: [
          {
            size: y.size,
            currency: priceObj.currency,
            price: priceObj.price,
            quantity: y.quantity,
          },
        ],
      };
    }
  });

  return productsDictionary;
};

const App = () => {
  const User = useStore((state: any) => state.User);
  const setCoffeeList = useStore((state: any) => state.setCoffeeList);
  const setBeanList = useStore((state: any) => state.setBeanList);
  const setCartList = useStore((state: any) => state.setCartList);
  const setFavoritesList = useStore((state: any) => state.setFavoritesList);
  const setOrderHistoryList = useStore(
    (state: any) => state.setOrderHistoryList,
  );

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    if (User === null) {
      return;
    }

    const getData = async () => {
      setLoading(true);

      const data = await database()
        .ref(`/users/favorites/${User.uid}`)
        .once('value');

      const favourites = data.val();

      const responseProducts = await axios.get('/products');
      const responseOrders = await axios.get(`/orders/${User.uid}`);
      const responseCart = await axios.get(`/cart/${User.uid}`);

      const coffeeList = responseProducts.data
        .filter((x: any) => x.productType === 'COFFEE')
        .map((x: any, i: number) => {
          return {
            ...x,
            imagelink_square: imageMap[x.imagelink_square],
            imagelink_portrait: imageMap[x.imagelink_portrait],
            index: i,
            type: x.productType,
            favourite:
              favourites === null
                ? false
                : favourites.some((id: any) => id === x.id),
          };
        });

      setCoffeeList(coffeeList);

      const beanList = responseProducts.data
        .filter((x: any) => x.productType === 'BEAN')
        .map((x: any, i: number) => {
          return {
            ...x,
            imagelink_square: imageMap[x.imagelink_square],
            imagelink_portrait: imageMap[x.imagelink_portrait],
            index: i,
            type: x.productType,
            favourite:
              favourites === null
                ? false
                : favourites.some((id: any) => id === x.id),
          };
        });

      setBeanList(beanList);

      if (favourites !== null) {
        setFavoritesList([
          ...coffeeList.filter((c: any) =>
            favourites.some((id: any) => id === c.id),
          ),
          ...beanList.filter((b: any) =>
            favourites.some((id: any) => id === b.id),
          ),
        ]);
      }

      const cartItems = Object.values(
        mapDbProductsToStoreProducts(responseCart.data),
      ).map((p: any) => {
        let ItemPrice = 0;

        p.newPrices.forEach((y: any) => {
          ItemPrice += y.price * y.quantity;
        });

        return {
          ...p,
          ItemPrice,
          prices: p.newPrices,
          imagelink_square: imageMap[p.imagelink_square],
          imagelink_portrait: imageMap[p.imagelink_portrait],
        };
      });

      setCartList(cartItems);

      const orders = responseOrders.data.map((x: any) => {
        return {
          CartListPrice: x.totalPrice.toFixed(2),
          OrderDate: new Date(x.orderDate).toLocaleString(),
          CartList: Object.values(
            mapDbProductsToStoreProducts(x.orderProducts),
          ).map((p: any) => {
            let itemPrice = 0;

            p.newPrices.forEach((a: any) => {
              itemPrice += a.price * a.quantity;
            });

            return {
              ...p,
              prices: p.newPrices,
              ItemPrice: itemPrice.toFixed(2),
              imagelink_square: imageMap[p.imagelink_square],
              imagelink_portrait: imageMap[p.imagelink_portrait],
            };
          }),
        };
      });
      setOrderHistoryList(orders);

      setLoading(false);
    };

    getData();
  }, [User]);

  if (User === null) {
    return <AuthScreen />;
  }

  if (loading) {
    return (
      <View style={styles.ScreenContainer}>
        <ActivityIndicator size="large" color={COLORS.primaryOrangeHex} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
        <Stack.Screen
          name="User"
          component={UserDetails}
          options={{animation: 'slide_from_bottom'}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
