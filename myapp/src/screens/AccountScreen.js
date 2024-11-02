import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from '../store/user/userSlice';

const AccountScreen = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Account Screen</Text>
            <Button title="LOG OUT" onPress={handleLogout} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    text: { fontSize: 24, marginBottom: 20 },
});

export default AccountScreen;
