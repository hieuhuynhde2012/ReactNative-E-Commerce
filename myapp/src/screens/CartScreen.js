import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from '../store/user/userSlice';
import { useNavigation } from '@react-navigation/native';
import { formatCurrency } from '../utils/helpers';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import logo from '../../assets/logo.png';
import { apiRemoveCart, apiUpdateCart } from '../apis';
import Lottie from 'lottie-react-native';
import { images } from '../../assets';

const CartScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { currentCart, current } = useSelector((state) => state.user);

    const total = formatCurrency(
        currentCart?.reduce(
            (sum, el) => sum + Number(el?.price * el?.quantity),
            0,
        ),
    );

    const increaseQuantity = async (item) => {
        const updatedItem = {
            pid: item.product._id,
            color: item.color,
            quantity: 1,
            price: item.price,
            thumbnail: item.thumbnail,
            title: item.title,
            actionType: 'increase',
        };

        try {
            const response = await apiUpdateCart(updatedItem);
            if (response.success) {
                dispatch(
                    incrementQuantity({
                        pid: item.product._id,
                        color: item.color,
                    }),
                );
            } else {
                alert('Failed to update quantity');
            }
        } catch (error) {
            console.error('Error increasing quantity:', error);
            alert('An error occurred while increasing the quantity');
        }
    };

    const decreaseQuantity = async (item) => {
        if (item.quantity === 1) {
            try {
                await deleteItem(item.product._id, item.color);
            } catch (error) {
                console.error('Error removing item from cart:', error);
                alert('An error occurred while removing the item');
            }
        } else {
            const updatedItem = {
                pid: item.product._id,
                color: item.color,
                quantity: item.quantity,
                price: item.price,
                thumbnail: item.thumbnail,
                title: item.title,
                actionType: 'decrease',
            };

            try {
                const response = await apiUpdateCart(updatedItem);
                if (response.success) {
                    dispatch(
                        decrementQuantity({
                            pid: item.product._id,
                            color: item.color,
                        }),
                    );
                } else {
                    alert('Failed to update quantity');
                }
            } catch (error) {
                console.error('Error decreasing quantity:', error);
                alert('An error occurred while decreasing the quantity');
            }
        }
    };

    const deleteItem = async (pid, color) => {
        try {
            const response = await apiRemoveCart(pid, color);
            console.log(response);
            if (response.success) {
                dispatch(removeFromCart({ pid, color }));
            } else {
                alert('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            alert('An error occurred while removing the item');
        }
    };

    return (
        <>
            <View style={styles.headerContainer}>
                <View style={styles.headerAnimation}>
                    <Lottie
                        source={require('../../assets/animations/cart_loading.json')}
                        autoPlay
                        loop
                        style={{
                            width: 68,
                            height: 68,
                            resizeMode: 'contain',
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
                <Pressable onPress={() => navigation.navigate('Home')}>
                    <Image style={styles.logo} source={logo} />
                </Pressable>
            </View>
            {currentCart.length === 0 ? (
                <View style={styles.container}>
                    <View style={styles.emptyCartContainer}>
                        <View style={styles.cartIcon}>
                            <Image
                                source={images?.cart_empty}
                                style={styles.cartImage}
                            />
                        </View>
                        <Text style={styles.emptyTitle}>
                            Your cart is empty!
                        </Text>
                        <Text style={styles.emptyMessage}>
                            Items must be added to the cart before proceeding to
                            checkout.
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Home')}
                            style={styles.emptyButton}
                        >
                            <Text style={styles.emptyButtonText}>
                                SHOPPING NOW
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <ScrollView
                    style={styles.srcContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.scrInnerContainer}>
                        <View style={styles.totalContainer}>
                            <View style={styles.subTotalContainer}>
                                <Text
                                    style={[
                                        styles.subTotalText,
                                        styles.boldText,
                                    ]}
                                >
                                    {`Subtotal: `}
                                </Text>
                                <Text
                                    style={[
                                        styles.subTotalText,
                                        styles.boldText,
                                    ]}
                                >
                                    {total}
                                </Text>
                            </View>

                            <Text style={[styles.italicText]}>
                                Ready to checkout?
                            </Text>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('Confirm')}
                                style={styles.buyButtonContainer}
                            >
                                <Text style={styles.buyButtonText}>
                                    Proceed to Buy ({currentCart?.length}) items
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container}>
                            {currentCart.map((item) => (
                                <View
                                    key={item._id}
                                    style={styles.cartItemWrapper}
                                >
                                    <View style={styles.imgWrapper}>
                                        <Image
                                            style={styles.img}
                                            source={{
                                                uri: `${item?.thumbnail}`,
                                            }}
                                        />
                                    </View>
                                    <View style={styles.contentWrapper}>
                                        <View style={styles.inforWrapper}>
                                            <Text
                                                numberOfLines={1}
                                                ellipsizeMode="tail"
                                                style={[styles.textTitle]}
                                            >
                                                {item?.title}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    styles.boldText,
                                                ]}
                                            >
                                                {formatCurrency(
                                                    item?.price *
                                                        item?.quantity,
                                                )}
                                            </Text>
                                        </View>

                                        <View style={styles.ctrlWrapper}>
                                            <View
                                                style={styles.quantityCtrlBtn}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        increaseQuantity(item)
                                                    }
                                                >
                                                    <FontAwesome5
                                                        name="plus-circle"
                                                        size={28}
                                                        color="#ee3131"
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        styles.boldText,
                                                    ]}
                                                >
                                                    {item?.quantity}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        decreaseQuantity(item)
                                                    }
                                                >
                                                    <FontAwesome5
                                                        name="minus-circle"
                                                        size={28}
                                                        color="#ee3131"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            deleteItem(
                                                item?.product?._id,
                                                item?.color,
                                            )
                                        }
                                        style={styles.deleteBtn}
                                    >
                                        <FontAwesome5
                                            name="times"
                                            size={22}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    headerAnimation: {
        height: 62,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -20,
        marginLeft: -16,
        marginBottom: -14,
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        gap: 16,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    cartIcon: {
        position: 'relative',
        marginBottom: 20,
        marginTop: 70,
    },
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    srcContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 12,
    },
    scrInnerContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        backgroundColor: '#f0f0f0',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textHeader: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    logo: {
        width: 160,
        objectFit: 'contain',
    },

    cartItemWrapper: {
        width: '100%',
        aspectRatio: 3 / 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        padding: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
        borderRadius: 16,
        marginBottom: 20,
        backgroundColor: 'white',
        gap: 10,
        overflow: 'hidden',
    },
    contentWrapper: {
        flex: 1,
        position: 'relative',
        justifyContent: 'space-between',
        alignItems: 'stretch',
    },
    textTitle: {
        fontSize: 16,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    imgWrapper: {
        width: '29%',
        aspectRatio: 1 / 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 12,
    },
    img: {
        width: '100%',
        aspectRatio: 1 / 1,
        resizeMode: 'contain',
    },
    inforWrapper: {
        width: '90%',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'flex-start',
    },
    ctrlWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },

    quantityCtrlBtn: {
        width: '60%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    deleteBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#ee3131',
        borderWidth: 1,
        borderColor: '#ee3131',
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 6,
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
    warningIcon: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ee3131',
        marginBottom: 10,
    },
    emptyMessage: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    emptyButton: {
        backgroundColor: '#ee3131',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cartImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    cartTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchContainer: {
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartContainer: {
        flex: 1,
        alignItems: 'center',
        marginBottom: -20,
    },
    cartHeader: {
        fontSize: 100,
    },
    icon: {
        marginRight: 10,
    },
    subTotalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalContainer: {
        borderWidth: 1,
        borderColor: '#a0a0a0',
        width: '100%',
        padding: 10,
        borderRadius: 16,
        marginVertical: 20,
        justifyContent: 'space-between',
    },
    subTotalText: {
        fontSize: 18,
        fontWeight: '400',
    },
    cartHeader: {
        marginHorizontal: 10,
    },
    buyButtonContainer: {
        width: '100%',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#ee3131',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buyButtonText: {
        fontSize: 18,
        fontWeight: '400',
        color: 'white',
    },
    seperator: {
        height: 1,
        borderColor: '#D0D0D0',
        borderWidth: 1,
        marginTop: 15,
    },
    imageContainer: {
        width: 140,
        height: 140,
        resizeMode: 'contain',
        borderColor: '#D0d0d0',
        borderWidth: 1,
        marginLeft: 10,
    },
    productInfoContainer: {
        backgroundColor: 'white',
        marginVertical: 10,
        borderBottomColor: '#F0F0F0',
        borderWidth: 2,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
    },
    productInfo: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    productTitle: {
        width: 150,
        marginTop: 10,
    },
    productPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 6,
    },
    inStockText: {
        color: 'red',
        fontWeight: '500',
    },
    styleIcon: {
        backgroundColor: '#D8D8D8',
        padding: 7,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
    },
    iconCotainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 7,
        borderColor: '#D0d0d0',
        borderWidth: 1,
        marginLeft: 10,
    },
    quantityAdjust: {
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderColor: '#D0d0d0',
    },
    pressableContainer: {
        marginTop: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    customButton: {
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 14,
        borderRadius: 7,
        borderColor: '#D0d0d0',
        borderWidth: 1,
        marginLeft: 5,
    },
    boderPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
        marginLeft: 10,
    },
    italicText: {
        fontStyle: 'italic',
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default CartScreen;
