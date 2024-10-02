import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useNavigation } from '@react-navigation/native'; // Để điều hướng
// import useBreadcrumbs from "use-react-router-breadcrumbs"; // Không cần thiết trong React Native
import { GrFormNext } from "react-icons/gr"; // Bạn có thể cần một biểu tượng tương tự trong React Native

const Breadcrumb = ({ title, category }) => {
  // const navigation = useNavigation(); // Khai báo navigation

  // const routes = [
  //   { path: "/:category", breadcrumb: category },
  //   { path: "/", breadcrumb: "Home" },
  //   { path: "/:category/:pid/:title", breadcrumb: title },
  // ];

  // const breadcrumb = useBreadcrumbs(routes);

  return (
    <View style={styles.container}>
      {/* Giả sử breadcrumb là một mảng đã được định nghĩa */}
      {[
        { path: "/:category", breadcrumb: category },
        { path: "/", breadcrumb: "Home" },
        { path: "/:category/:pid/:title", breadcrumb: title },
      ]?.map(({ breadcrumb }, index, self) => (
        <TouchableOpacity
          style={styles.link}
          key={index}
          // onPress={() => navigation.navigate(path)} // Điều hướng đến đường dẫn
        >
          <Text style={styles.breadcrumbText}>{breadcrumb}</Text>
          {index !== self.length - 1 && <GrFormNext />} {/* Bạn có thể thay bằng một biểu tượng khác */}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Giả định khoảng cách giữa các phần tử
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
  },
});

export default memo(Breadcrumb);
