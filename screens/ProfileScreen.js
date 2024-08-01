import { Alert, Image, ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, Settings, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native'
import ExpandableList from '../components/ExpandableList ';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CurrencyPD from '../components/CurrencyPD';
import ProductProfile from '../components/ProductProfile';
import { presentableWord } from '../utils/consts';
import { useUser } from '../utils/UserContext';
import Loading from '../components/Loading';
import D3Chart from '../components/D3Chart';
import UserSettings from '../components/UserSettings';
import {getOrders} from '../api/apiServices'

const ProfileScreen = () => {

    const { user, setUser } = useUser();

    // TODO: uncomment when user is sent
    // const route = useRoute();
    // const {user} = route.params;
    const navigator = useNavigation();

    // const user = { name: 'K', email: 'k@k.com' }
    const [isLoading, setIsLoading] = useState(false);

    const [orders, setOrders] = useState([]);
    const [userProducts, setUserProducts] = useState([]);

    const [soldData, setSoldData] = useState([]);
    const [boughtData, setBoughtData] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
                //TODO: get the orders from the database
                const dummyOrders = [
                    {
                        _id: 0,
                        products: [
                            {
                                product: {
                                    _id: 0,
                                    user: 'gal',
                                    name: 'pikachu',
                                    url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                                    gender: 0,
                                    level: 50,
                                    isShiny: false,
                                    abilities: ['static'],
                                    moves: ['mega-punch', 'thunder-punch', 'slam'],
                                    species: ['pikachu'],
                                    stats: [{
                                        hp: 50,
                                        attack: 30,
                                        defense: 40,
                                        specialAttack: 60,
                                        specialDefense: 70,
                                        speed: 20
                                    }],
                                    types: ['electric'],
                                    price: 8000,
                                    quantity: 2,
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 2,
                                    user: 'ash',
                                    name: 'charizard',
                                    url: 'https://pokeapi.co/api/v2/pokemon/charizard/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
                                    gender: 0,
                                    level: 36,
                                    isShiny: false,
                                    abilities: ['blaze', 'solar-power'],
                                    moves: ['flamethrower', 'fly', 'dragon-claw'],
                                    species: ['charizard'],
                                    stats: [{
                                        hp: 78,
                                        attack: 84,
                                        defense: 78,
                                        specialAttack: 109,
                                        specialDefense: 85,
                                        speed: 100
                                    }],
                                    types: ['fire', 'flying'],
                                    price: 15000,
                                    quantity: 1
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 1,
                                    user: 'raz',
                                    name: 'venusaur',
                                    url: 'https://pokeapi.co/api/v2/pokemon/venusaur/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/3.png',
                                    gender: 1,
                                    level: 4,
                                    isShiny: true,
                                    abilities: ['overgrow', 'chlorophyll'],
                                    moves: ['swords-dance', 'bind'],
                                    species: ['venusaur'],
                                    stats: [{
                                        hp: 20,
                                        attack: 30,
                                        defense: 40,
                                        specialAttack: 15,
                                        specialDefense: 23,
                                        speed: 17
                                    }],
                                    types: ['grass', 'poison'],
                                    price: 1000,
                                    quantity: 4
                                },
                                quantity: 2
                            }
                        ],
                        totalPrice: 25000,
                        shippingAddress: {
                            region: 'Region Dummy',
                            location: 'Location Dummy',
                            houseNo: 5
                        },
                        createdAt: '2024-04-27T10:13:18.637+00:00'
                    },
                    {
                        _id: 1,
                        products: [
                            {
                                product: {
                                    _id: 3,
                                    user: 'misty',
                                    name: 'psyduck',
                                    url: 'https://pokeapi.co/api/v2/pokemon/psyduck/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png',
                                    gender: 1,
                                    level: 30,
                                    isShiny: false,
                                    abilities: ['damp', 'cloud-nine'],
                                    moves: ['water-gun', 'confusion', 'tail-whip'],
                                    species: ['psyduck'],
                                    stats: [{
                                        hp: 60,
                                        attack: 48,
                                        defense: 50,
                                        specialAttack: 65,
                                        specialDefense: 50,
                                        speed: 55
                                    }],
                                    types: ['water'],
                                    price: 3000,
                                    quantity: 1
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 4,
                                    user: 'brock',
                                    name: 'onix',
                                    url: 'https://pokeapi.co/api/v2/pokemon/onix/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',
                                    gender: 0,
                                    level: 22,
                                    isShiny: false,
                                    abilities: ['rock-head', 'sturdy'],
                                    moves: ['rock-throw', 'dig', 'iron-tail'],
                                    species: ['onix'],
                                    stats: [{
                                        hp: 35,
                                        attack: 45,
                                        defense: 160,
                                        specialAttack: 30,
                                        specialDefense: 45,
                                        speed: 70
                                    }],
                                    types: ['rock', 'ground'],
                                    price: 5000,
                                    quantity: 1
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 7,
                                    user: 'dawn',
                                    name: 'piplup',
                                    url: 'https://pokeapi.co/api/v2/pokemon/piplup/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png',
                                    gender: 1,
                                    level: 15,
                                    isShiny: false,
                                    abilities: ['torrent'],
                                    moves: ['bubble', 'peck', 'growl'],
                                    species: ['piplup'],
                                    stats: [{
                                        hp: 53,
                                        attack: 51,
                                        defense: 53,
                                        specialAttack: 61,
                                        specialDefense: 56,
                                        speed: 40
                                    }],
                                    types: ['water'],
                                    price: 2000,
                                    quantity: 1
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 8,
                                    user: 'may',
                                    name: 'torchic',
                                    url: 'https://pokeapi.co/api/v2/pokemon/torchic/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/255.png',
                                    gender: 0,
                                    level: 12,
                                    isShiny: false,
                                    abilities: ['blaze'],
                                    moves: ['ember', 'scratch', 'growl'],
                                    species: ['torchic'],
                                    stats: [{
                                        hp: 45,
                                        attack: 60,
                                        defense: 40,
                                        specialAttack: 70,
                                        specialDefense: 50,
                                        speed: 45
                                    }],
                                    types: ['fire'],
                                    price: 1500,
                                    quantity: 2
                                },
                                quantity: 2
                            },
                            {
                                product: {
                                    _id: 9,
                                    user: 'serena',
                                    name: 'fennekin',
                                    url: 'https://pokeapi.co/api/v2/pokemon/fennekin/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/653.png',
                                    gender: 1,
                                    level: 10,
                                    isShiny: false,
                                    abilities: ['blaze'],
                                    moves: ['scratch', 'ember', 'tail-whip'],
                                    species: ['fennekin'],
                                    stats: [{
                                        hp: 40,
                                        attack: 45,
                                        defense: 40,
                                        specialAttack: 62,
                                        specialDefense: 60,
                                        speed: 60
                                    }],
                                    types: ['fire'],
                                    price: 2500,
                                    quantity: 1
                                },
                                quantity: 1
                            }
                        ],
                        totalPrice: 14000,
                        shippingAddress: {
                            region: 'Region Dummy 2',
                            location: 'Location Dummy 2',
                            houseNo: 10
                        },
                        createdAt: '2024-05-15T08:47:22.541+00:00'
                    },
                    {
                        _id: 2,
                        products: [
                            {
                                product: {
                                    _id: 5,
                                    user: 'jessie',
                                    name: 'ekans',
                                    url: 'https://pokeapi.co/api/v2/pokemon/ekans/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png',
                                    gender: 1,
                                    level: 20,
                                    isShiny: false,
                                    abilities: ['intimidate', 'shed-skin'],
                                    moves: ['poison-sting', 'bite', 'wrap'],
                                    species: ['ekans'],
                                    stats: [{
                                        hp: 35,
                                        attack: 60,
                                        defense: 44,
                                        specialAttack: 40,
                                        specialDefense: 54,
                                        speed: 55
                                    }],
                                    types: ['poison'],
                                    price: 2000,
                                    quantity: 1
                                },
                                quantity: 1
                            },
                            {
                                product: {
                                    _id: 6,
                                    user: 'james',
                                    name: 'koffing',
                                    url: 'https://pokeapi.co/api/v2/pokemon/koffing/',
                                    img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png',
                                    gender: 0,
                                    level: 18,
                                    isShiny: false,
                                    abilities: ['levitate'],
                                    moves: ['smog', 'tackle', 'sludge'],
                                    species: ['koffing'],
                                    stats: [{
                                        hp: 40,
                                        attack: 65,
                                        defense: 95,
                                        specialAttack: 60,
                                        specialDefense: 45,
                                        speed: 35
                                    }],
                                    types: ['poison'],
                                    price: 1500,
                                    quantity: 2
                                },
                                quantity: 1
                            }
                        ],
                        totalPrice: 3500,
                        shippingAddress: {
                            region: 'Region Dummy 3',
                            location: 'Location Dummy 3',
                            houseNo: 15
                        },
                        createdAt: '2024-06-04T17:22:38.832+00:00'
                    }
                ];

                const resOrders = await getOrders(user.userId);
                console.log("profile resOrders.data")
                console.log(resOrders)
                if(resOrders.data){
                    const orders = resOrders.data
                    console.log("profile orders")
                    console.log(orders[0].products)
                   
                    setOrders(orders);
                }

                // const dummyOrders = [];

                //TODO: get user's products from database
                // const dummyUserProducts = [
                //     {

                //         _id: 0,
                //         user: 'K',
                //         name: 'pikachu',
                //         url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
                //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                //         gender: 0,
                //         level: 50,
                //         isShiny: false,
                //         abilities: ['static'],
                //         moves: ['mega-punch', 'thunder-punch', 'slam'],
                //         species: ['pikachu'],
                //         stats: [{
                //             hp: 50,
                //             attack: 30,
                //             defense: 40,
                //             specialAttack: 60,
                //             specialDefense: 70,
                //             speed: 20
                //         }],
                //         types: ['electric'],
                //         price: 8000,
                //         quantity: 2,

                //     },
                //     {

                //         _id: 1,
                //         user: 'K',
                //         name: 'bulbasaur',
                //         url: 'https://pokeapi.co/api/v2/pokemon/bulbasaur/',
                //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
                //         gender: 1,
                //         level: 15,
                //         isShiny: false,
                //         abilities: ['overgrow'],
                //         moves: ['tackle', 'vine-whip', 'razor-leaf'],
                //         species: ['bulbasaur'],
                //         stats: [{
                //             hp: 45,
                //             attack: 49,
                //             defense: 49,
                //             specialAttack: 65,
                //             specialDefense: 65,
                //             speed: 45
                //         }],
                //         types: ['grass', 'poison'],
                //         price: 6000,
                //         quantity: 3,

                //     },
                //     {

                //         _id: 2,
                //         user: 'K',
                //         name: 'charmander',
                //         url: 'https://pokeapi.co/api/v2/pokemon/charmander/',
                //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
                //         gender: 0,
                //         level: 18,
                //         isShiny: true,
                //         abilities: ['blaze'],
                //         moves: ['scratch', 'ember', 'dragon-rage'],
                //         species: ['charmander'],
                //         stats: [{
                //             hp: 39,
                //             attack: 52,
                //             defense: 43,
                //             specialAttack: 60,
                //             specialDefense: 50,
                //             speed: 65
                //         }],
                //         types: ['fire'],
                //         price: 7000,
                //         quantity: 1,

                //     },
                //     {

                //         _id: 3,
                //         user: 'K',
                //         name: 'squirtle',
                //         url: 'https://pokeapi.co/api/v2/pokemon/squirtle/',
                //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
                //         gender: 1,
                //         level: 20,
                //         isShiny: false,
                //         abilities: ['torrent'],
                //         moves: ['water-gun', 'bubble', 'tackle'],
                //         species: ['squirtle'],
                //         stats: [{
                //             hp: 44,
                //             attack: 48,
                //             defense: 65,
                //             specialAttack: 50,
                //             specialDefense: 64,
                //             speed: 43
                //         }],
                //         types: ['water'],
                //         price: 6500,
                //         quantity: 2,
                //     },

                //     {

                //         _id: 4,
                //         user: 'K',
                //         name: 'jigglypuff',
                //         url: 'https://pokeapi.co/api/v2/pokemon/jigglypuff/',
                //         img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
                //         gender: 0,
                //         level: 22,
                //         isShiny: false,
                //         abilities: ['cute-charm'],
                //         moves: ['pound', 'sing', 'double-slap'],
                //         species: ['jigglypuff'],
                //         stats: [{
                //             hp: 115,
                //             attack: 45,
                //             defense: 20,
                //             specialAttack: 45,
                //             specialDefense: 25,
                //             speed: 20
                //         }],
                //         types: ['normal', 'fairy'],
                //         price: 5000,
                //         quantity: 4,

                //     },
                // ];

                //TODO: get user's sold pokemons (amount and time)
                const boughtProductsData = dummyOrders.map((order) => ({
                    date: new Date(order.createdAt),
                    value: order.totalPrice,
                }));

                setOrders(dummyOrders);
                // setUserProducts(dummyUserProducts)
                setBoughtData(boughtProductsData);
            } catch {
                console.log('Error fetching profile: ' + e.message);
                Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();

    }, []);


    const sections = [
        // User's previous orders
        {
            id: 1,
            title: "Orders",
            icon: <MaterialCommunityIcons name="package-variant" size={24} color="black" />,
            content:
                <View>
                    {orders.length > 0 ? (orders.map((order) => {
                        return (
                            <View style={{ marginBottom: 20 }} key={order._id}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17 }}>Payed: {order.totalPrice}</Text>
                                    <CurrencyPD
                                        style={styles.currency} />
                                </View>

                                <ScrollView horizontal>
                                    {order.products.map((product) => {
                                        console.log('product')
                                        console.log(product)
                                        return (
                                            <View key={product}></View>
                                            // <ProductProfile
                                            //     key={product.product._id}
                                            //     product={product.product}
                                            //     quantityBought={product.quantity}

                                            // />
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        )
                    })
                    ) : (
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>You have not ordered any products yet...</Text>
                    )}
                </View>

        },

        // User's products for sale
        {
            id: 2,
            title: "My Products",
            icon: <MaterialIcons name="sell" size={24} color="black" />,
            content:
                <View>
                    {userProducts.length > 0 ? (
                        <ScrollView horizontal>
                            {userProducts.map(product => {
                                return (

                                    <View key={product._id}>
                                        <ProductProfile

                                            product={product}
                                            quantitySold={product.quantity}
                                        />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                            <Pressable onPress={() => handleEditProduct(product)}>
                                                <AntDesign name="edit" size={24} color="black" />
                                            </Pressable>
                                            <Pressable onPress={() => handleDeleteProduct(product)}>
                                                <Ionicons name="trash" size={24} color="black" />
                                            </Pressable>
                                        </View>
                                    </View>

                                )
                            })}
                        </ScrollView>
                    ) : (
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>You have not sold any products yet...</Text>
                    )}

                </View>

        },
        // User's data
        //TODO: build the D3.js here (i think??)
        {
            id: 3,
            title: "Data",
            icon: <Entypo name="line-graph" size={24} color="black" />,
            content:
                <View style={{ paddingLeft: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Orders Data</Text>
                    <D3Chart
                        data={boughtData}
                        yAxisName={'Total Price'}
                    />
                </View>
        },
        // User's setting - can edit their name and log out of the account
        {
            id: 4,
            title: "Settings",
            icon: <Ionicons name="settings" size={24} color="black" />,
            content:
                <View>
                    <UserSettings />
                </View>
        },
    ];


    const handleEditProduct = (product) => {
        navigator.navigate('AddPokemon', { item: product });
    }

    const handleDeleteProduct = (product) => {
        //TODO: delete product from database
        Alert.alert(`Delete ${presentableWord(product.name)} from the store?`, 'Click OK to delete', [
            {
                text: 'OK',
                //TODO: delete product from store here 
                onPress: () => console.log(`delete product: ${product._id}, ${product.name} click`)
            },
            {
                text: 'CANCEL',
                style: 'cancel'
            }

        ])


    }


    if (isLoading) {
        return (
            <Loading
                loading={isLoading}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>


            <View style={styles.userInfo}>
                <Text style={{ fontSize: 20, color: 'white', marginBottom: 7 }}>Hi, {user.name}!</Text>
                <Text style={{ fontSize: 15, color: 'white' }}>{user.email}</Text>
            </View>


            <ExpandableList data={sections} />


        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white',
        // padding: 10
    },
    currency: {
        resizeMode: "contain",
        width: 15,
        height: 15
    },
    userInfo: {
        backgroundColor: '#3b4cca',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 6,
        paddingBottom: 18,
        paddingTop: 30,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10
    },
    logOutBtn: {
        backgroundColor: '#ff0000',
        alignItems: 'center',
        padding: 5,
        marginTop: 18,
        borderRadius: 5
    }, logOutBtnText: {
        fontSize: 18,
        fontWeight: 'bold'
    }

})