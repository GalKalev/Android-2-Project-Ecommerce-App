import { View, Pressable, TextInput } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';

const SearchInput = (props) => {
    return (
        <View style={props.styleSearchContainer}>
            <Pressable style={props.styleSearchBar}>
                <AntDesign style={{ paddingLeft: 10 }}
                    name="search1"
                    size={24}
                    color="black" />
                <TextInput
                    style={props.stylesInput}
                    value={props.value}
                    onChangeText={(txt) => props.handleSearchInput(txt)}
                    placeholder={props.placeholder}
                />
            </Pressable>

        </View>
    )
}




export default SearchInput