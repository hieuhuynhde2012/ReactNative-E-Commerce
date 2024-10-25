import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import AccountScreen from '../screens/AccountScreen';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarIcon: () => <Icon name="home" type="font-awesome" />,
        headerShown: false
      }} />
      <Tab.Screen name="Category" component={CategoryScreen} options={{
        tabBarIcon: () => <Icon name="list" type="font-awesome" />
      }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{
        tabBarIcon: () => <Icon name="heart" type="font-awesome" />,
        tabBarBadge: 3
      }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{
        tabBarIcon: () => <Icon name="user" type="font-awesome" />
      }} />
    </Tab.Navigator>
  );
};

export default MainTab;
