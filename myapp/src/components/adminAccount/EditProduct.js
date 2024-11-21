import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Keyboard,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    showAlert,
    showLoading,
    hideLoading,
    hideModal,
} from '../../store/app/appSlice';
import CustomedInput from '../CustomedInput';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import { validate } from '../../utils/helpers';
import { apiUpdateProduct } from '../../apis/product';

const EditProduct = ({ data = {}, onUpdateProduct = () => {} }) => {
    const dispatch = useDispatch();

    const { categories } = useSelector((state) => state.app);
    const [title, setTitle] = useState(data?.title || '');
    const [price, setPrice] = useState(data?.price || 0);
    const [quantity, setQuantity] = useState(data?.quantity || 0);
    const [color, setColor] = useState(data?.color || '');
    const [category, setCategory] = useState(data?.category || '');
    const [brand, setBrand] = useState(data?.brand || '');
    const [brandItems, setBrandItems] = useState([]);
    const [description, setDescription] = useState(data?.description || []);
    const [invalidFields, setInvalidFields] = useState([]);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);

    const [thumb, setThumb] = useState(data?.thumb || '');
    const [loadedThumb, setLoadedThumb] = useState([]);
    const [images, setImages] = useState(data?.images || []);
    const [loadedImages, setLoadedImages] = useState([]);
    const [newUploadedImages, setNewUploadedImages] = useState([]);

    const [isActiveUpdateBtn, setIsActiveUpdateBtn] = useState(false);

    useEffect(() => {
        if (category !== '') {
            setBrandItems(
                categories
                    ?.find((item) => item?.title === category)
                    ?.brand?.map((brandItem) => ({
                        label: brandItem,
                        value: brandItem,
                    })),
            );
        }
    }, []);

    useEffect(() => {
        if (category !== '') {
            setBrandItems(
                categories
                    ?.find((item) => item?.title === category)
                    ?.brand?.map((brandItem) => ({
                        label: brandItem,
                        value: brandItem,
                    })),
            );
        }
    }, [category]);

    const handleCategoryChange = (category) => {
        setCategory(category);
        setBrand('');
    };

    const selectImage = async (type) => {
        let loadedImg;

        if (type === 'MULTIPLE') {
            if (loadedImages?.length >= 4) {
                dispatch(
                    showAlert({
                        title: 'Error',
                        icon: 'warning',
                        message: 'You can only upload up to 4 images',
                    }),
                );
                return;
            }

            loadedImg = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!loadedImg.canceled) {
                const uri = loadedImg.assets[0].uri;
                const type = `image/${uri.split('.').pop()}`;
                const name = uri.split('/').pop();
                setLoadedImages((prev) => [...prev, { uri, type, name }]);
                setNewUploadedImages((prev) => [...prev, uri]);
                setImages([...newUploadedImages, uri]);
            }
        } else {
            loadedImg = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
            });

            if (!loadedImg.canceled) {
                const uri = loadedImg.assets[0].uri;
                const type = `image/${uri.split('.').pop()}`;
                const name = uri.split('/').pop();
                setLoadedThumb([{ uri, type, name }]);
                setThumb(uri);
            }
        }
    };

    const handleDescriptionChange = (text) => {
        setDescription(text.split('\n'));
    };

    const handleUpdateProduct = async () => {
        const payload = {
            title,
            price,
            quantity,
            color,
            category,
            brand,
            description,
            images,
            thumb,
        };

        const isValid = validate(payload, setInvalidFields);

        if (isValid > 0) {
            return;
        }

        const finalPayload = {
            title,
            price,
            quantity,
            color,
            category,
            brand,
        };

        const formData = new FormData();

        for (let key of Object.keys(finalPayload)) {
            formData.append(key, payload[key]);
        }

        if (description.length > 0) {
            description.forEach((desc) => {
                formData.append('description', desc);
            });
        }

        if (loadedThumb.length > 0) {
            loadedThumb.forEach((thumb) => {
                formData.append('thumb', thumb);
            });
        }

        if (loadedImages.length > 0) {
            loadedImages.forEach((img) => {
                formData.append('images', img);
            });
        }

        dispatch(showLoading());
        const res = await apiUpdateProduct(formData, data?._id);
        dispatch(hideLoading());

        if (res?.success) {
            dispatch(
                showAlert({
                    title: 'Success',
                    icon: 'shield-checkmark',
                    message: 'Product have been updated successfully!',
                    onConfirm: () => onUpdateProduct(),
                }),
            );
        } else {
            dispatch(
                showAlert({
                    title: 'Error',
                    icon: 'warning',
                    message: 'Fail to update the product',
                }),
            );
        }
    };

    useEffect(() => {
        if (
            category !== '' ||
            brand !== '' ||
            images.length > 0 ||
            thumb !== ''
        ) {
            setInvalidFields([]);
        }
    }, [category, brand, images, thumb]);

    const handleDiscardProductChanges = () => {
        setTitle(data?.title);
        setPrice(data?.price);
        setQuantity(data?.quantity);
        setColor(data?.color);
        setCategory(data?.category);
        setBrand(data?.brand);
        setDescription(data?.description);
        setImages(data?.images);
        setThumb(data?.thumb);
        setLoadedImages([]);
        setLoadedThumb([]);
        setInvalidFields([]);
    };

    useEffect(() => {
        if (
            title !== data?.title ||
            price !== data?.price ||
            quantity !== data?.quality ||
            color !== data?.color
            // category.toLowerCase() !== data?.category?.toLowerCase() ||
            // brand.toLowerCase() !== data?.brand?.toLowerCase()
            // description.some(
            //     (item, index) => item !== data?.description[index],
            // ) ||
            // thumb !== data?.thumb ||
            // images.some((item, index) => item !== data?.images[index])
        ) {
            setIsActiveUpdateBtn(true);
        } else {
            setIsActiveUpdateBtn(false);
        }
    }, [
        title,
        price,
        quantity,
        color,
        category,
        brand,
        description,
        images,
        thumb,
    ]);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <KeyboardAvoidingView
                style={[styles.overlay]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 10}
            >
                <ScrollView
                    style={styles.scrContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <View style={styles.titleWrapper}>
                            <Text
                                style={[
                                    styles.text,
                                    styles.boldText,
                                    styles.errorText,
                                ]}
                            >
                                Edit product
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => dispatch(hideModal())}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.container}>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Product name
                            </Text>
                            <CustomedInput
                                value={title}
                                onChangeText={setTitle}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="title"
                            />
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Price (vnd)
                            </Text>
                            <CustomedInput
                                value={'' + price}
                                onChangeText={setPrice}
                                type="number"
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="price"
                            />
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Quantity
                            </Text>
                            <CustomedInput
                                value={'' + quantity}
                                onChangeText={setQuantity}
                                type="number"
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="quantity"
                            />
                        </View>
                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Color
                            </Text>
                            <CustomedInput
                                value={color}
                                onChangeText={setColor}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="color"
                            />
                        </View>
                        <View style={[styles.pickerWrapper]}>
                            <Text style={[styles.text, styles.boldText]}>
                                Category
                            </Text>
                            {invalidFields?.some(
                                (item) => item.name === 'category',
                            ) && (
                                <View style={styles.errorWrapper}>
                                    <Ionicons
                                        name="warning"
                                        size={18}
                                        color="#ee3131"
                                    />
                                    <Text style={styles.errorText}>
                                        {
                                            invalidFields?.find(
                                                (item) =>
                                                    item.name === 'category',
                                            )?.message
                                        }
                                    </Text>
                                </View>
                            )}
                            <ScrollView
                                style={[styles.pickerScrWrapper]}
                                horizontal
                                bounces={false}
                            >
                                <DropDownPicker
                                    style={[
                                        styles.picker,
                                        invalidFields?.some(
                                            (item) => item.name === 'category',
                                        ) && { borderColor: '#ee3131' },
                                    ]}
                                    dropDownContainerStyle={
                                        styles.dropDownContainer
                                    }
                                    open={categoryOpen}
                                    value={category}
                                    items={categories?.map((item) => ({
                                        label: item?.title,
                                        value: item?.title,
                                    }))}
                                    placeholder="Select a category"
                                    setOpen={setCategoryOpen}
                                    setValue={(value) =>
                                        handleCategoryChange(value)
                                    }
                                    maxHeight={80}
                                />
                            </ScrollView>
                        </View>

                        <View style={[styles.pickerWrapper]}>
                            <Text style={[styles.text, styles.boldText]}>
                                Brand
                            </Text>
                            {invalidFields?.some(
                                (item) => item.name === 'brand',
                            ) && (
                                <View style={styles.errorWrapper}>
                                    <Ionicons
                                        name="warning"
                                        size={18}
                                        color="#ee3131"
                                    />
                                    <Text style={styles.errorText}>
                                        {
                                            invalidFields?.find(
                                                (item) => item.name === 'brand',
                                            )?.message
                                        }
                                    </Text>
                                </View>
                            )}

                            <ScrollView
                                horizontal
                                style={styles.pickerScrWrapper}
                                scrollEnabled={false}
                            >
                                <DropDownPicker
                                    style={[
                                        styles.picker,
                                        invalidFields?.some(
                                            (item) => item.name === 'brand',
                                        ) && { borderColor: '#ee3131' },
                                    ]}
                                    dropDownContainerStyle={
                                        styles.dropDownContainer
                                    }
                                    open={brandOpen}
                                    value={brand.toLowerCase()}
                                    items={brandItems?.map((item) => ({
                                        ...item,
                                        value: item?.value?.toLowerCase(),
                                    }))}
                                    placeholder="Select a brand"
                                    setOpen={setBrandOpen}
                                    setValue={setBrand}
                                    maxHeight={80}
                                />
                            </ScrollView>
                        </View>

                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Description
                            </Text>
                            <CustomedInput
                                value={description.join('\n')}
                                onChangeText={handleDescriptionChange}
                                invalidFields={invalidFields}
                                setInvalidFields={setInvalidFields}
                                nameKey="description"
                                multiline
                            />
                        </View>

                        <View style={styles.imgWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Upload main image
                            </Text>
                            {invalidFields?.some(
                                (item) => item.name === 'thumb',
                            ) && (
                                <View style={styles.imgErrorWrapper}>
                                    <Ionicons
                                        name="warning"
                                        size={18}
                                        color="#ee3131"
                                    />
                                    <Text style={styles.errorText}>
                                        {
                                            invalidFields?.find(
                                                (item) => item.name === 'thumb',
                                            )?.message
                                        }
                                    </Text>
                                </View>
                            )}
                            {thumb !== '' ? (
                                <Image
                                    source={{ uri: thumb }}
                                    style={styles.img}
                                />
                            ) : (
                                <Image
                                    source={images.no_image}
                                    style={styles.img}
                                />
                            )}
                            <TouchableOpacity
                                style={[
                                    styles.imgCtrlBtn,
                                    invalidFields?.some(
                                        (item) => item.name === 'thumb',
                                    ) && { borderColor: '#ee3131' },
                                ]}
                                onPress={() => selectImage('SINGLE')}
                            >
                                <FontAwesome
                                    name="upload"
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.imgWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Upload more images (up to 4 images)
                            </Text>
                            {invalidFields?.some(
                                (item) => item.name === 'images',
                            ) && (
                                <View style={styles.imgErrorWrapper}>
                                    <Ionicons
                                        name="warning"
                                        size={18}
                                        color="#ee3131"
                                    />
                                    <Text style={styles.errorText}>
                                        {
                                            invalidFields?.find(
                                                (item) =>
                                                    item.name === 'images',
                                            )?.message
                                        }
                                    </Text>
                                </View>
                            )}
                            <View style={styles.productImgWrapper}>
                                {images.length > 0
                                    ? images.map((img, index) => (
                                          <Image
                                              key={index}
                                              source={{ uri: img }}
                                              style={styles.img}
                                          />
                                      ))
                                    : Array(4)
                                          .fill(null)
                                          .map((_, index) => (
                                              <Image
                                                  key={index}
                                                  source={images.no_image}
                                                  style={styles.img}
                                              />
                                          ))}
                            </View>
                            <TouchableOpacity
                                style={[
                                    styles.imgCtrlBtn,
                                    invalidFields?.some(
                                        (item) => item.name === 'images',
                                    ) && { borderColor: '#ee3131' },
                                ]}
                                onPress={() => selectImage('MULTIPLE')}
                            >
                                <FontAwesome
                                    name="upload"
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.bottomBtnWrapper}>
                        <TouchableOpacity
                            style={[styles.btn]}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleDiscardProductChanges();
                            }}
                        >
                            <Text style={[styles.text, styles.whiteText]}>
                                Discard
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.btn,
                                !isActiveUpdateBtn && {
                                    backgroundColor: '#d0d0d0',
                                },
                            ]}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleUpdateProduct();
                            }}
                            disabled={!isActiveUpdateBtn}
                        >
                            <Text style={[styles.text, styles.whiteText]}>
                                Update
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditProduct;

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        width: '100%',
        zIndex: 1,

        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 5,
    },
    scrContainer: {
        width: '100%',
    },
    header: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '50%',
        top: 0,
        right: 0,

        borderWidth: 1,
        borderColor: '#ee3131',
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        overflow: 'hidden',
    },

    titleWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    closeBtn: {
        backgroundColor: '#ee3131',
        padding: 6,
        borderBottomLeftRadius: 10,
    },
    pickerWrapper: {
        flex: 1,
        position: 'relative',
        width: '100%',
        marginBottom: 136,
    },
    pickerScrWrapper: {
        position: 'absolute',
        zIndex: 1,
        top: 22,
        height: 134,
    },
    picker: {
        backgroundColor: 'transparent',
        borderColor: '#666',
        borderRadius: 10,
        width: 260,
    },
    dropDownContainer: {
        backgroundColor: '#fff',
        borderColor: '#666',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 42,
    },
    infoWrapper: {
        width: '100%',
        marginBottom: 76,
        gap: 6,
    },
    imgWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 76,
        gap: 6,
    },
    imgErrorWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 52,
    },
    img: {
        width: 60,
        height: 60,
        borderRadius: 8,
        overflow: 'hidden',
        resizeMode: 'contain',
    },
    imgCtrlBtn: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white',
        padding: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#666',

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    productImgWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
    },

    bottomBtnWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        gap: 16,
        bottom: 12,
        right: 0,
    },
    btn: {
        padding: 12,
        backgroundColor: '#ee3131',
        borderRadius: 12,
    },
    errorWrapper: {
        position: 'absolute',
        top: 0,
        right: 58,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: -14,
    },
    errorText: {
        color: '#ee3131',
    },
    whiteText: {
        color: 'white',
    },
    text: {
        fontSize: 16,
    },
    boldText: {
        fontWeight: 'bold',
    },
    italicText: {
        fontStyle: 'italic',
    },
});
