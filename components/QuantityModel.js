import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import {addToCart, fetchPokemons, getCart, removeFromCart} from "../api/apiServices";
import {useUser} from "../utils/UserContext";


const QuantityModel = ({ item, modalVisible, setModalVisible }) => {

    const [value, setValue] = useState(0);
    const { user, setCart } = useUser();
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
    const checkCartAvailability= async (stockProducts,cartProducts)=>{
        // Validate that all items in cart are still available in stock. If not set new quantity to products in cart
        try{
            for(let cartProduct of cartProducts){
                const stockProduct = stockProducts.find(product=> product._id.equals(cartProduct._id));

                if(!stockProduct){
                    console.debug(`Product ${cartProduct.name} no longer in stock. Removing it from cart`);
                    const retCode = removeFromCart(user.userId,cartProduct._id);
                }else if(stockProduct.quantity<cartProduct.quantity){
                    console.debug(`Adjusting quantity for ${cartProduct.name} from ${cartProduct.quantity} to ${stockProduct.quantity}`);
                    const retCode = addToCart(user.userId,cartProduct._id,(stockProduct.quantity-cartProduct.quantity));
                }
                console.log("Cart updated successfully");
            }
        }catch (error){
            console.log(`Error in checkCartAvailability: ${error}`);
        }
    }

    const handleSubmitQuantity = async () => {
        //add product to cart. Validate products quantities between stock and cart.
        console.log(`trying to submit new item to cart with ${item._id}`);
        try {
            const retStatus = await addToCart(user.userId, item._id, value);
            if (retStatus.status === 201) {
            const itemsInStock = await fetchPokemons()
            console.debug(`fetched from stock`);
            const itemsInCart =await getCart(user.userId);
            console.debug(`fetched from cart`);
            await checkCartAvailability(itemsInStock, itemsInCart);
            }
        }catch (error){
            console.error("Error submit item to cart:", error);
        }
        finally {
            setModalVisible(false);
        }
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
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Select Quantity (max is {item.quantity})</Text>


                        <View style={{ flexDirection: 'row', alignItems:'center'}}>
                            <Pressable style={[styles.button, styles.buttonOption]} onPress={handleAddQuantity}>
                                <Text style={styles.buttonText}>+</Text>
                            </Pressable>

                            <View style={{marginRight:8, marginLeft:8}}>
                            <Text style={{fontSize:18}}>{value}</Text>
                            </View>
                            


                            <Pressable style={[styles.button, styles.buttonOption]} onPress={handleReduceQuantity}>
                                <Text style={styles.buttonText}>-</Text>
                            </Pressable>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.buttonText}>Close</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonSubmit]}
                                onPress={() => handleSubmitQuantity()}
                            >
                                <Text style={styles.buttonText}>Submit</Text>
                            </Pressable>
                        </View>

                    </View>
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
        marginTop:10
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
    buttonSubmit:{
        backgroundColor:'green'
    }
})