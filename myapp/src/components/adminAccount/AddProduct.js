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
import { apiCreateProduct } from '../../apis/product';

const AddProduct = ({ onAddProduct = () => {} }) => {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.app);
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [brandItems, setBrandItems] = useState([]);
    const [description, setDescription] = useState([]);
    const [invalidFields, setInvalidFields] = useState([]);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [brandOpen, setBrandOpen] = useState(false);
    const [loadedImages, setLoadedImages] = useState([]);
    const [loadedThumb, setLoadedThumb] = useState({});
    const [images, setImages] = useState([]);
    const [thumb, setThumb] = useState('');

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
                setImages((prev) => [...prev, uri]);
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
                setLoadedThumb({ uri, type, name });
                setThumb(uri);
            }
        }
    };

    const handleDescriptionChange = (text) => {
        if (/^ *$/.test(text) === false) {
            const splitLines = text.trim().split('\n');
            if (splitLines[splitLines.length - 1] === '') {
                splitLines.pop();
            }
            setDescription(splitLines);
        }
    };

    const handleAddProduct = async () => {
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

        if (loadedThumb) {
            formData.append('thumb', loadedThumb);
        }

        if (loadedImages.length > 0) {
            loadedImages.forEach((img) => {
                formData.append('images', img);
            });
        }

        dispatch(showLoading());
        const res = await apiCreateProduct(formData);
        dispatch(hideLoading());

        if (res?.success) {
            dispatch(
                showAlert({
                    title: 'Success',
                    icon: 'shield-checkmark',
                    message: 'Product have been added successfully!',
                    onConfirm: () => {
                        onAddProduct();
                    },
                }),
            );
        } else {
            dispatch(
                showAlert({
                    title: 'Error',
                    icon: 'warning',
                    message: 'Fail to add the product',
                }),
            );
        }

        setTitle('');
        setPrice(0);
        setQuantity(0);
        setColor('');
        setCategory('');
        setBrand('');
        setDescription([]);
        setImages([]);
        setThumb('');
        setLoadedImages([]);
        setLoadedThumb({});
    };

    const handleDiscardProductChange = () => {
        setTitle('');
        setPrice(0);
        setQuantity(0);
        setColor('');
        setCategory('');
        setBrand('');
        setDescription([]);
        setImages([]);
        setThumb('');
        setLoadedImages([]);
        setLoadedThumb({});

        setInvalidFields([]);
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
                                Add new product
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
                                value={price}
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
                                value={quantity}
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
                                style={[
                                    styles.pickerScrWrapper,
                                    { height: categoryOpen ? 134 : 'auto' },
                                    { zIndex: 2 },
                                ]}
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
                                    dropDownContainerStyle={[
                                        styles.dropDownContainer,
                                    ]}
                                    open={categoryOpen}
                                    value={category}
                                    items={categories?.map((item) => ({
                                        label: item?.title,
                                        value: item?.title,
                                    }))}
                                    placeholder="Select a category"
                                    setOpen={setCategoryOpen}
                                    setValue={setCategory}
                                    maxHeight={84}
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
                                style={[
                                    styles.pickerScrWrapper,
                                    { height: brandOpen ? 134 : 'auto' },
                                ]}
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
                                    value={brand}
                                    items={brandItems}
                                    placeholder="Select a brand"
                                    setOpen={setBrandOpen}
                                    setValue={setBrand}
                                    maxHeight={84}
                                />
                            </ScrollView>
                        </View>

                        <View style={styles.infoWrapper}>
                            <Text style={[styles.text, styles.boldText]}>
                                Description
                            </Text>
                            <CustomedInput
                                value={
                                    description.length === 0 ? '' : description
                                }
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
                        <View style={[styles.btnWrapper]}>
                            <TouchableOpacity
                                style={[styles.btn]}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    handleDiscardProductChange();
                                }}
                            >
                                <Text style={[styles.text, styles.whiteText]}>
                                    Discard
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btn]}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    handleAddProduct();
                                }}
                            >
                                <Text style={[styles.text, styles.whiteText]}>
                                    Add
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AddProduct;

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
        width: '60%',
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
        marginBottom: 66,
    },
    pickerScrWrapper: {
        position: 'absolute',
        zIndex: 1,
        top: 22,
    },
    picker: {
        backgroundColor: '#fff',
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
        marginBottom: 12,
        gap: 6,
    },
    imgWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 12,
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
    },
    btnWrapper: {
        width: '100%',
        marginBottom: 16,
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 16,
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
