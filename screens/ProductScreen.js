import React from 'react';
import { View, Text, Pressable, SafeAreaView, StyleSheet, Platform, ScrollView, Image, ImageBackground, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AntDesign, Foundation } from '@expo/vector-icons';
import { presentableWord } from '../utils/consts';
import RadarChart from '../components/RadarChart';


const ProductScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { item, prevScreen } = route.params;

    const screenWidth = Dimensions.get('window').width;

    // Product's stats data for chart
    const data = Object.values(item.stats);
    const labels = ["Hp", "Attack", "Defense", "Sp. Attack", "Sp. Defense", "Speed"];


    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View>
                {/* Back to previous screen  */}
                <View style={styles.backContainer}>
                    <Pressable onPress={handleBackPress}>
                        <AntDesign name="arrowleft" size={24} color="black" />
                    </Pressable>
                    <Text style={{ fontSize: 20, marginLeft: 5 }}>| {prevScreen}</Text>
                </View>

                {/* Product's info */}
                <ScrollView contentContainerStyle={[styles.infoContainer]}>
                    <Pressable>
                        <View>
                            <ImageBackground
                                style={styles.imageBackground}
                                source={{ uri: 'https://img.freepik.com/free-vector/gradient-zoom-effect-background_23-2149751078.jpg?size=626&ext=jpg' }}>
                                <View>
                                    <Image style={styles.image} source={{ uri: item.img }} />
                                </View>
                            </ImageBackground>
                        </View>

                        <View style={styles.nameGenderLevelContainer}>
                            <Text style={styles.level}>LV: {item.level}</Text>
                            <View>
                                <Text style={styles.name}>{presentableWord(item.name)}</Text>
                                <View>
                                    {item.types.map((type) => (
                                        <View key={type}>
                                            <Text>{presentableWord(type)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>

                            {item.gender ? (
                                <Foundation name="female-symbol" size={35} color="pink" style={styles.gender} />
                            ) : (
                                <Foundation name="male-symbol" size={35} color="blue" style={styles.gender} />
                            )}
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', height:'auto', paddingBottom:100 }}>
                            <View style={styles.statsContainer}>
                                <RadarChart data={data} labels={labels} size={screenWidth - 120} />
                            </View>

                            <View style={styles.abilitiesMovesTypesContainer}>
                                <View>
                                    <Text style={styles.abilitiesMovesTypesText}>Abilities</Text>
                                    {item.abilities.map((ability) => (
                                        <View key={ability}>
                                            <Text>{presentableWord(ability)}</Text>
                                        </View>
                                       
                                    ))}
                                     
                                </View>
                                <View>
                                    <Text style={styles.abilitiesMovesTypesText}>Moves</Text>
                                    {item.moves.map((move) => (
                                        <View key={move}>
                                            <Text>{presentableWord(move)}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </ScrollView>

            </View>

            {/* Add to cart button */}
            <View style={styles.addToCartContainer}>
                <Pressable>
                    <Text style={{ color: 'white', fontSize: 17 }}>ADD TO CART</Text>
                    <Text style={{ color: 'white' }}>{item.quantity} left</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
    },
    imageBackground: {},
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
    infoContainer: {},
    image: {
        resizeMode: 'contain',
        height: 300,
        width: 300,
        alignSelf: 'center',
        paddingBottom: 60
    },
    nameGenderLevelContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1,
        padding: 15
    },
    name: {
        fontSize: 25,
    },
    level: {
        fontSize: 18
    },
    statsContainer: {
        alignItems: 'center',
        justifyContent:'center',
        borderRightWidth: 1,
        borderRightColor: 'black',

    },
    abilitiesMovesTypesContainer: {
        // flexDirection: 'row',
        justifyContent: 'space-evenly',
        // marginTop: 15,
        // paddingBottom: 100
    },
    abilitiesMovesTypesText: {
        fontSize: 18,
        padding: 3
    },
    addToCartContainer: {
        alignItems: 'center',
        backgroundColor: 'black',
        bottom: 0,
        padding: 5,
        position: 'absolute',
        width: '100%'
    }
});

export default ProductScreen;
