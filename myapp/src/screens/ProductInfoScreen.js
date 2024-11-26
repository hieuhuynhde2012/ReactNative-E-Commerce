import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Pressable,
    ImageBackground,
    Dimensions,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart, addToCart } from '../store/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/helpers';
import logo from '../../assets/logo.png';
import { apiUpdateCart } from '../apis';
import Lottie from 'lottie-react-native';

const { width } = Dimensions.get('window');
const height = (width * 100) / 100;

const ProductInfoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const { currentCart } = useSelector((state) => state.user);

    srcRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        if (contentOffsetX < 0) {
            setCurrentIndex(0);
            return;
        }
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const addItemToCart = async (item) => {
        setLoading(true);

        try {
            const newItem = {
                pid: item?._id,
                color: item?.color,
                quantity: 1,
                price: item?.price,
                thumbnail: item?.thumb,
                title: item?.title,
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
        <>
            <View style={styles.searchBarContainer}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back-outline"
                        size={32}
                        color="black"
                    />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image style={styles.logo} source={logo} />
                </Pressable>
            </View>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.productImgListWrapper,
                        { height: height * 0.8 },
                    ]}
                >
                    {route?.params?.carouseImages?.map((item, index) => (
                        <Pressable
                            onPress={() => {
                                setCurrentIndex(index);
                                srcRef.current.scrollTo({
                                    x: index * width,
                                    y: 0,
                                    animated: true,
                                });
                            }}
                            key={index}
                            style={[
                                styles.productImgListItem,
                                index === currentIndex && {
                                    borderColor: '#aaa',
                                },
                                index === currentIndex && {
                                    opacity: 1,
                                },
                            ]}
                        >
                            <Image
                                style={[
                                    styles.productImgItem,
                                    index === currentIndex && {
                                        opacity: 1,
                                    },
                                ]}
                                source={{ uri: item }}
                            ></Image>
                        </Pressable>
                    ))}
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ref={srcRef}
                    pagingEnabled
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {route.params.carouseImages.map((item, index) => (
                        <View
                            key={index}
                            style={[styles.productImg, { width, height }]}
                        >
                            <ImageBackground
                                style={[
                                    styles.imageBackground,
                                    { width: width * 0.8, height: width * 0.8 },
                                ]}
                                source={{ uri: item }}
                            ></ImageBackground>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.infoContainer}>
                    <Text style={styles.productTitle}>
                        {route?.params?.title}
                    </Text>
                    <Text style={styles.inStockText}>In Stock</Text>
                    <Text style={styles.productPrice}>
                        {formatCurrency(route?.params.price)}
                    </Text>
                </View>

                <Text style={styles.separator} />

                <View style={styles.colorContainer}>
                    <Text style={styles.descriptionTitle}>
                        {`Color: `}
                        <Text style={styles.colorText}>
                            {route?.params?.color}
                        </Text>
                    </Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionTitle}>Description:</Text>
                    <View style={styles.table}>
                        {route?.params?.description?.map((descItem, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.rowText}>{descItem}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.deliveryInfoContainer}>
                    <Text style={styles.deliveryText}>
                        FREE delivery Tomorrow by 3PM. Order within 10hrs 30
                        mins
                    </Text>
                </View>

                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={24} color="black" />
                    <Text>Deliver To HCM - 70000</Text>
                </View>

                <Pressable
                    onPress={() => addItemToCart(route?.params?.item)}
                    style={[
                        styles.addToCartButton,
                        loading && { opacity: 0.7 },
                    ]}
                    disabled={loading}
                >
                    {currentCart.length > 0 &&
                    currentCart?.some(
                        (cartItem) =>
                            cartItem?.product?._id === route?.params?.id,
                    ) ? (
                        <View>
                            <Text style={styles.addToCartText}>Add more</Text>
                        </View>
                    ) : (
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    )}
                    <View style={styles.addingAnimationWrapper}>
                        <Lottie
                            source={require('../../assets/animations/cart_adding.json')}
                            autoPlay
                            loop
                            style={{
                                width: 200,
                                height: 200,
                                resizeMode: 'contain',
                                borderWidth: 1,
                            }}
                            colorFilters={[
                                {
                                    keypath: 'button',
                                    color: '#F00000',
                                },
                                {
                                    keypath: 'Sending Loader',
                                    color: '#F00000',
                                },
                            ]}
                        />
                    </View>
                    {/* <Ionicons name="bag-add-outline" size={24} color="#fff" /> */}
                </Pressable>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        position: 'relative',
    },
    searchBarContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        width: 160,
        objectFit: 'contain',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 7,
        gap: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        height: 38,
        flex: 1,
        justifyContent: 'space-between',
    },
    textInputSearch: {
        marginLeft: 10,
    },
    searchIcon: {
        paddingLeft: 10,
        marginRight: 10,
    },
    productImgListWrapper: {
        position: 'absolute',
        zIndex: 1,
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
        top: 12,
        left: 12,
    },
    productImgListItem: {
        width: 40,
        height: 40,
        padding: 2,
        borderWidth: 1,
        opacity: 0.4,
        borderColor: '#D0D0D0',
        overflow: 'hidden',
        borderRadius: 10,
        opacity: 0.4,
        backgroundColor: 'white',
    },
    productImgItem: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    productImg: {
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'contain',
    },

    imageBackground: {
        marginTop: 25,
        resizeMode: 'contain',
    },
    imageHeader: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    discountBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#C60C30',
        justifyContent: 'center',
        alignItems: 'center',
    },
    discountText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 12,
    },
    shareButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto',
        marginLeft: 20,
        marginBottom: 20,
    },
    infoContainer: {
        padding: 10,
    },
    productTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 6,
    },
    separator: {
        alignSelf: 'center',
        width: '94%',
        height: 0.5,
        borderColor: '#D0D0D0',
        borderBottomWidth: 1,
    },
    colorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    colorText: {
        fontSize: 16,
        fontWeight: 'light',
    },
    descriptionContainer: {
        padding: 10,
    },
    descriptionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    table: {
        borderWidth: 1,
        paddingTop: 12,
        borderColor: '#D0D0D0',
        borderRadius: 12,
        overflow: 'hidden',
    },
    tableRow: {
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 12,
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    rowText: {
        fontSize: 15,
        flex: 1,
    },
    deliveryInfoContainer: {
        padding: 10,
    },
    deliveryText: {
        color: '#C60C30',
    },
    locationContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        gap: 5,
    },
    inStockText: {
        color: '#ee3131',
    },
    addingAnimationWrapper: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        width: 32,
        height: 24,
    },
    addToCartButton: {
        backgroundColor: '#ee3131',
        padding: 12,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 10,
        gap: 8,
    },
    addToCartText: {
        color: 'white',
        fontSize: 20,
    },
});

export default ProductInfoScreen;
