import { View, Text, Pressable, ScrollView, StyleSheet, Animated } from 'react-native'
import React, { useEffect, useState } from 'react'
// import FilterMenu from '../ignoreComponents/FilterMenu';
import { Picker } from '@react-native-picker/picker';
import { Feather } from '@expo/vector-icons';
import MultiSelectFilter from './MultiSelectFilter';
import RangeSlider from './RangeSlider';
import { Ionicons } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const FIlterOptions = ({ toggleFilterMenu, isFilterOpen, setFilter, items, setLoading, filteredItems, setFilteredItems, slideIn }) => {

    // Filter options
    const [gender, setGender] = useState(null);
    const [minLevel, setMinLevel] = useState(0);
    const [maxLevel, setMaxLevel] = useState(100);
    const [isShiny, setIsShiny] = useState(null);
    const [abilities, setAbilities] = useState([]);
    const [moves, setMoves] = useState([]);
    const [species, setSpecies] = useState([]);
    const [types, setTypes] = useState([]);

    // Selected filters

    const [selectedAbilities, setSelectedAbilities] = useState([]);
    const [selectedMoves, setSelectedMoves] = useState([]);
    const [selectedSpecies, setSelectedSpecies] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    const selectedFilters = [
        [abilities, setSelectedAbilities, "Abilities"],
        [moves, setSelectedMoves, "Moves"],
        [species, setSelectedSpecies, "Species"],
        [types, setSelectedTypes, 'Pokemon Types']];

    // Max price and min price of pokemons 
    const [maxPrice, setMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);

    // Selected min price and max price
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(0);
    const [selectedMinPrice, setSelectedMinPrice] = useState(0);

    // 
    const [selectedPriceOrderFilter, setSelectedPriceOrderFilter] = useState('default');

    // Set for reset button
    const [reset, setReset] = useState(false);


    useEffect(() => {
        const abilitiesList = items.map(poke => poke.abilities);
        setAbilities(Array.from(new Set(abilitiesList.flat())));

        const movesList = items.map(poke => poke.moves);
        setMoves(Array.from(new Set(movesList.flat())));

        const speciesList = items.map(poke => poke.species);
        setSpecies(Array.from(new Set(speciesList.flat())));

        const typesList = items.map(poke => poke.types);
        setTypes(Array.from(new Set(typesList.flat())));

        setMinPrice(items.reduce((min, item) => (item.price < min ? item.price : min), items[0].price));
        setMaxPrice(items.reduce((max, item) => (item.price > max ? item.price : max), items[0].price));
        // console.log('min: ' + items.reduce((min, item) => (item.price < min ? item.price : min), items[0].price))
        // console.log('max: ' + items.reduce((max, item) => (item.price > max ? item.price : max), items[0].price))

    }, []);

    const handleShinyPress = () => {
        setIsShiny(isShiny === null ? 0 : (isShiny === 0 ? 1 : null));
    }

    const handelGenderPress = () => {
        setGender(gender === null ? 0 : (gender === 0 ? 1 : null));
    }

    // Handle function to apply the filters to the pokemons in the shop
    const handleApplyButton = () => {
        setLoading(true);
        // console.log('_________________')
        // console.log('selectedAbilities: ' + selectedAbilities);
        // console.log('selectedMoves: ' + selectedMoves);
        // console.log('selectedSpecies: ' + selectedSpecies);
        // console.log('selectedTypes: ' + selectedTypes);
        // console.log('selectedMaxPrice: ' + selectedMaxPrice);
        // console.log('selectedMinPrice: ' + selectedMinPrice);
        // console.log('minLevel: ' + minLevel);
        // console.log('maxLevel: ' + maxLevel);
        // console.log('gender: ' + gender);
        // console.log('isShiny: ' + isShiny);

        const applyingFilters = items.filter(poke => {
            const isPriceRange = poke.price >= selectedMinPrice && poke.price <= selectedMaxPrice;

            const hasAbilities = selectedAbilities.length === 0 || selectedAbilities.every(ability => poke.abilities.includes(ability));

            const hasTypes = selectedTypes.length === 0 || selectedTypes.every(type => poke.types.includes(type));

            const hasMoves = selectedMoves.length === 0 || selectedMoves.every(move => poke.moves.includes(move));

            const hasSpecies = selectedSpecies.length === 0 || selectedSpecies.every(specie => poke.species.includes(specie));

            const isLevelRange = poke.level >= minLevel && poke.level <= maxLevel;

            const hasShiny = isShiny === null || (isShiny === 1 && poke.isShiny) || (isShiny === 0 && !poke.isShiny);

            const whatGender = gender === null || (gender === 0 && poke.gender === 0) || (gender === 1 && poke.gender === 1);

            return isPriceRange &&
                hasAbilities &&
                hasTypes &&
                hasMoves &&
                hasSpecies &&
                isLevelRange &&
                hasShiny &&
                whatGender;

        });
        // console.log(applyingFilters);

        setFilteredItems(applyingFilters);
        setFilter(false);
        setLoading(false);


    }

    const handleResetButton = () => {
        console.log(filteredItems);
        setReset(true);
        setGender(null);
        setIsShiny(null);
        setSelectedAbilities([]);
        setSelectedMoves([]);
        setSelectedTypes([]);
        setSelectedSpecies([]);
        setFilteredItems(items);
        setSelectedPriceOrderFilter('default')
        // setReset(false);
    }



    return (
        // <ScrollView nestedScrollEnabled={true} contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
        <View style={styles.filterContainer}>


            <View style={{ flexDirection: 'row' }}>
                {/* Button to open the filter menu */}
                <Pressable
                    onPress={toggleFilterMenu} style={[styles.filterBtn, { backgroundColor: isFilterOpen ? 'white' : '#B5B5B5', }]}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Filter:
                    </Text>
                    <Feather name="filter" size={24} color="black" />
                </Pressable>

                {/* Order the pokemon by price value (highest to lowest or lowest to highest)*/}
                <View style={styles.priceBtn}>
                    <Text style={{ fontWeight: 'bold' }}>
                        Price:
                    </Text>
                    <Picker style={{
                        height: 50, width: 220
                    }}
                        selectedValue={selectedPriceOrderFilter}
                        onValueChange={(itemValue, itemIndex) => {
                            // console.log(itemValue);
                            setSelectedPriceOrderFilter(itemValue)
                            setLoading(true);
                            if (itemValue === 'LtH') {
                                setFilteredItems([...filteredItems].sort((i1, i2) => i1.price - i2.price));

                            } else if (itemValue === 'HtL') {
                                setFilteredItems([...filteredItems].sort((i1, i2) => i2.price - i1.price));
                            }
                            setLoading(false);
                            console.log('over');
                        }
                        }>
                        <Picker.Item label="Order by prices..." value="default" />
                        <Picker.Item label="Lowest to highest" value="LtH" />
                        <Picker.Item label="Highest to lowest" value="HtL" />
                    </Picker>

                </View>

            </View>
            {/* The filter options */}

            {isFilterOpen ? (
                <Animated.View style={[styles.FilterOptionsContainer, slideIn]}>
                    <View style={[styles.genderShinySection, styles.section]}>
                        <View style={styles.genderShinyContainer}>
                            <Text style={[styles.genderShinyText, styles.title]}>
                                Shiny:
                            </Text>
                            <Pressable onPress={handleShinyPress}>
                                {isShiny === 1 ? (
                                    <Ionicons name="sparkles-sharp" size={30} color="gold" />
                                ) : isShiny === 0 ? (
                                    <Ionicons name="sparkles-sharp" size={30} color='black' />
                                ) : (
                                    <Ionicons name="sparkles-outline" size={30} color='black' />
                                )}

                            </Pressable>

                        </View>
                        <View style={styles.genderShinyContainer}>
                            <Text style={[styles.genderShinyText, styles.title]}>
                                Gender:
                            </Text>
                            <Pressable onPress={handelGenderPress}>
                                {gender === 0 ? (
                                    <Foundation name="male-symbol" size={30} color='blue' />
                                ) : gender === 1 ? (
                                    <Foundation name="female-symbol" size={30} color='pink' />
                                ) : (
                                    <FontAwesome name="genderless" size={30} color="black" />
                                )}
                            </Pressable>
                        </View>

                    </View>
                    <View style={[styles.section]} >
                        <Text style={[styles.title]}>Level</Text>
                        <RangeSlider
                            minValue={0}
                            maxValue={100}
                            setSelectedMinValue={setMinLevel}
                            setSelectedMaxValue={setMaxLevel}
                            reset={reset}
                            setReset={setReset}
                        />
                    </View>

                    {/* Filter component for abilities, moves, species and types */}
                    {selectedFilters.map((dataSelect) => {
                        return (
                            <View key={dataSelect} style={[styles.section]}>

                                <MultiSelectFilter
                                    data={dataSelect[0]}
                                    styleTitle={styles.title}
                                    // selected={dataSelect[1]}
                                    setSelected={dataSelect[1]}
                                    reset={reset}
                                    placeholder={dataSelect[2]}
                                    setReset={setReset}

                                />

                            </View>

                        )
                    })}

                    {/* Filter the pokemon by price */}
                    {maxPrice !== minPrice ? (
                        <View style={styles.section}>
                            <Text style={styles.title}>
                                Price Range:
                            </Text>
                            <RangeSlider
                                minValue={minPrice}
                                maxValue={maxPrice}
                                setSelectedMinValue={setSelectedMinPrice}
                                setSelectedMaxValue={setSelectedMaxPrice}
                                reset={reset}
                                setReset={setReset}
                            />
                        </View>
                    ) : (
                        <></>
                    )}


                    {/* Apply the filters to the pokemon products or reset the filters */}
                    <View style={styles.applyResetBtnsContainer}>
                        <Pressable onPress={handleApplyButton}>
                            <Text style={[styles.applyBtn, styles.applyResetBtns]}>
                                Apply
                            </Text>
                        </Pressable>
                        <Pressable onPress={handleResetButton}>
                            <Text style={[styles.resetBtn, styles.applyResetBtns]}>
                                Reset
                            </Text>
                        </Pressable>
                    </View>
                </Animated.View>


            ) : (
                <>
                </>
            )}
        </View>

        // </ScrollView> 
    )
}

