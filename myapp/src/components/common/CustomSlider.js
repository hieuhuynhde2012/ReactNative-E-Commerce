import React, { memo } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Product } from "components"; // Giả sử bạn đã chuyển đổi Product component sang React Native

const CustomSlider = ({ products, activeTab, normal }) => {
  const renderItem = ({ item }) => (
    <Product
      key={item._id}
      pid={item._id}
      productData={item}
      isNew={activeTab === 2}
      normal={normal}
    />
  );

  return (
    <View style={styles.container}>
      {products && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={200} // Điều chỉnh kích thước phù hợp
          snapToAlignment="center"
          decelerationRate="fast"
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 5,
  },
  listContainer: {
    paddingVertical: 10,
  },
});

export default memo(CustomSlider);
