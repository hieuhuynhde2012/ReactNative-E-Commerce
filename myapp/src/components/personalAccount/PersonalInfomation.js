import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomedInput from '../CustomedInput';

const PersonalInfomation = ({ currentUser }) => {
    const [firstname, setFirstname] = useState(currentUser?.firstname);
    const [lastname, setLastname] = useState(currentUser?.lastname);
    const [email, setEmail] = useState(currentUser?.email);
    const [mobile, setMobile] = useState(currentUser?.mobile);
    const [address, setAddress] = useState(currentUser?.address);

    useEffect(() => {
        console.log(currentUser);
    });
    return (
        <View style={styles.container}>
            <View style={styles.topContent}>
                <View style={styles.infoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>
                        First name
                    </Text>
                    <CustomedInput value={firstname} />
                </View>

                <View style={styles.infoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>
                        Last name
                    </Text>{' '}
                    <CustomedInput value={lastname} />
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>Email</Text>{' '}
                    <CustomedInput value={email} />
                </View>

                <View style={styles.infoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>Mobile</Text>
                    <CustomedInput value={mobile} />
                </View>
                <View style={styles.infoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>Address</Text>
                    <CustomedInput value={address} />
                </View>
                <View style={styles.avtWrapper}>
                    <Text style={[styles.text, styles.boldText]}>Avatar</Text>
                    <Image
                        source={{ uri: `${currentUser?.avatar}` }}
                        style={styles.avt}
                    />
                    <TouchableOpacity style={styles.avtCtrlBtn}>
                        <FontAwesome name="camera" size={24} color="#ee3131" />
                    </TouchableOpacity>
                </View>
                <View style={styles.uneditableInfoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>
                        Account status:
                    </Text>
                    <Text style={[styles.text, styles.italicText]}>
                        {currentUser?.isBlocked === false
                            ? 'active'
                            : 'blocked'}
                    </Text>
                </View>
                <View style={styles.uneditableInfoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>Role:</Text>
                    <Text style={[styles.text, styles.italicText]}>
                        {currentUser?.role === '1999' ? 'admin' : 'user'}
                    </Text>
                </View>
                <View style={styles.uneditableInfoWrapper}>
                    <Text style={[styles.text, styles.boldText]}>
                        Created at:
                    </Text>
                    <Text style={[styles.text, styles.italicText]}>
                        {moment(currentUser?.createdAt).format('DD/MM/YYYY')}
                    </Text>
                </View>
            </View>
            <View style={[styles.updateBtnWrapper]}>
                <TouchableOpacity style={[styles.btn]}>
                    <Text style={[styles.text, styles.whiteText]}>Update</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PersonalInfomation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    topContent: {
        width: '100%',
    },
    infoWrapper: {
        width: '100%',
        marginBottom: 12,
        gap: 6,
    },
    uneditableInfoWrapper: {
        width: '100%',
        flexDirection: 'row',
        marginBottom: 12,
        gap: 6,
        borderRadius: 12,
    },
    avtWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 12,
        gap: 6,
    },
    avt: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avtCtrlBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 12,
    },
    updateBtnWrapper: {
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    btn: {
        padding: 12,
        backgroundColor: '#ee3131',
        borderRadius: 12,
    },
    whiteText: {
        color: 'white',
    },
    text: {
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    italicText: {
        fontStyle: 'italic',
    },
});
