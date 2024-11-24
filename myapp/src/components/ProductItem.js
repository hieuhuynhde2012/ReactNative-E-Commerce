import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/user/userSlice';
import { formatCurrency } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { apiUpdateCart } from '../apis';

const ProductItem = ({ item }) => {
    const dispatch = useDispatch();
    const { currentCart } = useSelector((state) => state.user);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const addItemToCart = async (item) => {
        setLoading(true);

        try {
            const newItem = {
                pid: item._id,
                color: item.color,
                quantity: 1,
                price: item.price,
                thumbnail: item.thumb,
                title: item.title,
                actionType: 'increase',
            };

            const response = await apiUpdateCart(newItem);
            if (response.success) {
                dispatch(addToCart(newItem));
            } else {
                console.error(
                    'Failed to add item to cart:',
                    response.data.message,
                );
            }
        } catch (error) {
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate('Info', {
                    id: item._id,
                    title: item.title,
                    price: item?.price,
                    carouseImages: item.images,
                    color: item?.color,
                    description: item?.description,
                    item: item,
                })
            }
        >
            <Image style={styles.image} source={{ uri: item?.thumb }} />
            <Text numberOfLines={1} style={styles.title}>
                {item?.title}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.price}>{formatCurrency(item?.price)}</Text>
                <Text style={styles.rating}>{item?.totalRating} ⭐️</Text>
            </View>

            <TouchableOpacity
                onPress={() => addItemToCart(item)}
                style={[styles.addButton, loading && { opacity: 0.7 }]}
                disabled={loading}
            >
                {currentCart.length > 0 &&
                currentCart?.some(
                    (cartItem) => cartItem?.product?._id === item._id,
                ) ? (
                    <View>
                        <Text style={styles.addToCartText}>Add more</Text>
                    </View>
                ) : (
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default ProductItem;

const styles = StyleSheet.create({
    container: {
        width: 170,
        borderWidth: 1,
        borderColor: '#D0d0d0',
        borderRadius: 16,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    title: {
        alignSelf: 'left',
        marginTop: 10,
    },
    infoContainer: {
        width: '100%',
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    price: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    rating: {
        color: '#FFC72C',
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#ee3131',
        padding: 10,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginTop: 10,
        width: '100%',
    },
    buttonText: {
        color: 'white',
    },
    addToCartText: {
        color: 'white',
    },
});
