import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";

const ProductItem = ({item}) => {
    return (
        <Pressable style={{marginHorizontal: 20, marginVertical: 25}}>
            <Image style={{width:150, height:150, resizeMode: 'contain'}} source={{uri:item?.thumb}}/>

            <Text numberOfLines={1} style={{width: 150, marginTop: 10}}>{item?.title}</Text>
            <View>
                <Text>{item?.price}</Text>
            </View>
        </Pressable>
    )
}

export default ProductItem
const styles = StyleSheet.create({})