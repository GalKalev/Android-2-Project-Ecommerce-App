import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, SafeAreaView, StyleSheet, Image, Alert, Platform, FlatList, TouchableWithoutFeedback, Keyboard, Animated } from 'react-native';
import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons'; // Assuming you're using Expo icons
import { IP_ADDRESS } from '@env';
import FloatingButton from '../components/FloatingButton';
import SearchInput from '../components/SearchInput';
import { presentableWord } from '../utils/consts';
import ImageSlider from '../components/ImageSlider'
import Loading from '../components/Loading';
import FIlterOptions from '../components/FIlterOptions'
import Product from '../components/Product';
import {fetchPokemons} from "../api/apiServices";

// export const [cart, setCart] = useState([]);

const HomeScreen = () => {

    const [pokemonList, setPokemonList] = useState([])
    const [searchPokemons, setSearchPokemons] = useState([]);
    const [filteredPokemon, setFilteredPokemons] = useState([])
    const [searchPokemonsList, setSearchPokemonsList] = useState([]);
    const [pokemonsNameList, setPokemonNameList] = useState([]);
    const [searchedPokemon, setSearchedPokemon] = useState([]);

    // Set search items list visibility when touching the background
    const [isSearchItemsListVisible, setIsSearchItemsListVisible] = useState();

    // UseState for loading screen
    const [isLoading, setIsLoading] = useState(false);

    // UseState for filter
    const [isFilterOpen, setFilter] = useState(false);


    // Animation opening/closing the filter
    const animation = useRef(new Animated.Value(0)).current;



    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);

                const pokemonsList = await fetchPokemons();
                if(pokemonsList!=null){
                    const names = pokemonsList.map(poke => poke.name);
                    const pokemonNames = [...new Set(names)];

                    setSearchPokemons(pokemonNames);
                    setPokemonNameList(pokemonNames);
                    setPokemonList(pokemonsList);
                    setFilteredPokemons(pokemonsList);
                }
            } catch (error) {
                console.log(`Error fetching Pokémon: ${error.message}`);
            }finally {
                setIsLoading(false);
            }
        }
        fetchData();

    }, [])


    function handleChosenPokemon(name) {
        console.log(`pressed poke name: ${name} `);
    }


    function handleSearchInput(txt) {
        setIsSearchItemsListVisible(true);
        setSearchPokemonsList(txt);
        const lowerTxt = txt.toLowerCase();
        // console.log(pokemonsNameList);
        const names = pokemonsNameList.filter(name => name.startsWith(lowerTxt));
        // console.log(names);
        setSearchPokemons(names);
    }

    function handleBackgroundPress() {
        setIsSearchItemsListVisible(false);
        // setSearchedPokemon('');
    }

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

    if (isLoading || pokemonList.length === 0) {
        return (
            <Loading />
        )
    }

    return (
        <TouchableWithoutFeedback onPress={handleBackgroundPress}>
            <SafeAreaView style={styles.homeScreenContainer}>
                <View>
                    <Pressable onPress={() => setIsSearchItemsListVisible(true)}>
                        <SearchInput
                            styleSearchContainer={styles.searchContainer}
                            styleSearchBar={styles.searchBar}
                            stylesInput={styles.input}
                            handleSearchInput={handleSearchInput}
                            placeholder={"Search Poke Store..."}
                            value={searchedPokemon}
                        />


                    </Pressable>

                    {/* List of the searched pokemons  */}
                    {searchPokemonsList && (
                        searchPokemons.length === (pokemonList.length) ? (
                            <></>
                        ) : searchPokemons.length === 0 ? (
                            <View>
                                <Text style={[styles.sectionTitle, { alignSelf: 'center', marginTop: 0 }]}>
                                    Pokémon not found...
                                </Text>
                            </View>
                        ) : (
                            <View>
                                {isSearchItemsListVisible && (
                                    // List of the searched pokemons
                                    <FlatList
                                        style={styles.searchList}
                                        data={searchPokemons}
                                        keyExtractor={(item) => item}
                                        renderItem={({ item }) => (
                                            <Pressable style={{ flexDirection: 'row' }}
                                                onPress={() => handleChosenPokemon(item)}>
                                                <View style={{ flexDirection: 'column' }}>
                                                    <Text>{presentableWord(item)}</Text>
                                                </View>
                                            </Pressable>
                                        )}
                                    />

                                )}
                            </View>
                        )
                    )}
                </View>

                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {/* Image slider of the shop */}

                    <Pressable>
                        <ImageSlider />
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
                                    <Text>No items were found...</Text>
                                </View>
                            ) : (
                                // Filter Options

                                <View style={{ marginTop: 15 }}>


                                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>



                                        {filteredPokemon.map((poke, index) => {

                                            return (
                                              <View key={poke.id}>

                                                <Product
                                                    item={poke}
                                                    screen={'Home Page'}
                                                    // setCart={setCart}
                                                    // cart={cart}
                                                />
                                                </View>

                                            )
                                        })}

                                    </View>

                                </View>
                            )}


                        </View>

                    </Pressable>

                </ScrollView>

                <FloatingButton />
            </SafeAreaView >

        </TouchableWithoutFeedback>

    );
};

export default HomeScreen

const styles = StyleSheet.create({
    homeScreenContainer: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white'
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 7,
        gap: 10,
        backgroundColor: "white",
        borderRadius: 3,
        height: 38,
        flex: 1
    },
    searchContainer: {
        backgroundColor: "#3b4cca",
        padding: 10,
        flexDirection: "row",
        alignItems: "center",

    },
    searchList: {
        position: 'absolute',
        top: 0, // Adjust this value based on the height of your input
        // left: 5,
        // right: 10,
        // maxHeight: '100%',
        minHeight: '100%',
        width: '100%',
        borderColor: 'gray',
        borderWidth: 1.5,
        backgroundColor: 'white',
        zIndex: 1
    },
    productsHeadline: {
        fontSize: 20,
        alignSelf: 'center',
        fontStyle: 'italic',
    },
    input: {
        marginLeft: 10,
        flex: 1,
    },
    pokemonInfoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    pokemonSearchedNames: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    pokemonImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
})







