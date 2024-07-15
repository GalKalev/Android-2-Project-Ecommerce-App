import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { FloatingAction } from "react-native-floating-action";
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";


const FloatingButton = (props) => {

  const navigation = useNavigation();
  const actions = [
    {
        text: 'Add Pokemon',
        icon: require('..\\images\\pokemon_icon.png'),
        name: 'bt_add_pokemon',
        position: 1
    },
    {
        text: 'Add Item',
        icon: require('..\\images\\pokemon_ball_icon.png'),
        name: 'bt_add_Item',
        position: 2
    },
    {
        text: 'Add Berry',
        icon: require('..\\images\\berry_icon.png'),
        name: 'bt_add_berry',
        position: 3
    }
];

// Handle action button press
const handlePress = (name) => {
    switch (name) {
        case 'bt_add_pokemon':
            navigation.navigate('AddPokemon');
            break;
        case 'bt_add_Item':
            Alert.alert('Add Item', 'Navigate to add item screen');
            break;
        case 'bt_add_berry':
            Alert.alert('Add Berry', 'Navigate to add berry screen');
            break;
        default:
            break;
    }
};

return (
    <View style={styles.container}>
        {/* Other components can be added here */}
        
        <FloatingAction
            actions={actions}
            onPressItem={name => handlePress(name)}
        />
    </View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
}
});

export default FloatingButton