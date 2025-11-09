import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Modal, Pressable, Linking } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const EmployeeMenu = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalperformanceVisible, setModalPerformanceVisible] = useState(false);

    const createTwoButtonAlert = () =>
        Alert.alert(
            'Alert',
            'Coming Soon',
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ]
        );

    const openPlayStore = async () => {
        const packageName = 'com.gazolecollege';
        const playStoreAppUrl = `market://details?id=${packageName}`;
        const playStoreWebUrl = `https://play.google.com/store/apps/details?id=${packageName}`;

        try {
            const supported = await Linking.canOpenURL(playStoreAppUrl);
            if (supported) {
                await Linking.openURL(playStoreAppUrl);
            } else {
                await Linking.openURL(playStoreWebUrl);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not open the Play Store.');
        }
    };

    const dailyReportOptions = [
        {
            name: 'Monthly Biometric Attendance Count Report(Teaching)',
            onPress: () => navigation.navigate('MonthlyBiometricAttendanceCountReportTeaching')
        },
        {
            name: 'Teachers Class Taken Report',
            onPress: () => navigation.navigate('TeacherClassTakenReport')
        },
        {
            name: 'Biometric in and out Time Report(Teaching)',
            onPress: () => navigation.navigate('EmployeeBiometricAttendanceReportInDetails1')
        },
        {
            name: 'Monthly Performance List (All)',
            onPress: () => navigation.navigate('MonthlyPerformanceList')
        },
        {
            name: 'Monthly Biometric Attendance Count Report(Non-Teaching)',
            onPress: () => navigation.navigate('MonthlyBiometricAttendanceCountReportNonTeaching')
        },
        {
            name: 'Biometric in and out Time Report(Non-Teaching)',
            onPress: () => navigation.navigate('BiometricInoutReportNonTeaching')
        },
        {
            name: 'Daily Student Attendance Report',
            onPress: () => navigation.navigate('DailyStudentAttedanceReport')
        },
    ];

    const myperformanceOptions = [
        {
            name: 'Monthly Performance Entry',
            onPress: () => navigation.navigate('MyPerformanceEntry')
        },
        {
            name: 'Monthly Performance List',
            onPress: () => navigation.navigate('MonthlyPerformanceListTeacherWise')
        },

    ];

    return (
        <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Employee Profile')}>
                    <Image source={require('../assets/myprofile.png')} style={styles.image} />
                    <Text style={[styles.text]} >My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    {/* onPress={() => navigation.navigate('Student Attendance')} */}
                    <Image source={require('../assets/scholarship.png')} style={styles.image} />
                    <Text style={styles.text} >Class Attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    {/* onPress={() => navigation.navigate('My Class')} */}
                    <Image source={require('../assets/class.png')} style={styles.image} />
                    <Text style={styles.text} >My Class</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('MonthlyPerformanceListTeacherWise')} >
                    <Image source={require('../assets/book.png')} style={styles.image} />
                    <Text style={styles.text} >My Performance</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.inner} onPress={() => setModalPerformanceVisible(true)}>
                    <Image source={require('../assets/book.png')} style={styles.image} />
                    <Text style={styles.text} >My Performance</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    {/* onPress={() => navigation.navigate('Attendance summary Report')} */}
                    <Image source={require('../assets/report.png')} style={styles.image} />
                    <Text style={styles.text} >Students Attendance Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Employee Notice')}>
                    <Image source={require('../assets/noticeboard.png')} style={styles.image} />
                    <Text style={styles.text} >Employee Notice</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('College Directory')}>
                    <Image source={require('../assets/college.png')} style={styles.image} />
                    <Text style={styles.text} >College Directory</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('V-Card')}>
                    <Image source={require('../assets/identity-card.png')} style={styles.image} />
                    <Text style={styles.text} >V-Card</Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity style={styles.inner} onPress={() => setModalVisible(true)}>
                    <Image source={require('../assets/about.png')} style={styles.image} />
                    <Text style={styles.text} >View Daily Report</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Attendance History')}>
                    <Image source={require('../assets/history.png')} style={styles.image} />
                    <Text style={styles.text} >My Biometric Report</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Apply Leave')}>
                    <Image source={require('../assets/Fees.png')} style={styles.image} />
                    <Text style={styles.text} >Leave Count</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Meeting')}>
                    <Image source={require('../assets/meeting.png')} style={styles.image} />
                    <Text style={styles.text} >Meeting</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Employee Notice')}>
                    <Image source={require('../assets/noticeboard.png')} style={styles.image} />
                    <Text style={styles.text} >College Notice</Text>
                </TouchableOpacity> */}
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Faculty Activity')}>
                    <Image source={require('../assets/attendance.png')} style={styles.image} />
                    <Text style={styles.text} >Activities</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Employee Profile')}>
                    <Image source={require('../assets/myprofile.png')} style={styles.image} />
                    <Text style={[styles.text]} >My Profile</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Download Document')}>
                    <Image source={require('../assets/downloads.png')} style={styles.image} />
                    <Text style={styles.text} >Download Document</Text>
                </TouchableOpacity> */}
            </View>

            {/* onPress={() => navigation.navigate("Change Password")} */}
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    <Image source={require('../assets/password.png')} style={styles.image} />
                    <Text style={styles.text} >Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate("About Us")}>
                    <Image source={require('../assets/about.png')} style={styles.image} />
                    <Text style={styles.text} >About College</Text>
                </TouchableOpacity>
                  <TouchableOpacity style={styles.inner} onPress={() => openPlayStore()}>
                    <Image source={require('../assets/feedback.png')} style={[styles.image]} />
                    <Text style={styles.text} >Rate App</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
              
                <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity>
            </View>
            {/* <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate("TestOne")}>
                    <Image source={require('../assets/password.png')} style={styles.image} />
                    <Text style={styles.text} >test</Text>
                </TouchableOpacity>
            </View> */}

            {/* Daily Report Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Daily Reports</Text>
                        {dailyReportOptions.map((option, index) => (
                            <Pressable
                                key={index}
                                style={[styles.modalButton, styles.buttonClose]}
                                onPress={() => {
                                    option.onPress();
                                    setModalVisible(!modalVisible);
                                }}>
                                <Text style={styles.modalText}>{option.name}</Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={[styles.modalButton, styles.buttonCancel]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.modalText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Performance Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalperformanceVisible}
                onRequestClose={() => {
                    setModalPerformanceVisible(!modalperformanceVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>My Performance</Text>
                        {myperformanceOptions.map((option, index) => (
                            <Pressable
                                key={index}
                                style={[styles.modalButton, styles.buttonClose]}
                                onPress={() => {
                                    option.onPress();
                                    setModalPerformanceVisible(!modalperformanceVisible);
                                }}>
                                <Text style={styles.modalText}>{option.name}</Text>
                            </Pressable>
                        ))}
                        <Pressable
                            style={[styles.modalButton, styles.buttonCancel]}
                            onPress={() => setModalPerformanceVisible(!modalperformanceVisible)}>
                            <Text style={styles.modalText}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    boxContainer: {
        width: '100%',
        height: '85%',
        backgroundColor: 'red',
        padding: 5,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    box: {
        width: '33.33%',
        height: '25%',
        padding: 5,
        backgroundColor: 'green'
    },
    inner: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        margin: 2,
        height: 130,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10
    },
    text: {
        fontSize: 15,
        fontWeight: '700',
        color: '#00517c',
        textAlign: 'center',
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8
    },
    image: {
        width: 50,
        height: 50
    },
    studentdetailstext: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#00517c'
    },
    modalButton: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        marginVertical: 5,
        width: '100%'
    },
    buttonClose: {
        backgroundColor: '#00517c',
    },
    buttonCancel: {
        backgroundColor: '#ff4444',
        marginTop: 15
    },
    modalText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EmployeeMenu;