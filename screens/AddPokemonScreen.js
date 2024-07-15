import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert, Image, FlatList, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../components/SearchInput';
import Loading from '../components/Loading';
import axios from 'axios';
import { presentableWord } from '../utils/consts';
import Checkbox from 'expo-checkbox';
import { Pokemon } from '../classes/Pokemon';
import MultiSelectAdd from '../components/MultiSelectAdd';
import PokemonStats from '../components/PokemonStats';
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CurrencyPD from '../components/CurrencyPD';
import { IP_ADDRESS } from '@env';
import Toast from 'react-native-toast-message';

const AddPokemonScreen = () => {
    const [pokemonsList, setPokemonList] = useState([]);
    const [searchPokemon, setSearchPokemon] = useState('');
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [chosenPokemon, setChosenPokemon] = useState(null);
    const [pokemonLevel, setPokemonLevel] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [gender, setGender] = useState(0);
    const [isShiny, setIsShiny] = useState(false);
    const [pokemonAbilities, setPokemonAbilities] = useState([]);
    const [selectedAbilities, setSelectedAbilities] = useState([]);
    const [pokemonMoves, setPokemonMoves] = useState([]);
    const [selectedPokemonMoves, setSelectedPokemonMoves] = useState([]);
    const [selectedHP, setSelectedHP] = useState(0);
    const [selectedAttack, setSelectedAttack] = useState(0);
    const [selectedDefense, setSelectedDefense] = useState(0);
    const [selectedSpecialAttack, setSelectedSpecialAttack] = useState(0);
    const [selectedSpecialDefense, setSelectedSpecialDefense] = useState(0);
    const [selectedSpeed, setSelectedSpeed] = useState(0);
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);

    function handleSearchInput(txt) {
        setSearchPokemon(txt);
        const lowerTxt = txt.toLowerCase();
        const filteredNames = pokemonsList.filter(pokemon => pokemon.name.startsWith(lowerTxt));
        setFilteredPokemons(filteredNames);
    }

    async function fetchChosenPokemon(poke) {
        try {
            setIsLoading(true);
            setSearchPokemon('');
            const response = await axios.get(`${poke.url}`);
            if (!response.data) {
                throw new Error('Error fetching a pokemon');
            }

            const data = response.data;
            const abilities = data.abilities.map(ab => ab.ability.name);
            setPokemonAbilities(abilities);
            const moves = data.moves.map(mv => mv.move.name);
            setPokemonMoves(moves);
            const stats = data.stats.map(st => ({
                name: st.stat.name,
                statLevel: st.base_stat
            }));

            const types = data.types.map(ty => ty.type.name);

            const pokemon = {
                name: poke.name,
                url: poke.url,
                imgDefault: data.sprites.front_default,
                imgShiny: data.sprites.front_shiny,
                abilities: abilities,
                moves: moves,
                species: data.species.name,
                stats: stats,
                types: types
            };

            // console.log(pokemon);

            setChosenPokemon(pokemon);
            setSelectedAbilities(abilities[0]);

        } catch (error) {
            console.log(`Error fetching Pokémon: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChosenPokemon(poke) {
        fetchChosenPokemon(poke);
    }

    function handleLevelChange(lvl) {
        if (lvl > 100) {
            Alert.alert('Incorrect Level', 'Pokemon level are between 0 to 100.');
            return;
        }
        setPokemonLevel(lvl);
    }

    const validateInput = () => {
        const regex = /^[1-9]\d*$/;
    
        const isPositiveInteger = (value) => regex.test(value);
        const isValidAbility = (abilities) => abilities.length > 0;
        const isValidLevel = (level) => isPositiveInteger(level) && level <= 100;
    
        if (!isValidAbility(selectedAbilities)) {
            Alert.alert('Invalid Input', 'Abilities must be selected');
            return false;
        }
    
        const stats = [selectedAttack, selectedDefense, selectedHP, selectedSpecialAttack, selectedSpecialDefense, amount];
    
        for (let stat of stats) {
            if (!isPositiveInteger(stat)) {
                Alert.alert('Invalid Input', 'Stats must be positive integers');
                return false;
            }
        }
    
        if (!isValidLevel(pokemonLevel)) {
            Alert.alert('Invalid Input', 'Pokemon level must be between 1 and 100');
            return false;
        }
    
        return true;
    };

    async function submitPokemon() {
    
        // const regex = /^[1-9]*$/;
        // if (selectedAbilities.length === 0 || !regex.test(selectedAttack) || !regex.test(selectedDefense)
        //     || !regex.test(selectedHP) || !regex.test(selectedSpecialAttack) || !regex.test(selectedSpecialDefense) ||
        //     !regex.test(amount) || !regex.test(pokemonLevel) || pokemonLevel > 100) {
        //     Alert.alert('Invalid Input', 'Make sure to input correct details');
        //     return;
        // }

        if (!validateInput()) {
            return;
        }
        console.log(IP_ADDRESS);
        const image = isShiny ? chosenPokemon.imgShiny : chosenPokemon.imgDefault;
        const stats = {
            hp: selectedHP,
            defense: selectedDefense,
            attack: selectedAttack,
            specialAttack: selectedSpecialAttack,
            specialDefense: selectedSpecialDefense,
            speed: selectedSpeed
        }

        const soldPokemon = {
            name: chosenPokemon.name,
            url:  chosenPokemon.url,
            img: image,
            gender: gender,
            level: pokemonLevel,
            isShiny: isShiny,
            abilities: selectedAbilities,
            moves: selectedPokemonMoves,
            species:chosenPokemon.species,
            stats:stats,
            types: chosenPokemon.types,
            price:price,
            amount:amount

        }

        try {
            const response = await axios.post(`http://${IP_ADDRESS}:1400/addPokemon`, soldPokemon);
            Toast.show({
                type:'success',
                text1:'Pokemon Is Up For Sale',
                visibilityTime:2000
            });
        } catch (e) {
            console.log('error uploading pokemon to sell: ' + e.message);
            Alert.alert('Error', 'Please try again later')
        }

    }

    useEffect(() => {
        async function fetchPokemons() {
            try {
                setIsLoading(true);
                const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1310');
                if (!response.data) {
                    throw new Error('Error fetching pokemons');
                }

                const data = response.data.results;

                const pokemonData = data.map(item => ({
                    name: item.name,
                    url: item.url
                }));

                const sortedPokemonData = pokemonData.sort((p1, p2) => {
                    if (p1.name < p2.name) {
                        return -1;
                    }
                    if (p1.name > p2.name) {
                        return 1;
                    }
                    return 0;
                });
                setPokemonList(sortedPokemonData);
            } catch (error) {
                console.log(`Error fetching Pokémon: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPokemons();
    }, []);

    if (isLoading) {
        return (
            <Loading loading={isLoading} />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <ScrollView stickyHeaderIndices={[0]} contentContainerStyle={styles.scrollViewContent} nestedScrollEnabled> */}
            <View style={[styles.sectionContainer, { backgroundColor: '#F9FEFF' }]}>

                <Text style={[styles.sectionTitle, { alignSelf: 'center', textShadowColor: 'gray', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 5 }]}>
                    Sell Your Pokemon
                </Text>


                <SearchInput
                    styleSearchContainer={styles.searchContainer}
                    styleSearchBar={styles.searchBar}
                    stylesInput={styles.input}
                    handleSearchInput={handleSearchInput}
                    placeholder={"Pick a pokemon you want to sell..."}
                    value={searchPokemon}
                />


            </View>


            {searchPokemon && (
                filteredPokemons.length === (pokemonsList.length) ? (
                    <></>
                ) : filteredPokemons.length === 0 ? (
                    <View style={{ backgroundColor: 'white', marginTop: -20 }}>
                        <Text style={[styles.sectionTitle, { alignSelf: 'center', marginTop: 0 }]}>
                            Pokémon not found...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        style={{
                            position: 'absolute',
                            top: 136, // Adjust this value based on the height of your input
                            left: 5,
                            // right: 10,
                            maxHeight: 200,
                            width: 350,
                            borderColor: 'gray',
                            borderWidth: 1.5,
                            backgroundColor: 'white',
                            zIndex: 1
                        }}
                        data={filteredPokemons}
                        keyExtractor={(item) => item.name}
                        renderItem={({ item }) => (
                            <Pressable style={styles.pokemonList} onPress={() => handleChosenPokemon(item)}>
                                <Text style={styles.pokemonName}>{presentableWord(item.name)}</Text>
                            </Pressable>
                        )}
                    />
                    // <ScrollView nestedScrollEnabled>
                    //     {filteredPokemons.map((poke) => (

                    //         <Pressable style={styles.pokemonList} key={poke.name} onPress={() => handleChosenPokemon(poke)}>
                    //             <Text style={styles.pokemonName}>{presentableWord(poke.name)}</Text>
                    //         </Pressable>))}
                    // </ScrollView>

                    // filteredPokemons.map((poke) => (

                    //     <Pressable style={styles.pokemonList} key={poke.name} onPress={() => handleChosenPokemon(poke)}>
                    //         <Text style={styles.pokemonName}>{presentableWord(poke.name)}</Text>
                    //     </Pressable>


                    // ))

                )
            )}
            <ScrollView contentContainerStyle={styles.scrollViewContent} nestedScrollEnabled>
                {chosenPokemon ? (
                    <View style={styles.sectionContainerTitle}>
                        <Text style={[styles.detailsTitle, { alignSelf: 'center', marginBottom: 15, textDecorationLine: 'underline' }]}>
                            Enter {presentableWord(chosenPokemon.name)} Details
                        </Text>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Is The Pokemon A Shiny</Text>
                            <View style={styles.genderShinyContainer}>
                                <Pressable style={styles.icon}
                                    onPress={() => {
                                        console.log(isShiny)
                                        setIsShiny(!isShiny)
                                    }}>
                                    <Ionicons name="sparkles-sharp" size={45} color={isShiny ? "gold" : 'black'} />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: isShiny ? chosenPokemon.imgShiny : chosenPokemon.imgDefault }}
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Choose the gender of the pokemon</Text>
                            <View style={styles.genderShinyContainer}>
                                <Pressable onPress={() => setGender(0)} style={styles.icon}>
                                    <Foundation name="male-symbol" size={45} color={gender === 0 ? 'blue' : "black"} />
                                </Pressable>

                                <Pressable onPress={() => setGender(1)} style={styles.icon}>
                                    <Foundation name="female-symbol" size={45} color={gender === 1 ? 'pink' : "black"} />
                                </Pressable>
                            </View>
                        </View>

                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Pokemon Level</Text>
                            <Pressable style={{ alignItems: 'center' }}>
                                <TextInput
                                    style={[styles.input]}
                                    onChangeText={handleLevelChange}
                                    value={pokemonLevel}
                                    keyboardType="numeric"
                                    placeholder="Enter pokemon's level"
                                    placeholderTextColor="#999"
                                />
                            </Pressable>
                        </View>


                        <View style={styles.sectionContainer}>
                            <Text style={[styles.sectionTitle]}>Enter Pokemon Abilities</Text>
                            <MultiSelectAdd
                                data={pokemonAbilities}
                                selected={selectedAbilities}
                                setSelected={setSelectedAbilities}
                                placeholder={'Abilities'}
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Enter Pokemon Moves</Text>
                            <MultiSelectAdd
                                data={pokemonMoves}
                                selected={selectedPokemonMoves}
                                setSelected={setSelectedPokemonMoves}
                                placeholder={'Moves'}
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Enter Pokemon Stats</Text>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>HP: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedHP(v.trim())}
                                    stat={selectedHP}
                                    placeholder={"Enter Pokemon's HP..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Attack: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedAttack(v.trim())}
                                    stat={selectedAttack}
                                    placeholder={"Enter Pokemon's Attack..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Defense: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedDefense(v.trim())}
                                    stat={selectedDefense}
                                    placeholder={"Enter Pokemon's Defense..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Special Defense: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedSpecialDefense(v.trim())}
                                    stat={selectedSpecialDefense}
                                    placeholder={"Enter Pokemon's Special Defense..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Special Attack: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedSpecialAttack(v.trim())}
                                    stat={selectedSpecialAttack}
                                    placeholder={"Enter Pokemon's Special Attack..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Speed: </Text>
                                <PokemonStats
                                    style={styles.input}
                                    setStat={(v) => setSelectedSpeed(v.trim())}
                                    stat={selectedSpeed}
                                    placeholder={"Enter Pokemon's Speed..."}
                                />
                            </View>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Enter Amount </Text>
                            <TextInput
                                style={styles.input}
                                keyboardType='numeric'
                                value={amount}
                                onChangeText={(v) => setAmount(v.trim())}
                                placeholder="Enter Pokemon's Price..."
                            />
                        </View>
                        <View style={styles.sectionContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.sectionTitle}>Enter Price</Text>
                                <Text style={[styles.sectionTitle, { fontSize: 14, paddingTop: 3, color: '#8E8E8E' }]}>(for each Pokemon)</Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TextInput
                                    style={styles.input}
                                    keyboardType='numeric'
                                    value={price}
                                    onChangeText={(v) => setPrice(v.trim())}
                                    placeholder="Enter Pokemon's Price..."

                                />
                                <CurrencyPD
                                    style={styles.PDImage}
                                />
                            </View>


                        </View>
                        <Pressable onPress={submitPokemon} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Submit</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View>
                        <Text>Pick a Pokémon to enter its settings</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        backgroundColor: '#F9FEFF', // Adjust as needed
    },
    pokemonList: {
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1

    },
    pokemonName: {
        fontSize: 18
    },
    sectionContainerTitle: {
        marginBottom: 20,
    },
    detailsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingRight: 13,
        paddingLeft: 13,
    },
    sectionContainer: {
        paddingTop: 5,
        paddingBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        paddingRight: 13,
        paddingLeft: 13,
        marginTop: 12,

    },


    genderShinyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 15,
        marginLeft: 15,

    },
    imageContainer: {
        alignItems: 'center',
        height: 200,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
    multiSelectContainer: {
        marginBottom: 20,
    },
    statsContainer: {
        marginBottom: 20,
    },
    statsInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,

    },
    statsText: {
        fontSize: 16,
    },
    statsTextInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        marginLeft: 8,
    },
    submitButton: {
        backgroundColor: '#4630EB',
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
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
        backgroundColor: "yellow",
        padding: 10,
        flexDirection: "row",
        alignItems: 'center',

    },
    input: {
        marginLeft: 10,
        flex: 1,
        fontSize: 16,
        alignSelf: 'center',
        textAlign: 'center'
    },
    PDImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});
export default AddPokemonScreen;
