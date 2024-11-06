import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainTab from "./MainTab";
import AuthStack from "./AuthStack";
import { useSelector, useDispatch } from "react-redux";
import { getCurrent } from "../store/user/asyncAction";
import HomeScreen from "../screens/ProductInfoScreen";
import ProductInfoScreen from "../screens/ProductInfoScreen";
import AddressScreen from "../screens/AddressScreen";
import AddAddressScreen from "../screens/AddAddressScreen";
import ConfirmationScreen from "../screens/ConfirmationScreen";

const Stack = createStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, ...data } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getCurrent());
  }, [dispatch]);

  return (
    <Stack.Navigator>
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
            name="Address"
            component={AddAddressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            component={AddressScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Confirm"
            component={ConfirmationScreen}
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
