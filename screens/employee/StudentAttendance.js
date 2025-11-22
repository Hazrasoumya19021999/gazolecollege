import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, ActivityIndicator, Alert, Modal } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postData, getData } from '../services/api';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { PermissionsAndroid } from 'react-native';
import { getCurrentPosition } from 'react-native-geolocation-service';
import Geolocation from 'react-native-geolocation-service';


const StudentAttendance = () => {
    const navigation = useNavigation();
    const [isGeneratingCode, setIsGeneratingCode] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const [Session, setSession] = useState([]);
    const [Sessionvalue, setSessionValue] = useState(null);

    const [Programme, setProgramme] = useState([]);
    const [ProgrammeId, setProgrammeId] = useState(0);

    const [yearId, setYearId] = useState('0');
    const [semesterId, setSemesterId] = useState(0);

    const [Stream, setStream] = useState([]);
    const [StreamId, setStreamId] = useState(0);

    const [Subject, setSubject] = useState([]);
    const [subjectId, setSubjectId] = useState(null);

    const [Section, setSection] = useState([]);
    const [SectionId, setSectionId] = useState(null);

    const [Period, setPeriod] = useState([]);
    const [PeriodId, setPeriodId] = useState(null);

    const [Paper, setPaper] = useState([]);
    const [PaperId, setPaperId] = useState(null);

    const [subjectTypeId, setSubjectTypeId] = useState(0);

    const [yeardata, setYeardata] = useState([]);
    const [semesterdata, setSemesterdata] = useState([]);
    const [subjecttypedata, setSubjectTypedata] = useState([]);

    // State for controlling dropdown enables
    const [isSemesterEnabled, setIsSemesterEnabled] = useState(true);
    const [isSubjectTypeEnabled, setIsSubjectTypeEnabled] = useState(true);
    const [isPaperEnabled, setIsPaperEnabled] = useState(true);
    const [isStreamEnabled, setIsStreamEnabled] = useState(true);

    const [loading, setLoading] = useState(true);
    const [teacherId, setTeacherId] = useState(0);
    const [hsUpdatePermission, sethsUpdatePermission] = useState(0);
    const [data, setData] = useState([]);

    // Year data for different programs
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
    };

    // Semester data for different years
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
    };

    // Subject type data for different programs
    const allsubjectTypedata = {
        'UG': [
            { label: 'Honours/Major', value: 'HONS' },
            { label: 'General/Minor', value: 'PASS' },
            { label: 'Compulsory', value: 'COMP' },
            { label: 'Practical', value: 'PRAC' },
            { label: 'MDC', value: 'MDC' },
            { label: 'VAC', value: 'VAC' },
            { label: 'AEC', value: 'AEC' },
        ],
        'PG': [],
        'BCA': [
            { label: 'Honours/Major', value: 'HONS' },
            { label: 'General/Minor', value: 'PASS' },
            { label: 'Compulsory', value: 'COMP' },
            { label: 'Practical', value: 'PRAC' },
            { label: 'MDC', value: 'MDC' },
            { label: 'VAC', value: 'VAC' },
        ]
    };

    // Format date to YYYY-MM-DD
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Implement the EnableDisableControls logic
    const enableDisableControls = () => {
        // if (!ProgrammeId || !Sessionvalue || !yearId || !subjectTypeId || !SectionId) return;

        const sessionNum = parseInt(Sessionvalue);
        const yearNum = parseInt(yearId);

        // SEMESTER Enable/Disable Logic
        if ((ProgrammeId === 'UG' && sessionNum < 10) ||
            (ProgrammeId === 'UG' && sessionNum === 11 && yearNum === 2) ||
            (ProgrammeId === 'UG' && sessionNum === 11 && yearNum === 3) ||
            (ProgrammeId === 'UG' && sessionNum === 13 && yearNum === 3)) {
            setIsSemesterEnabled(false);
            setSemesterId(0); // Reset to default value when disabled
        } else {
            setIsSemesterEnabled(true);
        }

        // SUBJECT TYPE Enable/Disable Logic
        if ((ProgrammeId === 'BCA' && sessionNum < 10) ||
            (ProgrammeId === 'BCA' && sessionNum === 11 && yearNum === 2) ||
            (ProgrammeId === 'BCA' && sessionNum === 11 && yearNum === 3) ||
            (ProgrammeId === 'BCA' && sessionNum === 13 && yearNum === 3) ||
            (ProgrammeId === 'PG')) {
            setIsSubjectTypeEnabled(true);
            setSubjectTypeId(0); // Reset to default value when disabled
        } else {
            setIsSubjectTypeEnabled(true);
        }

        // PAPER Enable/Disable Logic
        if (sessionNum === 16 && yearNum === 1 &&
            (subjectTypeId === 'PASS' || subjectTypeId === 'HONS')) {
            setIsPaperEnabled(true);
        } else if ((sessionNum >= 10) &&
            ((subjectTypeId === 'PASS' || subjectTypeId === 'COMP') ||
                !(SectionId === 1 || SectionId === 14 || SectionId === 15 || SectionId === 16))) {
            setIsPaperEnabled(false);
            setPaperId(0); // Reset to default value when disabled
        } else {
            setIsPaperEnabled(true);
        }

        // STREAM Enable/Disable Logic
        if (subjectTypeId === 'COMP' || ProgrammeId === 'BCA') {
            setIsStreamEnabled(false);
            setStreamId(0); // Reset to default value when disabled
        } else {
            setIsStreamEnabled(true);
        }
    };

    // Call enableDisableControls whenever relevant states change
    useEffect(() => {
        enableDisableControls();
    }, [ProgrammeId, Sessionvalue, yearId, subjectTypeId, SectionId]);

    useFocusEffect(
        useCallback(() => {
            resetAllDropdowns();
            getStoredData();
            setLoading(false);
        }, [])
    );

    useEffect(() => {
        resetAllDropdowns();
        getStoredData();
        setLoading(false);
    }, []);

    const resetAllDropdowns = () => {
        setSelectedDate(new Date());
        setSessionValue(null);
        setProgrammeId(null);
        setYearId(null);
        setSemesterId(null);
        setStreamId(null);
        setSubjectId(null);
        setSectionId(null);
        setPeriodId(null);
        setPaperId(null);
        setSubjectTypeId(null);
        setYeardata([]);
        setSemesterdata([]);
        setSubjectTypedata([]);
        setData([]);
    };

    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    const getStoredData = async () => {
        try {
            bindSession();
            bindProgramme();
            bindStream();
            const Id = await AsyncStorage.getItem('empid');
            if (Id == 1) {
                sethsUpdatePermission(1);
            }
            setTeacherId(Id);
        } catch (e) {
            console.log(e);
        }
    };

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
                    // bindSection(sessionItems[0].value, yearId, 'HONS');
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

    const bindProgramme = async () => {
        try {
            const programmedata = await getData(`EmployeeNew/BindProgramme`);
            if (Array.isArray(programmedata) && programmedata.length > 0) {
                const programmeItems = programmedata.map((item) => ({
                    label: item.ProgrammeCode,
                    value: item.ProgrammeCode,
                }));
                setProgramme(programmeItems);
                setProgrammeId(programmeItems[0].value);
                setYeardata(allyeardata[programmeItems[0].value] || []);
                setSubjectTypedata(allsubjectTypedata[programmeItems[0].value] || []);
                setSubjectTypeId('HONS');
                bindPeriod(programmeItems[0].value);
            } else {
                setProgramme([]);
                Alert.alert("No Data Found", "No programme data available.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch programme data.");
        }
    };

    const bindStream = async () => {
        try {
            const Streamdata = await getData(`EmployeeNew/BindStream`);
            if (!Streamdata || Streamdata.length === 0) {
                console.log("No stream found for the given parameters.");
                //setStream([{ label: "Select Stream", value: 0 }]);
                setStreamId(0);
                return;
            }
            const StreamItems = [
                // { label: "Select Stream", value: 0 },
                ...Streamdata.map((item) => ({
                    label: item.StreamName,
                    value: item.StreamId,
                }))
            ];
            setStream(StreamItems);
            setStreamId(0);
        } catch (error) {
            console.log("Error fetching stream data:", error);
        }
    };

    const bindSubject = async (ProgrammeId, yearId, semesterId, subjectTypeId, StreamId, Sessionvalue) => {
        try {
            const subjectdata = await getData(`EmployeeNew/BindSubject?program=${ProgrammeId}&year=${yearId}&SemNo=${semesterId}&subjectType=${subjectTypeId}&StreamId=${StreamId}&Session=${Sessionvalue}`);
            if (!subjectdata || subjectdata.length === 0) {
                console.log("No subjects found for the given parameters.");
                //setSubject([{ label: "Select Subject", value: 0 }]);
                setSubjectId(0);
                return;
            }

            const subjectItems = [
                // { label: "Select Subject", value: 0 },
                ...subjectdata.map((item) => ({
                    label: item.SubjectName,
                    value: item.SubjectId,
                }))
            ];

            setSubject(subjectItems);
            setSubjectId(0);
        } catch (error) {
            console.log("Error fetching subject data:", error);
        }
    };

    // const bindSection = async (Sessionvalue, yearId, subjectTypeId) => {
    //     try {
    //         const sectiondata = await getData(`EmployeeNew/BindSectionNew?AdmissionSessionId=${Sessionvalue}&YearId=${yearId}&SubjectType=${subjectTypeId}`);
    //         if (!sectiondata || sectiondata.length === 0) {
    //             console.log("No section found for the given parameters.");
    //             //setSection([{ label: "Select Section", value: 0 }]);
    //             setSectionId(0);
    //             return;
    //         }
    //         const sectionItems = [
    //             //{ label: "Select Section", value: 0 },
    //             ...sectiondata.map((item) => ({
    //                 label: item.SectionName,
    //                 value: item.SectionId,
    //             }))
    //         ];

    //         setSection(sectionItems);
    //         setSectionId(0);
    //     } catch (error) {
    //         console.log("Error fetching section data:", error);
    //     }
    // };

    const bindPeriod = async (ProgrammeId) => {
        switch (ProgrammeId) {
            case 'UG':
                ProgrammeId = 1;
                break;
            case 'PG':
                ProgrammeId = 2;
                break;
            case 'BCA':
                ProgrammeId = 3;
                break;
        }
        try {
            const Perioddata = await getData(`EmployeeNew/BindPeriod?Programmeid=${ProgrammeId}`);
            if (Perioddata && Perioddata !== "No Data Found" && Perioddata.length > 0) {
                const PeriodItems = Perioddata.map((item) => ({
                    label: item.PeriodName,
                    value: item.PeriodId,
                }));
                setPeriod(PeriodItems);
            } else {
                setPeriod([]);
                Alert.alert("No Data Found", "No period data available for this programme.");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch period data.");
        }
    };

    // const bindPaper = async (semesterId, Sessionvalue, ProgrammeId, yearId, subjectTypeId) => {
    //     switch (ProgrammeId) {
    //         case 'UG':
    //             ProgrammeId = 1;
    //             break;
    //         case 'PG':
    //             ProgrammeId = 2;
    //             break;
    //         case 'BCA':
    //             ProgrammeId = 3;
    //             break;
    //     }
    //     try {
    //         const paperdata = await getData(`Employee/BindPaper?Semester=${semesterId}&Session=${Sessionvalue}&ProgrammeId=${ProgrammeId}&yearid=${yearId}&subjecttype=${subjectTypeId}`);
    //         if (paperdata && paperdata !== "No Data Found" && paperdata.length > 0) {
    //             const paperItems = paperdata.map((item) => ({
    //                 label: item.Paper,
    //                 value: item.PaperId,
    //             }));
    //             setPaper(paperItems);
    //         } else {
    //             setPaper([]);
    //         }
    //     } catch (error) {
    //         console.log("Error fetching paper data:", error);
    //     }
    // };

    const onYearChange = (item) => {
        bindSubject(ProgrammeId, item.value, semesterId, subjectTypeId, StreamId, Sessionvalue);
        // bindSection(Sessionvalue, item.value, subjectTypeId);
        setYearId(item.value);
        setSemesterId(0);
        setSemesterdata(allsemester[item.value] || []);
    };

    const onProgrammeChange = (item) => {
        bindSubject(item.value, yearId, semesterId, subjectTypeId, StreamId, Sessionvalue);
        bindPeriod(item.value);
        // bindPaper(semesterId, Sessionvalue, item.value, yearId, subjectTypeId);
        setProgrammeId(item.value);
        setYearId(0);
        setYeardata(allyeardata[item.value] || []);
        setSubjectTypeId(0);
        setSubjectTypedata(allsubjectTypedata[item.value] || []);
        setSemesterId(0);
    };

    const SearchStudentData = async () => {
        console.log("selected date", selectedDate);

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
        if (!subjectTypeId && ProgrammeId == 'UG') {
            Alert.alert("Alert", "Please select subject type");
            return;
        }
        if (!subjectId || subjectId === 0) {
            Alert.alert("Alert", "Please select subject");
            return;
        }
        if (!PeriodId) {
            Alert.alert("Alert", "Please select period");
            return;
        }
        // if (!PaperId && ProgrammeId != 'PG') {
        //     Alert.alert("Alert", "Please select paper");
        //     return;
        // }

        // Get current date in Indian timezone (IST)
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000; // IST offset is UTC+5:30
        const indiaNow = new Date(now.getTime() + offset);
        const today = new Date(indiaNow.getFullYear(), indiaNow.getMonth(), indiaNow.getDate());

        // Create date-only version of selectedDate for comparison
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        // Check if selected date is in the future
        if (selectedDateOnly > today) {
            Alert.alert(
                "Invalid Date",
                "Attendance cannot be marked for future dates.",
                [{ text: "OK" }]
            );
            return;
        }

        // Get the selected labels for each dropdown
        const getSelectedLabel = (data, value) => {
            const item = data.find(item => item.value === value);
            return item ? item.label : '';
        };

        const body = {
            SessionId: Sessionvalue,
            YearId: yearId,
            SemNo: semesterId,
            SubjectId: subjectId,
            SubjectType: subjectTypeId,
            PeriodId: PeriodId,
            Date: formatDate(selectedDate),
            TeacherId: teacherId,
            Paper: PaperId,
            SectionId: SectionId,
            ProgrammeId: ProgrammeId,
        };

        console.log("Request Body:", body);

        const EmployeeId = await AsyncStorage.getItem('empid');

        setIsGeneratingCode(true);
        try {
            const studentdata = await postData(`EmployeeNew/BindStudent`, body);
            console.log("Response:", studentdata);

            if (studentdata && studentdata !== "No Data Found" && studentdata.length > 0) {
                console.log('ok');
                setData(studentdata);

                // Prepare the dropdown values to pass to next screen
                const dropdownValues = {
                    date: selectedDate.toDateString(),
                    session: getSelectedLabel(Session, Sessionvalue),
                    programme: getSelectedLabel(Programme, ProgrammeId),
                    year: getSelectedLabel(yeardata, yearId),
                    semester: getSelectedLabel(semesterdata, semesterId),
                    subjectType: getSelectedLabel(subjecttypedata, subjectTypeId),
                    subject: getSelectedLabel(Subject, subjectId),
                    period: getSelectedLabel(Period, PeriodId),
                    paper: getSelectedLabel(Paper, PaperId),
                    rawValues: {
                        SessionId: Sessionvalue,
                        YearId: yearId,
                        SemNo: semesterId,
                        SubjectId: subjectId,
                        SubjectType: subjectTypeId,
                        PeriodId: PeriodId,
                        Date: formatDate(selectedDate),
                        TeacherId_FK: teacherId,
                        SectionId: SectionId,
                        ProgrammeId: ProgrammeId,
                        TeacherId: EmployeeId.toString(),
                        Paper: PaperId,
                        HsUpdatePermission: hsUpdatePermission,
                    }
                };
                console.log(dropdownValues);
                navigation.navigate("Student Attendance List", {
                    studentData: studentdata,
                    dropdownValues: dropdownValues
                });
            } else {
                setData([]);
                Alert.alert("No Data Found", "No student data found for the selected criteria.");
            }
            setIsGeneratingCode(false);
        } catch (error) {
            console.log("Error fetching student data:", error);
            setIsGeneratingCode(false);
            Alert.alert("Error", "Something went wrong while fetching student data.");
        } finally {
            setLoading(false);
            setIsGeneratingCode(false);
        }
    };

    function LoadingAnimation() {
        return (
            <View style={styles.indicatorWrapper}>
                <ActivityIndicator size="large" style={styles.indicator} />
                <Text style={styles.indicatorText}>Loading ...</Text>
            </View>
        );
    }

    // const GenerateCode = async () => {

    //     console.log("selected date", selectedDate);

    //     // Validate mandatory fields
    //     if (!Sessionvalue) {
    //         Alert.alert("Alert", "Please select academic session");
    //         return;
    //     }
    //     if (!ProgrammeId) {
    //         Alert.alert("Alert", "Please select programme");
    //         return;
    //     }
    //     if (!yearId || yearId === '0') {
    //         Alert.alert("Alert", "Please select year");
    //         return;
    //     }
    //     if (!semesterId || semesterId === '0') {
    //         Alert.alert("Alert", "Please select semester");
    //         return;
    //     }
    //     if (!subjectTypeId && ProgrammeId == 'UG') {
    //         Alert.alert("Alert", "Please select subject type");
    //         return;
    //     }
    //     if (!subjectId || subjectId === 0) {
    //         Alert.alert("Alert", "Please select subject");
    //         return;
    //     }
    //     if (!PeriodId) {
    //         Alert.alert("Alert", "Please select period");
    //         return;
    //     }
    //     const now = new Date();
    //     const offset = 5.5 * 60 * 60 * 1000; // IST offset is UTC+5:30
    //     const indiaNow = new Date(now.getTime() + offset);
    //     const today = new Date(indiaNow.getFullYear(), indiaNow.getMonth(), indiaNow.getDate());

    //     // Create date-only version of selectedDate for comparison
    //     const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    //     // Check if selected date is in the future
    //     if (selectedDateOnly > today) {
    //         Alert.alert(
    //             "Invalid Date",
    //             "Attendance cannot be marked for future dates.",
    //             [{ text: "OK" }]
    //         );
    //         return;
    //     }

    //     // Get the selected labels for each dropdown
    //     const getSelectedLabel = (data, value) => {
    //         const item = data.find(item => item.value === value);
    //         return item ? item.label : '';
    //     };

    //     const body = {
    //         SessionId: Sessionvalue,
    //         YearId: yearId,
    //         SemNo: semesterId,
    //         SubjectId: subjectId,
    //         SubjectType: subjectTypeId,
    //         PeriodId: PeriodId,
    //         Date: formatDate(selectedDate),
    //         TeacherId: teacherId,
    //         Paper: PaperId,
    //         SectionId: SectionId,
    //         ProgrammeId: ProgrammeId,
    //     };

    //     console.log("Request Body:", body);

    //     const EmployeeId = await AsyncStorage.getItem('empid');

    //     console.log("EmployeeId:", EmployeeId);

    //     const codebody = {
    //         StudentAttendanceCodeId: 0,
    //         SessionId: Sessionvalue,
    //         Year: yearId,
    //         SemNo: semesterId,
    //         SubjectId: subjectId,
    //         SubjectType: subjectTypeId,
    //         PeriodId: PeriodId,
    //         //Date: formatDate(selectedDate),
    //         AttendanceDate: formatDate(selectedDate),
    //         TeacherId: teacherId,
    //         //DayMorning: selectedTimeSlot,
    //         SectionId: SectionId,
    //         ProgrammeId: ProgrammeId,
    //         //CourseId: Coursevalue || 0, // Use Coursevalue if available, else default to 0
    //         Programme: ProgrammeId,
    //         Paper: PaperId,
    //     };

    //     console.log("Request Body 2:", codebody);

    //     setLoading(true);
    //     try {
    //         const studentdata = await postData(`Employee/BindStudent`, body);
    //         console.log("Response:", studentdata);

    //         if (studentdata && studentdata !== "No Data Found" && studentdata.length > 0) {
    //             setData(studentdata);

    //             const codedata = await postData(`EmployeeNew/SaveStudentAttendanceCode`, codebody);
    //             console.log("Response2 :", codedata);

    //             // Prepare the dropdown values to pass to next screen
    //             const dropdownValues = {
    //                 date: selectedDate.toDateString(),
    //                 session: getSelectedLabel(Session, Sessionvalue),
    //                 programme: getSelectedLabel(Programme, ProgrammeId),
    //                 year: getSelectedLabel(yeardata, yearId),
    //                 semester: getSelectedLabel(semesterdata, semesterId),
    //                 subjectType: getSelectedLabel(subjecttypedata, subjectTypeId),
    //                 subject: getSelectedLabel(Subject, subjectId),
    //                 period: getSelectedLabel(Period, PeriodId),
    //                 //timeSlot: getSelectedLabel(dayOptions, selectedTimeSlot),
    //                 CourseId: 0 || 0,

    //                 // Also pass the raw values needed for submission
    //                 rawValues: {
    //                     SessionId: Sessionvalue,
    //                     YearId: yearId,
    //                     SemNo: semesterId,
    //                     SubjectId: subjectId,
    //                     SubjectType: subjectTypeId,
    //                     PeriodId: PeriodId,
    //                     Paper: PaperId,
    //                     Date: formatDate(selectedDate),
    //                     TeacherId_FK: teacherId,
    //                     DayMorning: '',
    //                     SectionId: SectionId,
    //                     ProgrammeId: ProgrammeId,
    //                     TeacherId: EmployeeId.toString(),

    //                 }
    //             };

    //             navigation.navigate("Student Attendance List", {
    //                 studentData: studentdata,
    //                 dropdownValues: dropdownValues,
    //                 codevaluedate: codedata
    //             });
    //         } else {
    //             setData([]);
    //             Alert.alert("No Data Found", "No student data found for the selected criteria.");
    //         }
    //         setLoading(false);
    //     } catch (error) {
    //         setLoading(false);
    //         console.log("Error fetching student data:", error);
    //         Alert.alert("Error", "Something went wrong while fetching student data.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const GenerateCode = async () => {
        // Validate all required fields
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
        if (!subjectTypeId && ProgrammeId == 'UG') {
            Alert.alert("Alert", "Please select subject type");
            return;
        }
        if (!subjectId || subjectId === 0) {
            Alert.alert("Alert", "Please select subject");
            return;
        }
        if (!PeriodId) {
            Alert.alert("Alert", "Please select period");
            return;
        }

        // Check date validity
        const now = new Date();
        const offset = 5.5 * 60 * 60 * 1000; // IST offset is UTC+5:30
        const indiaNow = new Date(now.getTime() + offset);
        const today = new Date(indiaNow.getFullYear(), indiaNow.getMonth(), indiaNow.getDate());
        const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

        if (selectedDateOnly > today) {
            Alert.alert(
                "Invalid Date",
                "Attendance cannot be marked for future dates.",
                [{ text: "OK" }]
            );
            return;
        }

        setIsGeneratingCode(true);

        try {
            // Request location permission
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Location Permission",
                    message: "This app needs access to your location to generate the attendance code.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                Alert.alert(
                    "Permission Denied",
                    "You need to grant location permission to generate the attendance code.",
                    [{ text: "OK" }]
                );
                return;
            }

            // Get current location
            const position = await new Promise((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 15000,
                        maximumAge: 10000
                    }
                );
            });

            const { latitude, longitude } = position.coords;

            // Prepare request body
            const body = {
                SessionId: Sessionvalue,
                YearId: yearId,
                SemNo: semesterId,
                SubjectId: subjectId,
                SubjectType: subjectTypeId,
                PeriodId: PeriodId,
                Date: formatDate(selectedDate),
                TeacherId: teacherId,
                Paper: PaperId,
                SectionId: SectionId,
                ProgrammeId: ProgrammeId,
            };

            console.log("Request Body:", body);

            const EmployeeId = await AsyncStorage.getItem('empid');

            const codebody = {
                StudentAttendanceCodeId: 0,
                SessionId: Sessionvalue,
                Year: yearId,
                SemNo: semesterId,
                SubjectId: subjectId,
                SubjectType: subjectTypeId,
                PeriodId: PeriodId,
                AttendanceDate: formatDate(selectedDate),
                TeacherId: teacherId,
                SectionId: SectionId,
                ProgrammeId: ProgrammeId,
                Programme: ProgrammeId,
                Paper: PaperId,
                Latitude: latitude.toString(),
                Longitude: longitude.toString(),
                Accuracy: position.coords.accuracy.toString()
            };

            console.log("Request Body with Location:", codebody);

            setLoading(true);

            // First get student data
            const studentdata = await postData(`Employee/BindStudent`, body);
            console.log("Student Data Response:", studentdata);

            if (!studentdata || studentdata === "No Data Found" || studentdata.length === 0) {
                setData([]);
                Alert.alert("No Data Found", "No student data found for the selected criteria.");
                return;
            }

            // Then generate the attendance code
            const codedata = await postData(`EmployeeNew/SaveStudentAttendanceCode`, codebody);
            console.log("Code Generation Response:", codedata);

            // Prepare navigation data
            const dropdownValues = {
                date: selectedDate.toDateString(),
                session: getSelectedLabel(Session, Sessionvalue),
                programme: getSelectedLabel(Programme, ProgrammeId),
                year: getSelectedLabel(yeardata, yearId),
                semester: getSelectedLabel(semesterdata, semesterId),
                subjectType: getSelectedLabel(subjecttypedata, subjectTypeId),
                subject: getSelectedLabel(Subject, subjectId),
                period: getSelectedLabel(Period, PeriodId),
                rawValues: {
                    SessionId: Sessionvalue,
                    YearId: yearId,
                    SemNo: semesterId,
                    SubjectId: subjectId,
                    SubjectType: subjectTypeId,
                    PeriodId: PeriodId,
                    Paper: PaperId,
                    Date: formatDate(selectedDate),
                    TeacherId_FK: teacherId,
                    DayMorning: '',
                    SectionId: SectionId,
                    ProgrammeId: ProgrammeId,
                    TeacherId: EmployeeId.toString(),
                }
            };
            setIsGeneratingCode(false);

            // Navigate to next screen with all data
            navigation.navigate("Student Attendance List", {
                studentData: studentdata,
                dropdownValues: dropdownValues,
                codevaluedate: codedata
            });

        } catch (error) {
            console.log("Error:", error);
            let errorMessage = "Something went wrong while generating the code.";

            if (error.code === 'PERMISSION_DENIED') {
                errorMessage = "Location permission was denied.";
            } else if (error.code === 'POSITION_UNAVAILABLE') {
                errorMessage = "Location information is unavailable.";
            } else if (error.code === 'TIMEOUT') {
                errorMessage = "The request to get location timed out.";
            }

            Alert.alert(
                "Error",
                errorMessage,
                [{ text: "OK" }]
            );
            setIsGeneratingCode(false);
        } finally {
            setLoading(false);
            setIsGeneratingCode(false);
        }
    };

    const getSelectedLabel = (data, value) => {
        if (!data || !value) return '';
        const item = data.find(item => item.value === value);
        return item ? item.label : '';
    };


    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <ScrollView>
                        <View style={styles.datePickerContainer}>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                                <Text style={styles.datePickerText}>📅 Date: {formatDate(selectedDate)}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                                    onChange={onDateChange}
                                    minimumDate={new Date(new Date().setDate(new Date().getDate() - 2))}
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>
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
                                bindSubject(ProgrammeId, yearId, semesterId, subjectTypeId, StreamId, item.value);
                                // bindSection(item.value, yearId, subjectTypeId);
                                // bindPaper(semesterId, item.value, ProgrammeId, yearId, subjectTypeId);
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
                                bindSubject(ProgrammeId, yearId, item.value, subjectTypeId, StreamId, Sessionvalue);
                                if (ProgrammeId == 'UG') {
                                    //  bindPaper(item.value, Sessionvalue, ProgrammeId, yearId, subjectTypeId);
                                }
                            }}
                            disable={!isSemesterEnabled || !semesterdata.length}
                        />

                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Stream}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Stream *"
                            search
                            searchPlaceholder="Search Stream..."
                            value={StreamId}
                            onChange={(item) => {
                                setStreamId(item.value);
                                bindSubject(ProgrammeId, yearId, semesterId, subjectTypeId, item.value, Sessionvalue);
                            }}
                            disable={!isStreamEnabled || ProgrammeId == 'BCA'}
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
                                bindSubject(ProgrammeId, yearId, semesterId, item.value, StreamId, Sessionvalue);
                                //bindSection(Sessionvalue, yearId, item.value);
                                //bindPaper(semesterId, Sessionvalue, ProgrammeId, yearId, item.value);
                            }}
                            disable={!isSubjectTypeEnabled || !subjecttypedata.length}
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
                        {/* <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Section}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Section *"
                            search
                            searchPlaceholder="Search Section..."
                            value={SectionId}
                            onChange={(item) => {
                                setSectionId(item.value);
                            }}
                        /> */}
                        <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Period}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Period *"
                            search
                            searchPlaceholder="Search Period..."
                            dropdownPosition="top"
                            value={PeriodId}
                            onChange={(item) => {
                                setPeriodId(item.value);
                            }}
                        />
                        {/* <Dropdown
                            style={[styles.dropdown]}
                            containerStyle={styles.dropdownContainer}
                            data={Paper}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Paper *"
                            search
                            searchPlaceholder="Search Paper..."
                            dropdownPosition="top"
                            value={PaperId}
                            onChange={(item) => {
                                setPaperId(item.value);
                            }}
                            disable={!isPaperEnabled || ProgrammeId == 'PG'}
                        /> */}
                        <TouchableOpacity
                            onPress={SearchStudentData}
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
                        <TouchableOpacity
                            onPress={GenerateCode}
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
                            }}
                        >
                            <Text style={{
                                fontSize: 19,
                                color: '#fff',
                                textAlign: 'center'
                            }}>Generate Code</Text>
                        </TouchableOpacity>

                        <Modal
                            transparent={true}
                            animationType="fade"
                            visible={isGeneratingCode}
                            onRequestClose={() => setIsGeneratingCode(false)}>
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <ActivityIndicator size="large" color="#00517c" />
                                    <Text style={styles.modalText}>Please Wait...</Text>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
            }
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
    },
    searchButton: {
        backgroundColor: '#00517c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    searchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    picker: {
        height: 50,
        width: '97%',
        margin: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    datePickerContainer: {
        marginVertical: 5,
        margin: 10
    },
    datePickerButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderWidth: 2,
        borderColor: '#007BFF',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    datePickerText: {
        fontSize: 16,
        color: '#007BFF',
        fontWeight: 'bold',
    },
    dropdown: {
        margin: 16,
        height: 50,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.5,
    },
    dropdownContainer: {
        backgroundColor: '#fafafa',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        marginTop: 10,
        fontSize: 16,
        color: '#00517c',
    },
});

export default StudentAttendance;