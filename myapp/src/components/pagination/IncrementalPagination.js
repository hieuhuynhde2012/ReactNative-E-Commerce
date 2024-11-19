import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useState, useEffect } from 'react';

const IncrementalPagination = ({
    data = [],
    itemPerPage = 1,
    onChangeShownData = () => {},
}) => {
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isShowSeeMore, setisShowSeeMore] = useState(true);

    const calculateTotalPage = useCallback(
        (totalUser, itemPerPage) => {
            return Math.ceil(totalUser / itemPerPage);
        },
        [itemPerPage],
    );

    const handlePagination = (key) => {
        if (key === 'next' && page < totalPage) {
            const nextPage = page + 1;
            setPage(nextPage);
            onChangeShownData(data.slice(0, nextPage * itemPerPage));
        } else if (key === 'prev' && page > 1) {
            const prevPage = page - 1;
            setPage(prevPage);
            onChangeShownData(data.slice(0, prevPage * itemPerPage));
        } else return;
    };

    useEffect(() => {
        setTotalPage(calculateTotalPage(data.length, itemPerPage));
    }, [data]);

    useEffect(() => {
        if (page === 1) {
            setisShowSeeMore(true);
        } else if (page === totalPage) {
            setisShowSeeMore(false);
        }
    }, [page]);

    return (
        <View style={styles.container}>
            {isShowSeeMore ? (
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => handlePagination('next')}
                >
                    <Text style={[styles.text, styles.whiteText]}>
                        See more
                    </Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => handlePagination('prev')}
                >
                    <Text style={[styles.text, styles.whiteText]}>
                        See less
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default IncrementalPagination;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: '32%',
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#ee3131',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 20,
    },
    boldText: {
        fontWeight: 'bold',
    },
    whiteText: {
        color: 'white',
    },
});
