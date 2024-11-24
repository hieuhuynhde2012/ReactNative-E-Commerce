import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CartScreen from '../screens/CartScreen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import CategoryTopTab from './CategoryTopTab';

const Tab = createBottomTabNavigator();

const MainTab = () => {
    const { currentCart, current } = useSelector((state) => state.user);

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#ee3131',
                tabBarInactiveTintColor: 'black',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Entypo
                            name="home"
                            size={24}
                            color={focused ? '#ee3131' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Category"
                component={CategoryTopTab}
                options={{
                    tabBarLabel: 'Category',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <MaterialIcons
                            name="category"
                            size={24}
                            color={focused ? '#ee3131' : 'black'}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarLabel: 'Cart',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.cartIconWrapper}>
                            <Entypo
                                name="shopping-cart"
                                size={24}
                                color={focused ? '#ee3131' : 'black'}
                            />
                            {!focused && currentCart?.length > 0 && (
                                <View style={styles.cartQuantityWrapper}>
                                    <Text style={styles.cartQuantity}>
                                        {currentCart?.length}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                options={{
                    tabBarLabel: 'Account',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <Ionicons
                            name="person"
                            size={24}
                            color={focused ? '#ee3131' : 'black'}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTab;

const styles = StyleSheet.create({
    cartIconWrapper: {
        position: 'relative',
    },
    cartQuantityWrapper: {
        position: 'absolute',
        width: 16,
        height: 16,
        backgroundColor: '#ee3131',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        right: -10,
        top: -5,
    },
    cartQuantity: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});
