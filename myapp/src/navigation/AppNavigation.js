import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import AuthStack from "./AuthStack";
import { useSelector, useDispatch } from "react-redux";
import { getCurrent } from "../store/user/asyncAction";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddressScreen from "../screens/AddressScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";
import OrderScreen from "../screens/OrderScreen";
import EditAddressesScreen from "../screens/EditAddressesScreen";
import TestScreen from "../screens/TestScreen";
import { getCategories } from "../store/app/asyncActions";
import { showLoading, hideLoading } from "../store/app/appSlice";
import ProductItem from "../components/ProductItem";
import { SafeAreaView, View, Platform } from "react-native";

const Stack = createStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      dispatch(showLoading());
      dispatch(getCategories());
      dispatch(getCurrent());
      dispatch(hideLoading());
    }, 500);
    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [isLoggedIn, dispatch]);

  return (
    <Stack.Navigator >
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="MainTab"
            component={MainTab}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Info"
            component={ProductInfoScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductItem"
            component={ProductItem}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddressScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Address"
            component={AddAddressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Confirm"
            component={ConfirmationScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Order"
            component={OrderScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditAddress"
            component={EditAddressesScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="test"
            component={TestScreen}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <Stack.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigation;
