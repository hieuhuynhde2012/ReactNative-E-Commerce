import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/user/userSlice';
import AntDesign from '@expo/vector-icons/AntDesign';
import PersonalInfomation from '../components/personalAccount/PersonalInfomation';

const AccountScreen = () => {
    const dispatch = useDispatch();
    const { current } = useSelector((state) => state.user);

    const handleLogout = () => {
        dispatch(logout());
    };

    // useEffect(() => {
    //     console.log(current);
    // });

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
                        source={{ uri: `${current?.avatar}` }}
                        style={styles.avt}
                    />
                </View>
            </View>

            <View style={styles.bottomWrapper}>
                <View style={styles.ctrlWrapper}>
                    <TouchableOpacity style={[styles.btn, styles.activeBtn]}>
                        <Text style={[styles.text, styles.whiteText]}>
                            User workspace
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn]}>
                        <Text style={[styles.text]}>Admin workspace</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={styles.scrBottomWrapper}
                    showsVerticalScrollIndicator={false}
                >
                    <View>
                        <Text style={[styles.text, styles.boldText]}>
                            Personal Information
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#f0f0f0',
                                padding: 16,
                                borderRadius: 26,
                                marginTop: 12,
                            }}
                        >
                            <PersonalInfomation currentUser={current} />
                        </View>
                    </View>
                </ScrollView>
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
    whiteText: { color: 'white' },
    text: { fontSize: 16 },
    boldText: { fontWeight: 'bold' },
    italicText: { fontStyle: 'italic' },
});

export default AccountScreen;
