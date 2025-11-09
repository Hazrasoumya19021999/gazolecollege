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

const AttendanceSummeryReport = () => {

    const navigation = useNavigation()
    const [employeeId, setEmployeeId] = useState(0)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true);

    const [Session, setSession] = useState([])
    const [Sessionvalue, setSessionValue] = useState(null);

    const [Programme, setProgramme] = useState([])
    const [ProgrammeId, setProgrammeId] = useState(null);

    const [yearId, setYearId] = useState('0');
    const [semesterId, setSemesterId] = useState(0);
    const [subjectTypeId, setSubjectTypeId] = useState(null);
    const [Subject, setSubject] = useState([])
    const [subjectId, setSubjectId] = useState(null);
    const [studentcode, setStudentCode] = useState('');
    const [semesterdata, setSemesterdata] = useState([]);
    const [yeardata, setYeardata] = useState([]);
    const [subjecttypedata, setSubjectTypedata] = useState([]);

    const [teacherId, setTeacherId] = useState(0);

    useEffect(() => {

        bindSession()
        bindProgramme()
        //  bindSubject()
        setLoading(false);
    }, [])

    useEffect(() => {
        // console.log("Programme value", ProgrammeId)
        // console.log("Session value", Sessionvalue)
        // console.log("Year value", yearId)
        // console.log("Semester value", semesterId)
        // console.log("Subject value", subjectId)
        // console.log("SubjectType value", subjectTypeId)
    }, [Sessionvalue, ProgrammeId, yearId, semesterId, subjectTypeId, subjectId])

    const getStoredData = async () => {
        try {
            const Id = await AsyncStorage.getItem('empid')
            setTeacherId(Id)
            setLoading(false);

        } catch (e) {
            console.log(e)
        }
    }
    //bindsession
    const bindSession = async () => {
        const sessiondata = await getData(`EmployeeNew/BindSession`);
        console.log("Bind session", sessiondata)
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

    //bindprogramme
    const bindProgramme = async () => {
        const programmedata = await getData(`EmployeeNew/BindProgramme`);
        const programmeItems = programmedata.map((item) => ({
            label: item.ProgrammeCode,
            value: item.ProgrammeCode,
        }));
        setProgramme(programmeItems)

        if (programmeItems.length > 0) {
            setProgrammeId(programmeItems[0].value);
            setYeardata(allyeardata[programmeItems[0].value] || []);
            setSubjectTypedata(allsubjectTypedata[programmeItems[0].value] || []);
        }
    }

    //bindYear
    const allyeardata = {
        'UG': [
            { label: '1st Year', value: '1' },
            { label: '2nd Year', value: '2' },
            { label: '3rd Year', value: '3' },
        ],
        'PG': [
            { label: '1st Year', value: '1' },
            { label: '2nd Year', value: '2' }
        ],
        'BCA': [
            { label: '1st Year', value: '1' },
            { label: '2nd Year', value: '2' },
            { label: '3rd Year', value: '3' },
        ],
    }

    const allsemester = {
        '1': [
            { label: '1', value: '1' },
            { label: '2', value: '2' }
        ],
        '2': [
            { label: '3', value: '3' },
            { label: '4', value: '4' }
        ],
        '3': [
            { label: '5', value: '5' },
            { label: '6', value: '6' }
        ]
    }

    const onYearChange = (item) => {
        bindSubject(ProgrammeId, item.value, semesterId, subjectTypeId)
        setYearId(item.value);
        setSemesterId(0);
        setSemesterdata(allsemester[item.value] || []);
    }
    const onProgrammeChange = (item) => {
        bindSubject(item.value, yearId, semesterId, subjectTypeId)
        setProgrammeId(item.value);
        setYearId(0);
        setYeardata(allyeardata[item.value] || []);
        setSubjectTypeId(null);
        setSubjectTypedata(allsubjectTypedata[item.value] || []);
        setSemesterId(0)
    }

    //bindsubjectType
    const allsubjectTypedata = {
        'UG': [
            { label: 'Honours/Major', value: 'HONS' },
            { label: 'General/Minor', value: 'PASS' },
            { label: 'Compulsory', value: 'COMP' },
            { label: 'Practical', value: 'PRAC' },
            { label: 'MDC', value: 'MDC' },
            { label: 'VAC', value: 'VAC' },
        ]
    };
    //bindsubject
    const bindSubject = async (ProgrammeId, yearId, semesterId, subjectTypeId) => {
        // console.log(`EmployeeNew/BindSubject?program=${ProgrammeId}&year=${yearId}&SemNo=${semesterId}&subjectType=${subjectTypeId}`)
        const subjectdata = await getData(`EmployeeNew/BindSubject?program=${ProgrammeId}&year=${yearId}&SemNo=${semesterId}&subjectType=${subjectTypeId}`);
        // console.log('Subject Data ', subjectdata)
        const subjectItems = subjectdata.map((item) => ({
            label: item.SubjectName,
            value: item.SubjectId,
        }));
        setSubject(subjectItems)
    }

    const GetStudentData = async () => {
        // Validate mandatory fields
        // Validate mandatory fields
        if (!Sessionvalue) {
            Alert.alert("Alert", "Please select academic session");
            return;
        }
        if (!ProgrammeId) {
            Alert.alert("Alert", "Please select programme");
            return;
        }
        if (!yearId || yearId === '0') {
            Alert.alert("Alert", "Please select year");
            return;
        }
        if (!semesterId || semesterId === '0') {
            Alert.alert("Alert", "Please select semester");
            return;
        }
        if (!subjectTypeId && ProgrammeId =='UG') {
            Alert.alert("Alert", "Please select subject type");
            return;
        }
        if (!subjectId || subjectId === 0) {
            Alert.alert("Alert", "Please select subject");
            return;
        }
        setLoading(true);

        const body = {
            SessionId: Sessionvalue,
            YearId: yearId,
            SemNo: semesterId,
            SubjectId: subjectId,
            StudentCode: studentcode
        }

        // console.log(body)
        const studentdata = await postData(`EmployeeNew/StudentAttendanceReport`, body);

        if (studentdata != "No Data Found") {
            setData(studentdata);
            setLoading(false);
            navigation.navigate('Attendance Report List', { data: studentdata })
        }
        else {
            setLoading(false);
            Alert.alert("Message","No data found....");
        }
        // console.log('JSON', studentdata);

        // console.log('SubjectId', subjectId)

        setLoading(false);
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <ScrollView>
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Session}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Session *"
                            search
                            searchPlaceholder="Search Session..."
                            value={Sessionvalue}
                            onChange={(item) => {
                                setSessionValue(item.value);
                            }}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Programme}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Programme *"
                            search
                            searchPlaceholder="Search Programme..."
                            value={ProgrammeId}
                            onChange={onProgrammeChange}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={yeardata}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Year *"
                            search
                            searchPlaceholder="Search Year..."
                            value={yearId}
                            onChange={onYearChange}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={semesterdata}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Semester *"
                            search
                            searchPlaceholder="Search Semester..."
                            value={semesterId}
                            onChange={(item) => {
                                setSemesterId(item.value);
                                bindSubject(ProgrammeId, yearId, item.value, subjectTypeId)
                            }}
                            disable={!semesterdata.length}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={subjecttypedata}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Subject Type *"
                            search
                            searchPlaceholder="Search Subject Type..."
                            value={subjectTypeId}
                            onChange={(item) => {
                                setSubjectTypeId(item.value);
                                bindSubject(ProgrammeId, yearId, semesterId, item.value)
                            }}
                            disable={!subjecttypedata.length}
                        />
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Subject}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Subject *"
                            search
                            searchPlaceholder="Search Subject..."
                            value={subjectId}
                            onChange={(item) => {
                                setSubjectId(item.value);
                            }}
                        />
                        <View style={{
                            borderBottomColor: '#000000',
                            borderBottomWidth: 1,
                            padding: 10,
                            marginHorizontal: 5
                        }}>
                            <TextInput
                                placeholder='Write Student Code Here'
                                editable
                                placeholderTextColor={'black'}
                                onChangeText={(text) => setStudentCode(text)} />
                        </View>
                        <TouchableOpacity
                            onPress={() => GetStudentData()}
                            style={{
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
                            }}>
                            <Text style={{
                                fontSize: 19,
                                color: '#fff',
                                textAlign: 'center'
                            }}>Search</Text>
                        </TouchableOpacity>
                    </ScrollView>

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
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
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
export default AttendanceSummeryReport