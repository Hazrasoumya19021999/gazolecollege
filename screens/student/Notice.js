import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

const Notice = () => {
    const navigation = useNavigation()
    const [studentid, setStudentId] = useState(0)
    const [courseid, setcourseid] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
    }, [])

    const getStoredData = async () => {
        try {
            const value = await AsyncStorage.getItem('studentid')
            const value1 = await AsyncStorage.getItem('CourseId')
            if (value !== null && value1 != null) {
                setStudentId(value)
                setcourseid(value1)
                console.log("Notice data")
                console.log(value)
                console.log(value1)
                const api = 'https://gmg.ac.in//api/api/Student/GetBillNoticeForStudent?StudentId=' + parseInt(value) + '&CourseId=' + parseInt(value1)
                console.log(api)
                let result = await fetch(api)
                result = await result.json()
                setData(result)
                console.log(result)
                console.log('https://gmg.ac.in//api/api/Student/GetBillNoticeForStudent?StudentId=' + parseInt(value) + '&CourseId=' + parseInt(value1))
                setLoading(false);
            }
        } catch (e) {
            console.log(e)
        }
    }

    function abc(_itembody, _itemdate, _itemNoticeNumber, _itemDocumentPath) {
        console.log( _itembody,
            _itemdate,
             _itemNoticeNumber,
           _itemDocumentPath)
        navigation.navigate('NoticeDetails', {
            noticeBody: _itembody,
            noticeDate: _itemdate,
            noticeNo: _itemNoticeNumber,
            DocumentPath: _itemDocumentPath
        });
    }



    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="dark-content" hidden={false} backgroundColor="#d5d5eb" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => abc(item.NoticeBody, item.NoticeDate.split('T')[0].toString(), item.NoticeTitle, item.DocumentPath)} style={{
                                    backgroundColor: '#e9eef2', shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 10,
                                    borderRadius: 10,
                                    marginBottom: 10
                                }} >
                                    <View style={{ flexDirection: 'row', borderColor: '#7092db', borderWidth: 1, margin: 5, borderRadius: 10 }}>
                                        <Text style={styles.noticedate}>{item.NoticeDate.split('T')[0].toString()}</Text>
                                        <View >
                                            <Text style={styles.noticetitle}>{item.NoticeTitle}</Text>
                                            <Text style={styles.noticenumber} >Notice No : {item.NoticeNumber}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>}
                    />
            }
        </SafeAreaView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Notice...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    noticeoutline: {

    },
    noticedate: {
        backgroundColor: '#7092db',
        padding: 10,
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
        borderTopRightRadius: 90,
        borderBottomRightRadius: 90,
        textAlignVertical: 'center',
        borderTopLeftRadius: 17,
        borderBottomLeftRadius: 17
    },
    noticetitle: {
        fontSize: 17,
        paddingLeft: 20,
        paddingRight: 100,
        fontWeight: 'bold',
        color: '#326789'
    },
    noticenumber: {
        fontSize: 14,
        textAlign: 'center',
        paddingRight: 100,
        color: '#e65c4f',
        fontWeight: 'bold'
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {},
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
        color: 'black'
    },
});

export default Notice