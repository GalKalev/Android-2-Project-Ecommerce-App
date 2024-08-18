import { StyleSheet, Text, View, TextInput } from "react-native";
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const LogRegForm = ({ isLog, email, setEmail, name, setName, password, setPassword }) => {
    return (

        <View>
            {isLog ? (
                <View style={styles.textBox}>
                    <Text style={styles.text}>
                        Login To Your Account
                    </Text>
                </View>

            ) : (
                <View>
                     <View style={styles.textBox}>
                    <Text style={styles.text}>
                        Register an Account
                    </Text>
                </View>

            <View style={styles.nameInput}>
                <View style={styles.input}>
                    <Ionicons style={styles.inputIcon}
                        name="person"
                        size={24}
                        color="gray" />
                    <TextInput style={[styles.inputText, { fontSize: name ? 16 : 16 }]}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        placeholder="Enter your name" />
                </View>
            </View>
                </View>
               
            )}


            <View style={styles.emailInput}>
                <View style={styles.input}>
                    <MaterialIcons style={styles.inputIcon}
                        name="email"
                        size={24}
                        color="gray" />
                    <TextInput style={[styles.inputText, { fontSize: email ? 16 : 16 }]}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        placeholder="Enter your Email" />
                </View>
            </View>

            <View style={styles.passwordInput}>
                <View style={styles.input}>
                    <AntDesign style={styles.inputIcon}
                        name="lock"
                        size={24}
                        color="gray" />
                    <TextInput style={[styles.inputText, { fontSize: password ? 16 : 16 }]}
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                        placeholder="Enter your Password" />
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    textBox: {
        alignItems: "center"
    },

    text: {
        fontSize: 17,
        fontWeight: "bold",
        marginTop: 12,
        color: "#041E42"
    },

    emailInput: {
        marginTop: 20
    },

    input: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 5,
        backgroundColor: "#D0D0D0",
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 30
    },

    inputIcon: {
        marginLeft: 8
    },

    inputText: {
        color: "gray",
        marginVertical: 10,
        width: 300
    },

    passwordInput: {
        marginTop: 20
    },

    nameInput: {
        marginTop: 20
    }
});
export default LogRegForm