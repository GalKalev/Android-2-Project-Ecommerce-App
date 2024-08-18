import { Alert, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import Loading from '../components/Loading';
import { Dropdown } from 'react-native-element-dropdown';
import { presentableWord } from '../utils/consts';
import { EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import CurrencyPD from '../components/CurrencyPD';
import { useUser } from '../utils/UserContext';
import { checkout } from "../api/apiServices";

const CheckoutScreen = () => {
    const [isLoading, setLoading] = useState(false);
    const steps = ['Address', 'Payment', 'Confirmation'];
    const [currentStep, setCurrentStep] = useState(0);
    const navigator = useNavigation();
    const { cart, user } = useUser()

    // First step values
    const [regions, setRegions] = useState([]);
    const [locations, setLocations] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedHouseNum, setSelectedHouseNum] = useState(null);

    // Second step values
    const [cardNumber, setCardNumber] = useState(null);
    const [cardOwner, setCardOwner] = useState(null);
    const [expirationDate, setExpirationDate] = useState(null);
    const [cvv, setCvv] = useState(null);

    // Third step values
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://pokeapi.co/api/v2/region');
                if (!response.data) {
                    throw new Error('Error fetching regions');
                }

                const data = response.data;
                const regionsData = data.results.map((res) => ({
                    label: presentableWord(res.name),
                    value: res.url,
                }));
                setRegions(regionsData);
            } catch (e) {
                Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
                console.log('error fetching regions: ' + e.message);
                navigator.replace('Cart');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchLocation = async (url) => {
        try {
            setLoading(true);
            const response = await axios.get(url);
            if (!response.data) {
                throw new Error('Error fetching locations');
            }

            const data = response.data;
            const locationsData = data.locations.map((location) => ({
                label: presentableWord(location.name),
                value: location.name, // Use a unique value for each location
            }));
            setLocations(locationsData);
        } catch (e) {
            Alert.alert('Server Error', 'Sorry for the trouble.\nPlease try again later');
            console.log('error fetching locations: ' + e.message);
            navigator.replace('Cart');
        } finally {
            setLoading(false);
        }
    };

    const isExpirationDateValid = () => {

        if (!expirationDate) {
            return false;
        }
        const regex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!regex.test(expirationDate)) {
            return false;
        }

        const [_, month, year] = date.match(regex);

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear() % 100;

        const expMonth = parseInt(month, 10);
        const expYear = parseInt(year, 10);

        if (expYear < currentYear || (expYear === currentYear && expMonth <= currentMonth)) {
            return false;
        }

        return true;

    }

    const handleNextStep = async () => {
        switch (currentStep) {
            case (0): {
                if (!selectedRegion || !selectedHouseNum || !selectedLocation) {
                    Alert.alert('Please make sure to fill all the fields correctly');
                } else {
                    setCurrentStep(currentStep + 1);
                }
                return;
            }
            case (1): {

                if (!cardNumber || cardNumber.length !== 16 || !cardOwner || !cvv || !isExpirationDateValid) {
                    Alert.alert('Please make sure to fill all the fields correctly');
                } else {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        setCurrentStep(currentStep + 1);
                    }, 4000)

                }
                return;
            }
            case (2): {
                setLoading(true);
                try {
                    const resCheckout = await checkout(user.userId, selectedRegion.label, selectedLocation.label, selectedHouseNum, cardOwner, cardNumber, expirationDate, cvv);
                    console.log("resCheckout.data");
                    console.log(resCheckout)
                    if (resCheckout.success) {
                        cart.totalPrice = 0;
                        cart.products = [];
                        setModalVisible(true);
                        setTimeout(() => {
                            setModalVisible(false);
                            navigator.replace('Main');
                        }, 4000);
                    }else{
                        throw Error('Checkout error');
                    }

                } catch (error) {
                    Alert.alert('Checkout failed', 'Please try again later.');
                    console.error('Checkout error:', error);
                } finally {
                    setLoading(false);
                }
                return;
            }
        }
    };

    const handleBackStep = () => {
        if (currentStep === 0) {
            navigator.goBack();
        }
        setCurrentStep(currentStep - 1);
    }

    const renderDropdown = (item) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <EvilIcons name="location" size={24} color="black" />
            <Text style={{ fontSize: 17, padding: 5 }}>{item.label}</Text>
        </View>
    );

    const handleSelectedHouseNum = (txt) => {
        setSelectedHouseNum(txt);
    }

    if (isLoading) {
        return <Loading loading={isLoading} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Steps header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                        {currentStep <= index ? (
                            <>
                                <Text style={styles.stepNum}>{index + 1}</Text>
                                <Text>{step}</Text>
                            </>
                        ) : (
                            <>
                                <AntDesign name="check" size={23} color="black" style={[styles.stepNum, { backgroundColor: 'green' }]} />
                                <Text>{step}</Text>
                            </>
                        )}
                    </View>
                ))}
            </View>
            {currentStep === 0 ? (
                // First step 
                <View>
                    <Text style={styles.sectionTitle}>Select Delivery Address</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.subSectionTitle}>Select a region</Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={regions}
                            labelField="label"
                            valueField="value"
                            placeholder="Select region"
                            value={selectedRegion}
                            onChange={item => {
                                setSelectedLocation(null);
                                setSelectedRegion(item);
                                fetchLocation(item.value);
                            }}
                            renderItem={renderDropdown}
                        />
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.subSectionTitle}>Select Location</Text>
                        <Text style={{ fontSize: 13, color: 'red', marginBottom: 4 }}>* Select a region first</Text>

                        <View>
                            <Dropdown
                                style={styles.dropdown}
                                data={locations}
                                labelField="label"
                                valueField="value"
                                placeholder="Select location"
                                value={selectedLocation}
                                onChange={item => {
                                    setSelectedLocation(item);
                                }}
                                renderItem={renderDropdown}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.subSectionTitle}>Enter House Number</Text>
                            <Pressable style={styles.houseNumContainer}>
                                <TextInput
                                    style={styles.houseNumTextInput}
                                    value={selectedHouseNum}
                                    keyboardType='numeric'
                                    placeholder='Enter House Num. Here...'
                                    onChangeText={(txt) => handleSelectedHouseNum(txt)}
                                />
                            </Pressable>
                        </View>


                    </View>


                </View>
            ) : currentStep === 1 ? (
                // Second step
                <View>
                    <Text style={styles.sectionTitle}>Enter Payment Information</Text>

                    <View>
                        <Text style={styles.subSectionTitle}>Card Information</Text>
                        <TextInput
                            style={styles.cardInput}
                            placeholder="Card Owner's Name"
                            value={cardOwner}
                            onChangeText={setCardOwner}
                        />
                        <TextInput
                            style={styles.cardInput}
                            placeholder="Card Number"
                            keyboardType="numeric"
                            value={cardNumber}
                            onChangeText={setCardNumber}
                        />
                        <TextInput
                            style={styles.cardInput}
                            placeholder="Expiration Date (MM/YY)"
                            value={expirationDate}
                            onChangeText={setExpirationDate}
                        />
                        <TextInput
                            style={styles.cardInput}
                            placeholder="CVV"
                            keyboardType="numeric"
                            value={cvv}
                            onChangeText={setCvv}
                        />

                    </View>


                </View>
            ) : (
                // Third step
                <View>
                    <Text style={styles.sectionTitle}>Confirm Order Details</Text>
                    <Text style={styles.subSectionTitle}>Delivery Address</Text>
                    <Text style={{ fontSize: 17 }}>{selectedRegion.label}, {selectedLocation.label} No. {selectedHouseNum}</Text>
                    <Text style={styles.subSectionTitle}>Payment Detail</Text>
                    <Text style={{ fontSize: 17, marginBottom: 10 }}>**** **** **** {cardNumber.slice(-4)}</Text>
                    <View style={styles.total}>
                        <Text style={{ fontSize: 17 }}>Total Payment: {cart.totalPrice}</Text>
                        <CurrencyPD
                            style={styles.currency}
                        />
                    </View>
                    <Modal
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>

                                <Text style={styles.modalTitle}>Thank You For Your Order</Text>
                                <AntDesign name="check" size={30} color="black" style={[styles.stepNum, { backgroundColor: 'green' }]} />


                            </View>
                        </View>
                    </Modal>

                </View>
            )}



            {/* Buttons to move from steps*/}
            <View style={styles.stepsBtnsContainer}>

                <Pressable style={[
                    styles.stepBtn
                ]}
                    onPress={handleBackStep}>
                    <Text>BACK</Text>
                </Pressable>
                <Pressable style={[
                    styles.stepBtn,

                ]}
                    onPress={handleNextStep}>
                    {currentStep === 2 ? <Text>CONFIRM</Text> : <Text>NEXT</Text>}

                </Pressable>
            </View>

        </SafeAreaView>
    );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white',
        padding: 10
    },
    stepContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    stepNum: {
        fontSize: 23,
        backgroundColor: 'gray',
        color: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        textAlign: 'center',
        lineHeight: 40,
    },
    sectionTitle: {
        fontSize: 18,
        marginTop: 8,
        marginBottom: 8,
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    subSectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 7,
        marginTop: 6
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    houseNumContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        padding: 5,
        backgroundColor: 'white',
    },
    houseNumTextInput: {
        fontSize: 16,
    },
    total: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        padding: 5,
        backgroundColor: '#F4F4F4',
        marginBottom: 8
    },
    currency: {
        resizeMode: 'contain',
        width: 17,
        height: 17
    },
    cardInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    stepsBtnsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        padding: 5
    },
    stepBtn: {
        backgroundColor: '#FEBE10',
        borderRadius: 4,
        padding: 12,
        paddingRight: 17,
        paddingLeft: 17,
    }
});
