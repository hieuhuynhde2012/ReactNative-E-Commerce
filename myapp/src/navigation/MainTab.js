import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CartScreen from "../screens/CartScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import CategoryTopTab from "./CategoryTopTab";

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const cart = useSelector((state) => state.user.cart);
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#ee3131",
        tabBarInactiveTintColor: "black",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="home"
              size={24}
              color={focused ? "#ee3131" : "black"}
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
          tabBarLabel: "Cart",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="shopping-cart"
              size={24}
              color={focused ? "#ee3131" : "black"}
            />
          ),
          tabBarBadge: cart.length > 0 ? cart.length : null,
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person"
              size={24}
              color={focused ? "#ee3131" : "black"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTab;
