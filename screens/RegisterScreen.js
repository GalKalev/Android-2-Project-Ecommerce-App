import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import Logo from "../components/Logo";
import LogRegForm from "../components/LogRegForm";
import { IP_ADDRESS } from '@env';
import { useUser } from '../utils/UserContext';
import Loading from "../components/Loading";
import { registerUser } from "../api/apiServices";

const RegisterScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setLoading] = useState(false);
    const { setUser } = useUser();

    const navigation = useNavigation();

    const handleRegister = async () => {
        try {
            setLoading(true)
            const registrationStatus = await registerUser(name, email.toLocaleLowerCase().trim(), password);
            console.log('register');
            console.log(registrationStatus.data);
            if (registrationStatus.success === true) {
                setUser(registrationStatus.data);
                navigation.replace('Main');
            } else if (registrationStatus === 400) {
                Alert.alert("Registration Error", "Email already registered or missing fields");
            } else if (registrationStatus === 1) {
                Alert.alert("Server Error", "The server responded with an error");
            } else if (registrationStatus === 2) {
                Alert.alert("Network Error", "No response from the server");
            } else if (registrationStatus === 3) {
                Alert.alert("Request Error", "An error occurred while setting up the request");
            } else {
                Alert.alert("Unknown Error", "An unknown error occurred during registration");
            }
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code outside the range of 2xx
                console.log("Server responded with an error: ", error.response.data);
                Alert.alert("Registration Error", error.response.data.message || "An error occurred during registration");
            } else if (error.request) {
                // The request was made but no response was received
                console.log("No response received: ", error.request);
                Alert.alert("Registration Error", "No response from the server");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log("Error setting up request: ", error.message);
                Alert.alert("Registration Error 2", "An error occurred during registration: " + error.message);
            }

        } finally {
            setLoading(false)

        }
    };


    if (isLoading) {
        return (<Loading
            loading={isLoading} />)
    }
    return (
        <SafeAreaView style={styles.container}>
            <Logo />

            <KeyboardAvoidingView>
                <LogRegForm
                    isLog={false}
                    email={email}
                    setEmail={setEmail}
                    name={name}
                    setName={setName}
                    password={password}
                    setPassword={setPassword}
                />

                <View style={styles.buttons}>
                    <Text>Keep me logged in</Text>
                    <Text style={styles.forgotPasswordBtn}>Forgot Password</Text>
                </View>

                <View style={styles.registerBtnContainer}>
                    <Pressable style={styles.registerBtn}
                        onPress={handleRegister}
                    >
                        <Text style={styles.registerBtnText}>
                            Register
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.signUpContainer}
                    onPress={() => navigation.goBack()}>
                    <Text style={styles.signUpText}>
                        Already have an account? Sign in
                    </Text>
                </Pressable>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },

    registerLogo: {
        marginTop: 40
    },

    img: {
        width: 180,
        height: 100
    },

    registerTextBox: {
        alignItems: "center"
    },

    registerText: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 12,
        color: "#041E42"
    },

    registerEmailInput: {
        marginTop: 20
    },

    registerInput: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 5,
        backgroundColor: "#D0D0D0",
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30
    },

    registerInputIcon: {
        marginLeft: 8
    },

    registerInputText: {
        color: "gray",
        marginVertical: 10,
        width: 300
    },

    registerPasswordInput: {
        marginTop: 20
    },

    buttons: {
        marginTop: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    forgotPasswordBtn: {
        color: "#007FFF",
        fontWeight: "500"
    },

    registerBtnContainer: {
        marginTop: 80
    },

    registerBtn: {
        width: 200,
        backgroundColor: "#FEBE10",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15
    },

    registerBtnText: {
        textAlign: "center",
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },

    signUpContainer: {
        marginTop: 15
    },

    signUpText: {
        textAlign: "center",
        color: "gray",
        fontSize: 16
    },

    registerNameInput: {
        marginTop: 20
    }
});