import { View, Text,StyleSheet,Image } from 'react-native'
import React from 'react'

const Logo = () => {
    return (
        <View style={styles.logoContainer}>
            <Image style={styles.img}
                source={{
                    uri: "https://media.pocketmonsters.net/news/4863/logo.jpg/t/450.png"
                }}

            />

        </View>
    )
}

const styles = StyleSheet.create({
    logoContainer: {
        marginTop: 40
    },
    img: {
        width: 180,
        height: 100
    }
})

export default Logo