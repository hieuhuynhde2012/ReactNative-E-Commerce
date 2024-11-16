import React from 'react';
import {
    View,
    Text,
    SafeAreaView,
    Platform,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect, useCallback } from 'react';
import ProductItem from '../components/ProductItem';
import { apiGetProducts, apiSearchProduct } from '../apis/product';
import DropDownPicker from 'react-native-dropdown-picker';
import ProductBar from '../components/ProductBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { color } from 'react-native-elements/dist/helpers';
import { Dimensions } from 'react-native';
import { ModalContent, SlideAnimation } from 'react-native-modals';
import { BottomModal } from 'react-native-modals';
import Carousel from 'react-native-snap-carousel';
import Entypo from '@expo/vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import { updateCart } from '../store/user/userSlice';
import { showLoading, hideLoading } from '../store/app/appSlice';
import { apiGetAdditionalAddress, apiGetCurrent } from '../apis';
import { Audio } from 'expo-av';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { width: viewportWidth } = Dimensions.get('window');
    const [offers, setOffers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState('All');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const handleSearch = async (key) => {
        if (key.trim() !== '') {
            setLoading(true);
            try {
                const response = await apiSearchProduct(key);
                // const responseLimit = res
                setProduct(response.products.slice(0, 5));
                //console.log(response.products.slice(0, 5));
                setShowResults(true);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setProduct([]);
            setShowResults(false);
        }
    };

    const handleOutsidePress = () => {
        setShowResults(false);
        setSearchKey('');
        setProduct([]);
    };

    // useEffect(() => {
    //   Voice._onSpeechStart = onSpeechStart;
    //   Voice._onSpeechEnd = onSpeechEnd;
    //   Voice._onSpeechResults = onSpeechResults;

    //   return () => {
    //     Voice.destroy.then(Voice.removeAllListeners);
    //   };
    // }, []);

    // const onSpeechStart = (e) => {
    //   console.log('Speech started');
    // };

    // const onSpeechEnd = (e) => {
    //   console.log('Speech ended');
    // };

    // const onSpeechResults = (e) => {
    //   const { value } = e;
    //   if (value && value.length > 0) {
    //     setSearchKey(value[0]); // Set the first recognized value as the search key
    //     handleSearch(value[0]); // Call your existing search function
    //   }
    // };

    // const startListening = async () => {
    //   try {
    //     await Voice.start('en-US'); // You can change the language code as needed
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };
    //console.log(selectedAddress);
    const dispatch = useDispatch();
    const [addedToCart, setAddedToCart] = useState(false);
    const addItemToCart = (item) => {
        setAddedToCart(true);
        dispatch(addToCart(item));
        setTimeout(() => {
            setAddedToCart(false);
        }, 6000);
    };
    const cart = useSelector((state) => state.user.cart);

    const list = [
        {
            id: '0',
            image: 'https://hanoicomputercdn.com/media/product/63677_camera_wifi_4mp_ipc_f42p_imou_ho_tro_hotspot.jpg',
            name: 'Camera',
        },
        {
            id: '1',
            image: 'https://digital-world-2.myshopify.com/cdn/shop/files/laptop_300x.jpg?v=1613166811',
            name: 'Laptop',
        },
        {
            id: '2',
            image: 'https://www.svstore.vn/uploads/source/apple-watch-ultra/mqe23ref-vw-34fr-watch-49-titanium-ultra-vw-34fr-wf-co-watch-face-49-alpine-ultra-vw-34fr-wf-co-2.jpg',
            name: 'Accessories',
        },
        {
            id: '3',
            image: 'https://digital-world-2.myshopify.com/cdn/shop/files/printer_300x.jpg?v=1613166810',
            name: 'Printer',
        },
        {
            id: '4',
            image: 'https://media.currys.biz/i/currysprod/M10233499_black?$l-large$&fmt=auto',
            name: 'Speaker',
        },
        {
            id: '5',
            image: 'https://digital-world-2.myshopify.com/cdn/shop/files/mobile-devices_300x.jpg?v=1613166682',
            name: 'Smartphone',
        },
        {
            id: '6',
            image: 'https://digital-world-2.myshopify.com/cdn/shop/files/television_300x.jpg?v=1613166810',
            name: 'Television',
        },
        {
            id: '5',
            image: 'https://sp.yimg.com/ib/th?id=OPHS.r9lTVkznfhmwRQ474C474&o=5&pid=21.1',
            name: 'Tablet',
        },
    ];

    const images = [
        'https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg',
        'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif',
    ];

    const [items, setItems] = useState([
        { label: 'All', value: 'All' },
        { label: 'Laptop', value: 'Laptop' },
        { label: 'Camera', value: 'Camera' },
        { label: 'Accessories', value: 'Accessories' },
        { label: 'Printer', value: 'Printer' },
        { label: 'Speaker', value: 'Speaker' },
        { label: 'Smartphone', value: 'Smartphone' },
        { label: 'Television', value: 'Television' },
        { label: 'Tablet', value: 'Tablet' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetProducts({
                    limit: 100,
                    //sort: "-totalRating",
                });
                //console.log('response', response);
                setProducts(response.productData);
            } catch (error) {
                console.log('error message', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await apiGetProducts({
                    limit: 10,
                    sort: '-totalRating',
                });
                //console.log('response', response);
                setDeals(response.productData);
            } catch (error) {
                console.log('error message', error);
            }
        };
        fetchDeals();
    }, []);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await apiGetProducts({
                    sort: '-quantity',
                });
                if (response.success) setOffers(response.productData);
            } catch (error) {
                console.log('Error:', error);
            }
        };
        fetchOffers();
    }, []);

    const onGenderOpen = useCallback(() => {
        setOpen(true);
    }, []);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchUserAndAddresses();
    }, []);

    const fetchUserAndAddresses = async () => {
        try {
            const userResponse = await apiGetCurrent();
            if (userResponse.success) {
                const userID = userResponse.rs._id;
                //console.log(userID);

                const addressResponse = await apiGetAdditionalAddress(userID);

                if (addressResponse.success) {
                    //console.log(addressResponse.additionalAddress);
                    setAddresses(addressResponse.additionalAddress);
                } else {
                    console.log(
                        'Failed to fetch addresses:',
                        addressResponse.message,
                    );
                }
            } else {
                console.log('Failed to fetch user:', userResponse.message);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };
    //refresh the addresses when the component comes to the focused element
    useFocusEffect(
        useCallback(() => {
            fetchUserAndAddresses();
        }),
    );
    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={handleOutsidePress}>
                        <View
                            style={[
                                styles.searchContainer,
                                showResults && styles.expandedSearchContainer,
                            ]}
                        >
                            <View style={styles.searchBox}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Search"
                                    value={searchKey}
                                    onChangeText={(text) => {
                                        setSearchKey(text);
                                        handleSearch(text);
                                    }}
                                />

                                {showResults && (
                                    <View style={styles.resultsWrapper}>
                                        <FlatList
                                            data={product}
                                            keyExtractor={(item) => item._id}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            'Info',
                                                            {
                                                                id: item?._id,
                                                                title: item?.title,
                                                                price: item?.price,
                                                                carouseImages:
                                                                    item.images,
                                                                color: item?.color,
                                                                description:
                                                                    item?.description,
                                                                item: item,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.resultItem
                                                        }
                                                        numberOfLines={1}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                            style={styles.resultsContainer}
                                        />
                                    </View>
                                )}
                                <AntDesign
                                    style={styles.icon}
                                    name="search1"
                                    size={22}
                                    color="black"
                                />
                            </View>

                            {/* <Feather name="mic" size={24} color="black" /> */}
                        </View>
                    </TouchableWithoutFeedback>

                    <Pressable
                        onPress={() => setModalVisible(!modalVisible)}
                        style={styles.locationContainer}
                    >
                        <Ionicons
                            name="location-outline"
                            size={24}
                            color="black"
                        />

                        <Pressable>
                            {selectedAddress ? (
                                <Text style={styles.selectedLocationText}>
                                    Deliver to {selectedAddress?.name} -{' '}
                                    {selectedAddress?.street}
                                </Text>
                            ) : (
                                <Text style={styles.locationText}>
                                    Add a Adress
                                </Text>
                            )}
                        </Pressable>
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={24}
                            color="black"
                        />
                    </Pressable>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {list.map((item, index) => (
                            <Pressable
                                key={index}
                                style={styles.listItemContainer}
                            >
                                <Image
                                    style={styles.listItemImage}
                                    source={{ uri: item.image }}
                                />
                                <Text style={styles.listItemText}>
                                    {item?.name}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>

                    <Carousel
                        data={images}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: item }}
                                style={{ width: viewportWidth, height: 200 }}
                            />
                        )}
                        sliderWidth={viewportWidth}
                        itemWidth={viewportWidth}
                        autoplay
                        loop
                    />

                    <Text style={styles.trendingDealsTitle}>
                        Trending Deals of the week
                    </Text>
                    <View style={styles.productsContainer}>
                        {deals.slice(0, 4).map((item, index) => (
                            <Pressable
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
                                key={index}
                                style={styles.productItem}
                            >
                                <Image
                                    style={styles.productImage}
                                    source={{ uri: item?.thumb }}
                                />

                                <Text
                                    numberOfLines={1}
                                    style={styles.productTitle}
                                >
                                    {item?.title}
                                </Text>
                                <View style={styles.productInfo}>
                                    <Text style={styles.productPrice}>
                                        {(item?.price / 24000).toFixed(2)} $
                                    </Text>
                                    <Text style={styles.productRating}>
                                        {item?.totalRating} ⭐️
                                    </Text>
                                    {/* <Text style={styles.productSold}>{item?.sold}</Text> */}
                                </View>
                                <ProductBar
                                    numberOfProducts={
                                        item?.quantity - item?.sold
                                    }
                                    totalProducts={item?.quantity}
                                />
                            </Pressable>
                        ))}
                    </View>
                    <Text style={styles.separator} />
                    <Text style={styles.dealsTitle}>Today's Deals</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {offers.slice(0, 4).map((item, index) => (
                            <Pressable
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
                                style={styles.offersItem}
                            >
                                <Image
                                    style={styles.offerImage}
                                    source={{ uri: item?.thumb }}
                                />
                                <View style={styles.offerDiscountContainer}>
                                    <Text style={styles.offerDiscountText}>
                                        Up to 40% Off
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                    <Text style={styles.separator} />
                    <View
                        style={{
                            marginHorizontal: 10,
                            width: '45%',
                            marginBottom: open ? 50 : 15,
                            marginTop: 20,
                        }}
                    >
                        <View style={{ zIndex: 3000 }}>
                            <DropDownPicker
                                style={[{ marginBottom: open ? 150 : 1 }]}
                                open={open}
                                value={category}
                                items={items}
                                setOpen={setOpen}
                                setValue={setCategory}
                                setItems={setItems}
                                placeholder="Choose category"
                                placeholderStyle={{ color: 'gray' }}
                                onOpen={onGenderOpen}
                                zIndex={3000}
                                zIndexInverse={1000}
                            />
                        </View>
                    </View>
                    <View style={styles.productsFilterContainer}>
                        {products
                            ?.filter(
                                (item) =>
                                    category === 'All' ||
                                    item.category === category,
                            )
                            .map((item) => (
                                <ProductItem item={item} key={item.id} />
                            ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <BottomModal
                onBackdropPress={() => setModalVisible(!modalVisible)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                modalAnimation={
                    new SlideAnimation({
                        slideFrom: 'bottom',
                    })
                }
                onHardwareBackPress={() => setModalVisible(!modalVisible)}
                visible={modalVisible}
                onTouchOutside={() => setModalVisible(!modalVisible)}
            >
                <ModalContent
                    style={[styles.modalContentContainer, { zIndex: 20 }]}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalContentHeaderText}>
                            Choose your Location
                        </Text>
                        <Text style={styles.modalContentText}>
                            Select a delivery location to see product
                            availability
                        </Text>
                    </View>
                    <ScrollView
                        style={{ flexDirection: 'row-reverse' }}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {addresses?.map((item, index) => (
                            <Pressable
                                onPress={() => setSelectedAddress(item)}
                                style={[
                                    styles.addressesButtonContainer,
                                    {
                                        backgroundColor:
                                            selectedAddress === item
                                                ? '#FBCEB1'
                                                : 'white',
                                    },
                                ]}
                            >
                                <View style={styles.addressesInfoContainer}>
                                    <Text style={styles.addressesInfoText}>
                                        {item?.name}
                                    </Text>
                                    <Entypo
                                        name="location-pin"
                                        size={24}
                                        color="#ee3131"
                                    />
                                </View>

                                <Text
                                    numberOfLines={1}
                                    style={styles.addressesDetailInfoText}
                                >
                                    {item?.houseNo}, {item?.landmark}
                                </Text>
                                <Text style={styles.addressesDetailInfoText}>
                                    {item?.street}
                                </Text>
                                <Text style={styles.addressesDetailInfoText}>
                                    {item?.country}
                                </Text>
                                {/* <Text style={styles.addressesDetailInfoText}>Phone number: {item?.mobileNo}</Text>
              <Text style={styles.addressesDetailInfoText}>Pin code: {item?.postalCode}</Text> */}
                            </Pressable>
                        ))}
                        <Pressable
                            onPress={() => {
                                setModalVisible(false);
                                navigation.navigate('Address');
                            }}
                            style={styles.addAdressContainer}
                        >
                            <Text style={styles.addAdressText}>
                                Add an Address or pick-up point
                            </Text>
                        </Pressable>
                    </ScrollView>

                    <View style={styles.addLocationContainer}>
                        <View style={styles.addPinCodeContainer}>
                            <Entypo
                                name="location-pin"
                                size={24}
                                color="#ee3131"
                            />
                            <Text style={styles.addPinCodeText}>
                                Enter a VietNam pincode
                            </Text>
                        </View>
                        <View style={styles.addPinCodeContainer}>
                            <Ionicons
                                name="locate-sharp"
                                size={24}
                                color="#ee3131"
                            />
                            <Text style={styles.addPinCodeText}>
                                Use my crrent location
                            </Text>
                        </View>
                        <View style={styles.addPinCodeContainer}>
                            <AntDesign name="earth" size={24} color="#ee3131" />
                            <Text style={styles.addPinCodeText}>
                                Deliver outside VietNam
                            </Text>
                        </View>
                    </View>
                </ModalContent>
            </BottomModal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 40 : 0,
        flex: 1,
        backgroundColor: 'white',
    },
    searchContainer: {
        backgroundColor: '#ee3131',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 0,
    },
    expandedSearchContainer: {
        height: 450,
        marginTop: -200,
    },
    searchBox: {
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
    input: {
        marginLeft: 10,
    },
    resultsContainer: {
        flexDirection: 'row',
        marginHorizontal: 7,
        // gap: 10,
        backgroundColor: 'white',
        borderRadius: 3,
        //height: 38,
        flex: 1,
        width: '105%',
        marginTop: -100,
        marginLeft: -7,
    },
    resultsWrapper: {
        position: 'absolute',
        top: 150,
        left: 10,
        right: 10,
        zIndex: 1000,
    },
    resultItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    icon: { paddingLeft: 10, marginRight: 10 },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        padding: 10,
        backgroundColor: '#ee4731',
        //position: 'relative'
        zIndex: 1,
    },
    locationText: { fontSize: 13, fontWeight: '500', color: 'white' },
    selectedLocationText: { fontSize: 13, fontWeight: '500', color: 'white' },
    listItemContainer: {
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listItemImage: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    listItemText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 5,
    },
    trendingDealsTitle: { padding: 10, fontSize: 18, fontWeight: 'bold' },
    productsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    productItem: {
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#D0d0d0',
        borderRadius: 5,
        padding: 10,
        //width: "48%"
    },
    offersItem: {
        marginVertical: 15,
        borderWidth: 1,
        borderColor: '#D0d0d0',
        borderRadius: 5,
        padding: 10,
        //width: "48%",
        paddingHorizontal: 7,
        marginRight: 10,
        marginLeft: 5,
    },
    productImage: { width: 150, height: 150, resizeMode: 'contain' },
    productTitle: { width: 150, marginTop: 10 },
    productInfo: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    productPrice: { fontSize: 15, fontWeight: 'bold' },
    productRating: { color: '#FFC72C', fontWeight: 'bold' },
    productSold: { fontSize: 15, fontWeight: 'bold' },
    separator: {
        height: 1,
        borderColor: '#D0D0D0',
        borderWidth: 2,
        marginTop: 15,
    },
    dealsTitle: { padding: 10, fontSize: 18, fontWeight: 'bold' },
    offerItem: {
        marginVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    offerImage: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    offerDiscountContainer: {
        backgroundColor: '#Ee3131',
        paddingVertical: 5,
        width: 130,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 4,
    },
    offerDiscountText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },
    dropdownContainer: {
        borderColor: 'white',
        height: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    productsFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 5,
    },
    modalContentContainer: {
        width: '100%',
        height: 400,
    },
    modalContent: {
        marginBottom: 8,
    },
    modalContentHeaderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalContentText: {
        marginTop: 5,
        fontSize: 16,
        color: 'gray',
    },
    addAdressContainer: {
        width: 140,
        height: 140,
        borderColor: '#D0D0D0',
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addAdressText: {
        textAlign: 'center',
        color: '#ee3131',
        fontWeight: '500',
    },
    addPinCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    addPinCodeText: {
        color: '#ee3131',
        fontWeight: '400',
    },
    addLocationContainer: {
        flexDirection: 'column',
        gap: 7,
        marginBottom: 30,
    },
    addressesInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    addressesInfoText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    addressesButtonContainer: {
        width: 140,
        height: 140,
        borderColor: '#D0D0D0',
        borderWidth: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 3,
        marginRight: 15,
        marginTop: 10,
    },
    addressesDetailInfoText: {
        fontSize: 13,
        textAlign: 'center',
        width: 130,
    },
});

export default HomeScreen;
