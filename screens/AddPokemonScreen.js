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
import PokemonInput from '../components/PokemonInput';
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import CurrencyPD from '../components/CurrencyPD';
import { IP_ADDRESS } from '@env';
import Toast from 'react-native-toast-message';
import { useUser } from '../utils/UserContext';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { addPokemon } from "../api/apiServices";


const AddPokemonScreen = () => {

    const route = useRoute();
    const { item } = route.params;
    const { user } = useUser();

    const navigator = useNavigation();

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
    const [selectedHP, setSelectedHP] = useState(null);
    const [selectedAttack, setSelectedAttack] = useState(null);
    const [selectedDefense, setSelectedDefense] = useState(null);
    const [selectedSpecialAttack, setSelectedSpecialAttack] = useState(null);
    const [selectedSpecialDefense, setSelectedSpecialDefense] = useState(null);
    const [selectedSpeed, setSelectedSpeed] = useState(null);
    const [price, setPrice] = useState(null);
    const [quantity, setQuantity] = useState(null);

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


            setChosenPokemon(pokemon);

        } catch (error) {
            console.log(`Error fetching Pokémon: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChosenPokemon(poke) {
        fetchChosenPokemon(poke);
    }


    const validateInput = () => {
        const regex = /^[1-9]\d*$/;

        const isPositiveInteger = (value) => regex.test(value);
        const isValidAbility = (abilities) => abilities.length > 0;
        const isValidLevel = (level) => (level) && level <= 100;

        if (!isValidAbility(selectedAbilities)) {
            Alert.alert('Invalid Input', 'Abilities must be selected');
            return false;
        }

        const stats = [selectedAttack, selectedDefense, selectedHP, selectedSpecialAttack, selectedSpecialDefense];

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

        if (!isPositiveInteger(price)) {
            Alert.alert('Invalid Input', 'Pokemon price must be above 0');
            return false
        }

        if (!isPositiveInteger(quantity)) {
            Alert.alert('Invalid Input', 'Pokemon quantity must be above 0');
            return false;
        }

        return true;
    };

    async function handleSubmitPokemon() {

        if (!validateInput()) {
            return;
        }

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
            user: user.userId,
            name: chosenPokemon.name,
            url: chosenPokemon.url,
            img: image,
            gender: gender,
            level: pokemonLevel,
            isShiny: isShiny,
            abilities: selectedAbilities,
            moves: selectedPokemonMoves,
            species: chosenPokemon.species,
            stats: stats,
            types: chosenPokemon.types,
            price: price,
            quantity: quantity

        }

        try {

            let response;
            if (item) {
                // TODO: sending the pokemon id so it will not create a new one (??)
                const editPokemon = { pokemon: soldPokemon, pokemonId: item._id }
                // console.log(JSON.stringify(editPokemon));
                //TODO: create route editPokemon
                // const response = await editPokemon(soldPokemon);
            } else {
                response = await addPokemon(soldPokemon);
            }
            if (response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Pokemon Is Up For Sale',
                    visibilityTime: 2000
                });
                navigator.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            }
            else {
                throw Error('error uploading pokemon to sell');
            }


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
                if (item) {

                    setSearchPokemon(item.name);
                    setGender(item.gender);
                    setSelectedHP(item.stats[0].hp);
                    setSelectedAttack(item.stats[0].attack);
                    setSelectedDefense(item.stats[0].defense);
                    setSelectedSpecialAttack(item.stats[0].specialAttack);
                    setSelectedSpecialDefense(item.stats[0].specialDefense);
                    setSelectedSpeed(item.stats[0].speed);
                    setSelectedAbilities(item.abilities);
                    setSelectedPokemonMoves(item.moves);
                    setPokemonLevel(item.level);
                    setIsShiny(item.isShiny);
                    setPrice(item.price);
                    setQuantity(item.quantity);

                    // Fetch the Pokémon details if not already fetched
                    handleChosenPokemon(item);
                }
            } catch (error) {
                console.log(`Error fetching Pokémon: ${error.message}`);
                Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
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

                {item ? (
                    <></>
                ) : (
                    <SearchInput
                        styleSearchContainer={styles.searchContainer}
                        styleSearchBar={styles.searchBar}
                        stylesInput={styles.input}
                        handleSearchInput={handleSearchInput}
                        placeholder={"Pick a pokemon you want to sell..."}
                        value={searchPokemon}
                    />

                )}


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
                            top: 136,
                            left: 5,
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


                            <PokemonInput
                                style={styles.input}
                                setInput={(v) => setPokemonLevel(v.trim())}
                                input={pokemonLevel}
                                placeholder={"Enter pokemon's level..."}
                            />

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
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedHP(v.trim())}
                                    input={selectedHP}
                                    placeholder={"Enter Pokemon's HP..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Attack: </Text>
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedAttack(v.trim())}
                                    input={selectedAttack}
                                    placeholder={"Enter Pokemon's Attack..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Defense: </Text>
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedDefense(v.trim())}
                                    input={selectedDefense}
                                    placeholder={"Enter Pokemon's Defense..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Special Defense: </Text>
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedSpecialDefense(v.trim())}
                                    input={selectedSpecialDefense}
                                    placeholder={"Enter Pokemon's Special Defense..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Special Attack: </Text>
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedSpecialAttack(v.trim())}
                                    input={selectedSpecialAttack}
                                    placeholder={"Enter Pokemon's Special Attack..."}
                                />
                            </View>
                            <View>
                                <Text style={[styles.sectionTitle, { fontSize: 15 }]}>Speed: </Text>
                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setSelectedSpeed(v.trim())}
                                    input={selectedSpeed}
                                    placeholder={"Enter Pokemon's Speed..."}
                                />
                            </View>
                        </View>
                        <View style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>Enter Quantity </Text>


                            <PokemonInput
                                style={styles.input}
                                setInput={(v) => setQuantity(v.trim())}
                                input={quantity}
                                placeholder={"Enter quantity Of Pokemon You Want To Sell..."}
                            />
                        </View>

                        <View style={styles.sectionContainer}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.sectionTitle}>Enter Price</Text>
                                <Text style={[styles.sectionTitle, { fontSize: 14, paddingTop: 3, color: '#8E8E8E' }]}>
                                    (for each Pokemon)
                                </Text>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

                                <PokemonInput
                                    style={styles.input}
                                    setInput={(v) => setPrice(v.trim())}
                                    input={price}
                                    placeholder={"Enter Pokemon's Price..."}
                                />
                                <CurrencyPD
                                    style={styles.PDImage}
                                />
                            </View>


                        </View>

                        <Pressable onPress={handleSubmitPokemon} style={styles.submitButton}>
                            {item ? (
                                <Text style={styles.submitButtonText}>CONFIRM EDIT</Text>
                            ) : (
                                <Text style={styles.submitButtonText}>SUBMIT</Text>
                            )}
                        </Pressable>


                    </View>
                ) : (
                    <View style={{marginTop:10}}> 
                        <Text style={{textAlign:'center',fontSize:18}}>Pick a Pokémon to enter it's details</Text>
                        <Image
                        style={{width:'100%', height:300, resizeMode:'contain'}}
                        source={{uri: 'https://pokemonletsgo.pokemon.com/assets/img/how-to-play/hero-img.png'}}
                        />
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
