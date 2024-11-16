import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const dots = (
    <MaterialCommunityIcons name="dots-horizontal" size={20} color="black" />
);

const pagination = ({
    currentPage = 1,
    totalCount = 0,
    onCurrentPageChange = () => {},
}) => {
    const [ownedCurrentPage, setOwnedCurrentPage] = useState(currentPage);
    const [totalPages, setTotalPages] = useState(Math.ceil(totalCount / 10));
    const [paginationArray, setPaginationArray] = useState([]);

    const generateArray = (length) => {
        return Array.from({ length }, (_, index) => index + 1);
    };

    const generatePaginationArray = (totalPages, ownedCurrentPage) => {
        if (totalPages <= 6) {
            return generateArray(totalPages);
        }

        if (totalPages > 6) {
            if (ownedCurrentPage <= 3) {
                return [1, 2, 3, dots, totalPages];
            }

            if (ownedCurrentPage > 3 && ownedCurrentPage < totalPages - 2) {
                return [
                    1,
                    dots,
                    ownedCurrentPage - 1,
                    ownedCurrentPage,
                    ownedCurrentPage + 1,
                    dots,
                    totalPages,
                ];
            }

            if (ownedCurrentPage >= totalPages - 2) {
                return [1, dots, totalPages - 2, totalPages - 1, totalPages];
            }
        }
    };

    const handleTurnToPreviousPage = () => {
        if (ownedCurrentPage > 1) {
            setOwnedCurrentPage(ownedCurrentPage - 1);
            onCurrentPageChange(ownedCurrentPage - 1);
        }
    };

    const handleTurnToNextPage = () => {
        if (ownedCurrentPage < totalPages) {
            setOwnedCurrentPage(ownedCurrentPage + 1);
            onCurrentPageChange(ownedCurrentPage + 1);
        }
    };

    useEffect(() => {
        const NumOfPages = Math.ceil(totalCount / 10);
        setTotalPages(NumOfPages);
        setPaginationArray(generatePaginationArray(NumOfPages, currentPage));
        setOwnedCurrentPage(currentPage);
    }, [totalCount, currentPage]);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.ctrlWrapper}
                onPress={handleTurnToPreviousPage}
            >
                <Ionicons name="chevron-back-outline" size={20} color="black" />
            </TouchableOpacity>
            {paginationArray.length > 0 &&
                paginationArray.map((item, index) =>
                    item === dots ? (
                        <View style={styles.wrapper} key={index}>
                            {dots}
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[
                                styles.wrapper,
                                ownedCurrentPage === item &&
                                    styles.activeWrapper,
                            ]}
                            key={index}
                            onPress={() => {
                                setOwnedCurrentPage(item);
                                onCurrentPageChange(item);
                            }}
                        >
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    ),
                )}
            <TouchableOpacity
                style={styles.ctrlWrapper}
                onPress={handleTurnToNextPage}
            >
                <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="black"
                />
            </TouchableOpacity>
        </View>
    );
};

export default pagination;

const styles = StyleSheet.create({
    container: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    wrapper: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    ctrlWrapper: {
        width: 40,
        height: 40,

        justifyContent: 'center',
        alignItems: 'center',
    },
    activeWrapper: {
        borderWidth: 1,
        borderColor: '#000',
    },
    text: {
        fontSize: 16,
    },
});
