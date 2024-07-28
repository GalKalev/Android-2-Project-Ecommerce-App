import { View, Image } from 'react-native';
import React from 'react';
import Swiper from 'react-native-swiper';

const ImageSlider = () => {
    const userData = [
        {
            img: require('../images/image_slider_one.png'),
            name: 'delivery',
        },
        {
            img: require('../images/image_slider_two.jpg'),
            name: 'sale',
        },
       
        {
            img: require('../images/image_slider_three.png'),
            name: 'healing items',
        },
    ];

    return (
        <View style={{ marginTop: 20, }}>
            <Swiper showsButtons={true} style={{ height: 200, marginBottom:25 }} autoplay autoplayTimeout={7}>
                {userData.map((image, index) => (
                    <View key={index} style={{ alignItems: 'center' }}>
                        <Image
                            style={{ width: 300, height: 200, resizeMode: 'contain' }}
                            source={image.img}
                        />
                    </View>
                ))}
            </Swiper>
        </View>
    );
}

export default ImageSlider;
