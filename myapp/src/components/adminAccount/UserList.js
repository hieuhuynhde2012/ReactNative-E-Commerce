import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { apiGetUsers, apiDeleteUsers } from '../../apis/user';
import { images } from '../../../assets';
import { showLoading, hideLoading, showAlert } from '../../store/app/appSlice';
import { useDispatch } from 'react-redux';
import IncrementalPagination from '../pagination/IncrementalPagination';
import UserDetails from './UserDetails';
import { showModal } from '../../store/app/appSlice';

const itemPerPage = 4;
const UserList = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [shownUsers, setShownUsers] = useState([]);

    const fetchUsers = async (params) => {
        dispatch(showLoading());
        const res = await apiGetUsers({ ...params });
        if (res.success) {
            setUsers(res.users);

            if (res.length < itemPerPage) {
                setShownUsers(res.users);
            } else {
                setShownUsers(res.users.slice(0, itemPerPage));
            }
        }
        dispatch(hideLoading());
    };

    useEffect(() => {
        fetchUsers({ limit: 100 });
    }, []);

    const handleChangeShownData = (data) => {
        setShownUsers(data);
    };

    const handleDeleteUser = (userId) => {
        dispatch(
            showAlert({
                title: 'Delete user',
                icon: 'warning',
                message:
                    'This user will be deleted permanently from the system, are you sure?',
                onConfirm: async () => {
                    const res = await apiDeleteUsers(userId);
                    if (res.success) {
                        fetchUsers({ limit: 100 });
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
            {shownUsers.length > 0 &&
                shownUsers.map((item) => (
                    <View key={item._id} style={styles.cartItemWrapper}>
                        <View style={styles.imgWrapper}>
                            <Image
                                style={styles.img}
                                source={
                                    item?.avatar
                                        ? { uri: `${item?.avatar}` }
                                        : images.avatar
                                }
                            />
                        </View>
                        <View style={styles.inforWrapper}>
                            <Text
                                numberOfLines={1}
                                style={[styles.text, styles.boldText]}
                            >
                                {`${item?.firstname} ${item?.lastname}`}
                            </Text>
                            <Text numberOfLines={1} style={[styles.text]}>
                                {item?.email}
                            </Text>
                        </View>
                        <View style={styles.ctrlWrapper}>
                            <TouchableOpacity
                                style={styles.ctrlBtn}
                                onPress={() => handleDeleteUser(item._id)}
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
                                                <UserDetails
                                                    data={item}
                                                    onUpdatedUser={fetchUsers}
                                                />
                                            ),
                                        }),
                                    );
                                }}
                            >
                                <FontAwesome5
                                    name="user-edit"
                                    size={16}
                                    color="#444"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

            {users.length > itemPerPage && (
                <IncrementalPagination
                    data={users}
                    itemPerPage={itemPerPage}
                    onChangeShownData={handleChangeShownData}
                />
            )}
            {/* {isEditUser && editedData && (
                <UserDetails data={editedData} onHide={setIsEditUser} />
            )} */}
        </View>
    );
};

export default UserList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartItemWrapper: {
        width: '100%',
        aspectRatio: 3 / 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#a0a0a0',
        borderRadius: 16,
        marginBottom: 10,
        backgroundColor: 'white',
    },
    imgWrapper: {
        width: '29%',
        aspectRatio: 1 / 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    inforWrapper: {
        width: '50%',
        justifyContent: 'space-between',
        gap: 16,
        alignItems: 'flex-start',
    },
    ctrlWrapper: {
        width: '10%',
        height: '100%',
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
    totalPriceWrapper: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
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
