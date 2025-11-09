// import React from 'react';
// import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
// import { WebView } from 'react-native-webview';

// const EmployeeNotice = () => {
//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
//             <WebView
//                 source={{ uri: 'http://docs.google.com/presentation/d/10bQD2ed1NYAs7lE8Cg8_IfOqLRZr8CSxxR7221LunCE/present' }}
//                 style={{ flex: 1 }}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 startInLoadingState={true}
//                 injectedJavaScript={`
//                     document.body.style.margin = '0';
//                     document.body.style.padding = '0';
//                     var iframe = document.querySelector('iframe');
//                     if (iframe) {
//                     iframe.style.width = '100vw';
//                     iframe.style.height = '100vh';
//                     iframe.style.border = 'none';
//                     }
//                     true;
//                 `}
//             />

//         </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         marginTop: StatusBar.currentHeight || 0,
//     },
// });

// export default EmployeeNotice;

import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { postData, getData } from '../services/api';

const EmployeeNotice = () => {
    const navigation = useNavigation()
    const [employeeId, setEmployeeId] = useState(0)
    const [courseid, setcourseid] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
    }, [])

    const getStoredData = async () => {
        try {
            const Id = await AsyncStorage.getItem('empid')
            if (Id !== null) {
                setEmployeeId(Id)
                const result = await getData(`EmployeeNew/GetBillNoticeForEmployee?EmployeeId=${Id}`)
                console.log(result)
                if (result != "No Data Found") {
                    setData(result)
                    setLoading(false);
                } else {
                    setLoading(false);
                    setData([])
                    Alert.alert("No Data Found");
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    function abc(_itembody, _itemdate, _itemNoticeTitle, _itemNoticeNumber, _itemDocumentPath, _itemPublishFromDate) {
        navigation.navigate('Employee Notice Details', {
            noticeBody: _itembody,
            noticeDate: _itemdate,
            noticetitle: _itemNoticeTitle,
            noticeNo: _itemNoticeNumber,
            DocumentPath: _itemDocumentPath,
            publishDate: _itemPublishFromDate
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => abc(item.NoticeBody, item.NoticeDate, item.NoticeTitle, item.NoticeNumber, item.DocumentPath, item.PublishFromDate)} style={{
                                    backgroundColor: '#fff', shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 10,
                                    borderRadius: 10,
                                    marginBottom: 10
                                }} >
                                    <View style={{ borderColor: '#00517c', borderWidth: 1, margin: 5, borderRadius: 5 }}>
                                        <View >
                                            <Text style={styles.noticetitle}>{item.NoticeTitle}</Text>
                                            <Text style={styles.noticenumber} >Notice No : {item.NoticeNumber}</Text>
                                            <View style={styles.noticedate}>
                                                <Text>Notice Date : {item.NoticeDate.substr(0, 10)}</Text>
                                                <Text>Posted : {item.PublishFromDate.substr(0, 10)}</Text>
                                            </View>
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
 });

export default EmployeeNotice;


/*
================= Previous Code (Commented) =================

import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { postData, getData } from '../services/api';

const EmployeeNotice = () => {
    const navigation = useNavigation()
    const [employeeId, setEmployeeId] = useState(0)
    const [courseid, setcourseid] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
    }, [])

    const getStoredData = async () => {
        try {
            const Id = await AsyncStorage.getItem('empid')
            if (Id !== null) {
                setEmployeeId(Id)
                const result = await getData(`EmployeeNew/GetBillNoticeForEmployee?EmployeeId=${Id}`)
                if (result != "No Data Found") {
                    setData(result)
                    setLoading(false);
                } else {
                    setLoading(false);
                    setData([])
                    Alert.alert("No Data Found");
                }

            }
        } catch (e) {
            console.log(e)
        }
    }

    function abc(_itembody, _itemdate, _itemNoticeTitle, _itemNoticeNumber, _itemDocumentPath, _itemPublishFromDate) {
        navigation.navigate('Employee Notice Details', {
            noticeBody: _itembody,
            noticeDate: _itemdate,
            noticetitle: _itemNoticeTitle,
            noticeNo: _itemNoticeNumber,
            DocumentPath: _itemDocumentPath,
            publishDate: _itemPublishFromDate
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => abc(item.NoticeBody, item.NoticeDate, item.NoticeTitle, item.NoticeNumber, item.DocumentPath, item.PublishFromDate)} style={{
                                    backgroundColor: '#fff', shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.25,
                                    shadowRadius: 3.84,
                                    elevation: 10,
                                    borderRadius: 10,
                                    marginBottom: 10
                                }} >
                                    <View style={{ borderColor: '#00517c', borderWidth: 1, margin: 5, borderRadius: 5 }}>
                                        <View >
                                            <Text style={styles.noticetitle}>{item.NoticeTitle}</Text>
                                            <Text style={styles.noticenumber} >Notice No : {item.NoticeNumber}</Text>
                                            <View style={styles.noticedate}>
                                                <Text>Notice Date : {item.NoticeDate.substr(0, 10)}</Text>
                                                <Text>Posted : {item.PublishFromDate.substr(0, 10)}</Text>
                                            </View>
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
============================================================
*/
