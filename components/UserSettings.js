import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { useUser } from '../utils/UserContext';
import { useNavigation, CommonActions } from '@react-navigation/native'
import { TextInput } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';


const UserSettings = () => {
   

    const { user, setUser } = useUser();
    const navigator = useNavigation()
    const [editActive, setEditActive] = useState(false);
    const [newName, setNewName] = useState(user.name);

    const handleEditName = () => {
       
        console.log('edit name')
        setEditActive(true);
    }

    const handleApproveName = () => {
        if(newName === ''){
            Alert.alert('Name cannot be empty');
            return;
        }
        setEditActive(false)
        console.log(newName);
        // const editedUser = {'userId':user.userId, 'name':newName, 'email':user.email};
        // setUser(editedUser);
        user.name = newName;
        console.log(JSON.stringify(user));
        //TODO: edit user name in database

    }

    const handleCancelEditName = () => {
        setEditActive(false)
        setNewName(user.name);
    }



    const handleLogOut = () => {
        console.log('log out pressed');
        Alert.alert('Log out?', 'press OK to log out', [
            {
                text: 'OK',
                onPress: () => navigator.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                ),
            },
            {
                text: 'CANCEL',
                style: 'cancel'
            }

        ])
    }


    return (
        <View>
            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Edit Name</Text>
            <View style={{ flexDirection: 'row' }}>
                {/* <Text>{user.name}</Text> */}
                <TextInput
                    value={newName}
                    disabled={!editActive}
                    style={[styles.input, editActive && styles.disabledInput]}
                    onChangeText={(txt) => {
                        setNewName(txt);
                    }}
                />
                {editActive ? (
                    <View style={{marginLeft: 10, alignItems:'center'}}>
                        <Pressable onPress={handleApproveName}>
                            <AntDesign name="checkcircle" size={24} color="black" />
                        </Pressable>
                        <Pressable onPress={handleCancelEditName}>
                            <MaterialIcons name="cancel" size={30} color="gray" />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={handleEditName} style={{marginLeft: 10, alignSelf:'center'}}>
                        <AntDesign name="edit" size={24} color="black" />
                    </Pressable>
                )}

            </View>
            <Pressable style={styles.logOutBtn} onPress={handleLogOut}>
                <Text style={styles.logOutBtnText}>LOG OUT</Text>
            </Pressable>
        </View >
    )
}

export default UserSettings

const styles = StyleSheet.create({
    logOutBtn: {
        backgroundColor: '#ff0000',
        alignItems: 'center',
        padding: 5,
        marginTop: 18,
        borderRadius: 5
    }, logOutBtnText: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {

        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'black',
        textAlign: 'center'
    },
    disabledInput: {
        backgroundColor: 'white',
        color: 'black',
    },
})