import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, Linking } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { all } from 'axios';


const StudentMenu = () => {
    const navigation = useNavigation();
    const openLink = () => {
        Linking.openURL('https://docs.google.com/forms/d/e/1FAIpQLSeydvppbbwCaLGv6ffneoqR0LTeFZa7H_vaspk-HnXfLdlXmQ/viewform'); // Replace with your URL
    };
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

    return (
        <ScrollView>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('My Profile')}>
                    <Image source={require('../assets/myprofile.png')} style={styles.image} />
                    <Text style={[styles.text]} >My Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('My Notice')}>
                    <Image source={require('../assets/noticeboard.png')} style={styles.image} />
                    <Text style={styles.text} >My Notice</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('StudentICard')} >
                    <Image source={require('../assets/identity-card.png')} style={styles.image} />
                    <Text style={styles.text} >My Student ID</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])}>
                    {/* onPress={() => navigation.navigate('Attendance')}   */}
                    <Image source={require('../assets/attendance.png')} style={styles.image} />
                    <Text style={styles.text} >My Attendance</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>

                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    {/* onPress={() => navigation.navigate('AttendanceSummaryReport')} */}
                    <Image source={require('../assets/areports.png')} style={styles.image} />
                    <Text style={styles.text} >Attendance Report</Text>
                </TouchableOpacity>
                {/* onPress={() => navigation.navigate('Fees')} */}
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    <Image source={require('../assets/Fees.png')} style={styles.image} />
                    <Text style={styles.text} >My Fees</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])} >
                    {/* onPress={() => navigation.navigate("GiveAttendance")} */}
                    <Image source={require('../assets/about.png')} style={styles.image} />
                    <Text style={styles.text} >Give Attendance</Text>
                </TouchableOpacity>

            </View>
            {/* <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Study Material')}>
                    <Image source={require('../assets/syllabus.png')} style={styles.image} />
                    <Text style={styles.text} >Study Material</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Feedback')}>
                    <Image source={require('../assets/feedback.png')} style={[styles.image]} />
                    <Text style={styles.text} >Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Instant Feedback')}>
                    <Image source={require('../assets/myprofile.png')} style={[styles.image]} />
                    <Text style={styles.text} >Instant Feedback</Text>
                </TouchableOpacity>
            </View> */}
            {/* <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }}>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Routine')}>
                    <Image source={require('../assets/routine.png')} style={styles.image} />
                    <Text style={styles.text} >Routine</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Academic Calender')}>
                    <Image source={require('../assets/calender.png')} style={styles.image} />
                    <Text style={styles.text} >Academic Calender</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Code Of Conduct')}>
                    <Image source={require('../assets/codeofconducti.png')} style={styles.image} />
                    <Text style={styles.text} >Code of Conduct</Text>
                </TouchableOpacity>
            </View> */}
            {/* <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }} >
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Download Document')}>
                    <Image source={require('../assets/downloads.png')} style={styles.image} />
                    <Text style={styles.text} >Download Document</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate('Sem Wise Attendance Report')}>
                    <Image source={require('../assets/areports.png')} style={styles.image} />
                    <Text style={styles.text} >Attendance Report(SEM)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate("Student Marks View")}>
                    <Image source={require('../assets/aboutcollege.png')} style={styles.image} />
                    <Text style={styles.text} >Student Marks View</Text>
                </TouchableOpacity>
            </View> */}
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }} >
                {/* <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate("College Leaving Certificate")}>
                    <Image source={require('../assets/certificate.png')} style={styles.image} />
                    <Text style={styles.text} >College Leaving Certificate</Text>
                </TouchableOpacity> */}

                {/* <TouchableOpacity style={styles.inner} onPress={openLink}>
                    <Image source={require('../assets/Principal.png')} style={styles.image} />
                    <Text style={styles.text} >Principal Feedback</Text>
                </TouchableOpacity> */}
                {/* onPress={() => navigation.navigate("Change Password")} */}
                <TouchableOpacity style={styles.inner} onPress={() => Alert.alert("Alert", "Coming Soon", [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ])}>
                    <Image source={require('../assets/password.png')} style={styles.image} />
                    <Text style={styles.text} >Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => navigation.navigate("AboutUs")}>
                    <Image source={require('../assets/about.png')} style={styles.image} />
                    <Text style={styles.text} >About College</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inner} onPress={() => openPlayStore()}>
                    <Image source={require('../assets/feedback.png')} style={[styles.image]} />
                    <Text style={styles.text} >Rate Our App</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 5, marginHorizontal: 10 }} >
                {/* <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={[styles.inner, { opacity: 0 }]}>
                </TouchableOpacity> */}
            </View>
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
    }
})
export default StudentMenu