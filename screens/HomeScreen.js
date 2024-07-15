import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, SafeAreaView, StyleSheet, Image, Alert, Platform, FlatList } from 'react-native';
import axios from 'axios';
import { AntDesign, Feather } from '@expo/vector-icons'; // Assuming you're using Expo icons
import { IP_ADDRESS } from '@env';
import FloatingButton from '../components/FloatingButton';
import SearchInput from '../components/SearchInput';
import { presentableWord } from '../utils/consts';

const HomeScreen = () => {
    // const [pokemonsNamesList, setPokemonsNameList] = useState([]);
    // const [pokemonsUrlList, setPokemonsUrlList] = useState([]);
    // const [filterdPokemonsNames, setFilteredPokemonsNames] = useState(pokemonsNamesList);
    // const [pokemonSearchedName, setPokemonSearchedName] = useState('');

    const [searchProducts, setSearchProducts] = useState([]);

    // function presentableWord(dataWord) {
    //     return dataWord.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    // }

    useEffect(() => {
        async function fetchData() {
            try {
                // setIsLoading(true);
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20`);
                if (!response.data) {
                    throw new Error('Pokémon not found. Please check the name and try again.');
                }

                const data = response.data.results;
                console.log(data[0].name, data[0].url);

                const names = data.map(item => item.name);
                const urls = data.map(item => item.url);

                setPokemonsNameList(names);
                setPokemonsUrlList(urls);

                console.log(names[0]);
                console.log(urls[0]);
                // const names = responseData.map(item => presentableWord(item.data.name)).join("\n");

                // console.log(response.data.result);

                // const pokemonInfo = {
                //     name: data.name,
                //     image: data.sprites.front_default, // Fetch front_default sprite for the image
                // };


                // setPokemonsNameList(data[0]);
            } catch (error) {
                console.log(`Error fetching Pokémon: ${error.message}`);
            }
        }
        fetchData();

    }, [])

    const handlePressedSearchedItem = (name) => {
        console.log(name);
    }

    const handleSearchInput = (txt) => {
      
    };

    const showSearchList = () => {
        return (
            <FlatList>
                {filterdPokemonsNames.map((name) => {
                    return (
                        <Pressable key={name} onPress={() => handlePressedSearchedItem(name)}>
                            <Text>{presentableWord(name)}</Text>
                        </Pressable >
                    );
                })}
            </FlatList>
        )
    }

    return (
        <SafeAreaView style={styles.homeScreenContainer}>
             <View>
                    <FlatList style={{backgroundColor:'red', width:20}}>
                        {filterdPokemonsNames.map((name) => {
                            return (
                                <Pressable key={name} onPress={() => handlePressedSearchedItem(name)}>
                                    <Text>{presentableWord(name)}</Text>
                                </Pressable >
                            );
                        })}
                    </FlatList>
                    </View>
            <ScrollView>
                <View>
                    <SearchInput
                        styleSearchContainer={styles.searchContainer}
                        styleSearchBar={styles.searchBar}
                        stylesInput={styles.input}
                        handleSearchInput={handleSearchInput}
                        placeholder={"Search pokemons, items, berries..."}
                        value={searchProducts}
                    />
                    {/* <View style={styles.searchContainer}>
                        <Pressable style={styles.searchBar}>
                            <AntDesign style={{ paddingLeft: 10 }}
                                name="search1"
                                size={24}
                                color="black" />
                            <TextInput
                                style={styles.input}
                                value={pokemonSearchedName}
                                onFocus={showSearchList}
                                onChangeText={(txt) => handleSearchInput(txt)}
                                placeholder="Search pokemons, items, berries..."
                            />
                        </Pressable>
                        <Feather style={{ backgroundColor: "white", borderRadius: 8, padding: 4 }}
                            name="mic"
                            size={24}
                            color="black" />
                    </View> */}
                   
                    

                    <View>
                        <Pressable>
                            <Text>
                                Pokemons
                            </Text>
                        </Pressable>
                    </View>
                    <View>
                        <Pressable>
                            <Text>
                                Items
                            </Text>
                        </Pressable>
                    </View>
                    <View>
                        <Pressable>
                            <Text>
                                Berries
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Other components like ImageSlider, Items, Pokemons, Berries */}
            </ScrollView>
            <FloatingButton/>
        </SafeAreaView>
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







