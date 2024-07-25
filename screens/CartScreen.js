import { View, Text, Pressable, ScrollView, SafeAreaView, StyleSheet, Platform, FlatList, Image, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { getCart } from '../api/apiServices';
import ProductCart from '../components/ProductCart';
import CurrencyPD from '../components/CurrencyPD';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    // TODO: uncomment when all the user info is passed and add user to cart useState
    // const route = useRoute();
    // const { user } = route.params;
    // console.log("home:", user);
    const [cart, setCart] = useState({ products: [], totalPrice: 0 });
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const navigator = useNavigation();

    const deleteProductCart = (item) => {
        //TODO: remove product from database as well
        const newCartProducts = cart.products.filter(product => product !== item);
        const newTotalPrice = newCartProducts.reduce((acc, product) => acc + (product.product.price * product.quantity), 0);
        const newTotalProducts = newCartProducts.reduce((acc, product) => acc + product.quantity, 0);

        setCart(prevCart => ({
            ...prevCart,
            products: newCartProducts,
            totalPrice: newTotalPrice,
        }));
        setTotalProducts(newTotalProducts);
        setTotalPrice(newTotalPrice);
    };

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true)
            try {
                console.log('cart');
                // const cartData = await getCart();
                // setCart(cartData);
                const demeProductsCart = [{
                    product: {
                        _id: 0,
                        user: 'gal',
                        name: 'pikachu',
                        url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
                        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                        gender: 0,
                        level: 50,
                        isShiny: false,
                        abilities: ['static'],
                        moves: ['mega-punch', 'thunder-punch', 'slam'],
                        species: ['pikachu'],
                        stats: {
                            hp: 50,
                            attack: 30,
                            defense: 40,
                            specialAttack: 60,
                            specialDefense: 70,
                            speed: 20
                        },
                        types: ['electric'],
                        price: 8000,
                        quantity: 2,
                    },
                    quantity: 1
                },
                {
                    product: {
                        _id: 2,
                        user: 'ash',
                        name: 'charizard',
                        url: 'https://pokeapi.co/api/v2/pokemon/charizard/',
                        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
                        gender: 0,
                        level: 36,
                        isShiny: false,
                        abilities: ['blaze', 'solar-power'],
                        moves: ['flamethrower', 'fly', 'dragon-claw'],
                        species: ['charizard'],
                        stats: {
                            hp: 78,
                            attack: 84,
                            defense: 78,
                            specialAttack: 109,
                            specialDefense: 85,
                            speed: 100
                        },
                        types: ['fire', 'flying'],
                        price: 15000,
                        quantity: 1
                    },
                    quantity: 1
                },
                {
                    product: {
                        _id: 1,
                        user: 'raz',
                        name: 'venusaur',
                        url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
                        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png',
                        gender: 1,
                        level: 4,
                        isShiny: true,
                        abilities: ['overgrow', 'chlorophyll'],
                        moves: ['swords-dance', 'bind'],
                        species: ['venusaur'],
                        stats: {
                            hp: 20,
                            attack: 30,
                            defense: 40,
                            specialAttack: 15,
                            specialDefense: 23,
                            speed: 17
                        },
                        types: ['grass', 'poison'],
                        price: 1000,
                        quantity: 4
                    },
                    quantity: 2
                }];
                // const demeProductsCart = [];

                let tPrice = 0;
                let tProducts = 0;
                demeProductsCart.forEach(product => {
                    tPrice += product.product.price * product.quantity;
                    tProducts += product.quantity;
                });
                setTotalProducts(tProducts);
                setTotalPrice(tPrice);
                setCart({ user: { name: 'k', email: 'k@k.com' }, products: demeProductsCart, totalPrice: tPrice });

            } catch (e) {
                Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
                console.log('error fetching cart: ' + e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);


    const handleCheckout = () => {
        //TODO: add user to navigate
        navigator.navigate('Checkout', {cart});
        // navigator.navigate('Checkout', {cart, user});
    };

    if (isLoading) {
        return (<Loading />);
    }


    return (
        <SafeAreaView style={styles.cartScreenContainer}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cart ({totalProducts})</Text>
            </View>
            {cart.products.length > 0 ? (
                <FlatList
                    data={cart.products}
                    keyExtractor={(item) => item.product._id.toString()}
                    renderItem={({ item }) => (
                        <ProductCart
                            cart={cart}
                            setCart={setCart}
                            item={item}
                            setTotalProducts={setTotalProducts}
                            totalProducts={totalProducts}
                            deleteProductCart={deleteProductCart}
                            key={item.product._id}
                        />
                    )}
                />) : (
                <View style={{ alignItems: 'center' , marginTop:20}}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png' }}
                        style={{ resizeMode: 'contain', height: 200, width: 200, marginBottom:20 }}
                    />
                    <Text style={{ fontSize: 20 , marginBottom:5}}>Cart is empty :(</Text>
                    <Text style={{color:'gray', fontSize:15, textAlign:'center'}}>Explore the store to find the best Pokemons for battles</Text>
                </View>
            )}


            <View style={styles.checkoutContainer}>
                <Text style={styles.total}>
                    Total: {cart.totalPrice}
                </Text>
                <CurrencyPD style={styles.currency} />
                <Pressable
                    style={({ pressed }) => [
                        styles.checkoutButton,
                        { backgroundColor: cart.products.length > 0 ? (pressed ? '#d3d3d3' : '#FEBE10') : '#cccccc' }
                    ]}
                    onPress={handleCheckout}
                    disabled={cart.products.length === 0}
                >
                    <Text>CHECKOUT</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cartScreenContainer: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        padding: 10
    },
    checkoutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: 'black',
        borderTopWidth: 1,
        padding: 5,
        borderRadius: 5,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'flex-end'
    },
    checkoutButton: {
        width: 200,
        // backgroundColor: "#",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15,
        alignItems: 'center'
    },
    currency: {
        resizeMode: 'contain',
        height: 13,
        width: 13
    },
    total:{
        fontSize:17,
        fontWeight:'bold'
    }
});

export default CartScreen;
