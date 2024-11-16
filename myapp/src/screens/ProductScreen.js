import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import ProductItem from '../components/ProductItem';
import { apiGetProducts } from '../apis/product';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../store/app/appSlice';
import CustomedCheckbox from '../components/common/CustomedCheckbox';
import Pagination from '../components/pagination/pagination';
import { priceOptions, colorOptions, sortOptions } from '../utils/constants';

const ProductScreen = ({ category = 'all' }) => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [selectedColorOptions, setSelectedColorOptions] =
        useState(colorOptions);
    const [selectedPriceOptions, setSelectedPriceOptions] =
        useState(priceOptions);
    const [selectedSortOptions, setSelectedSortOptions] = useState(sortOptions);
    const [isResetOptions, setIsResetOptions] = useState(false);
    const [isShownOption, setIsShownOption] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [query, setQuery] = useState({});
    const flatListRef = useRef(null);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isShownOption ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isShownOption]);

    const fetchData = async (query) => {
        try {
            dispatch(showLoading());
            let response;
            if (Object.keys(query).length === 0) {
                response = await apiGetProducts({
                    category:
                        category.toLowerCase() === 'all' ? undefined : category,
                    limit: 10,
                });
            } else {
                response = await apiGetProducts({
                    category:
                        category.toLowerCase() === 'all' ? undefined : category,
                    limit: 10,
                    ...query,
                });
            }

            flatListRef.current.scrollToOffset({ y: 0, animated: true });
            setProducts(response.productData);
            setTotalCount(response.count);
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            setProducts([]);
            console.log('error message', error);
        }
    };

    useEffect(() => {
        fetchData({});
    }, [category]);

    const handleSelectedColorOptionsChange = (options) => {
        setSelectedColorOptions(options);
    };

    const handleSelectedPriceOptionsChange = (options) => {
        setSelectedPriceOptions(options);
    };

    const handleSelectedSortOptionsChange = (options) => {
        setSelectedSortOptions(options);
    };

    useEffect(() => {
        let queryString = {};

        const colorQuery = selectedColorOptions
            .filter((option) => option.isActive)
            .map((option) => option.value)
            .join(',');

        const priceQuery = selectedPriceOptions.reduce((acc, option) => {
            if (option.isActive) {
                if (option.to && option.from) {
                    return {
                        $and: [
                            { price: { gte: option.from } },
                            { price: { lte: option.to } },
                        ],
                    };
                } else if (option.to) {
                    return { price: { lte: option.to } };
                } else if (option.from) {
                    return { price: { gte: option.from } };
                }
            } else return acc;
        }, {});

        const sortQuery = selectedSortOptions.reduce((acc, option) => {
            if (option.isActive) {
                return option.value;
            } else return acc;
        }, '');

        if (colorQuery) {
            queryString.color = colorQuery;
        }

        if (priceQuery) {
            queryString = { ...queryString, ...priceQuery };
        }

        if (sortQuery) {
            queryString.sort = sortQuery;
        }

        queryString.page = 1;
        setQuery(queryString);
        setCurrentPage(1);

        fetchData(queryString);
    }, [selectedColorOptions, selectedPriceOptions, selectedSortOptions]);

    const handleCurrentPageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        let queryString = { ...query };

        if (currentPage) {
            queryString.page = currentPage;
        }

        fetchData(queryString);
    }, [currentPage]);

    return (
        <View style={styles.container}>
            <View style={styles.optionBtnWrapper}>
                <TouchableOpacity
                    style={styles.optionBtn}
                    onPress={() => setIsShownOption(!isShownOption)}
                >
                    <Text style={styles.optionBtnText}>
                        {isShownOption ? 'Close' : 'Filter & Sort'}
                    </Text>
                </TouchableOpacity>
            </View>
            {isShownOption && (
                <Animated.View
                    style={[styles.optionWrapper, { opacity: fadeAnim }]}
                >
                    <View>
                        <Text>Filter by color</Text>
                        <CustomedCheckbox
                            isMultipleChoice={true}
                            options={selectedColorOptions}
                            onOptionsChange={handleSelectedColorOptionsChange}
                            isResetOptions={isResetOptions}
                            onToggleResetOptions={() =>
                                setIsResetOptions(false)
                            }
                        />
                    </View>

                    <View>
                        <Text>Filter by price</Text>
                        <CustomedCheckbox
                            isMultipleChoice={false}
                            options={selectedPriceOptions}
                            onOptionsChange={handleSelectedPriceOptionsChange}
                            isResetOptions={isResetOptions}
                            onToggleResetOptions={() =>
                                setIsResetOptions(false)
                            }
                        />
                    </View>
                    <View>
                        <Text>Sort</Text>
                        <CustomedCheckbox
                            isMultipleChoice={false}
                            options={selectedSortOptions}
                            onOptionsChange={handleSelectedSortOptionsChange}
                            isResetOptions={isResetOptions}
                            onToggleResetOptions={() =>
                                setIsResetOptions(false)
                            }
                        />
                    </View>
                    <View style={styles.resetOptionBtnWrapper}>
                        <TouchableOpacity
                            style={styles.resetOptionBtn}
                            onPress={() => setIsResetOptions(true)}
                        >
                            <Text style={styles.optionBtnText}>Reset</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            )}

            <View style={styles.listWrapper}>
                <FlatList
                    ref={flatListRef}
                    data={products}
                    renderItem={({ item }) => (
                        <View style={styles.productItemWrapper}>
                            <ProductItem item={item} />
                        </View>
                    )}
                    keyExtractor={(item) => item._id}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.list}
                    ListFooterComponent={
                        totalCount > 10 && (
                            <View style={styles.paginationWrapper}>
                                <Pagination
                                    currentPage={currentPage}
                                    totalCount={totalCount}
                                    onCurrentPageChange={
                                        handleCurrentPageChange
                                    }
                                />
                            </View>
                        )
                    }
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    optionWrapper: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 1,
        backgroundColor: 'white',
        width: '94%',
        alignItems: 'flex-start',
        paddingTop: 46,
        paddingBottom: 46,
        paddingHorizontal: 12,
        gap: 10,
        borderWidth: 0.5,
        borderColor: '#D0D0D0',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 8,
    },

    container: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingTop: 6,
    },
    optionBtnWrapper: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 2,
    },
    optionBtn: {
        backgroundColor: '#ee3131',
        padding: 10,
        borderTopLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    optionBtnText: {
        color: 'white',
    },
    resetOptionBtnWrapper: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 2,
    },
    resetOptionBtn: {
        backgroundColor: '#ee3131',
        padding: 10,
        borderBottomRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    listWrapper: {
        flex: 1,
        width: '100%',
        marginTop: 46,
    },

    list: {
        width: '100%',
        padding: 6,
    },
    productItemWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationWrapper: {
        marginTop: 16,
        alignItems: 'center',
        marginBottom: 18,
    },
});

export default ProductScreen;
