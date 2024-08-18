import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Foundation } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { presentableWord } from '../utils/consts';

import CurrencyPD from './CurrencyPD';

const ProductProfile = ({ product, quantityBought, quantitySale }) => {
    return (
        <View style={[styles.productContainer, { borderColor: product.isShiny ? 'gold' : 'black' }]} key={product._id}>
            {product.isShiny && (
                <>
                    <Ionicons name="sparkles-sharp" size={15} color="gold" style={styles.shinyContainerTop} />
                    <Ionicons name="sparkles-sharp" size={15} color="gold" style={styles.shinyContainerBottom} />
                </>

            )}
            <View>
                <View>

                    <Image
                        source={{ uri: product.img }}
                        style={styles.productImg}
                    />
                    <View style={styles.genderLevelContainer}>
                        <Text style={{ fontSize: 11 }}>
                            LV: {product.level}
                        </Text>
                        {product.gender ? (
                            <Foundation name="female-symbol" size={15} color='pink' style={styles.gender} />
                        ) : (
                            <Foundation name="male-symbol" size={15} color='blue' style={styles.gender} />

                        )}
                    </View>
                </View>
                <View style={{ marginTop: 2 }}>
                    <Text style={[styles.productNamePrice, {fontWeight:'bold', maxWidth:80, textAlign:'center'}]}>{presentableWord(product.name)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.productNamePrice}>{product.price} </Text>
                        <CurrencyPD
                            style={styles.currency}
                        />

                        {quantityBought && (
                            <Text>({quantityBought})</Text>
                        )}
                        {quantitySale && (
                            <Text>({quantitySale} left)</Text>
                        )}
                    </View>
                </View>


            </View>

        </View>
    )
}

export default ProductProfile

const styles = StyleSheet.create({
    productContainer: {
        margin: 5,
        borderColor: 'black',
        borderWidth: 1,
        padding: 3,
        borderRadius: 5
    },
    productImg: {
        resizeMode: 'contain',
        width: 70,
        height: 70,
        alignSelf:'center'
    },
    shinyContainerTop: {
        position: 'absolute',
        top: -5,
        left: -6,
        backgroundColor: 'white'
    },
    shinyContainerBottom: {
        position: 'absolute',
        bottom: -6,
        right: -8,
        backgroundColor: 'white'
    },
    genderLevelContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#DEDEDE',
        opacity: 0.7,
        flexDirection: 'row',
        padding: 2,
        alignItems: 'center',
    },
    currency: {
        resizeMode: "contain",
        width: 13,
        height: 13
    },
    productNamePrice: {
        fontSize: 15,
        alignSelf: 'center'
    }
})