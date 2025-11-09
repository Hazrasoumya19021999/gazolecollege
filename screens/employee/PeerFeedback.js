import {
    View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, StatusBar,
    SafeAreaView, Image, ActivityIndicator, BackHandler, ScrollView,
    Alert
} from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { Dropdown } from 'react-native-element-dropdown';

import { postData, getData } from '../services/api';

const PeerFeedback = () => {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState([])
    const [SessionValue, setSessionValue] = useState(0);
    const [Teacher, setTeacher] = useState([])
    const [TeacherId, setTeacherId] = useState(null);
    const [feedback, setFeedback] = useState([])
    const [feedbackId, setFeedbackId] = useState(0)
    const [data, Setdata] = useState([])
    const [EmpId, setEmpId] = useState(0);

    useEffect(() => {
        getLocalData()
        bindSession()
        bindTeacher()
    }, [])

    const getLocalData = async () => {
        try {
            const value1 = await AsyncStorage.getItem('empid')
            setEmpId(value1)
            setLoading(false);

        } catch (e) {
            console.log(e)
        }
    }
    //bindsession
    const bindSession = async () => {
        const sessiondata = await getData(`EmployeeNew/BindSession`);
        const sessionItems = sessiondata.map((item) => ({
            label: item.SessionName,
            value: item.SessionId,
        }));
        setSession(sessionItems)
        if (sessionItems.length > 0) {
            setSessionValue(sessionItems[0].value);
        }
        setLoading(false);
    }
    //bindsession
    const bindTeacher = async () => {
        const teacherdata = await getData(`EmployeeNew/BindTeacherStaff`);
        const teacherItems = teacherdata.map((item) => ({
            label: item.FullName,
            value: item.EmployeeId,
        }));
        setTeacher(teacherItems)
        setLoading(false);
    }
    //bindfeedback
    const bindFeedback = async (session) => {
        console.log('Session ', session)
        if (SessionValue > session) {
            const feedbackdata = await getData(`EmployeeNew/LoadFeedbackMaster?SessionId=${session}&FeedbackFor=""&FeedbackName=""`);

            const feedbackdataItems = feedbackdata.map((item) => ({
                label: item.FeedbackMasterName,
                value: item.StudentFeedbackMasterId,
            }));
            setFeedback(feedbackdataItems)
        } else {
            setFeedback([])
        }
    }
    const GetEmployeeData = async () => {
        // Validate mandatory fields
        if (!feedbackId) {
            Alert.alert("Alert", "Please select feedback");
            return;
        }
        if (!TeacherId) {
            Alert.alert("Alert", "Please select teacher");
            return;
        }
        setLoading(true);
        const employeedata = await getData(`EmployeeNew/LoadTeacherFeedbackTeachersGetAll?TeacherId=${TeacherId}&GivenByTeacherId=${EmpId}&StudentFeedbackMasterId=${feedbackId}`);
        console.log('Employee Data', employeedata)
        if (employeedata != "No Data Found") {
            Setdata(employeedata)
            setLoading(false);
        } else {
            setLoading(false);
            Setdata([])
            Alert.alert("No Data Found");
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <View>
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={session}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Session *"
                            search
                            searchPlaceholder="Search Session..."
                            value={SessionValue}
                            onChange={(item) => {
                                setSessionValue(item.value);
                                bindFeedback(item.value)
                            }}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={feedback}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Feedback *"
                            search
                            searchPlaceholder="Search ..."
                            value={feedbackId}
                            onChange={(item) => {
                                setFeedbackId(item.value);
                            }}
                            disable={!feedback.length}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Teacher}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Teacher *"
                            search
                            searchPlaceholder="Search Teacher..."
                            value={TeacherId}
                            onChange={(item) => {
                                setTeacherId(item.value);
                            }}
                        />
                        <TouchableOpacity
                            onPress={() => GetEmployeeData()}
                            style={styles.button}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>
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
                                                <Text style={styles.noticetitle}>Teacher Name : </Text>
                                                <Text style={styles.noticenumber}>{item.TeacherName}</Text>
                                                <Text style={styles.noticetitle} >Feedback Submission Status : </Text>
                                                {
                                                    item.FeedbackStatus == "PENDING" ? 
                                                    <Text style={styles.listunpaid}>{item.FeedbackStatus}</Text>
                                                    :
                                                    <Text style={styles.listpaid}>{item.FeedbackStatus}</Text>
                                                }
                                                
                                            </View>
                                            <TouchableOpacity style={styles.button}>
                                                <Text style={styles.buttonText}>Proceed</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </TouchableOpacity>

                                </View>}
                        />
                    </View>

            }
        </SafeAreaView>
    )
}
function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Peer Feedback...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
    },
    dropdown: {
        marginTop: -16,
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
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
        fontSize: 18,
        paddingLeft: 5,
        paddingRight: 5,
        fontWeight: 'bold',
        color: '#00517c'
    },
    noticenumber: {
        fontSize: 15,
        paddingRight: 5,
        paddingLeft: 5,
        color: '#000',
        fontWeight: 'bold',
        margin: 10,
        backgroundColor: 'white', // For visibility
        borderWidth: 2,  // Apply a 2px border on all sides
        borderColor: '#00517c', // Blue border color
        borderRadius: 5, // Round the corners with a radius of 10
    },
    icon: {
        marginRight: 5,
    },
    listpaid: {
        fontSize: 15,
        paddingRight: 5,
        paddingLeft: 5,
        color: 'green',
        fontWeight: 'bold',
        margin: 10,
        backgroundColor: 'white', // For visibility
        borderWidth: 2,  // Apply a 2px border on all sides
        borderColor: '#00517c', // Blue border color
        borderRadius: 5, // Round the corners with a radius of 10
    },
    listunpaid: {
       fontSize: 15,
        paddingRight: 5,
        paddingLeft: 5,
        color: 'red',
        fontWeight: 'bold',
        margin: 10,
        backgroundColor: 'white', // For visibility
        borderWidth: 2,  // Apply a 2px border on all sides
        borderColor: '#00517c', // Blue border color
        borderRadius: 5, // Round the corners with a radius of 10
    },
    button: {
        backgroundColor: '#00517c',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        borderColor: '#00517c',
        borderWidth: 1
    },
    buttonText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
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
export default PeerFeedback