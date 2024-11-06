import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { apiGetAdditionalAddress, apiGetCurrent } from "../apis";
import Entypo from '@expo/vector-icons/Entypo';

const AddAddressScreen = () => {
  const navigation = useNavigation();

  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    fetchUserAndAddresses();
  }, []);

  const fetchUserAndAddresses = async () => {
    try {
      const userResponse = await apiGetCurrent();
      if (userResponse.success) {
        const userID = userResponse.rs._id;
        //console.log(userID);

        const addressResponse = await apiGetAdditionalAddress(userID);

        if (addressResponse.success) {
          //console.log(addressResponse.additionalAddress);
          setAddresses(addressResponse.additionalAddress);
        } else {
          console.log("Failed to fetch addresses:", addressResponse.message);
        }
      } else {
        console.log("Failed to fetch user:", userResponse.message);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };
//refresh the addresses when the component comes to the focused element
  useFocusEffect(
    useCallback(() => {
      fetchUserAndAddresses();
    })
  )

  return (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      style={styles.addAddressContainer}
    >
      <View style={styles.searchContainer}>
        <Pressable style={styles.searchBox}>
          <AntDesign
            style={styles.icon}
            name="search1"
            size={22}
            color="black"
          />
          <TextInput placeholder="Search" />
        </Pressable>
        <Feather name="mic" size={24} color="black" />
      </View>

      <View style={styles.addressHeaderContainer}>
        <Text style={styles.addressHeaderText}>Your address</Text>

        <Pressable
          onPress={() => navigation.navigate("Add")}
          style={styles.addAddressHeader}
        >
          <Text>Add a new Address</Text>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

        <Pressable>
          {addresses?.map((item, index) => (
            <Pressable style={styles.addressesInfoButton}>
              <View style={styles.addressesInfoContainer}>
                <Text style={styles.addressesInfoText}>{item?.name}</Text>
                <Entypo name="location-pin" size={24} color="#ee3131" />
              </View>
              <Text style={styles.addressesDetailInfoText}>{item?.houseNo}, {item?.landmark}</Text>
              <Text style={styles.addressesDetailInfoText} >{item?.street}</Text>
              <Text style={styles.addressesDetailInfoText}>{item?.country}</Text>
              <Text style={styles.addressesDetailInfoText}>Phone number: {item?.mobileNo}</Text>
              <Text style={styles.addressesDetailInfoText}>Pin code: {item?.postalCode}</Text>
              <View style={styles.addressButtonContainer}>
                <Pressable style={styles.editAddressButton}>
                  <Text style={styles.editAddressText}>Edit</Text>
                </Pressable>
                <Pressable style={styles.editAddressButton}>
                  <Text style={styles.editAddressText}>Remove</Text>
                </Pressable>
                <Pressable style={styles.editAddressButton}>
                  <Text style={styles.editAddressText}>Set as default</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  addAddressContainer: {
    // marginTop: 50,
  },
  searchContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
    flex: 1,
  },
  addressHeaderContainer: {
    padding: 10,
  },
  addressHeaderText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  addAddressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  addressesInfoButton: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    padding: 10,
    flexDirection: "column",
    gap: 5,
    marginVertical: 10,
  },
  addressesInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  addressesInfoText: {
    fontSize: 15,
    fontWeight: "bold"
  },
  addressesDetailInfoText: {
    fontSize: 15,
    color: "#181818"
  },
  addressButtonContainer: {
    flexDirection: "row",
    alignItems : "center",
    gap: 10,
    marginTop: 7

  },
  editAddressButton: {
    backgroundColor: "#ee3131",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    borderWidth: 0.9,
    borderColor: "#D0D0D0"
  },
  editAddressText: {
    color: "white"
  }
});
