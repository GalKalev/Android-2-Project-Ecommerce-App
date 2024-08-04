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
import UserSettings from '../components/UserSettings';
import {getOrders, getUserProducts} from '../api/apiServices'

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

    useEffect(() => {

        const fetchData = async () => {
            try {
                setIsLoading(true);
                //TODO: get the orders from the database    

                const resOrders = await getOrders(user.userId);
                if(resOrders.data){
                    const orders = resOrders.data
                    setOrders(orders);
                }

                const resUserProducts = await getUserProducts(user.userId);
               
                if(resUserProducts.data){
                    const userProducts = resUserProducts.data
                    setUserProducts(userProducts);
                }

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
                    {orders?.length > 0 ? (orders.map((order) => (
                            <View style={{ marginBottom: 20 }} key={order._id}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 17 }}>Payed: {order.totalPrice}</Text>
                                    <CurrencyPD
                                        style={styles.currency} />
                                </View>

                                <ScrollView horizontal>
                                    {order.products.map((product) => {
                                        
                                        return (
                                            <ProductProfile
                                                key={product.product._id}
                                                product={product.product}
                                                quantityBought={product.quantity}

                                            />
                                        )
                                    })}
                                </ScrollView>
                            </View>
                        )
                    )
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
                    {userProducts?.length > 0 ? (
                        <ScrollView horizontal>
                            {userProducts.map(product => {
                                return (

                                    <View key={product._id}>
                                        <ProductProfile
                                            product={product}
                                            quantitySale={product.quantity}
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
                        <Text style={{ fontSize: 18, textAlign: 'center' }}>You don't have products up for sale</Text>
                    )}

                </View>

        },
        // User's app settings
        {
            id: 3,
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
                onPress: async() => {
                    try{
                        setIsLoading(true)
                        const response = await removePokemon(product._id)
                        if(response.data){
                            fetchData();
                        }
                    }catch(e){
                        console.log('error deleting product: ' + e.message);
                        Alert.alert('Error', 'Please try again later');
                    }finally{
                        setIsLoading(false);
                    }
                   
                }
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