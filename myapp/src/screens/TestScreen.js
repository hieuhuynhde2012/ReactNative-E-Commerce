import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import AddressScreen from "./AddressScreen";

const TestScreen = () => {
  return (
      <AddressScreen />  
  );
}

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: "white",
    flex: 1,
  },
});

export default TestScreen;
