import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { formatCurrency } from '../../utils/helpers';
import moment from 'moment';

import { apiGetUserOrder } from '../../apis';

const OrderList = ({ current = {} }) => {
    const [orders, setOrders] = useState([]);
    const fetchUserOrder = async () => {
        const res = await apiGetUserOrder({
            limit: 100,
        });

        if (res?.success) {
            setOrders(res.order);
        }
    };

    useEffect(() => {
        fetchUserOrder();
    }, [current]);

    return (
        <View style={styles.container}>
            <View style={styles.wrapper}>
                {orders?.length > 0 ? (
                    <>
                        {orders.map((order) => (
                            <View
                                key={order._id}
                                style={styles.productOuterWrapper}
                            >
                                {order?.products?.map((item, index) => (
                                    <View
                                        key={index}
                                        style={styles.productWrapper}
                                    >
                                        <View style={styles.productImgWrapper}>
                                            <Image
                                                source={{
                                                    uri: item?.thumbnail,
                                                }}
                                                style={styles.productImg}
                                            />
                                        </View>
                                        <View style={styles.infoWrapper}>
                                            <Text>{item?.title}</Text>
                                            <Text>{`Price: ${formatCurrency(
                                                item?.price,
                                            )}`}</Text>
                                            <Text>{`Color: ${item?.color}`}</Text>
                                            <Text>{`Quantity: ${item?.quantity}`}</Text>
                                        </View>
                                    </View>
                                ))}

                                <View style={styles.overviewWrapper}>
                                    <Text style={[styles.boldText]}>
                                        {`Order at: ${moment(
                                            order?.createAt,
                                        ).format('DD/MM/YYYY')}`}
                                    </Text>
                                    <Text style={[styles.boldText]}>
                                        {`Pay by: ${order?.paymentMethod}`}
                                    </Text>
                                    <Text
                                        style={[styles.boldText]}
                                    >{`Status: ${order?.status}`}</Text>
                                    <Text
                                        style={[styles.boldText]}
                                    >{`Total: ${formatCurrency(
                                        order?.total,
                                    )}`}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                ) : (
                    <Text style={{ textAlign: 'center' }}>
                        You have not bought any items yet!
                    </Text>
                )}
            </View>
        </View>
    );
};

export default OrderList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -12,
    },
    wrapper: {
        width: '100%',
    },
    productOuterWrapper: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    productWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderColor: '#d0d0d0',
        gap: 12,
        marginBottom: 6,
    },
    overviewWrapper: {
        alignItems: 'flex-start',
        gap: 6,
    },
    productImgWrapper: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    productImg: {
        width: 80,
        height: 80,
        borderRadius: 6,
        resizeMode: 'contain',
    },
    infoWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 6,
        alignItems: 'flex-start',
        borderLeftWidth: 1,
        borderColor: '#d0d0d0',
        paddingLeft: 12,
    },
    boldText: {
        fontWeight: 'bold',
    },
});
