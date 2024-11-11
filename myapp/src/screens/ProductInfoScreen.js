import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  ImageBackground,
  Dimensions,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useDispatch, useSelector } from "react-redux";
import { updateCart, addToCart } from "../store/user/userSlice";
import { showLoading, hideLoading } from "../store/app/appSlice";
import { useNavigation } from "@react-navigation/native";

const ProductInfoScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width } = Dimensions.get("window");
  const height = (width * 100) / 100;
  const [addedToCart, setAddedToCart] = useState(false);
  const dispatch = useDispatch();
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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.searchBarContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.searchBar}>
          <TextInput style={styles.textInputSearch} placeholder="Search" />
          <AntDesign
            style={styles.searchIcon}
            name="search1"
            size={22}
            color="black"
          />
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {route.params.carouseImages.map((item, index) => (
          <ImageBackground
            style={[styles.imageBackground, { width, height }]}
            source={{ uri: item }}
            key={index}
          >
            <View style={styles.imageHeader}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>40% off</Text>
              </View>
              <View style={styles.shareButton}>
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="black"
                />
              </View>
            </View>
            <View style={styles.heartButton}>
              <AntDesign name="hearto" size={24} color="black" />
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.productTitle}>{route?.params?.title}</Text>
        <Text style={styles.productPrice}>
          {(route?.params.price / 24000).toFixed(2)} $
        </Text>
      </View>

      <Text style={styles.separator} />

      <View style={styles.colorContainer}>
        <Text>Color:</Text>
        <Text style={styles.colorText}>{route?.params?.color}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionTitle}>Description:</Text>
        <View style={styles.table}>
          {route?.params?.description?.map((descItem, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.rowText}>{descItem}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.deliveryInfoContainer}>
        <Text style={styles.deliveryText}>
          FREE delivery Tomorrow by 3PM. Order within 10hrs 30 mins
        </Text>
      </View>

      <View style={styles.locationContainer}>
        <Ionicons name="location" size={24} color="black" />
        <Text>Deliver To HCM - 70000</Text>
      </View>

      <Text style={styles.inStockText}>In Stock</Text>

      <Pressable
        onPress={() => addItemToCart(route?.params?.item)}
        style={styles.addToCartButton}
      >
        {addedToCart ? (
          <View>
            <Text style={styles.addToCartText}>Added to Cart</Text>
          </View>
        ) : (
          <Text style={styles.addToCartText}>Add to Cart</Text>
        )}
      </Pressable>

      <Pressable style={styles.buyNowButton}>
        <Text style={styles.addToCartText}>Buy Now</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginTop: 45,
    flex: 1,
    backgroundColor: "white",
  },
  searchBarContainer: {
    backgroundColor: "#ee3131",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap: 10,
    backgroundColor: "white",
    borderRadius: 3,
    height: 38,
    flex: 1,
    justifyContent: "space-between",
  },
  textInputSearch: {
    marginLeft: 10,
  },
  searchIcon: {
    paddingLeft: 10,
    marginRight: 10,
  },
  imageBackground: {
    marginTop: 25,
    resizeMode: "contain",
  },
  imageHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  discountBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C60C30",
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginLeft: 20,
    marginBottom: 20,
  },
  infoContainer: {
    padding: 10,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },
  separator: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 1,
  },
  colorContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  colorText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  descriptionContainer: {
    padding: 10,
  },
  descriptionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D0D0D0",
  },
  rowText: {
    fontSize: 15,
    flex: 1,
  },
  deliveryInfoContainer: {
    padding: 10,
  },
  deliveryText: {
    color: "#C60C30",
  },
  locationContainer: {
    flexDirection: "row",
    marginVertical: 5,
    alignItems: "center",
    gap: 5,
  },
  inStockText: {
    color: "red",
    marginHorizontal: 10,
    fontWeight: "500",
  },
  addToCartButton: {
    backgroundColor: "#ee3131",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  addToCartText: {
    color: "white",
  },
  buyNowButton: {
    backgroundColor: "#ef0505",
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 10,
  },
});

export default ProductInfoScreen;
