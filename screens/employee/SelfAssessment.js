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
const SelfAssessment = () => {
    const [loading, setLoading] = useState(true);
    const [Session, setSession] = useState([])
    const [Sessionvalue, setSessionValue] = useState(0);

    const [feedback, setFeedback] = useState([])
    const [feedbackId, setFeedbackId] = useState(0)
    const [name, setName] = useState('');
    const [data, Setdata] = useState([])

    const [teacherId, setTeacherId] = useState(0);

    useEffect(() => {
        getLocalData()
        bindSession()
    }, [])
    const getLocalData = async () => {
        try {
            const value1 = await AsyncStorage.getItem('empid')
            setTeacherId(value1)
            //setLoading(false);
            // const value2 = await AsyncStorage.getItem('department')
            // const value3 = await AsyncStorage.getItem('designation')
            const value4 = await AsyncStorage.getItem('firstname')
            const value5 = await AsyncStorage.getItem('middlename')
            const value6 = await AsyncStorage.getItem('lastname')
            // console.log(value1)
            // console.log(value2)
            // console.log(value3)
            // console.log(value4)
            // console.log(value5)
            // console.log(value6)
            setName(value4 + ' ' + value6)
            setLoading(false);

        } catch (e) {
            console.log(e)
        }
    }

    //bindsessionnew
    const bindSession = async () => {
        try {
            const sessiondata = await getData(`EmployeeNew/BindSession`);
            if (Array.isArray(sessiondata) && sessiondata.length > 0) {
                const sessionItems = sessiondata.map((item) => ({
                    label: item.SessionName,
                    value: item.SessionId,
                }));
                setSession(sessionItems);

                if (sessionItems.length > 0) {
                    setSessionValue(sessionItems[0].value);
                }
            } else {
                setSession([]);
                Alert.alert("No Data Found", "No session data available.");
            }
        } catch (error) {
            console.log("Error fetching session data:", error);
            Alert.alert("Error", "Failed to fetch session data.");
        }
    };
    //bindfeedback
    const bindFeedback = async (session) => {

        if (Sessionvalue > session) {
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
        setLoading(true);
        const employeedata = await getData(`EmployeeNew/LoadTeacherFeedbackTeachersGetAll?TeacherId=${teacherId}&GivenByTeacherId=${teacherId}&StudentFeedbackMasterId=${feedbackId}`);
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
                            data={Session}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Session *"
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            search
                            searchPlaceholder="Search ..."
                            value={Sessionvalue}
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
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            search
                            searchPlaceholder="Search ..."
                            value={feedbackId}
                            onChange={(item) => {
                                setFeedbackId(item.value);
                            }}
                            disable={!feedback.length}
                        />
                        <Text style={{ margin: 16, }}>Teacher : {name}</Text>
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
            <Text style={styles.indicatorText}>Loading ...</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
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
    dropdownContainer: {
        borderRadius: 8,
        borderColor: '#ddd',
        borderWidth: 1,
        marginTop: 5,
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    placeholderStyle: {
        fontSize: 14,
        color: '#999',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: '#333',
    },
    icon: {
        marginRight: 5,
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
export default SelfAssessment