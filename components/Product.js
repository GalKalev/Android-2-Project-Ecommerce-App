import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { presentableWord } from '../utils/consts';
import CurrencyPD from './CurrencyPD';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import QuantityModel from './QuantityModel';

const Product = ({ item, screen, scrollPosition, setScrollPosition }) => {
    const navigation = useNavigation();

    const [quantityModalVisible, setQuantityModalVisible] = useState(false);

    const handleAddToCart = () => {
        setQuantityModalVisible(true);
    }

    const handleItemPressed = () => {
        navigation.navigate('ProductScreen', { item: item, prevScreen: screen });
    }
    return (
        <View style={[styles.container, { borderColor: item.isShiny ? 'gold' : "black" }]}>
            {item.isShiny && (
                <>
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerTop} />
                    <Ionicons name="sparkles-sharp" size={20} color="gold" style={styles.shinyContainerBottom} />
                </>


            )}

            <Pressable style={{ alignItems: 'center' }}
                onPress={handleItemPressed}
            >
                <View style={{ borderBlockColor: 'black', borderBottomWidth: 0.17 }}>
                    <Image style={{ width: 160, height: 160, resizeMode: 'contain' }}
                        source={{ uri: item.img }} />
                    <View style={styles.genderLevelContainer}>
                        <Text style={styles.levelText}>
                            LV: {item.level}
                        </Text>
                        {item.gender ? (
                            <Foundation name="female-symbol" size={20} color='pink' style={styles.gender} />
                        ) : (
                            <Foundation name="male-symbol" size={20} color='blue' style={styles.gender} />

                        )}
                    </View>

                </View>
                <View>

                    <Text style={styles.itemName}>
                        {presentableWord(item.name)}
                    </Text>

                    <View style={styles.userNameContainer}>
                        <Ionicons name="person" size={18} color="white" style={{ backgroundColor: 'black', borderRadius: 10 }} />
                        <Text style={styles.userNameText}>{item.user.name}</Text>
                    </View>


                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <View style={styles.priceContainer}>

                            <Text style={styles.priceText}>
                                {item.price}
                            </Text>
                            <CurrencyPD style={styles.currency} />
                        </View>

                        <Text style={[styles.quantity, { color: item.quantity <= 3 ? 'red' : 'gray' }]}>
                            {item.quantity} left
                        </Text>
                    </View>

                </View>

                <Pressable style={styles.addToCardBtn}
                    onPress={handleAddToCart}
                >
                    {/* <Text style={styles.addToCardBtnText}>Add To Cart</Text> */}
                    <FontAwesome name="cart-plus" size={22} color="black" />
                </Pressable>

                <QuantityModel
                    item={item}
                    setModalVisible={setQuantityModalVisible}
                    modalVisible={quantityModalVisible}
                    scrollPosition={scrollPosition}
                    setScrollPosition={setScrollPosition}

                />


            </Pressable>



        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        //  borderColor: item.isShiny ? 'gold' : 'black',
        borderWidth: 2,
        marginTop: 5,
        borderRadius: 4,
        padding: 2,
        paddingBottom: 10,
        marginBottom: 10
    },
    shinyContainerTop: {
        position: 'absolute',
        top: -5,
        left: -8,
        backgroundColor: 'white'
    },
    shinyContainerBottom: {
        position: 'absolute',
        bottom: -5,
        right: -8,
        backgroundColor: 'white'
    },
    genderLevelContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#DEDEDE',
        opacity: 0.7,
        flexDirection: 'row',
        padding: 2,
        alignItems: 'center',
    },
    levelText: {
        fontSize: 12,
    },
    gender: {
        marginLeft: 10,
        marginRight: 5
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 7,
        alignSelf: 'center',
        marginBottom: 15
    },
    userNameContainer: {
        flexDirection: 'row',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
        alignSelf: 'flex-end',
        paddingRight: 3
    },
    userNameText: {
        fontSize: 15,
        marginLeft: 3
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'red',
        //  borderWidth:1,
        padding: 3,
        paddingRight: 4,
        paddingLeft: 4,
        borderRadius: 5,
    },
    priceText: {
        fontSize: 18,
    },
    currency: {
        resizeMode: 'contain',
        height: 14,
        width: 14,
        marginLeft: 3,
    },
    quantity: {
        marginLeft: 15,
    },
    addToCardBtn: {
        borderColor: 'black',
        borderRadius: 15,
        borderWidth: 1,
        paddingRight: 10,
        paddingLeft: 10,
        padding: 6
    }
});
export default Product
