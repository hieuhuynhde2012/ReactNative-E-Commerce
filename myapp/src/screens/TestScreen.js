import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { apiAddAdditionalAddress } from "../apis";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TestScreen = () =>  {
  // const navigation = useNavigation();
  // const [country, setCountry] = useState("");
  // const [name, setName] = useState("");
  // const [mobileNo, setMobileNo] = useState("");
  // const [houseNo, setHouseNo] = useState("");
  // const [street, setStreet] = useState("");
  // const [landmark, setLanmark] = useState("");
  // const [postalCode, setPostalCode] = useState("");
  
  // const handleAddAddress = async () => {
  //   if (!name || !mobileNo) {
  //     Alert.alert("Error", "Full name and mobile number are required.");
  //     return;
  //   }
  //   const address = {
  //     country,
  //     name,
  //     mobileNo,
  //     houseNo,
  //     street,
  //     landmark,
  //     postalCode,
  //   };

  //   try {
  //     const response = await apiAddAdditionalAddress({
  //       additionalAddress: address,
  //     });
  //     if (response.success) {
  //       Alert.alert("Success", "Address added successfully!");
  //       setCountry("");
  //       setName("");
  //       setMobileNo("");
  //       setHouseNo("");
  //       setStreet("");
  //       setLanmark("");
  //       setPostalCode("");

  //       setTimeout(() => {
  //         navigation.goBack();
  //       }, 500);
  //     } else {
  //       Alert.alert(
  //         "Error",
  //         response.data ? response.data.updatedUser : "Unknown error"
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     Alert.alert("Error", "Failed to add address. Please try again.");
  //   }
  // };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "red" }}>
      <View style={styles.addressContainer}></View>
    </SafeAreaView>
    );

}

const styles = StyleSheet.create({
  addressContainer: {
    backgroundColor: "red",
    
    //flex: 1,
   // height: "100%"
    
  },
    
});
export default TestScreen;


