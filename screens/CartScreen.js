import {View, Text, Pressable, ScrollView, SafeAreaView, StyleSheet, Platform, FlatList, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import {getCart} from '../api/apiServices';

const CartScreen = () => {

    const [cart,setCart] = useState(null);

    useEffect(() => {
        const fetchCart = async () => {
            const cartData = await getCart();
            setCart(cartData);
        };

        fetchCart();
    }, []);

    if(!cart) {
        return <Text>Loading...</Text>;
    }

    const handleCheckout = () =>{
        navigator.navigate('Checkout');
    };

    //const total = cart ?.map((product)=> product.price *product.quantity).reduce((curr, prev) => curr + prev, 0);
    return(
        <SafeAreaView style={styles.cartScreenContainer}>
            <FlatList
                data={cart.products}
                keyExtractor={(item) => item.product._id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.product.name}</Text>
                        <Text>Quantity: {item.quantity}</Text>
                        <Text>Price: ${item.product.price}</Text>
                    </View>
                )}
            />
            <View style={{marginHorizontal:10}}>
                {cart?.map((item, index) => (
                    <View>
                        <Pressable>
                            <View>
                                <Image style={styles.pokemonImage} source={{uri: item?.image}}/>
                            </View>
                            <View>
                                <Text>{item?.name}</Text>
                            </View>
                        </Pressable>
                    </View>
                ))}
            </View>
            <Text style={styles.total}>Total: ${cart.totalPrice}</Text>
            <Pressable title="Proceed to Checkout" style={styles.checkoutButton} onPress={handleCheckout} >
                <Text>Proceed to Buy ({cart.length}) Items</Text>
            </Pressable>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    cartScreenContainer: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white'
    },
    input: {
        marginLeft: 10,
        flex: 1
    },
    pokemonInfoContainer: {
        alignItems: 'center',
        marginBottom: 20
    },

    pokemonImage: {
        width: 200,
        height: 200,
        marginBottom: 10
    },
    button:{
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 5,
        borderColor: "#C0C0C0",
        borderWidth: 0.6
    },
    cartSum:{
        padding:10,
        flexDirection: "row",
        alignItems:"center"
    },
    checkoutButton:{
        width: 200,
        backgroundColor: "#FEBE10",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15
    },
    productImage:{
        width:140,
        height:140,
        resizeMode:"contain"
    }
});

export default CartScreen;
