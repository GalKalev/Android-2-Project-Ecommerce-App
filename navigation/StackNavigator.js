import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute, NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import AddPokemonScreen from '../screens/AddPokemonScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import ProductScreen from '../screens/ProductScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useUser } from '../utils/UserContext';
import { Alert } from 'react-native';
import SearchProductScreen from '../screens/SearchProductScreen';
import {getCart} from "../api/apiServices";




const StackNavigator = () => {

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const { user, cart, setCart } = useUser();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      console.log("insdie useEffect")
      try {
        const cartData = await getCart(user.userId);
        setCart(cartData);
        // const demeProductsCart = [{
        //   product: {
        //     _id: 0,
        //     user: 'gal',
        //     name: 'pikachu',
        //     url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
        //     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        //     gender: 0,
        //     level: 50,
        //     isShiny: false,
        //     abilities: ['static'],
        //     moves: ['mega-punch', 'thunder-punch', 'slam'],
        //     species: ['pikachu'],
        //     stats: {
        //       hp: 50,
        //       attack: 30,
        //       defense: 40,
        //       specialAttack: 60,
        //       specialDefense: 70,
        //       speed: 20
        //     },
        //     types: ['electric'],
        //     price: 8000,
        //     quantity: 2,
        //   },
        //   quantity: 1
        // },
        // {
        //   product: {
        //     _id: 2,
        //     user: 'ash',
        //     name: 'charizard',
        //     url: 'https://pokeapi.co/api/v2/pokemon/charizard/',
        //     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
        //     gender: 0,
        //     level: 36,
        //     isShiny: false,
        //     abilities: ['blaze', 'solar-power'],
        //     moves: ['flamethrower', 'fly', 'dragon-claw'],
        //     species: ['charizard'],
        //     stats: {
        //       hp: 78,
        //       attack: 84,
        //       defense: 78,
        //       specialAttack: 109,
        //       specialDefense: 85,
        //       speed: 100
        //     },
        //     types: ['fire', 'flying'],
        //     price: 15000,
        //     quantity: 1
        //   },
        //   quantity: 1
        // },
        // {
        //   product: {
        //     _id: 1,
        //     user: 'raz',
        //     name: 'venusaur',
        //     url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
        //     img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png',
        //     gender: 1,
        //     level: 4,
        //     isShiny: true,
        //     abilities: ['overgrow', 'chlorophyll'],
        //     moves: ['swords-dance', 'bind'],
        //     species: ['venusaur'],
        //     stats: {
        //       hp: 20,
        //       attack: 30,
        //       defense: 40,
        //       specialAttack: 15,
        //       specialDefense: 23,
        //       speed: 17
        //     },
        //     types: ['grass', 'poison'],
        //     price: 1000,
        //     quantity: 4
        //   },
        //   quantity: 2
        // }];
        // const demeProductsCart = [];

        // let tPrice = 0;
        // let tProducts = 0;
        // demeProductsCart.forEach(product => {
        //   tPrice += product.product.price * product.quantity;
        //   tProducts += product.quantity;
        // });
        // setTotalProducts(tProducts);
        // setTotalPrice(tPrice);
        // setCart({ user: user, products: demeProductsCart, totalPrice: tPrice });

      } catch (e) {
        Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
        console.log('error fetching cart: ' + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  function BottomTabs() {
    // const route = useRoute();
    // const { user } = route.params;
    // console.log("tab:" + user.gmail);
    return (
      <Tab.Navigator>
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: { color: '#008E97' },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#008E97" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),

          }}
        // initialParams={{user}}

        />

        <Tab.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
            tabBarLabelStyle: { color: '#008E97' },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="person" size={24} color="#008E97" />
              ) : (
                <Ionicons name="person-outline" size={24} color="black" />
              ),


          }}

        />

        <Tab.Screen
          name='Cart'
          component={CartScreen}
          options={{
            tabBarLabel: "Cart",
            tabBarLabelStyle: { color: '#008E97' },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="shoppingcart" size={24} color="#008E97" />
              ) : (
                <AntDesign name="shoppingcart" size={24} color="black" />
              ),
              tabBarBadge: cart?.products?.length ? cart.products.reduce((acc, item) => acc + item.quantity, 0) : undefined,
          }}

        />

      </Tab.Navigator>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
          {/*<Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />*/}
          {/*<Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />*/}
        <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddPokemon" component={AddPokemonScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchProduct" component={SearchProductScreen} options={{ headerShown: false }} />

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})