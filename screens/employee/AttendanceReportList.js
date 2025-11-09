import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, BackHandler, Alert,
    Image, TouchableOpacity, Linking, ActivityIndicator, FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'


const AttendanceReportList = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true);
    const[attendanceRecords,setAttendanceRecords] = useState([])

    const { data } = route.params;

    useEffect(() => {
        console.log("route",route)
        console.log("attendance data",data)
        setAttendanceRecords(data)
        setLoading(false);
    }, [])

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
                                <TouchableOpacity style={{
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
                                            <Text style={styles.noticetitle}>{item.StudentName}</Text>
                                            <Text style={styles.noticenumber} >Student Code : {item.StudentCode}</Text>
                                            <View style={styles.noticedate}>
                                                <Text>Total Class : {item.TotalClass}</Text>
                                                <Text>Total Present : {item.TotalPresent}</Text>
                                                <Text>Total Percenttage : {item.TotalPercentage}</Text>
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
            <Text style={styles.indicatorText}>Loading ...</Text>
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
        // justifyContent: 'space-between',
        flexDirection: 'column',
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
export default AttendanceReportList