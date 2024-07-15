import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Swiper from 'react-native-swiper';

const ImageSlider = () => {
    const [userData] = useState([
        {
            img: 'https://st2.depositphotos.com/4345611/11742/v/950/depositphotos_117428044-stock-illustration-pikachu-sale-vector.jpg',
            name: 'sale',
        },
        {
            img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4xseyGQiMf__vI6MQQiNEXOG9tyfCjURx4w&s',
            name: 'pokeballs',
        },
        {
            img: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2021/04/Pokemon-Potions-And-Healing-Items.jpg?q=50&fit=crop&w=1100&h=618&dpr=1.5',
            name: 'healing items',
        },

    ]);
    return (
        <View style={{marginTop:20}}>
            <Swiper showsButtons={true} style={{ height: 200 }} autoplay autoplayTimeout={7}>
                {userData.map((image) => (
                    <View key={image} style={{ alignItems: 'center' }}>
                        <Image
                            style={{ width: 300, height: 200 }}
                            source={{ uri: image.img }}
                        />
                    </View>
                ))}
            </Swiper>

        </View>
    )
}

export default ImageSlider