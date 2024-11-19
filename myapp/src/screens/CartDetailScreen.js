import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { formatCurrency } from '../utils/helpers';

const CartDetailScreen = () => {
    const { currentCart, current } = useSelector((state) => state.user);

    // Check if the user has a particular address

    return (
        <View style={styles.container}>
            {currentCart.length > 0 &&
                currentCart.map((item) => (
                    <View key={item._id} style={styles.cartItemWrapper}>
                        <View style={styles.imgWrapper}>
                            <Image
                                style={styles.img}
                                source={{ uri: `${item?.thumbnail}` }}
                            />
                        </View>
                        <View style={styles.inforWrapper}>
                            <Text numberOfLines={1} style={[styles.text]}>
                                {item?.title}
                            </Text>
                            <Text style={[styles.text, styles.boldText]}>
                                {formatCurrency(item?.price * item?.quantity)}
                            </Text>
                        </View>
                        <View style={styles.ctrlWrapper}>
                            <TouchableOpacity>
                                <FontAwesome
                                    name="plus-circle"
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                            <Text style={[styles.text, styles.boldText]}>
                                {item?.quantity}
                            </Text>
                            <TouchableOpacity>
                                <FontAwesome
                                    name="minus-circle"
                                    size={24}
                                    color="black"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            <View style={styles.totalPriceWrapper}>
                <Text style={[styles.text, styles.boldText]}>
                    {`Subtotal: ${formatCurrency(
                        currentCart?.reduce(
                            (sum, el) => sum + Number(el?.price * el?.quantity),
                            0,
                        ),
                    )}`}
                </Text>
            </View>
            <TouchableOpacity style={styles.btn}>
                <Text style={[styles.largeText, styles.whiteText]}>Order</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CartDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartItemWrapper: {
        width: '100%',
        aspectRatio: 3 / 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
        borderRadius: 16,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    imgWrapper: {
        width: '29%',
        aspectRatio: 1 / 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '100%',
        aspectRatio: 1 / 1,
        resizeMode: 'contain',
    },
    inforWrapper: {
        width: '56%',
        justifyContent: 'space-between',
        gap: 16,
        alignItems: 'flex-start',
    },
    ctrlWrapper: {
        width: '10%',
        height: '100%',

        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPriceWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
    },
    btn: {
        width: '100%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#ee3131',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    whiteText: {
        color: 'white',
    },
});
