import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
} from "react-native";
import axios from "axios";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect, useCallback } from "react";
import ProductItem from "../components/ProductItem";
import { apiGetProducts } from "../apis/product";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import { color } from "react-native-elements/dist/helpers";
import { Dimensions } from "react-native";
import { ModalContent, SlideAnimation } from "react-native-modals";
import { BottomModal } from "react-native-modals";
import Carousel from "react-native-snap-carousel";
import Entypo from "@expo/vector-icons/Entypo";
const HomeScreen = () => {
  const navigation = useNavigation();
  const { width: viewportWidth } = Dimensions.get("window");
  const list = [
    {
      id: "0",
      image: "https://img.lovepik.com/element/45013/9627.png_860.png",
      name: "Deals",
    },
    {
      id: "1",
      image:
        "https://cdn.tgdd.vn/Products/Images/42/329149/iphone-16-pro-max-tu-nhien-thumb-600x600.jpg",
      name: "Mobiles",
    },
    {
      id: "2",
      image:
        "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1697311054290",
      name: "Laptops",
    },
    {
      id: "3",
      image: "https://taingheviet.com/uploads/Jabra%20Elite%2085H/2.png",
      name: "Headphones",
    },
    {
      id: "4",
      image:
        "https://hangdang.vn/wp-content/uploads/2023/09/title_iphone_15_plus_ultrahybrid_black_01.jpg",
      name: "Back cover",
    },
    {
      id: "5",
      image:
        "https://azskin.vn/cdn/shop/files/37e3b4255beb424bbc0a98098cb9ec09-jpeg.webp?v=1690615552",
      name: "Charging cable",
    },
  ];

  const images = [
    "https://img.etimg.com/thumb/msid-93051525,width-1070,height-580,imgsize-2243475,overlay-economictimes/photo.jpg",
    "https://images-eu.ssl-images-amazon.com/images/G/31/img22/Wireless/devjyoti/PD23/Launches/Updated_ingress1242x550_3.gif",
  ];

  const [offers, setOffers] = useState([]);

  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState([
    { label: "All", value: "All" },
    { label: "Laptop", value: "Laptop" },
    { label: "Camera", value: "Camera" },
    { label: "Smartphone", value: "Smartphone" },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiGetProducts({
          limit: 10,
          sort: "-totalRating",
        });
        //console.log('response', response);
        setProducts(response.productData);
      } catch (error) {
        console.log("error message", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await apiGetProducts({
          sort: "-sold",
        });
        if (response.success) setOffers(response.productData);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    fetchOffers();
  }, []);

  const onGenderOpen = useCallback(() => {
    setOpen(true);
  }, []);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <ScrollView>
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

          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.locationContainer}
          >
            <Ionicons name="location-outline" size={24} color="black" />

            <Pressable>
              <Text style={styles.locationText}>
                Deliver to Ho Chi Minh City
              </Text>
            </Pressable>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </Pressable>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {list.map((item, index) => (
              <Pressable key={index} style={styles.listItemContainer}>
                <Image
                  style={styles.listItemImage}
                  source={{ uri: item.image }}
                />
                <Text style={styles.listItemText}>{item?.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Carousel
            data={images}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width: viewportWidth, height: 200 }}
              />
            )}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth}
            autoplay
            loop
          />

          <Text style={styles.trendingDealsTitle}>
            Trending Deals of the week
          </Text>
          <View style={styles.productsContainer}>
            {products.slice(0, 4).map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item._id,
                    title: item.title,
                    price: item?.price,
                    carouseImages: item.images,
                    color: item?.color,
                    description: item?.description,
                    item: item,
                  })
                }
                key={index}
                style={styles.productItem}
              >
                <Image
                  style={styles.productImage}
                  source={{ uri: item?.thumb }}
                />

                <Text numberOfLines={1} style={styles.productTitle}>
                  {item?.title}
                </Text>
                <View style={styles.productInfo}>
                  <Text style={styles.productPrice}>
                    {(item?.price / 24000).toFixed(2)} $
                  </Text>
                  <Text style={styles.productRating}>
                    {item?.totalRating} ⭐️
                  </Text>
                  <Text style={styles.productSold}>{item?.sold}</Text>
                </View>
              </Pressable>
            ))}
          </View>
          <Text style={styles.separator} />
          <Text style={styles.dealsTitle}>Today's Deals</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {offers.slice(0, 4).map((item, index) => (
              <Pressable
                onPress={() =>
                  navigation.navigate("Info", {
                    id: item._id,
                    title: item.title,
                    price: item?.price,
                    carouseImages: item.images,
                    color: item?.color,
                    description: item?.description,
                    item: item,
                  })
                }
                style={styles.offerItem}
              >
                <Image
                  style={styles.offerImage}
                  source={{ uri: item?.thumb }}
                />
                <View style={styles.offerDiscountContainer}>
                  <Text style={styles.offerDiscountText}>Up to 40% Off</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.separator} />
          <View
            style={{
              marginHorizontal: 10,
              width: "45%",
              marginBottom: open ? 50 : 15,
              marginTop: 20,
            }}
          >
            <DropDownPicker
              style={[
                styles.dropdownContainer,
                { marginBottom: open ? 120 : 1 },
              ]}
              open={open}
              value={category}
              items={items}
              setOpen={setOpen}
              setValue={setCategory}
              setItems={setItems}
              placeholder="Choose category"
              placeholderStyle={{ color: "gray" }}
              onOpen={onGenderOpen}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          <View style={styles.productsFilterContainer}>
            {products
              ?.filter(
                (item) => category === "All" || item.category === category
              )
              .map((item) => (
                <ProductItem item={item} key={item.id} />
              ))}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomModal
        onBackdropPress={() => setModalVisible(!modalVisible)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        modalAnimation={
          new SlideAnimation({
            slideFrom: "bottom",
          })
        }
        onHardwareBackPress={() => setModalVisible(!modalVisible)}
        visible={modalVisible}
        onTouchOutside={() => setModalVisible(!modalVisible)}
      >
        <ModalContent style={[styles.modalContentContainer]}>
          <View style={styles.modalContent}>
            <Text style={styles.modalContentHeaderText}>
              Choose your Location
            </Text>
            <Text style={styles.modalContentText}>
              Select a delivery location to see product availability
            </Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* alredy added address*/}
            <Pressable
            onPress={() => {
              setModalVisible(false);
              navigation.navigate("Address");
            }}
             style={styles.addAdressContainer}>
              <Text style={styles.addAdressText}>
                Add an Address or pick-up point
              </Text>
            </Pressable>
          </ScrollView>

          <View style={styles.addLocationContainer}>
            <View style={styles.addPinCodeContainer}>
              <Entypo name="location-pin" size={24} color="#ee3131" />
              <Text style={styles.addPinCodeText}>Enter a VietNam pincode</Text>
            </View>
            <View style={styles.addPinCodeContainer}>
            <Ionicons name="locate-sharp" size={24} color="#ee3131" />
              <Text style={styles.addPinCodeText}>Use my crrent location</Text>
            </View>
            <View style={styles.addPinCodeContainer}>
            <AntDesign name="earth" size={24} color="#ee3131" />
              <Text style={styles.addPinCodeText}>Deliver outside VietNam</Text>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? 40 : 0,
    flex: 1,
    backgroundColor: "white",
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
  icon: { paddingLeft: 10 },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 10,
    backgroundColor: "#ee4731",
  },
  locationText: { fontSize: 13, fontWeight: "500", color: "white" },
  listItemContainer: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  listItemImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  listItemText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },
  trendingDealsTitle: { padding: 10, fontSize: 18, fontWeight: "bold" },
  productsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  productItem: { marginHorizontal: 20, marginVertical: 25 },
  productImage: { width: 150, height: 150, resizeMode: "contain" },
  productTitle: { width: 150, marginTop: 10 },
  productInfo: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  productPrice: { fontSize: 15, fontWeight: "bold" },
  productRating: { color: "#FFC72C", fontWeight: "bold" },
  productSold: { fontSize: 15, fontWeight: "bold" },
  separator: {
    height: 1,
    borderColor: "#D0D0D0",
    borderWidth: 2,
    marginTop: 15,
  },
  dealsTitle: { padding: 10, fontSize: 18, fontWeight: "bold" },
  offerItem: {
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  offerImage: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  offerDiscountContainer: {
    backgroundColor: "#Ee3131",
    paddingVertical: 5,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 4,
  },
  offerDiscountText: {
    textAlign: "center",
    color: "white",
    fontSize: 13,
    fontWeight: "bold",
  },
  dropdownContainer: {
    borderColor: "#B7B7B7",
    height: 30,
  },
  productsFilterContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modalContentContainer: {
    width: "100%",
    height: 400,
  },
  modalContent: {
    marginBottom: 8,
  },
  modalContentHeaderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalContentText: {
    marginTop: 5,
    fontSize: 16,
    color: "gray",
  },
  addAdressContainer: {
    width: 140,
    height: 140,
    borderColor: "#D0D0D0",
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addAdressText: {
    textAlign: "center",
    color: "#ee3131",
    fontWeight: "500",
  },
  addPinCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addPinCodeText: {
    color: "#ee3131",
    fontWeight: "400",
  },
  addLocationContainer: {
    flexDirection: "column",
    gap: 7,
    marginBottom: 30,
  },
});

export default HomeScreen;
