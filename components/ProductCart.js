import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CurrencyPD from './CurrencyPD'
import { presentableWord } from '../utils/consts';
import { Foundation, Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../utils/UserContext';
import QuantityModel from './QuantityModel';

const ProductCart = ({ item, setTotalProducts, totalProducts, deleteProductCart }) => {
    const { cart, setCart } = useUser();
    const navigation = useNavigation();
    const [isAddDisabled, setIsAddDisabled] = useState(false);
    const [itemCartQuantity, setItemCartQuantity] = useState(item.quantity);
    const [quantityModalVisible, setQuantityModalVisible] = useState(false)

    useEffect(() => {
        setIsAddDisabled(item.quantity === item.product.quantity);
    }, [item.quantity, item.product.quantity]);

    const updateCart = (newQuantity) => {
        const newCartProducts = cart.products.map(product =>
            product.product._id === item.product._id
                ? { ...product, quantity: newQuantity }
                : product
        );
        const newTotalPrice = newCartProducts.reduce((acc, product) => acc + (product.product.price * product.quantity), 0);
        const newTotalProducts = newCartProducts.reduce((acc, product) => acc + product.quantity, 0);

        setCart({ ...cart, products: newCartProducts, totalPrice: newTotalPrice });
        setTotalProducts(newTotalProducts);
    };

    const handleItemPressed = () => {
        navigation.navigate('ProductScreen', { item: item.product, prevScreen: 'My Cart' });
    };

    return (
        <View style={[styles.container, { borderColor: item.product.isShiny ? 'gold' : 'black' }]}>
            {item.product.isShiny && (
                <>
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerTop} />
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerBottom} />
                </>
            )}
            <Pressable style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={handleItemPressed}>
                <View>
                    <Image
                        source={{ uri: item.product.img }}
                        style={{ resizeMode: 'contain', width: 100, height: 100 }}
                    />
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>{item.product.price}</Text>
                        <CurrencyPD style={styles.currency} />
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
                                <Text style={styles.userNameText}>{item.product.user.name}</Text>
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

            {/* Edit quantity buttons */}

            <View style={{ alignItems: 'center', alignSelf: "center", padding: 9, borderRadius: 10,  }}>
                <Pressable style={{ flexDirection: 'row', marginBottom: 18,borderColor:'black', borderBottomWidth:1, opacity:0.7 }} onPress={() => setQuantityModalVisible(true)}>
                    <Text style={{ fontSize: 14, }}>QTY: </Text>
                    <Text style={{ fontSize: 14, }}>{item.quantity}</Text>

                    <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
                </Pressable>

                <Pressable style={{ marginLeft: 10 , alignSelf:'center',}} onPress={() => deleteProductCart(item)}>
                    <Ionicons name="trash" size={24} color="black" />
                </Pressable>

            </View>


            <QuantityModel
                item={item.product}
                setModalVisible={setQuantityModalVisible}
                modalVisible={quantityModalVisible}
            />
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
    userNameContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
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
        justifyContent: 'space-between',
        flex: 1,
        maxWidth: 80
    },
})
