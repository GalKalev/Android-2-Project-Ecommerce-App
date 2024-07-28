import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NoItems = ({text}) => {
    return (
        <View style={{margin:10}}>
            <Text style={{fontSize:18, textAlign:'center', justifyContent:'center'}}>{text}</Text>
            <Image
                style={{width:250, height:250, resizeMode:'contain', alignSelf:'center'}}
                source={{uri: 'https://m.media-amazon.com/images/I/31l-gSFQJKS._AC_.jpg'}}
            />
        </View>
    )
}

export default NoItems

const styles = StyleSheet.create({})