import { View, Text, SafeAreaView, StatusBar, Alert, Image, StyleSheet, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
// import RadioButton from "rn-radio-button";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { postData } from '../services/api';

const InstantFeedback = () => {
    const [email, setEmail] = useState()
    const [studentemail, setstudentemail] = useState()
    const [studentid, setStudentid] = useState()
    const [desc, setDesc] = useState('')
    const [val, setVal] = useState("-");
    // function pressCircle(i) {
    //     setVal(i);
    // }
    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            const value1 = await AsyncStorage.getItem('studentemail')
            const value2 = await AsyncStorage.getItem('studentid')
            if (value !== null && value1 != null) {
                setEmail(value)
                setstudentemail(value1)
                setStudentid(value2)
                console.log('email', value)
                console.log('studentemail', value1)
            }
        } catch (e) {
            console.log(e)
        }
    }
    // validate from
    const Validation = () => {

        if (!desc) {
            Alert.alert(
                'Alert',
                'Please write description',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            )
            return;
        }
        else if (val == '-') {
            Alert.alert(
                'Alert',
                'Please select grievance or feedback',
                [
                    { text: 'OK', onPress: () => console.log('OK Pressed') },
                ]
            )
            return;
        } else {
            saveData();
        }
    }

    const saveData = async () => {
        try {
            const body = {
                StudentId: parseInt(studentid),
                FeedbackDescription: desc,
                FeedbackType: val,
            }
            console.log(body)
            const result = await postData('StudentNewReactNative/FeedBackSave', body);
            console.log('result', result)
            Alert.alert(result)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.text}>{email}</Text>
                <View style={{ borderWidth: 1, marginVertical: 5, borderColor: 'white' }}></View>
                <Text style={styles.text}>{studentemail}</Text>
            </View>
            <View style={styles.inputbox}>
                <View style={{
                    borderBottomColor: '#000000',
                    borderBottomWidth: 1,
                    padding: 10,
                    marginHorizontal: 5
                }}>
                    <TextInput
                        style={{
                            height: 100, // Control the box size
                            textAlignVertical: 'top', // Align text to the top
                            padding: 10, // Add internal padding
                            color: 'black' // Text color
                        }}
                        placeholder='Write Feedback Here'
                        editable
                        multiline
                        numberOfLines={4}
                        maxLength={400}
                        placeholderTextColor={'black'}
                        onChangeText={(text) => setDesc(text)} />
                </View>
                <View>
                    {/* <RadioButton
                        outerWidth={30}
                        innerWidth={20}
                        borderWidth={1}
                        data={listData}
                        onPress={pressCircle}
                        wrapperStyle={{ marginVertical: 10, marginLeft: 30 }}
                        horizontal={true}
                    /> */}

                    <RadioForm
                        radio_props={listData}
                        initial={-1}
                        formHorizontal={true}
                        buttonColor={'#00517C'}
                        animation={true}
                        selectedButtonColor={'#00517C'}
                        labelStyle={{ marginRight: 5, marginLeft: 0 }}
                        style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, }}
                        onPress={value => setVal(value)}
                    />
                </View>
                <TouchableOpacity style={styles.signIn} onPress={Validation}>
                    <Text style={{ color: 'white', fontSize: 16 }}>POST FEEDBACK</Text>
                </TouchableOpacity>
                <FlashMessage position="bottom" />
            </View>
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        fontSize: 15,
        fontWeight: '500',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    header: {
        borderWidth: 1,
        borderColor: '#78a6c8',
        margin: 20,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#00517c',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
    },
    inputbox: {
        borderColor: '#00517c',
        borderWidth: 1,
        margin: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
        color: '#00517c'
    },
    signIn: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#00517c',
        marginTop: 50,

    },
});
const listData = [
    { label: "Grievance", value: 1 },
    { label: "Feedback", value: 2 },
];
export default InstantFeedback