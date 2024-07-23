import { Alert, Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CurrencyPD from './CurrencyPD'
import { presentableWord } from '../utils/consts';
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ProductCart = ({ item, cart, setCart, setTotalProducts, totalProducts, deleteProductCart }) => {
    const navigation = useNavigation();
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [itemCartQuantity, setItemCartQuantity] = useState(item.quantity);

    useEffect(() => {
        if (item.quantity === item.product.quantity)
            setIsAddDisabled(true);
    }, [])

    const reduceQuantity = () => {
        // TODO: update cart in database
        setIsAddDisabled(false);
        if (item.quantity === 1) {
            Alert.alert('Delete product from cart?', 'press REMOVE to remove product from cart, and CANCEL to keep product in cart', [

                {
                    text: 'CANCEL',
                    style: 'cancel'
                },
                {
                    text: 'REMOVE',
                    onPress: () => deleteProductCart(item)
                },
            ]);
        } else {
            item.quantity = item.quantity - 1;
            setItemCartQuantity(item.quantity)
        }

        setTotalProducts(totalProducts - 1);
        cart.totalPrice = cart.totalPrice - item.product.price;


    }


    const addQuantity = () => {

        // TODO: update cart in database
        item.quantity = item.quantity + 1;
        setItemCartQuantity(item.quantity)
        if (item.quantity === item.product.quantity) {
            setIsAddDisabled(true);
        }
        setTotalProducts(totalProducts + 1);
        cart.totalPrice = cart.totalPrice + item.product.price;
    }
    const handleItemPressed = () => {
        navigation.navigate('ProductScreen', { item: item.product, prevScreen: 'My Cart' });
    }

    return (
        <View style={[styles.container, { borderColor: item.product.isShiny ? 'gold' : 'black', }]}>
            {item.product.isShiny && (
                <>
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerTop} />
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerBottom} />
                </>


            )}
            <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={handleItemPressed}>
                <View >

                    <Image
                        source={{ uri: item.product.img }}
                        style={{ resizeMode: 'contain', width: 100, height: 100 }}
                    />

                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.product.price}</Text>
                        <CurrencyPD
                            style={styles.currency}
                        />
                    </View>
                    <Text style={{ fontSize: 11, alignSelf: 'center', color: 'gray' }}>(each one)</Text>

                </View>
                <View style={{ alignSelf: 'center', marginRight: 4 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ fontSize: 18, marginRight: 7 }}>{presentableWord(item.product.name)}</Text>
                            <Text style={{ fontSize: 13, marginRight: 10 }}>LV: {item.product.level}</Text>
                            <View>
                                {item.gender ? (
                                    <Foundation name="female-symbol" size={20} color="pink" style={styles.gender} />
                                ) : (
                                    <Foundation name="male-symbol" size={20} color="blue" style={styles.gender} />
                                )}
                            </View>
                        </View>

                        <View>
                            <View style={styles.userNameContainer}>
                                <Ionicons name="person" size={18} color="white" style={{ backgroundColor: 'black', borderRadius: 10 }} />
                                <Text style={styles.userNameText}>{item.product.user}</Text>
                            </View>

                        </View>


                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            {item.product.types.map((type, index) => (
                                <View key={type}>
                                    <Text>{presentableWord(type)} {index < item.product.types.length - 1 ? ' / ' : ''} </Text>
                                </View>

                            ))}

                        </View>

                    </View>

                </View>

            </Pressable>

            <View style={[styles.quantityBtns]}>
                <Pressable onPress={reduceQuantity} style={{ padding: 3, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 17 }}>-</Text>
                </Pressable>
                <Text style={{ alignSelf: 'center', fontSize: 17 }}>
                    {itemCartQuantity}
                </Text>
                <Pressable style={{ padding: 3, paddingRight: 10, alignSelf: 'center' }} onPress={addQuantity} disabled={isAddDisabled}>
                    <Text style={{ fontSize: 17, color: isAddDisabled ? 'gray' : 'black' }}>+</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default ProductCart

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderWidth: 1,
        margin: 5,
        borderRadius: 4,
        padding: 5,
    },
    currency: {
        resizeMode: 'contain',
        height: 12,
        width: 12,
        alignSelf: 'center'
    },
    abilitiesMovesList: {
        alignSelf: 'center',
        borderRadius: 14,
        borderWidth: 1,
        padding: 2,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    userNameContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        alignSelf: 'baseline',
        paddingRight: 3,
        padding: 3,
        marginBottom: 10
    },
    shinyContainerTop: {
        position: 'absolute',
        top: -4,
        left: -5,
        backgroundColor: 'white'
    },
    shinyContainerBottom: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        backgroundColor: 'white'
    },
    quantityBtns: {
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 14,
        alignSelf: 'center',
        // paddingRight: 5,
        // paddingLeft: 5,
        justifyContent: 'space-between',
        flex: 1,
        maxWidth: 80
    },
})
