import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const PokemonStats = ({ stat, setStat, placeholder, style }) => {

    function handleStatChange(st){
        setStat(st);
    }
    return (
        <View>
            <Pressable style={{ alignItems: 'center' }}>
                <TextInput
                    style={style}
                    onChangeText={handleStatChange}
                    value={stat}
                    keyboardType="numeric"
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                />
            </Pressable>
        </View>
    )
}



export default PokemonStats