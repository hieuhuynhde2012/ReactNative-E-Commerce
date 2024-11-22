import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import moment from 'moment';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomedInput from '../CustomedInput';
import { useDispatch } from 'react-redux';
import {
    showLoading,
    hideLoading,
    showAlert,
    hideModal,
} from '../../store/app/appSlice';
import { validate } from '../../utils/helpers';
import { apiUpdateUsers } from '../../apis/user';

const UserDetails = ({ data = {}, onUpdatedUser = () => {} }) => {
    const dispatch = useDispatch();
    const [invalidFields, setInvalidFields] = useState([]);
    const [firstname, setFirstname] = useState(data?.firstname);
    const [lastname, setLastname] = useState(data?.lastname);
    const [mobile, setMobile] = useState(data?.mobile);
    const [isAdmin, setIsAdmin] = useState(data?.role === '1999');
    const [isActive, setIsActive] = useState(data?.isBlocked === false);
    const [isShowUpdateBtn, setIsShowUpdateBtn] = useState(false);

    useEffect(() => {
        setFirstname(data?.firstname);
        setLastname(data?.lastname);
        setMobile(data?.mobile);
        setIsAdmin(data?.role === '1999');
        setIsActive(data?.isBlocked === false);
    }, [data]);

    useEffect(() => {
        if (
            firstname !== data?.firstname ||
            lastname !== data?.lastname ||
            mobile !== data?.mobile ||
            isAdmin !== (data?.role === '1999') ||
            isActive !== !data?.isBlocked
        ) {
            setIsShowUpdateBtn(true);
        } else {
            setIsShowUpdateBtn(false);
        }
    }, [firstname, lastname, mobile, isAdmin, isActive]);

    const handleUpdateUser = async () => {
        const payload = { firstname, lastname, mobile };
        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            return;
        }

        const updatedData = {
            ...payload,
            role: isAdmin ? '1999' : '1998',
            isBlocked: !isActive,
        };

        dispatch(showLoading());
        const res = await apiUpdateUsers(updatedData, data?._id);
        dispatch(hideLoading());

        if (res?.success) {
            console.log('res', res);
            onUpdatedUser({ limit: 100 });

            setFirstname(res?.user?.firstname);
            setLastname(res?.user?.lastname);
            setMobile(res?.user?.mobile);
            setIsAdmin(res?.user?.role === '1999');
            setIsActive(res?.user?.isBlocked === false);

            dispatch(
                showAlert({
                    title: 'Update successfully',
                    icon: 'shield-checkmark',
                    message: 'Your information has been updated successfully!',
                }),
            );
            setIsShowUpdateBtn(false);
        }
    };

    return (
        <SafeAreaView style={styles.savContainer}>
            <KeyboardAvoidingView
                style={[styles.overlay]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 10}
            >
                <ScrollView
                    style={styles.scrContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.titleWrapper}>
                            <Text
                                style={[
                                    styles.text,
                                    styles.boldText,
                                    styles.primaryText,
                                ]}
                            >
                                Edit user
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => dispatch(hideModal())}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.content}>
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
                                onChangeText={setMobile}
                                type="number"
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="mobile"
                            />
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Email
                            </Text>
                            <CustomedInput
                                value={data?.email}
                                editable={false}
                            />
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Create at
                            </Text>
                            <CustomedInput
                                value={moment(data?.createdAt).format(
                                    'DD/MM/YYYY',
                                )}
                                editable={false}
                            />
                        </View>

                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Role
                            </Text>
                            <View style={styles.checkboxOuterWrapper}>
                                <View style={styles.checkboxWrapper}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isAdmin}
                                        onValueChange={() =>
                                            setIsAdmin(!isAdmin)
                                        }
                                        color={isAdmin ? '#ee3131' : undefined}
                                    />
                                    <Text style={[styles.text]}>Admin</Text>
                                </View>
                                <View style={styles.checkboxWrapper}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={!isAdmin}
                                        onValueChange={() =>
                                            setIsAdmin(!isAdmin)
                                        }
                                        color={!isAdmin ? '#ee3131' : undefined}
                                    />
                                    <Text style={[styles.text]}>User</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Status
                            </Text>
                            <View style={styles.checkboxOuterWrapper}>
                                <View style={styles.checkboxWrapper}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={isActive}
                                        onValueChange={() =>
                                            setIsActive(!isActive)
                                        }
                                        color={isActive ? '#ee3131' : '#666'}
                                    />
                                    <Text style={[styles.text]}>Active</Text>
                                </View>
                                <View style={styles.checkboxWrapper}>
                                    <Checkbox
                                        style={styles.checkbox}
                                        value={!isActive}
                                        onValueChange={() =>
                                            setIsActive(!isActive)
                                        }
                                        color={!isActive ? '#ee3131' : '#666'}
                                    />
                                    <Text style={[styles.text]}>Blocked</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    {isShowUpdateBtn && (
                        <TouchableOpacity
                            style={styles.updateBtn}
                            onPress={handleUpdateUser}
                        >
                            <Text style={[styles.text, styles.whiteText]}>
                                Update
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default UserDetails;

const styles = StyleSheet.create({
    savContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        width: '100%',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
    },

    scrContainer: {
        width: '100%',
    },

    header: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '50%',
        top: 0,
        right: 0,

        borderWidth: 1,
        borderColor: '#ee3131',
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
    },

    titleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeBtn: {
        backgroundColor: '#ee3131',
        padding: 6,
        // borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
    },
    content: {
        width: '100%',
        marginTop: 42,
    },
    checkboxOuterWrapper: {
        width: '100%',
        flexDirection: 'row',
        gap: 24,
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoWrapper: {
        width: '100%',
        marginBottom: 12,
        gap: 6,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 1,
    },
    updateBtn: {
        position: 'absolute',
        backgroundColor: '#ee3131',
        right: 0,
        bottom: 12,
        padding: 12,
        borderTopLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    primaryText: {
        color: '#ee3131',
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
