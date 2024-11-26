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
    TouchableWithoutFeedback,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Alert,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState, useEffect, useCallback, useRef } from 'react';
import ProductItem from '../components/ProductItem';
import { apiGetProducts, apiSearchProduct } from '../apis/product';
import DropDownPicker from 'react-native-dropdown-picker';
import ProductBar from '../components/ProductBar';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';
import Entypo from '@expo/vector-icons/Entypo';
import {
    apiGetAdditionalAddress,
    apiGetCurrent,
    apiGetCategories,
} from '../apis';
import { formatCurrency } from '../utils/helpers';
import hotDealsImage from '../../assets/hot_deal.png';
import trending from '../../assets/trending.png';

import Modal from 'react-native-modal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight =
    Platform.OS === 'ios'
        ? Dimensions.get('window').height
        : require('react-native-extra-dimensions-android').get(
              'REAL_WINDOW_HEIGHT',
          );

const HomeScreen = () => {
    const navigation = useNavigation();
    const { width: viewportWidth } = Dimensions.get('window');
    const [offers, setOffers] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [products, setProducts] = useState([]);
    const [deals, setDeals] = useState([]);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState('All');
    const scrollViewRef = useRef(null);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [searchKey, setSearchKey] = useState('');
    const [product, setProduct] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (key) => {
        if (key.trim() !== '') {
            setLoading(true);
            try {
                const response = await apiSearchProduct(key);

                setProduct(response.products.slice(0, 5));

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

    const [categories, setCategories] = useState([]);

    const images = [
        'https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg',
        'https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif',
    ];

    const [items, setItems] = useState([
        { label: 'All', value: 'All' },
        { label: 'Laptop', value: 'Laptop' },
        { label: 'Smartphone', value: 'Smartphone' },
        { label: 'Tablet', value: 'Tablet' },
        { label: 'Accessories', value: 'Accessories' },
    ]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetProducts({
                    limit: 100,
                    //sort: "-totalRating",
                });
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiGetCategories();
                if (response.success) {
                    const categoryList = response.productCategories.map(
                        (category) => ({
                            id: category.id,
                            name: category.title,
                            image: category.image,
                        }),
                    );
                    setCategories(categoryList);
                }
            } catch (error) {
                console.error('Error fetching category list:', error);
            }
        };
        fetchCategories();
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

    const handlePressCategory = (category) => {
        setCategory(category);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 1200, animated: true });
        }
    };

    return (
        <>
            <SafeAreaView style={styles.container}>
                <ScrollView ref={scrollViewRef}>
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
                        </View>
                    </TouchableWithoutFeedback>

                    <Pressable
                        onPress={() => {
                            setModalVisible(!modalVisible);
                        }}
                        style={styles.locationContainer}
                    >
                        <Ionicons
                            name="location-outline"
                            size={24}
                            color="#000"
                        />

                        <Pressable>
                            {selectedAddress ? (
                                <Text style={styles.selectedLocationText}>
                                    Deliver to {selectedAddress?.name} -{' '}
                                    {selectedAddress?.street}
                                </Text>
                            ) : (
                                <Text style={styles.locationText}>
                                    Add an address
                                </Text>
                            )}
                        </Pressable>
                        <MaterialIcons
                            name="keyboard-arrow-down"
                            size={24}
                            color="#000"
                        />
                    </Pressable>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.srcListItemContainer}
                    >
                        <View style={styles.srcListItemInnerContainer}>
                            {categories.map((item, index) => (
                                <Pressable
                                    onPress={() =>
                                        handlePressCategory(item?.name)
                                    }
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
                        </View>
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
                        Trending deals of the week
                    </Text>
                    <View style={styles.productsContainer}>
                        {deals.slice(0, 4).map((item, index) => (
                            <TouchableOpacity
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
                                <View style={styles.trendingImgWrapper}>
                                    <Image
                                        style={styles.trendingImg}
                                        source={trending}
                                    />
                                    <Image
                                        style={styles.trendingImg}
                                        source={trending}
                                    />
                                    <Image
                                        style={styles.trendingImg}
                                        source={trending}
                                    />
                                </View>
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
                                        {formatCurrency(item?.price)}
                                    </Text>
                                    <Text style={styles.productRating}>
                                        {item?.totalRating} ⭐️
                                    </Text>
                                </View>
                                <ProductBar
                                    numberOfProducts={
                                        item?.quantity - item?.sold
                                    }
                                    totalProducts={item?.quantity}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Text style={styles.separator} />
                    <Text style={styles.dealsTitle}>Today's deals</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.offersContainer}
                    >
                        {offers.slice(0, 4).map((item, index) => (
                            <View key={index} style={styles.offersItem}>
                                <ProductItem item={item} />
                                <View style={styles.offerDiscountContainer}>
                                    <Image
                                        source={hotDealsImage}
                                        style={styles.offerDiscountImage}
                                    />
                                    <Image
                                        source={hotDealsImage}
                                        style={styles.offerDiscountImage}
                                    />
                                    <Image
                                        source={hotDealsImage}
                                        style={styles.offerDiscountImage}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                    <Text style={styles.separator} />
                    <Text style={styles.moreProducts}>More products</Text>

                    <View style={styles.dropdownContainer}>
                        <ScrollView
                            horizontal
                            bounces={false}
                            style={[
                                {
                                    height: open ? 260 : 'auto',
                                },
                                styles.srcDropdownContainer,
                            ]}
                        >
                            <DropDownPicker
                                style={styles.dropdown}
                                containerStyle={{
                                    width: 168,
                                }}
                                dropDownContainerStyle={{
                                    borderColor: '#a0a0a0',
                                }}
                                open={open}
                                value={category}
                                items={items}
                                setOpen={setOpen}
                                setValue={setCategory}
                                setItems={setItems}
                                placeholder="Choose category"
                                placeholderStyle={{ color: 'gray' }}
                                onOpen={onGenderOpen}
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.productsFilterContainer}>
                        {products
                            ?.filter(
                                (item) =>
                                    category === 'All' ||
                                    item.category === category,
                            )
                            .map((item) => (
                                <ProductItem key={item?._id} item={item} />
                            ))}
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                deviceHeight={deviceHeight}
                deviceWidth={deviceWidth}
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                swipeDirection={['up', 'down']}
                swipeThreshold={200}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                animationInTiming={300}
                animationOutTiming={300}
                useNativeDriver={true}
                style={styles.modal}
            >
                <View
                    style={[
                        styles.modalContent,
                        { height: deviceHeight * 0.5 },
                    ]}
                >
                    <View style={styles.modalHeader}>
                        <Text style={[styles.text, styles.boldText]}>
                            Choose your Location
                        </Text>
                        <Text style={[styles.text, styles.lightText]}>
                            Select a delivery location to see product
                            availability
                        </Text>
                    </View>
                    <View style={styles.scrModalBodyWrapper}>
                        <ScrollView
                            style={styles.scrModalBody}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {addresses?.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
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
                                    <Text
                                        style={styles.addressesDetailInfoText}
                                    >
                                        {item?.street}
                                    </Text>
                                    <Text
                                        style={styles.addressesDetailInfoText}
                                    >
                                        {item?.country}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    navigation.navigate('Address');
                                }}
                                style={styles.addAdressContainer}
                            >
                                <Text style={styles.addAdressText}>
                                    Add an Address or pick-up point
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

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
                </View>
            </Modal>
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
        backgroundColor: 'white',
        borderRadius: 3,
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
        backgroundColor: '#ee3131',
        zIndex: 1,
    },
    locationText: { fontSize: 13, fontWeight: '500', color: '#000' },
    selectedLocationText: { fontSize: 13, fontWeight: '500', color: '#000' },
    srcListItemContainer: {
        width: '100%',
        paddingVertical: 10,
    },
    srcListItemInnerContainer: {
        width: '105%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 50,
        margin: 'auto',
    },

    listItemContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    listItemImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    },

    listItemText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 5,
    },
    trendingDealsTitle: { padding: 10, fontSize: 18, fontWeight: 'bold' },
    trendingImgWrapper: {
        position: 'absolute',
        zIndex: 1,
        top: 10,
        left: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 2,
        gap: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ff0000',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    trendingImg: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    productsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 5,
    },
    productItem: {
        borderWidth: 1,
        borderColor: '#D0d0d0',
        borderRadius: 16,
        padding: 10,
        width: 170,
        marginBottom: 10,
    },
    offersContainer: {
        marginLeft: 12,
    },
    offersItem: {
        marginRight: 12,
        marginBottom: -4,
        marginTop: 4,
        position: 'relative',
    },
    offerDiscountImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
        borderRadius: 6,
    },
    moreProducts: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 10,
    },

    dropdownContainer: {
        position: 'relative',
    },
    srcDropdownContainer: {
        width: 200,
        position: 'absolute',
        zIndex: 1,
        marginTop: 4,
        marginHorizontal: 12,
    },
    dropdown: {
        borderColor: '#a0a0a0',
        width: 168,
        borderRadius: 12,
        borderColor: '#a0a0a0',
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
        position: 'absolute',
        backgroundColor: '#fff',
        top: 10,
        left: 10,
        padding: 2,
        borderWidth: 1,
        borderColor: '#ff5a00',

        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        borderRadius: 6,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    offerDiscountText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 13,
        fontWeight: 'bold',
    },

    productsFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginHorizontal: 5,
        marginTop: 58,
    },
    modal: {
        margin: 0,
        justifyContent: 'flex-end',
    },
    modalContentContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    modalContent: {
        padding: 20,
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    modalHeader: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    scrModalBodyWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrModalBody: {
        flexDirection: 'row',
        width: '100%',
    },
    addAdressContainer: {
        width: 140,
        height: 140,
        borderColor: '#D0D0D0',

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
        marginBottom: 12,
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
        marginRight: 12,
    },
    addressesDetailInfoText: {
        fontSize: 13,
        textAlign: 'center',
        width: 130,
    },
    lightText: {
        color: '#a0a0a0',
    },
    text: {
        color: 'black',
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
});

export default HomeScreen;
