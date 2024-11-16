import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { apiAddAdditionalAddress } from "../apis";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AddressScreen = () => {
  const navigation = useNavigation();
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [landmark, setLanmark] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const handleAddAddress = async () => {
    if (!name || !mobileNo) {
      Alert.alert("Error", "Full name and mobile number are required.");
      return;
    }
    const address = {
      country,
      name,
      mobileNo,
      houseNo,
      street,
      landmark,
      postalCode,
    };

    try {
      const response = await apiAddAdditionalAddress({
        additionalAddress: address,
      });
      if (response.success) {
        Alert.alert("Success", "Address added successfully!");
        setCountry("");
        setName("");
        setMobileNo("");
        setHouseNo("");
        setStreet("");
        setLanmark("");
        setPostalCode("");

        setTimeout(() => {
          navigation.goBack();
        }, 500);
      } else {
        Alert.alert(
          "Error",
          response.data ? response.data.updatedUser : "Unknown error"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add address. Please try again.");
    }
  };
  return (
    // <View style={styles.container}> 

      
    //  </View>
    <SafeAreaView style={styles.container}>
    <ScrollView keyboardShouldPersistTaps="handled"
    showsHorizontalScrollIndicator={false} style={styles.addressContainer}>
      <View style={styles.addressBlock} />

      <View style={styles.addAddressHeader}>
        <Text style={styles.addAddressText}>Add a new Address</Text>

        <TextInput
          value={country}
          placeholder="Enter your country"
          onChangeText={(text) => setCountry(text)}
          placeholderTextColor={"black"}
          style={styles.addFieldInput}
        ></TextInput>

        <View style={styles.addNameContainer}>
          <Text style={styles.addField}>Full name (First and last name)</Text>

          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your name"
          />
        </View>

        <View>
          <Text style={styles.addField}>Mobile number</Text>
          <TextInput
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your mobile number"
          />
        </View>
        <View>
          <Text style={styles.addField}>House number, building, company</Text>
          <TextInput
            value={houseNo}
            onChangeText={(text) => setHouseNo(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your house number"
          />
        </View>
        <View>
          <Text style={styles.addField}>Area, street, sector, village</Text>
          <TextInput
            value={street}
            onChangeText={(text) => setStreet(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter your street"
          />
        </View>
        <View>
          <Text style={styles.addField}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(text) => setLanmark(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Eg near apollo, hospital"
          />
        </View>
        <View>
          <Text style={styles.addField}>Pincode</Text>
          <TextInput
            value={postalCode}
            onChangeText={(text) => setPostalCode(text)}
            placeholderTextColor={"black"}
            style={styles.addFieldInput}
            placeholder="Enter pincode"
          />
        </View>

        <Pressable
          style={styles.addAddressButtonContainer}
          onPress={handleAddAddress}
        >
          <Text style={styles.addAddressButtonText}>Add Address</Text>
        </Pressable>
      </View>
    </ScrollView>
    </SafeAreaView>

  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  addressContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  addressBlock: {
    height: 50,
    backgroundColor: "#ee3131",
  },
  addAddressHeader: {
    padding: 10,
  },
  addAddressText: {
    fontSize: 17,
    fontWeight: "bold",
  },
  addFieldInput: {
    padding: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 5,
  },
  addField: {
    fontSize: 15,
    fontWeight: "bold",
  },
  addNameContainer: {
    marginVertical: 10,
  },
  addAddressButtonContainer: {
    backgroundColor: "#ee3131",
    padding: 19,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    height: 60,
  },
  addAddressButtonText: {
    fontWeight: "bold",
    color: "white",
  },
});
