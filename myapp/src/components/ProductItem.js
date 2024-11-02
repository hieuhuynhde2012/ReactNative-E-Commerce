import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";

const ProductItem = ({ item }) => {
  return (
    <Pressable style={styles.container}>
      <Image style={styles.image} source={{ uri: item?.thumb }} />

      <Text numberOfLines={1} style={styles.title}>
        {item?.title}
      </Text>
      <View style={styles.infoContainer}>
        <Text style={styles.price}>{(item?.price / 24000).toFixed(2)} $</Text>
        <Text style={styles.rating}>{item?.totalRating} ⭐️</Text>
      </View>

      <Pressable style={styles.addButton}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 25,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  title: {
    width: 150,
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 15,
    fontWeight: "bold",
  },
  rating: {
    color: "#FFC72C",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
  },
});
