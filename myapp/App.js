import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import AuthStack from "./src/navigation/AuthStack";
import { ModalPortal } from "react-native-modals";
import { StatusBar } from "react-native";
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthStack />
        <StatusBar
          barStyle="dark-content" // Adjust text color to light-content or dark-content as needed
          backgroundColor="transparent" // Makes the background transparent
          translucent={true} // Enables transparency on Android
        />
      </NavigationContainer>
      <ModalPortal />
    </AuthProvider>
  );
};

export default App;