const styles = StyleSheet.create({
    filterContainer: {
        margin: 15,
    },
    filterBtn: {
        flexDirection: 'row',
        margin: 5,
        padding: 4,
        borderRadius: 5,
        alignItems: 'center',
        borderColor: '#B5B5B5',
        borderWidth: 1,

    },
    priceBtn: {
        flex: 1,
        borderColor: 'black',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 5,
        // paddingLeft:10,
        paddingLeft: 2,
        borderRadius: 6,

    },
    section: {
        borderBottomWidth: 1,
        borderBottomColor: "black",
        padding: 8,
        margin: 3
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        alignSelf: 'center'
    },
    FilterOptionsContainer: {
        borderWidth: 1,
        borderColor: '#B5B5B5',
        padding: 5,
        borderRadius: 7,
        backgroundColor: '#EBEBEB'
    },
    genderShinySection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",

    },
    genderShinyContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    genderShinyText: {
        paddingRight: 5
    },
    applyResetBtnsContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    applyResetBtns: {
        borderRadius: 5,
        padding: 10,
        margin: 5,
        fontSize: 18
    },
    applyBtn: {
        backgroundColor: 'blue',
        color: 'white',

    },
    resetBtn: {
        borderColor: 'blue',
        borderWidth: 1,
    }
})

export default FIlterOptions