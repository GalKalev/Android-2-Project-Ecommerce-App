import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, SafeAreaView, StyleSheet, Image, Alert, Platform, FlatList, TouchableWithoutFeedback, RefreshControl, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Feather } from '@expo/vector-icons'; // Assuming you're using Expo icons
import FloatingButton from '../components/FloatingButton';
import SearchInput from '../components/SearchInput';
import { presentableWord } from '../utils/consts';
import ImageSlider from '../components/ImageSlider'
import Loading from '../components/Loading';
import FilterOptions from '../components/FilterOptions'
import Product from '../components/Product';

import { fetchPokemons } from "../api/apiServices";
import NoItems from '../components/NoItems';


const HomeScreen = () => {

    const navigator = useNavigation();

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
    // const [isRefreshing, setIsRefreshing] = useState(false);

    // UseState for filter
    const [isFilterOpen, setFilter] = useState(false);

    // Animation opening/closing the filter
    const animation = useRef(new Animated.Value(0)).current;

    // Scroll position
    const scrollViewRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const fetchData = useCallback(async () => {

        try {

            setIsLoading(true);

            const pokemonsList = await fetchPokemons();
            if (pokemonsList !== null) {

                const names = pokemonsList.map(poke => poke.name);
                const pokemonNames = [...new Set(names)];

                setSearchPokemons(pokemonNames);
                setPokemonNameList(pokemonNames);
                setPokemonList(pokemonsList);
                setFilteredPokemons(pokemonsList);
            }
        } catch (error) {
            console.log(`Error fetching Pokémon home screen: ${error.message}`);
            Alert.alert('Server Error', 'Please try again later');
        } finally {
            setIsLoading(false);
        }
    }, [])

    useEffect(() => {
        console.log('home useEffect active');

        fetchData();

    }, [fetchData])

    useEffect(() => {
        console.log('home useEffect2 active');
        console.log(scrollPosition);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: scrollPosition, animated: false });
        }
    }, [isLoading]);



    function handleChosenPokemon(name) {
        const pokemonsWithName = pokemonList.filter((poke) => poke.name === name);
        // console.log(pokemonsWithName);
        navigator.navigate('SearchProduct', { pokemonList: pokemonsWithName, name: presentableWord(name) });
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

    if (isLoading) {
        return (
            <Loading loading={isLoading} />
        )
    }

    return (
        <SafeAreaView style={styles.homeScreenContainer}>
            <View >
                <Pressable style={{ minHeight: 70 }} onPress={() => setIsSearchItemsListVisible(true)}>
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
                {searchPokemonsList && isSearchItemsListVisible && (
                    searchPokemons.length === (pokemonList.length) ? (
                        <></>
                    ) : searchPokemons.length === 0 ? (
                        <View style={[styles.searchList, { alignSelf: 'center', justifyContent: 'center' }]}>
                            <Text style={{ alignSelf: 'center', marginTop: 0, textAlign: 'center', fontSize: 16 }}>
                                Pokémon not found...
                            </Text>
                        </View>
                    ) : (

                        //  List of the searched pokemons 
                        <FlatList
                            // nestedScrollEnabled

                            style={styles.searchList}
                            data={searchPokemons}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <Pressable style={{ flexDirection: 'row', alignSelf: 'center', padding: 6 }}
                                    onPress={() => handleChosenPokemon(item)}>
                                    <View style={{ flexDirection: 'column' }}>
                                        <Text style={{ fontSize: 18 }}>{presentableWord(item)}</Text>
                                    </View>
                                </Pressable>
                            )}
                        />


                    )
                )}

            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchData} />}
                ref={scrollViewRef}
                onScroll={(event) => setScrollPosition(event.nativeEvent.contentOffset.y)}
                scrollEventThrottle={16}

            >
                {/* Image slider of the shop */}



                <Pressable onPress={handleBackgroundPress}>
                    <ImageSlider />


                    {pokemonList.length === 0 ? (
                        <View>
                            <NoItems
                                text={'Out of products in store!! You can sell your Pokemons or come back later'}
                            />
                        </View>
                    ) : (
                        <View>
                            <FilterOptions
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
                                        text={'No Products Found...'}
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
                                                        scrollPosition={scrollPosition}
                                                        setScrollPosition={setScrollPosition}
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

            <FloatingButton />
        </SafeAreaView >


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
        flex: 1

    },

    searchList: {
        position: 'absolute',
        top: 70,
        maxHeight: 200,
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
