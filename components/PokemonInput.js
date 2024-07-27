import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';

const PokemonInput = ({ input, setInput, placeholder, style }) => {
    const [inputValue, setInputValue] = useState(input);

    useEffect(() => {
        if (input !== null && input !== undefined) {
            setInputValue(input.toString());
        }
    }, [input]);

    function handleStatChange(inp) {
        setInputValue(inp);
        setInput(inp);
    }

    return (
        <View>
            <Pressable style={{ alignItems: 'center' }}>
                <TextInput
                    style={style}
                    onChangeText={handleStatChange}
                    value={inputValue}
                    keyboardType="numeric"
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                />
            </Pressable>
        </View>
    );
}

export default PokemonInput;

