import { View, Text, TextInput, Pressable, ScrollView, SafeAreaView, StyleSheet, Image, Alert, Platform, FlatList } from 'react-native';
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
const CartScreen = () => {

    const cart = useSelector((state)=> state.cart.cart);
    console.log(cart);
    const total = cart ?.map((product)=> product.price *product.quantity).reduce((curr, prev) => curr + prev, 0);
    return(
        <SafeAreaView style={styles.cartScreenContainer}>
            <ScrollView>
                <View style={styles.cartSum}>
                    <Text>Subtotal:</Text>
                    <Text>{total}</Text>
                </View>

                <Pressable>
                    <Text>Proceed to Buy ({cart.length}) Items</Text>
                </Pressable>
            </ScrollView>

        </SafeAreaView>
    )
}

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
    }
})