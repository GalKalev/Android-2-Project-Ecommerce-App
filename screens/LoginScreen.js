import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Button, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Logo from "../components/Logo";
import LogRegForm from "../components/LogRegForm";
import { checkLogin } from '../api/apiServices';
import { IP_ADDRESS } from '@env';
import Loading from "../components/Loading";

const LoginScreen = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const[isLoading, setLoading] = useState(false)

    const navigation = useNavigation();


    const handleLogin = async () => {
        try {
            const loginSuccess = await checkLogin(email, password);
            if (loginSuccess.success === true) {
                navigation.replace('Main');
            } else {
                Alert.alert("Login Error", error.response.data.message || "An error occurred during login");
            }
        } catch (error) {
            Alert.alert("Login Error", "An unexpected error occurred");
            console.error("Login error: ", error);
        }
    }

    if(isLoading){
        return(
            <Loading/>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <Logo/>

            <KeyboardAvoidingView>
                <LogRegForm
                    isLog={true}
                    email={email}
                    setEmail={setEmail}
                    password={password} 
                    setPassword={setPassword}
                />

                {/* TODO: make this button work */}
                <View style={styles.buttons}>
                    <Text>Keep me logged in</Text>
                    <Text style={styles.forgotPasswordBtn}>Forgot Password</Text>
                </View>

                <View style={styles.loginBtnContainer}>
                    <Pressable style={styles.loginBtn}
                        onPress={handleLogin}
                    >
                        <Text style={styles.loginBtnText}>
                            Login
                        </Text>
                    </Pressable>
                </View>

                <Pressable style={styles.signUpContainer}
                    onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.signUpText}>
                        Don't have an account? Sign Up
                    </Text>
                </Pressable>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
    },

    loginLogo: {
        marginTop: 40
    },

    img: {
        width: 180,
        height: 100
    },

    loginTextBox: {
        alignItems: "center"
    },

    loginText: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 12,
        color: "#041E42"
    },

    loginEmailInput: {
        marginTop: 70
    },

    loginInput: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 5,
        backgroundColor: "#D0D0D0",
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30
    },

    loginInputIcon: {
        marginLeft: 8
    },

    loginInputText: {
        color: "gray",
        marginVertical: 10,
        width: 300
    },

    loginPasswordInput: {
        marginTop: 30
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

    loginBtnContainer: {
        marginTop: 80
    },

    loginBtn: {
        width: 200,
        backgroundColor: "#FEBE10",
        borderRadius: 6,
        marginLeft: "auto",
        marginRight: "auto",
        padding: 15
    },

    loginBtnText: {
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
    }
});