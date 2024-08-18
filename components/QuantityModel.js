import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from "../utils/UserContext";
import { addToCart, checkCartAvailability, fetchPokemons, getCart } from "../api/apiServices";
import Loading from './Loading';

const QuantityModel = ({ item, modalVisible, setModalVisible, scrollPosition, setScrollPosition }) => {

    const [value, setValue] = useState(1);
    const { user, cart, setCart } = useUser();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {


        const cartItem = cart.products.find(findProductInCart);
        if (cartItem) {

            if (cartItem.quantity > item.quantity) {
                setValue(item.quantity)
            } else {
                setValue(cartItem.quantity)
            }

        }
    }, [])

    const findProductInCart = (cartItem) => {
        return cartItem.product._id === item._id
    }

    const handleAddQuantity = () => {
        if (value < item.quantity) {
            setValue(value + 1)
        }

    };

    const handleReduceQuantity = () => {
        if (value > 0) {
            setValue(value - 1)
        }

    };

    const handleSubmitQuantity = async () => {
        //Add product to cart. Validate products quantities between stock and cart.
        console.log(`trying to submit new item to cart with ${item._id}`);
        try {
            setIsLoading(true)
            const retStatus = await addToCart(user.userId, item._id, value);
            const itemsInStock = await fetchPokemons()
            const cartiem = await getCart(user.userId);
            await checkCartAvailability(user, itemsInStock, cartiem.products);
            const cartData = await getCart(user.userId);
            setCart(cartData);

        } catch (error) {
            console.error("Error submit item to cart:", error);
        }
        finally {
            setModalVisible(false);
            setIsLoading(false);
            setScrollPosition(scrollPosition)
        }
    }

    if (isLoading) {
        return <Loading loading={isLoading} />
    }


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>

                    {item.user._id === user.userId ? (
                        <View style={styles.modalView}>
                            <View>
                                <Text>Can't Add to Cart Your Products</Text>
                                <Pressable
                                    style={[styles.button, styles.buttonClose, { alignSelf: 'center' }]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Select Quantity (max is {item.quantity})</Text>


                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Pressable style={[styles.button, { backgroundColor: value === item.quantity ? 'gray' : '#2196F3' }]} onPress={handleAddQuantity}>
                                    <Text style={styles.buttonText}>+</Text>
                                </Pressable>


                                <View style={{ marginRight: 8, marginLeft: 8 }}>
                                    <Text style={{ fontSize: 18 }}>{value}</Text>
                                </View>


                                <Pressable style={[styles.button, { backgroundColor: value === 0 ? 'gray' : '#2196F3' }]} onPress={handleReduceQuantity}>
                                    <Text style={styles.buttonText}>-</Text>
                                </Pressable>
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.buttonText}>Close</Text>
                                </Pressable>
                                <Pressable
                                    style={[styles.button, styles.buttonSubmit]}
                                    onPress={handleSubmitQuantity}
                                >
                                    <Text style={styles.buttonText}>Submit</Text>
                                </Pressable>
                            </View>

                        </View>
                    )}

                </View>

            </Modal>
        </View>
    )
}

export default QuantityModel

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 13,
        borderRadius: 5,
        margin: 5,
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
    },

    buttonClose: {
        backgroundColor: '#FF6347',
    },
    buttonSubmit: {
        backgroundColor: 'green'
    }
})