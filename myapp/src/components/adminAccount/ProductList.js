import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { images } from '../../../assets';
import {
    showLoading,
    hideLoading,
    showAlert,
    showModal,
} from '../../store/app/appSlice';
import { useDispatch } from 'react-redux';
import { apiGetProducts, apiDeleteProduct } from '../../apis/product';
import Pagination from '../pagination/Pagination';
import { formatCurrency } from '../../utils/helpers';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';

const ITEMSPERPAGE = 4;
const ProductList = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async (query) => {
        try {
            dispatch(showLoading());
            let response;
            if (Object.keys(query).length === 0) {
                response = await apiGetProducts({
                    limit: ITEMSPERPAGE,
                });
            } else {
                response = await apiGetProducts({
                    limit: ITEMSPERPAGE,
                    ...query,
                });
            }
            setProducts(response?.productData);
            setTotalCount(response?.count);
            dispatch(hideLoading());
        } catch (error) {
            dispatch(hideLoading());
            setProducts([]);
            console.log('error message', error);
        }
    };

    useEffect(() => {
        fetchData({});
    }, []);

    useEffect(() => {
        fetchData({ page: currentPage });
    }, [currentPage]);

    const handleCurrentPageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteProduct = (productId) => {
        dispatch(
            showAlert({
                title: 'Delete product',
                icon: 'warning',
                message:
                    'This product will be deleted permanently from the system, are you sure?',
                onConfirm: async () => {
                    dispatch(showLoading());
                    const res = await apiDeleteProduct(productId);
                    dispatch(hideLoading());
                    if (res.success) {
                        if (
                            (totalCount - 1) % ITEMSPERPAGE === 0 &&
                            currentPage > 1
                        ) {
                            fetchData({
                                page: Math.ceil(
                                    (totalCount - 1) / ITEMSPERPAGE,
                                ),
                            });
                            setCurrentPage((prev) => prev - 1);
                        } else {
                            fetchData({ page: currentPage });
                            setCurrentPage(
                                Math.ceil(totalCount / ITEMSPERPAGE),
                            );
                        }
                    }
                },
                onCancel: () => {
                    return;
                },
            }),
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.addBtnWrapper}>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => {
                        dispatch(
                            showModal({
                                children: (
                                    <AddProduct
                                        onAddProduct={() => {
                                            if (
                                                totalCount % ITEMSPERPAGE ===
                                                0
                                            ) {
                                                fetchData({
                                                    page:
                                                        totalCount /
                                                            ITEMSPERPAGE +
                                                        1,
                                                });

                                                setCurrentPage(
                                                    Math.ceil(
                                                        (totalCount + 1) /
                                                            ITEMSPERPAGE,
                                                    ),
                                                );
                                            } else {
                                                fetchData({
                                                    page: Math.ceil(
                                                        totalCount /
                                                            ITEMSPERPAGE,
                                                    ),
                                                });
                                                setCurrentPage(
                                                    Math.ceil(
                                                        totalCount /
                                                            ITEMSPERPAGE,
                                                    ),
                                                );
                                            }
                                        }}
                                    />
                                ),
                            }),
                        );
                    }}
                >
                    <Text style={[styles.text, styles.boldText]}>
                        Add new product
                    </Text>
                    <FontAwesome5 name="plus-circle" size={28} color="black" />
                </TouchableOpacity>
            </View>
            {products.length > 0 &&
                products?.map((item) => (
                    <View key={item._id} style={styles.productItemWrapper}>
                        <View style={styles.leftWrapper}>
                            <Image
                                style={styles.img}
                                source={
                                    item?.thumb
                                        ? { uri: `${item?.thumb}` }
                                        : images.no_image
                                }
                            />
                            <View style={styles.ctrlWrapper}>
                                <TouchableOpacity
                                    style={styles.ctrlBtn}
                                    onPress={() =>
                                        handleDeleteProduct(item._id)
                                    }
                                >
                                    <FontAwesome5
                                        name="trash"
                                        size={20}
                                        color="#444"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.ctrlBtn}
                                    onPress={() => {
                                        dispatch(
                                            showModal({
                                                children: (
                                                    <EditProduct
                                                        data={item}
                                                        onUpdateProduct={() =>
                                                            fetchData({
                                                                page: currentPage,
                                                            })
                                                        }
                                                    />
                                                ),
                                            }),
                                        );
                                    }}
                                >
                                    <FontAwesome5
                                        name="pen"
                                        size={16}
                                        color="#444"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inforWrapper}>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Name: `}
                                    </Text>
                                    {`${item?.title}`}
                                </Text>
                            </View>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Brand: `}
                                    </Text>
                                    {`${item?.brand}`}
                                </Text>
                            </View>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Category: `}
                                    </Text>
                                    {`${item?.category}`}
                                </Text>
                            </View>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Price: `}
                                    </Text>
                                    {`${formatCurrency(item?.price)}`}
                                </Text>
                            </View>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Quantity: `}
                                    </Text>
                                    {`${item?.quantity}`}
                                </Text>
                            </View>
                            <View style={styles.InfoItem}>
                                <Text numberOfLines={1} style={[styles.text]}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.text, styles.boldText]}
                                    >
                                        {`Sold: `}
                                    </Text>
                                    {`${item?.sold}`}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            <View style={styles.paginationWrapper}>
                <Pagination
                    currentPage={currentPage}
                    totalCount={totalCount}
                    onCurrentPageChange={handleCurrentPageChange}
                    itemsPerPage={ITEMSPERPAGE}
                />
            </View>
        </View>
    );
};

export default ProductList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnWrapper: {
        width: '100%',
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    addBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#a0a0a0',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 5,
    },
    productItemWrapper: {
        width: '100%',
        aspectRatio: 2 / 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
        borderRadius: 16,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    leftWrapper: {
        width: '30%',
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    img: {
        width: 86,
        height: 86,
        resizeMode: 'contain',
        borderRadius: 12,
    },
    ctrlWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ctrlBtn: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
    },
    inforWrapper: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        gap: 6,
        alignItems: 'flex-start',
        borderLeftWidth: 1,
        paddingLeft: 10,
        borderColor: '#a0a0a0',
    },

    InfoItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    paginationWrapper: {
        width: '100%',

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
