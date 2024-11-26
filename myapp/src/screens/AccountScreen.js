import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/user/userSlice';
import AntDesign from '@expo/vector-icons/AntDesign';
import PersonalInfomation from '../components/personalAccount/PersonalInfomation';
import { images } from '../../assets';

import UserList from '../components/adminAccount/UserList';
import ProductList from '../components/adminAccount/ProductList';
import OrderList from '../components/order/OrderList';

const AccountScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const current = useSelector((state) => state.user.current);
    const [isShowUserWorkspace, setIsShowUserWorkspace] = useState(true);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={styles.container}>
            <View style={styles.topWrapper}>
                <TouchableOpacity
                    style={styles.rightContent}
                    onPress={handleLogout}
                >
                    <AntDesign name="logout" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.leftContent}>
                    <View style={styles.inforWrapper}>
                        <Text
                            style={[styles.text, styles.boldText]}
                        >{`${current?.firstname} ${current?.lastname}`}</Text>
                        <Text style={[styles.text, styles.italicText]}>
                            {current?.role === '1999' ? 'Admin' : 'User'}
                        </Text>
                    </View>
                    <Image
                        source={
                            current?.avatar
                                ? { uri: `${current?.avatar}` }
                                : images.avatar
                        }
                        style={styles.avt}
                    />
                </View>
            </View>

            <View style={styles.bottomWrapper}>
                <View style={styles.ctrlWrapper}>
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            isShowUserWorkspace && styles.activeBtn,
                        ]}
                        onPress={() => setIsShowUserWorkspace(true)}
                    >
                        <Text
                            style={[
                                styles.text,
                                isShowUserWorkspace && styles.whiteText,
                            ]}
                        >
                            User workspace
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.btn,
                            !isShowUserWorkspace && styles.activeBtn,
                        ]}
                        onPress={() => setIsShowUserWorkspace(false)}
                    >
                        <Text
                            style={[
                                styles.text,
                                !isShowUserWorkspace && styles.whiteText,
                            ]}
                        >
                            Admin workspace
                        </Text>
                    </TouchableOpacity>
                </View>
                {isShowUserWorkspace ? (
                    <KeyboardAvoidingView
                        style={styles.scrBottomWrapper}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={
                            Platform.OS === 'ios' ? 144 : 144
                        }
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.scrBottomItem}>
                                <View style={styles.titleWrapper}>
                                    <Text
                                        style={[
                                            styles.text,
                                            styles.boldText,
                                            styles.whiteText,
                                        ]}
                                    >
                                        Personal Information
                                    </Text>
                                </View>
                                <PersonalInfomation currentUser={current} />
                            </View>
                            <View style={styles.scrBottomItem}>
                                <View style={styles.titleWrapper}>
                                    <Text
                                        style={[
                                            styles.text,
                                            styles.boldText,
                                            styles.whiteText,
                                        ]}
                                    >
                                        Order History
                                    </Text>
                                </View>
                                <OrderList currentUser={current} />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                ) : (
                    <>
                        {current?.role === '1999' ? (
                            <KeyboardAvoidingView
                                style={styles.scrBottomWrapper}
                                behavior={
                                    Platform.OS === 'ios' ? 'padding' : 'height'
                                }
                                keyboardVerticalOffset={
                                    Platform.OS === 'ios' ? 144 : 144
                                }
                            >
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                >
                                    <View style={styles.scrBottomItem}>
                                        <View style={styles.titleWrapper}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    styles.boldText,
                                                    styles.whiteText,
                                                ]}
                                            >
                                                Manage Users
                                            </Text>
                                        </View>
                                        <UserList />
                                    </View>
                                    <View style={styles.scrBottomItem}>
                                        <View style={styles.titleWrapper}>
                                            <Text
                                                style={[
                                                    styles.text,
                                                    styles.boldText,
                                                    styles.whiteText,
                                                ]}
                                            >
                                                Manage Products
                                            </Text>
                                        </View>
                                        <ProductList />
                                    </View>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        ) : (
                            <View style={styles.userContainer}>
                                <View style={styles.userImgWrapper}>
                                    <Image
                                        style={styles.userImg}
                                        source={images.oops}
                                    />
                                    <Image
                                        style={styles.userImg}
                                        source={images.oops}
                                    />
                                    <Image
                                        style={styles.userImg}
                                        source={images.oops}
                                    />
                                </View>
                                <Text>Admin role is mandatory here! </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
    },
    topWrapper: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 60,
        paddingHorizontal: 8,

        backgroundColor: '#f0f0f0',
    },
    rightContent: {
        width: 46,
        height: 46,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        alignItems: 'center',
    },
    inforWrapper: {
        flexDirection: 'column',
        height: 46,
        justifyContent: 'space-around',
        alignItems: 'flex-end',
    },
    avt: { width: 46, height: 46, borderRadius: 50 },

    bottomWrapper: {
        flex: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 26,
    },
    ctrlWrapper: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    btn: {
        width: '48%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 26,
    },

    activeBtn: {
        backgroundColor: '#ee3131',
    },

    scrBottomWrapper: {
        flex: 1,
        width: '100%',
    },
    scrBottomItem: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 52,
        borderRadius: 26,
        marginBottom: 12,
    },
    titleWrapper: {
        position: 'absolute',
        backgroundColor: '#ee3131',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderTopLeftRadius: 26,
        borderBottomRightRadius: 26,
    },
    userContainer: {
        flex: 1,
        marginTop: -36,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    userImgWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    userImg: {
        width: 46,
        height: 46,
        resizeMode: 'contain',
    },
    whiteText: { color: 'white' },
    text: { fontSize: 16 },
    boldText: { fontWeight: 'bold' },
    italicText: { fontStyle: 'italic' },
});

export default AccountScreen;
