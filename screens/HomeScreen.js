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
                async function fetchPokemons() {
                    try {
                        setIsLoading(true);

                        //! Fetch product from database
                        //! Fetch products from user's cart

                        //! Demo pokemons before fetching from database
                        const demoPokemons = [
                            {
                                id: 0,
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
                                stats: {
                                    hp: 50,
                                    attack: 30,
                                    defense: 40,
                                    specialAttack: 60,
                                    specialDefense: 70,
                                    speed: 20
                                },
                                types: ['electric'],
                                price: 8000,
                                quantity: 2
                            },
                            {
                                id: 1,
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
                                stats: {
                                    hp: 20,
                                    attack: 30,
                                    defense: 40,
                                    specialAttack: 15,
                                    specialDefense: 23,
                                    speed: 17
                                },
                                types: ['grass', 'poison'],
                                price: 1000,
                                quantity: 4
                            },
                            {
                                id: 2,
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
                                stats: {
                                    hp: 78,
                                    attack: 84,
                                    defense: 78,
                                    specialAttack: 109,
                                    specialDefense: 85,
                                    speed: 100
                                },
                                types: ['fire', 'flying'],
                                price: 15000,
                                quantity: 1
                            },
                            {
                                id: 3,
                                user: 'misty',
                                name: 'gyarados',
                                url: 'https://pokeapi.co/api/v2/pokemon/gyarados/',
                                img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
                                gender: 1,
                                level: 45,
                                isShiny: true,
                                abilities: ['intimidate', 'moxie'],
                                moves: ['hydro-pump', 'hyper-beam', 'dragon-dance'],
                                species: ['gyarados'],
                                stats: {
                                    hp: 95,
                                    attack: 125,
                                    defense: 79,
                                    specialAttack: 60,
                                    specialDefense: 100,
                                    speed: 81
                                },
                                types: ['water', 'flying'],
                                price: 20000,
                                quantity: 1
                            },
                            {
                                id: 4,
                                user: 'brock',
                                name: 'onix',
                                url: 'https://pokeapi.co/api/v2/pokemon/onix/',
                                img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png',
                                gender: 0,
                                level: 20,
                                isShiny: false,
                                abilities: ['rock-head', 'sturdy'],
                                moves: ['rock-throw', 'earthquake', 'iron-tail'],
                                species: ['onix'],
                                stats: {
                                    hp: 35,
                                    attack: 45,
                                    defense: 160,
                                    specialAttack: 30,
                                    specialDefense: 45,
                                    speed: 70
                                },
                                types: ['rock', 'ground'],
                                price: 3000,
                                quantity: 5
                            },
                            {
                                id: 5,
                                user: 'gary',
                                name: 'umbreon',
                                url: 'https://pokeapi.co/api/v2/pokemon/umbreon/',
                                img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/197.png',
                                gender: 1,
                                level: 30,
                                isShiny: false,
                                abilities: ['synchronize'],
                                moves: ['dark-pulse', 'faint-attack', 'moonlight'],
                                species: ['umbreon'],
                                stats: {
                                    hp: 95,
                                    attack: 65,
                                    defense: 110,
                                    specialAttack: 60,
                                    specialDefense: 130,
                                    speed: 65
                                },
                                types: ['dark'],
                                price: 12000,
                                quantity: 3
                            },
                            {
                                id: 6,
                                user: 'ash',
                                name: 'pikachu',
                                url: 'https://pokeapi.co/api/v2/pokemon/pikachu/',
                                img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
                                gender: 1,
                                level: 5,
                                isShiny: false,
                                abilities: ['static'],
                                moves: ['quick-attack', 'thunderbolt', 'iron-tail'],
                                species: ['pikachu'],
                                stats: {
                                    hp: 35,
                                    attack: 55,
                                    defense: 40,
                                    specialAttack: 50,
                                    specialDefense: 50,
                                    speed: 90
                                },
                                types: ['electric'],
                                price: 1000,
                                quantity: 3
                            }
                        ];

                        const names = demoPokemons.map(poke => poke.name);
                        const pokemonNames = [...new Set(names)];

                        setSearchPokemons(pokemonNames);
                        setPokemonNameList(pokemonNames);
                        setPokemonList(demoPokemons);
                        setFilteredPokemons(demoPokemons);

                    } catch (error) {
                        console.log(`Error fetching Pokémon: ${error.message}`);
                    } finally {
                        setIsLoading(false);
                    }
                }

                fetchPokemons();
            } catch (error) {
                console.log(`Error fetching Pokémon: ${error.message}`);
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







