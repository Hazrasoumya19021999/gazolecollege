import { View, Text, FlatList, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'

import { postData, getData } from '../services/api';

const StudentMarksView = () => {
    const navigation = useNavigation()
    const [studentid, setStudentId] = useState(0)
    const [courseid, setcourseid] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStoredData()
        const value = AsyncStorage.getItem('studenttokenid')
        console.log(value)
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
                const result = await getData(`StudentNewReactNative/usp_StudentMarksUpdate_UGBCA_ForStudent?StudentId=${value}`)
                if (result != "No Data Found") {
                    setData(result)
                    //console.log(result)
                    setLoading(false);
                } else {
                    setData([])
                    setLoading(false);
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
                                            <View style={styles.noticedate}>
                                                <Text style={styles.noticetitle}>Exam Name : {item.UGExamName}</Text>
                                            </View>
                                            <View style={styles.noticedate}>
                                                <Text style={styles.noticenumber} >Obtained Marks :</Text>
                                                <Text style={styles.noticetitle2}>{parseFloat(item.MarksObtain).toFixed(2)}</Text>
                                            </View>
                                            <View style={styles.noticedate}>
                                                <Text style={styles.noticenumber}>Passing Status :</Text>
                                                <Text style={styles.noticetitle2}>{item.ExamPassingStatusName}</Text>
                                            </View>
                                            <View style={styles.noticedate}>
                                                <Text style={styles.noticenumber}>Marksheet{"\n"}Handover Date :</Text>
                                                <Text style={styles.noticetitle2}>{item.MarksheetHandoverOn}</Text>
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
            <Text style={styles.indicatorText}>Loading Student Marks....</Text>
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
        justifyContent: 'flex-start',
        flexDirection: 'row',
        padding: 5,
        flexWrap: 'wrap'
    },
    noticetitle: {
        fontSize: 17,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        color: '#00517c'
    },
    noticetitle2: {
        fontSize: 13,
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

export default StudentMarksView