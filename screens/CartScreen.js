import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, FlatList, Image, SafeAreaView, StyleSheet, Platform, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../utils/UserContext';
import Loading from '../components/Loading';
import ProductCart from '../components/ProductCart';
import CurrencyPD from '../components/CurrencyPD';
import { getCart, removeFromCart } from "../api/apiServices";
import { presentableWord } from '../utils/consts';

const CartScreen = () => {
    const { user, cart, setCart } = useUser();
    const [totalProducts, setTotalProducts] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const navigation = useNavigation();

    // useEffect(() => {
    //     console.log('use effect cart screen')
    //     if (cart?.products?.length) {
    //         let totalProductsCount = 0;
    //         cart.products.forEach(product => {
    //             totalProductsCount += product.quantity;
    //         });
    //         setTotalProducts(totalProductsCount);
    //     }
    // }, []);

    useFocusEffect(
        useCallback(() => {
            console.log('Cart screen focused');
            if (cart?.products?.length) {
                let totalProductsCount = 0;
                cart.products.forEach(product => {
                    totalProductsCount += product.quantity;
                });
                setTotalProducts(totalProductsCount);
            } else {
                setTotalProducts(0);
            }

            return () => {
                // Cleanup logic if needed when screen is unfocused
            };
        }, [cart])
    );

    const deleteProductCart = (item) => {
        Alert.alert(`Delete ${presentableWord(item.product.name)} from cart?`, 'Press DELETE to confirm changes.', [
            {
                text: 'CANCEL',
                style: 'cancel'
            },
            {
                text: 'DELETE',
                onPress: () => {
                    removeFromCart(user.userId, item.product._id, item.product.price);
                    const newCartProducts = cart.products.filter(product => product !== item);
                    const newTotalPrice = newCartProducts.reduce((acc, product) => acc + (product.product.price * product.quantity), 0);
                    const newTotalProducts = newCartProducts.reduce((acc, product) => acc + product.quantity, 0);

                    setCart(prevCart => ({
                        ...prevCart,
                        products: newCartProducts,
                        totalPrice: newTotalPrice,
                    }));
                    setTotalProducts(newTotalProducts);
                }
            },

        ])

    };

    const handleCheckout = () => {
        navigation.navigate('Checkout', { cart });
    };

    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    return (
        <SafeAreaView style={styles.cartScreenContainer}>
            <View style={styles.header}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Cart ({totalProducts})</Text>
            </View>
            {cart?.products?.length > 0 ? (
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
                />
            ) : (
                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4555/4555971.png' }}
                        style={{ resizeMode: 'contain', height: 200, width: 200, marginBottom: 20 }}
                    />
                    <Text style={{ fontSize: 20, marginBottom: 5 }}>Cart is empty :(</Text>
                    <Text style={{ color: 'gray', fontSize: 15, textAlign: 'center' }}>
                        Explore the store to find the best Pokemons for battles
                    </Text>
                </View>
            )}
            <View style={styles.checkoutContainer}>
                <Text style={styles.total}>
                    Total: {cart?.totalPrice ? cart.totalPrice : 0}
                </Text>
                <CurrencyPD style={styles.currency} />
                <Pressable
                    style={({ pressed }) => [
                        styles.checkoutButton,
                        { backgroundColor: cart?.products?.length > 0 ? (pressed ? '#d3d3d3' : '#FEBE10') : '#cccccc' }
                    ]}
                    onPress={handleCheckout}
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
    total: {
        fontSize: 17,
        fontWeight: 'bold'
    }
});

export default CartScreen;
