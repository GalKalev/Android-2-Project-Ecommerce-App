import { StyleSheet, Text, View, SafeAreaView, Pressable, Platform, Animated, ScrollView } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { AntDesign, Foundation } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react'
import Product from '../components/Product';
import { useUser } from '../utils/UserContext';
import FIlterOptions from '../components/FIlterOptions';
import Loading from '../components/Loading';
import NoItems from '../components/NoItems';

const SearchProductScreen = () => {
    const route = useRoute();
    const navigator = useNavigation();
    const { pokemonList, name } = route.params;
    const [filteredPokemon, setFilteredPokemons] = useState([]);
    const { user } = useUser();

    const [isLoading, setIsLoading] = useState(false);

    const [isFilterOpen, setFilter] = useState(false);

    const animation = useRef(new Animated.Value(0)).current;


    const handleBackPress = () => {
        navigator.goBack();
    };


    useEffect(() => {
        setIsLoading(true);
        setFilteredPokemons(pokemonList);
        setIsLoading(false);
    }, []);


    function toggleFilterMenu() {
        // setFilter(!isFilterOpen);
        if (isFilterOpen) {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setFilter(false));
        } else {
            setFilter(true);
            Animated.timing(animation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }

    const slideIn = {
        transform: [
            {
                translateX: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                }),
            },
        ],
    };

    if (isLoading) {
        return (<Loading loading={isLoading} />)
    }

    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.backContainer}>
                <Pressable onPress={handleBackPress}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
                <Text style={{ fontSize: 20, marginLeft: 5 }}>| Search: {name}</Text>
            </View>

            <View style={{alignSelf:'center', marginTop:8, padding:8}}>
                <Text style={{fontSize:20, fontWeight:'bold'}}>Found {pokemonList.length} {name}</Text>
            </View>


            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                {/* Image slider of the shop */}

                <Pressable>

                    {pokemonList.length === 0 ? (
                        <View>
                            <NoItems
                                text={'Out of products in store!! Sell your Pokemons or come back later'}
                            />
                        </View>
                    ) : (
                        <View>
                            <FIlterOptions
                                toggleFilterMenu={toggleFilterMenu}
                                isFilterOpen={isFilterOpen}
                                setFilter={setFilter}
                                items={pokemonList}
                                setLoading={setIsLoading}
                                filteredItems={filteredPokemon}
                                setFilteredItems={setFilteredPokemons}
                                slideIn={slideIn}
                            />
                            {/* Checking if a pokemon with the filters exist in the shop  */}
                            {filteredPokemon.length === 0 ? (
                                <View>
                                    <NoItems
                                        text={'No items were found...'}
                                    />
                                </View>
                            ) : (
                                // Filter Options
                                <View style={{ marginTop: 15 }}>

                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
                                        {filteredPokemon.map((poke, index) => {

                                            return (
                                                <View key={poke._id}>

                                                    <Product
                                                        item={poke}
                                                        screen={'Home Page'}
                                                        user={user}
                                                    />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                </Pressable>

            </ScrollView>
        </SafeAreaView>
    )
}

export default SearchProductScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        backgroundColor: 'white',
        flex: 1,
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
})