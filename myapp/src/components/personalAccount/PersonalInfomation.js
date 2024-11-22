import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CustomedInput from '../CustomedInput';
import { validate } from '../../utils/helpers';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading, showAlert } from '../../store/app/appSlice';
import { getCurrent } from '../../store/user/asyncAction';
import { apiUpdateCurrent } from '../../apis/user';
import { images } from '../../../assets';
const PersonalInfomation = ({ currentUser }) => {
    const dispatch = useDispatch();
    const [firstname, setFirstname] = useState(currentUser?.firstname);
    const [lastname, setLastname] = useState(currentUser?.lastname);
    const [mobile, setMobile] = useState(currentUser?.mobile);
    const [address, setAddress] = useState(currentUser?.address);
    const [avatar, setAvatar] = useState(currentUser?.avatar);
    const [loadedAvt, setLoadedAvt] = useState(null);
    const [invalidFields, setInvalidFields] = useState([]);
    const [isShowUpdateBtn, setIsShowUpdateBtn] = useState(false);

    useEffect(() => {
        setFirstname(currentUser?.firstname);
        setLastname(currentUser?.lastname);
        setMobile(currentUser?.mobile);
        setAddress(currentUser?.address);
        setAvatar(currentUser?.avatar);
    }, [currentUser]);

    useEffect(() => {
        if (
            firstname !== currentUser?.firstname ||
            lastname !== currentUser?.lastname ||
            mobile !== currentUser?.mobile ||
            address !== currentUser?.address ||
            avatar !== currentUser?.avatar
        ) {
            setIsShowUpdateBtn(true);
        } else {
            setIsShowUpdateBtn(false);
        }

        const updatedTimeoutId = setTimeout(() => {
            if (isShowUpdateBtn) {
                setIsShowUpdateBtn(false);
                dispatch(getCurrent());
            }
        }, 30000);

        return () => clearTimeout(updatedTimeoutId);
    }, [firstname, lastname, mobile, address, avatar]);

    const selectImage = async (type) => {
        let loadedAvt;

        if (type === 'camera') {
            const isPermitted =
                await ImagePicker.requestCameraPermissionsAsync();

            if (isPermitted.granted === false) {
                dispatch(
                    showAlert({
                        title: 'Failed to take photo',
                        icon: 'warning',
                        message:
                            'You need to allow your app to access your camera first, please try again!',
                    }),
                );
                return;
            } else {
                loadedAvt = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.5,
                    cameraType: ImagePicker.CameraType.front,
                });
            }
        } else {
            loadedAvt = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });
        }

        if (!loadedAvt.canceled) {
            const uri = loadedAvt.assets[0].uri;
            const type = `image/${uri.split('.').pop()}`;
            const name = uri.split('/').pop();
            setLoadedAvt({ uri, type, name });
            setAvatar(uri);
        }
    };

    const handleSelectImage = () => {
        dispatch(
            showAlert({
                title: 'Update avatar',
                icon: 'person-circle',
                onConfirmText: 'Gallery',
                onCancelText: 'Camera',
                onConfirm: () => selectImage('gallery'),
                onCancel: () => selectImage('camera'),
                closable: true,
            }),
        );
    };

    const handleUpdateUser = async () => {
        const payload = { firstname, lastname, mobile, address };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            return;
        }

        const formData = new FormData();

        if (loadedAvt) {
            formData.append('avatar', loadedAvt);
        }

        for (let key of Object.keys(payload)) {
            formData.append(key, payload[key]);
        }

        dispatch(showLoading());
        const res = await apiUpdateCurrent(formData);
        if (res?.success) {
            dispatch(
                showAlert({
                    title: 'Update successfully',
                    icon: 'shield-checkmark',
                    message: 'Your information has been updated successfully!',
                    onConfirm: () => dispatch(getCurrent()),
                }),
            );
        } else {
            dispatch(
                showAlert({
                    title: 'Update failed',
                    icon: 'warning',
                    message:
                        'Your information has failed to update, please try again!',
                }),
            );
        }
        dispatch(hideLoading());
        setIsShowUpdateBtn(false);
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            First name
                        </Text>
                        <CustomedInput
                            value={firstname}
                            onChangeText={setFirstname}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            nameKey="firstname"
                        />
                    </View>

                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Last name
                        </Text>
                        <CustomedInput
                            value={lastname}
                            onChangeText={setLastname}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            nameKey="lastname"
                        />
                    </View>

                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Mobile
                        </Text>
                        <CustomedInput
                            value={mobile}
                            onChangeText={(value) => setMobile(value + '')}
                            type="number"
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            nameKey="mobile"
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Address
                        </Text>
                        <CustomedInput
                            value={address}
                            onChangeText={setAddress}
                            invalidFields={invalidFields}
                            setInvalidFields={setInvalidFields}
                            nameKey="address"
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Email
                        </Text>
                        <CustomedInput
                            value={currentUser?.email}
                            editable={false}
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Account status
                        </Text>
                        <CustomedInput
                            value={
                                currentUser?.isBlocked === false
                                    ? 'active'
                                    : 'blocked'
                            }
                            editable={false}
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>Role</Text>
                        <CustomedInput
                            value={
                                currentUser?.role === '1999' ? 'admin' : 'user'
                            }
                            editable={false}
                        />
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Create at
                        </Text>
                        <CustomedInput
                            value={moment(currentUser?.createdAt).format(
                                'DD/MM/YYYY',
                            )}
                            editable={false}
                        />
                    </View>
                    <View style={styles.avtWrapper}>
                        <Text style={[styles.text, styles.boldText]}>
                            Avatar
                        </Text>
                        <Image
                            source={
                                avatar ? { uri: `${avatar}` } : images.avatar
                            }
                            style={styles.avt}
                        />
                        <TouchableOpacity
                            style={styles.avtCtrlBtn}
                            onPress={handleSelectImage}
                        >
                            <FontAwesome name="camera" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
                {isShowUpdateBtn && (
                    <View style={[styles.updateBtnWrapper]}>
                        <TouchableOpacity
                            style={[styles.btn]}
                            onPress={handleUpdateUser}
                        >
                            <Text style={[styles.text, styles.whiteText]}>
                                Update
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </>
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

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
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
