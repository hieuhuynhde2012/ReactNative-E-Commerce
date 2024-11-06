import React from "react";
import { StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./src/navigation/AppNavigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/store/redux";
import CustomedAlert from "./src/components/CustomedAlert";
import { useSelector } from "react-redux";
import { ModalPortal } from "react-native-modals";
import { UserContext } from "./src/context/UserContext";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <AppContent />
      </PersistGate>
    </Provider>
  );
};

const AppContent = () => {
  const { isShownModal, modalChildren } = useSelector((state) => state.app);

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <CustomedAlert visible={isShownModal} children={modalChildren} />

        <AppNavigation />
      </NavigationContainer>
      <ModalPortal />
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
