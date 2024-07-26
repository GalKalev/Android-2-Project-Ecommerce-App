import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ExpandableListItem from './ExpandableListItem ';

const ExpandableList  = ({data}) => {
    const renderItem = ({ item }) => ( 
        <ExpandableListItem item={item} /> 
    ); 
  
    return ( 
        <FlatList 
            data={data} 
            renderItem={renderItem} 
            keyExtractor={(item) => item.id} 
        /> 
    ); 
}

export default ExpandableList 

const styles = StyleSheet.create({})