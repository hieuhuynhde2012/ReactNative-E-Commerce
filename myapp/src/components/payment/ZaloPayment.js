import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Linking,
    Image,
    Dimensions,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import {
    apiZaloCreatePayment,
    apiZaloCheckOrderStatus,
    apiMomoCreatePayment,
    apiMomoCheckOrderStatus,
} from '../../apis';
import { formatCurrency } from '../../utils/helpers';
import { images } from '../../../assets';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
const { useDispatch } = require('react-redux');
import { showLoading, hideLoading } from '../../store/app/appSlice';

const { width } = Dimensions.get('window');

const ZaloPayment = ({ order = {}, onPaid = () => {} }) => {
    const dispatch = useDispatch();
    let intervalIdRef = useRef(null);
    let timeoutIdRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
        };
    }, []);

    const handleZaloCheckOrderStatus = (data) => {
        let res;
        const duration = 10 * 60 * 1000;
        const startTime = Date.now();
        const endTime = startTime + duration;

        intervalIdRef.current = setInterval(async () => {
            dispatch(showLoading());
            res = await apiZaloCheckOrderStatus(data);
            dispatch(hideLoading());

            if (res?.return_code === 1) {
                clearInterval(intervalIdRef.current);
                onPaid();
            }

            if (Date.now() >= endTime) {
                clearInterval(intervalIdRef.current);
            }
        }, 2000);
    };

    const handleZaloCreatePayment = async () => {
        dispatch(showLoading());
        const res = await apiZaloCreatePayment({
            amount: order?.total,
        });
        dispatch(hideLoading());

        if (res?.return_code === 1) {
            const isSupported = await Linking.canOpenURL(res?.order_url);
            if (isSupported) {
                await Linking.openURL(res?.order_url);
            } else {
                Alert.alert('Error', 'Unable to open ZaloPay link');
                return;
            }

            let orderStatusRes;
            timeoutIdRef.current = setTimeout(() => {
                orderStatusRes = handleZaloCheckOrderStatus({
                    app_trans_id: res?.app_trans_id,
                });
            }, 6000);

            if (orderStatusRes?.return_code === 1) {
                onPaid();
                clearTimeout(timeoutIdRef.current);
            }
        }
    };

    const handleMomoCheckOrderStatus = async (data) => {
        let res;
        const duration = 10 * 60 * 1000;
        const startTime = Date.now();
        const endTime = startTime + duration;

        res = await apiMomoCheckOrderStatus(data);

        intervalIdRef.current = setInterval(async () => {
            dispatch(showLoading());
            res = await apiMomoCheckOrderStatus(data);
            dispatch(hideLoading());

            if (res?.resultCode === 0) {
                clearInterval(intervalIdRef.current);
                onPaid();
            }

            if (Date.now() >= endTime) {
                clearInterval(intervalIdRef.current);
            }
        }, 2000);
    };

    const handleMomoCreatePayment = async () => {
        dispatch(showLoading());
        const res = await apiMomoCreatePayment({
            amount: order?.total,
        });
        dispatch(hideLoading());

        if (res?.resultCode === 0) {
            const isSupported = await Linking.canOpenURL(res?.payUrl);
            if (isSupported) {
                await Linking.openURL(res?.payUrl);
            } else {
                Alert.alert('Error', 'Unable to open ZaloPay link');
                return;
            }

            let orderStatusRes;
            timeoutIdRef.current = setTimeout(() => {
                orderStatusRes = handleMomoCheckOrderStatus({
                    orderId: res?.orderId,
                });
            }, 6000);

            if (orderStatusRes?.return_code === 1) {
                onPaid();
                clearTimeout(timeoutIdRef.current);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.title}>
                <View style={styles.amountWrapper}>
                    <Text style={[styles.lightText]}>Amount</Text>
                    <MaterialCommunityIcons
                        name="cash"
                        size={32}
                        color="#ee3131"
                    />
                </View>
                <Text
                    style={[styles.largeText, styles.boldText]}
                >{` ${formatCurrency(order?.total)}`}</Text>
            </View>
            <View style={styles.body}>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        handleZaloCreatePayment();
                    }}
                >
                    <View style={styles.zaloImgWrapper}>
                        <Image
                            style={styles.zaloImg}
                            source={images.zalo_white}
                        />
                    </View>
                    <FontAwesome5
                        name="chevron-right"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        handleMomoCreatePayment();
                    }}
                >
                    <Image style={styles.momoImg} source={images.momo_white} />
                    <FontAwesome5
                        name="chevron-right"
                        size={24}
                        color="black"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ZaloPayment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: 20,
        justifyContent: 'center',
        gap: 6,
        alignItems: 'center',
    },
    amountWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
    },
    body: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    btn: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    zaloImgWrapper: {
        marginRight: 10,
        borderRadius: 4,
        padding: 8,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zaloImg: {
        width: 80,
        height: 18,
        resizeMode: 'contain',
    },
    momoImg: {
        marginVertical: -2,
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    whiteText: {
        color: 'white',
    },

    largeText: {
        fontSize: 20,
    },

    boldText: {
        fontWeight: 'bold',
    },
    lightText: {
        color: 'gray',
    },
});
