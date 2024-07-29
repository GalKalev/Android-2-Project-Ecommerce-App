import React, { useState } from 'react';
import { View, Text, Pressable, SafeAreaView, StyleSheet, Platform, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Foundation } from '@expo/vector-icons';
import { presentableWord } from '../utils/consts';
import { Ionicons } from '@expo/vector-icons';
import RadarChart from '../components/RadarChart';
import { addToCart } from "../api/apiServices";
import { FontAwesome6 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { useUser } from '../utils/UserContext';
import { Alert } from 'react-native';
import QuantityModel from '../components/QuantityModel';
import CurrencyPD from '../components/CurrencyPD';



const ProductScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { item, prevScreen } = route.params;
    const { user } = useUser();

    const [quantityModalVisible, setQuantityModalVisible] = useState(false);

    const screenWidth = Dimensions.get('window').width;

    // Product's stats data for chart
    const data = Object.values(item.stats[0]);
    const labels = ["Hp", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];

    const backgroundShiny = require('..\\images\\shiny_background.png');

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handelAddToCart = () => {
        //TODO: add to cart 
        setQuantityModalVisible(true);
    }

    const handleEditItem = () => {
        navigation.navigate('AddPokemon', { item: item });
    }

    const handleDeleteItem = () => {
        //TODO: delete product from database
        Alert.alert(`Delete ${presentableWord(item.name)} from the store?`, 'Click OK to delete', [
            {
                text: 'OK',
                onPress: () => console.log(`delete product: ${item._id}, ${item.name} click`)
            },
            {
                text: 'CANCEL',
                style: 'cancel'
            }

        ])

    }


    return (
        <SafeAreaView style={styles.container}>
            <View>

                {/* Back to previous screen  */}
                <View style={styles.backContainer}>
                    <Pressable onPress={handleBackPress}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </Pressable>
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>| {prevScreen}</Text>
                </View>


                <ScrollView contentContainerStyle={[styles.infoContainer]}>
                    <Pressable>
                        <View>
                            <ImageBackground
                                style={styles.imageBackground}
                                source={item.isShiny ? backgroundShiny : { uri: 'https://img.freepik.com/free-vector/gradient-zoom-effect-background_23-2149751078.jpg?size=626&ext=jpg' }}>

                                <View>
                                    <Image style={styles.image} source={{ uri: item.img }} />


                                </View>
                            </ImageBackground>
                        </View>


                        {/* Product's info */}

                        <View style={{ borderColor: 'black', borderWidth: 1, paddingBottom: 10 }}>
                            <View style={styles.nameGenderLevelContainer}>

                                <View style={styles.userNameContainer}>
                                    <Ionicons name="person" size={18} color="white" style={{ backgroundColor: 'black', borderRadius: 10 }} />
                                    <Text style={styles.userNameText}>{item.user.name}</Text>
                                </View>
                                <View>
                                    <Text style={styles.level}>LV: {item.level}</Text>


                                </View>

                                <View>
                                    <Text style={styles.name}>{presentableWord(item.name)}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: 'black', borderBottomWidth: 1, borderCurve: 'continuous', alignItems: 'center', justifyContent: 'center' }}>
                                        {item.types.map((type, index) => (
                                            <View key={type}>
                                                <Text style={{ color: 'gray' }}>{presentableWord(type)} {index < item.types.length - 1 ? ' / ' : ''} </Text>
                                            </View>

                                        ))}


                                    </View>


                                </View>


                                {item.gender ? (
                                    <Foundation name="female-symbol" size={35} color="pink" style={styles.gender} />
                                ) : (
                                    <Foundation name="male-symbol" size={35} color="blue" style={styles.gender} />
                                )}

                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={{ opacity: 1, fontWeight: 'bold', fontSize: 20 }}>{item.price}</Text>
                                <CurrencyPD
                                    style={styles.currency}
                                />
                            </View>
                        </View>




                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', height: 'auto', paddingBottom: 80 }}>
                            <View style={styles.statsContainer}>
                                <RadarChart data={data} labels={labels} size={screenWidth - 120} />
                            </View>

                            <View style={styles.abilitiesMovesTypesContainer}>
                                <View style={{ paddingBottom: 3, borderBottomColor: 'black', borderBottomWidth: 1, paddingBottom: 10 }}>
                                    <Text style={styles.abilitiesMovesTypesText}>ABILITIES</Text>
                                    {item.abilities.map((ability) => (
                                        <View key={ability} style={[styles.abilitiesMovesList, { borderColor: "#8D32F4", borderWidth: 1 }]}>
                                            <Entypo name="light-bulb" size={20} color="black" />
                                            <Text style={{ fontSize: 14, maxWidth: 65, textAlign: 'center' }}>{presentableWord(ability)}</Text>
                                        </View>

                                    ))}

                                </View>
                                <View>
                                    <Text style={styles.abilitiesMovesTypesText}>MOVES</Text>
                                    {item.moves.map((move) => (
                                        <View key={move} style={[styles.abilitiesMovesList, { borderColor: '#6EF432', borderWidth: 1 }]}>
                                            <FontAwesome6 name="hand-back-fist" size={20} color="black" />
                                            <Text style={{ fontSize: 14, maxWidth: 65, textAlign: 'center' }}>{presentableWord(move)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </ScrollView>

            </View>


            {/* If the user uploaded the product, they can not add to cart but can edit or delete the product  */}
            {user.userId === item.user._id ? (
                <View style={[styles.addToCartContainer, { flexDirection: 'row', backgroundColor: 'white', borderColor: 'black', borderTopWidth: 1 }]}>
                    <Pressable style={{ width: '50%', alignItems: 'center', backgroundColor: 'black', borderColor: 'black', borderRightWidth: 1 }} onPress={handleEditItem}>
                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 17, padding: 10, }}>EDIT</Text>
                    </Pressable>
                    <Pressable style={{ width: '50%', alignItems: 'center', backgroundColor: 'orange' }} onPress={handleDeleteItem}>
                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 17, padding: 10 }}>DELETE</Text>
                    </Pressable>



                </View>
            ) : (
                // Add to cart button
                <View style={styles.addToCartContainer}>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center' }} onPress={handelAddToCart}>

                        <Text style={{ color: 'white', fontSize: 17, marginRight: 5 }}>ADD TO CART</Text>
                        <Text style={{ color: 'white' }}>({item.quantity} left)</Text>
                    </Pressable>

                    <QuantityModel
                        item={item}
                        setModalVisible={setQuantityModalVisible}
                        modalVisible={quantityModalVisible}

                    />
                </View>
            )}




        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        backgroundColor: 'white',
        flex: 1,
    },
    imageBackground: {

    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
        paddingBottom: 5,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        margin: 2,
        backgroundColor: 'white'
    },
    infoContainer: {},
    image: {
        resizeMode: 'contain',
        height: 300,
        width: 300,
        alignSelf: 'center',
        paddingBottom: 60
    },
    nameGenderLevelContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // borderColor: 'black',
        // borderWidth: 1,
        // padding: 15,
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 18
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
        paddingRight: 3,
        position: 'absolute',
        top: 1,
        right: 2,
        padding: 3,
    },
    userNameText: {
        fontSize: 15,
        marginLeft: 3
    },
    name: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    level: {
        fontSize: 18
    },
    priceContainer: {
        marginLeft: 12,
        marginTop: 5,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#FEB2B2',
        padding:2,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    statsContainer: {
        // alignItems: 'center',
        // justifyContent: 'center',


    },
    abilitiesMovesTypesContainer: {
        borderLeftColor: 'black',
        borderLeftWidth: 1,
        // width: 100,
        flexWrap: 'wrap',
        marginRight: 6,
        alignItems: 'center',
        justifyContent: 'center',

    },
    abilitiesMovesTypesText: {
        fontSize: 17,
        padding: 3,
        alignSelf: 'center',

    },
    abilitiesMovesList: {
        alignSelf: 'center',
        // backgroundColor:"#FFE9E9",
        borderRadius: 14,
        // borderColor:'#FFCBCB',
        borderWidth: 1,
        padding: 2,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    addToCartContainer: {
        alignItems: 'center',
        backgroundColor: 'black',
        bottom: 0,
        padding: 5,
        position: 'absolute',
        width: '100%'
    },
    editDeleteContainer: {
        flexDirection: 'row'
    },
    currency: {
        width: 18,
        height: 18,
        resizeMode: 'contain',
    }
});

export default ProductScreen;
