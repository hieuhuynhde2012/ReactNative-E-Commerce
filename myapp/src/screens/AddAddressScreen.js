import React from "react";
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
const AddAddressScreen = () => {
  const navigation = useNavigation();
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
        style={styles.addAddressHeader}>
            <Text>Add a new Address</Text>
            <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </Pressable>

      </View>
    </ScrollView>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  addAddressContainer: {
    marginTop: 50,
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
    padding: 10

  },
  addressHeaderText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  addAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    borderColor: "#D0D0D0",
    borderWidth:1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 5
  }

});
