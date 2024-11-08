import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/user/userSlice";

const ProductItem = ({ item }) => {
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);
  const addItemToCart = (item) => {
    setAddedToCart(true);
    dispatch(addToCart(item));
    setTimeout(() => {
      setAddedToCart(false);
    }, 6000);
  };
  const cart = useSelector((state) => state.user.cart);
  // console.log(cart);
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

      <Pressable onPress={() => addItemToCart(item)} style={styles.addButton}>
        {addedToCart ? (
          <View>
            <Text style={styles.addToCartText}>Added to Cart</Text>
          </View>
        ) : (
          <Text style={styles.addToCartText}>Add to Cart</Text>
        )}
      </Pressable>
    </Pressable>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    borderWidth: 1, 
    borderColor: "#D0d0d0",
    borderRadius: 5, 
    padding: 10,
    //width: "48%",
    paddingHorizontal: 7,
    marginRight: 10,
    marginLeft: 5
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
  addToCartText : {
    color: 'white'

  },
});
