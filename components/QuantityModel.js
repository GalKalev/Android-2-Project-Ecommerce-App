import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../utils/UserContext';


const QuantityModel = ({ item, modalVisible, setModalVisible }) => {

    const { user } = useUser();

    const [value, setValue] = useState(0);
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

    const handleSubmitQuantity = () => {
        //TODO: enter the item to cart
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
                                    style={[styles.button, styles.buttonClose, {alignSelf:'center'}]}
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
                                <Pressable style={[styles.button, styles.buttonOption]} onPress={handleAddQuantity}>
                                    <Text style={styles.buttonText}>+</Text>
                                </Pressable>

                                <View style={{ marginRight: 8, marginLeft: 8 }}>
                                    <Text style={{ fontSize: 18 }}>{value}</Text>
                                </View>



                                <Pressable style={[styles.button, styles.buttonOption]} onPress={handleReduceQuantity}>
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
                                    onPress={() => handleSubmitQuantity}
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