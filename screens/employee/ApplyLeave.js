import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

import { postData, getData } from '../services/api';

const ApplyLeave = () => {
    const navigation = useNavigation()
    const [employeeId, setEmployeeId] = useState(0)
    const [courseid, setcourseid] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
        // const value = AsyncStorage.getItem('studenttokenid')
        // console.log(value)
    }, [])

    const getStoredData = async () => {
        try {
            const Id = await AsyncStorage.getItem('empid')
            if (Id !== null) {
                setEmployeeId(Id)
                const result = await getData(`EmployeeNew/LoadStockBalance?EmployeeId=${Id}`)
                if (result != "No Data Found") {
                    setData(result)
                    //console.log(result)
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
                                <TouchableOpacity 
                                style={{
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
                                            <Text style={styles.noticetitle}>Leave : {item.LeaveTypeName}</Text>
                                            <Text style={styles.noticenumber} >Leave Credit : {item.LeaveCredit}</Text>
                                            <Text style={styles.noticenumber} >Leave Taken : {item.LeaveTaken}</Text>
                                            <Text style={styles.noticenumber} >Leave Balance : {item.LeaveBalance}</Text>
                                            {/* <View style={styles.noticedate}>
                                                <Text>Notice Date : {item.NoticeDate.substr(0, 10)}</Text>
                                                <Text>Posted : {item.PublishFromDate.substr(0, 10)}</Text>
                                            </View> */}
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
            <Text style={styles.indicatorText}>Loading Leave...</Text>
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
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5
    },
    noticetitle: {
        fontSize: 17,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        color: '#00517c'
    },
    noticenumber: {
        fontSize: 14,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#000',
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
    },
});

export default ApplyLeave