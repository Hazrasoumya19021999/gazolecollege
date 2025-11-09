import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    ActivityIndicator,
    Dimensions,
    Alert,
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { postData, getData } from '../services/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const StudentAttendanceList = () => {
    const route = useRoute();
    const navigation = useNavigation();
    //const { studentData, dropdownValues } = route.params;
    const { studentData: initialStudentData, dropdownValues, codevaluedate } = route.params;
    const [studentData, setStudentData] = useState(initialStudentData);
    const [selectedRows, setSelectedRows] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const [attendanceStopped, setAttendanceStopped] = useState(false);
    const [stopping, setStopping] = useState(false);

    // Calculate attendance statistics
    const totalStudents = studentData.length;
    const totalPresent = Object.values(selectedRows).filter(val => val).length;
    const totalAbsent = totalStudents - totalPresent;

    // Calculate max TotalClass and TotalClassTaken
    const maxTotalClass = Math.max(
        ...studentData.map(item => parseFloat(item.TotalClass || 0))
    );

    const maxTotalClassTaken = Math.max(
        ...studentData.map(item => parseFloat(item.TotalClassTaken || 0))
    );

    // Effect to handle updates when route params change
    useEffect(() => {
        if (initialStudentData) {
            initializeData(initialStudentData);
        }
    }, [initialStudentData, dropdownValues, codevaluedate]);

    const initializeData = (data) => {
        setLoading(true);
        setStudentData(data);

        // Initialize selection
        const initialSelection = {};
        data.forEach(item => {
            initialSelection[item.StudentId] = item.IsPresent === "True";
        });
        setSelectedRows(initialSelection);

        // Set selectAll based on initial state
        const allPresent = data.every(item => item.IsPresent === "True");
        setSelectAll(allPresent);

        // Reset attendance stopped state when data changes
        setAttendanceStopped(false);

        setLoading(false);
    };

    // Initialize attendance data when screen focuses
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            console.log("maxTotalClass:", maxTotalClass);
            console.log("maxTotalClassTaken:", maxTotalClassTaken);
            // console.log("dropdown values next page", dropdownValues);
            // Initialize selection - check rows where IsPresent is "True" but allow changes
            const initialSelection = {};
            studentData.forEach(item => {
                initialSelection[item.StudentId] = item.IsPresent === "True";
            });
            setSelectedRows(initialSelection);

            // Set selectAll based on initial state
            const allPresent = studentData.every(item => item.IsPresent === "True");
            setSelectAll(allPresent);

            setLoading(false);

            return () => {
                // Cleanup if needed
            };
        }, [studentData])
    );

    // Refresh student data
    const handleRefresh = async () => {
        try {
            const body = {
                SessionId: dropdownValues.rawValues.SessionId,
                YearId: dropdownValues.rawValues.YearId,
                SemNo: dropdownValues.rawValues.SemNo,
                SubjectId: dropdownValues.rawValues.SubjectId,
                SubjectType: dropdownValues.rawValues.SubjectType == 0 ? "" : dropdownValues.rawValues.SubjectType,
                PeriodId: dropdownValues.rawValues.PeriodId,
                Paper: dropdownValues.rawValues.Paper,
                Date: dropdownValues.rawValues.Date,
                TeacherId: dropdownValues.rawValues.TeacherId,
                SectionId: dropdownValues.rawValues.SectionId || 0,
                ProgrammeId: dropdownValues.rawValues.ProgrammeId,
                CourseId: dropdownValues.CourseId || 0,
                Programme: dropdownValues.rawValues.ProgrammeId,
            };

            console.log("Refresh body:", body);

            const studentdata = await postData('Employee/BindStudent', body);

            if (studentdata && studentdata !== "No Data Found" && studentdata.length > 0) {
                setStudentData(studentdata);
                const newSelection = {};
                studentdata.forEach(item => {
                    newSelection[item.StudentId] = item.IsPresent == "True";
                });
                setSelectedRows(newSelection);
                return true;
            } else {
                Alert.alert("Error", "No student data found");
                return false;
            }
        } catch (error) {
            console.error("Refresh error:", error);
            Alert.alert("Error", "Failed to refresh student data");
            return false;
        }
    };

    // API call to update code status
    const updateCodeStatus = async () => {
        try {
            const response = await getData('EmployeeNew/StudentAttendanceCode_UPDATE?Code=' + codevaluedate);
            console.log("Code status updated:", response);
            return true;
        } catch (error) {
            console.error("Error updating code status:", error);
            return false;
        }
    };

    // Handle stop button press
    const handleStop = async () => {
        setStopping(true);
        try {
            // First update the code status
            const codeUpdated = await updateCodeStatus();

            // Then refresh the student data
            if (codeUpdated) {
                await handleRefresh();
            }

            setAttendanceStopped(true);
            Alert.alert(
                "Success",
                "Attendance collection stopped successfully",
                [{ text: "OK" }]
            );
        } catch (error) {
            console.error("Stop error:", error);
            Alert.alert("Error", "Failed to stop attendance collection");
        } finally {
            setStopping(false);
        }
    };

    // Toggle individual student selection
    const toggleSelection = (id) => {
        setSelectedRows(prev => ({
            ...prev,
            [id]: !prev[id], // Toggle the current state regardless of initial IsPresent
        }));

        // Update selectAll state
        const newSelection = { ...selectedRows, [id]: !selectedRows[id] };
        const allSelected = studentData.every(item => newSelection[item.StudentId]);
        setSelectAll(allSelected);
    };

    // Toggle select all students
    const toggleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);

        const newSelectedRows = {};
        studentData.forEach(item => {
            newSelectedRows[item.StudentId] = newSelectAll;
        });
        setSelectedRows(newSelectedRows);
    };

    const renderItem = ({ item }) => {
        const isSelected = selectedRows[item.StudentId];
        const wasInitiallyPresent = item.IsPresent === "True";

        // Determine if row should be green (currently selected)
        const isRowGreen = isSelected;

        // Show checkmark if currently selected (regardless of initial state)
        const showCheck = isSelected;

        return (
            <Pressable
                onPress={() => toggleSelection(item.StudentId)}
                style={[
                    styles.row,
                    {
                        backgroundColor: isRowGreen ? '#e0f9e0' : '#ffe5e5',
                        borderLeftWidth: 4,
                        borderLeftColor: wasInitiallyPresent ? '#28a745' : '#dc3545',
                    },
                ]}
            >
                <View style={styles.checkboxContainer}>
                    <Icon
                        name={showCheck ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color={showCheck ? 'green' : '#ccc'}
                    />
                </View>
                <View style={styles.nameColumn}>
                    <Text style={styles.nameText}>
                        {item.StudentName}
                    </Text>
                    <Text style={styles.codeText}>
                        ({item.StudentCode})
                    </Text>
                </View>
                <Text style={styles.boldValue}>{item.TotalPresent}</Text>
                {/* <Text style={styles.boldValue}>{item.TotalAbsent}</Text> */}
            </Pressable>
        );
    };

    const handleSubmit = async () => {
        setSubmitLoading(true);
        // console.log(submissionData)
        try {
            const submissionData = {
                SessionId: dropdownValues.rawValues.SessionId,
                YearId: dropdownValues.rawValues.YearId,
                SemNo: dropdownValues.rawValues.SemNo,
                SubjectType: dropdownValues.rawValues.SubjectType,
                SubjectId: dropdownValues.rawValues.SubjectId,
                SectionId: dropdownValues.rawValues.SectionId || 0,
                Period: dropdownValues.rawValues.PeriodId,
                TeacherId_FK: dropdownValues.rawValues.TeacherId,
                CreatedBy: dropdownValues.rawValues.TeacherId,
                ModifiedBy: dropdownValues.rawValues.TeacherId,
                AttendanceDate: dropdownValues.rawValues.Date,
                Date: dropdownValues.rawValues.Date,
                Paper: dropdownValues.rawValues.Paper,
                HsUpdatePermission: dropdownValues.rawValues.HsUpdatePermission,
                Remark: "",
                students: studentData.map(student => ({
                    StudentId: student.StudentId,
                    IsPresent: selectedRows[student.StudentId] || false
                }))
            };
            console.log(submissionData)
            const response = await postData('EmployeeNew/SaveStudentAttendance', submissionData);
            const message = response.replace(/^\d+\s*/, '');

            Alert.alert(
                "Message",
                message,
                [{ text: "OK", onPress: () => navigation.goBack() }]
            );

        } catch (error) {
            Alert.alert("Error", "An error occurred while saving attendance.");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4a90e2" />
                <Text style={styles.loadingText}>Loading attendance...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* <View style={styles.criteriaContainer}>
                <Text style={styles.criteriaText}>
                    <Text style={styles.criteriaLabel}>Date: </Text>
                    {formatDate(dropdownValues.date)}
                </Text>
                <Text style={styles.criteriaText}>
                    <Text style={styles.criteriaLabel}>Session: </Text>
                    {dropdownValues.session}
                </Text>
                <Text style={styles.criteriaText}>
                    <Text style={styles.criteriaLabel}>Subject: </Text>
                    {dropdownValues.subject}
                </Text>
                <Text style={styles.criteriaText}>
                    <Text style={styles.criteriaLabel}>Period: </Text>
                    {dropdownValues.period}
                </Text>
            </View> */}

            <View style={styles.criteriaContainer}>
                <View style={styles.criteriaRow}>
                    <Text style={styles.criteriaText}>
                        <Text style={styles.criteriaLabel}>Date: </Text>
                        {formatDate(dropdownValues.date)}
                    </Text>
                    <Text style={styles.criteriaText}>
                        <Text style={styles.criteriaLabel}>Period: </Text>
                        {dropdownValues.period}
                    </Text>
                    {/* <Text style={styles.criteriaText}>
                        <Text style={styles.criteriaLabel}>Session: </Text>
                        {dropdownValues.session}
                    </Text> */}
                </View>
                {/* <View style={styles.criteriaRow}>
                    <Text style={styles.criteriaText}>
                        <Text style={styles.criteriaLabel}>Subject: </Text>
                        {dropdownValues.subject}
                    </Text>
                    <Text style={styles.criteriaText}>
                        <Text style={styles.criteriaLabel}>Period: </Text>
                        {dropdownValues.period}
                    </Text>
                </View> */}
            </View>

            {codevaluedate && codevaluedate !== "" && (
                <>
                    <View style={styles.codeStopContainer}>
                        <View style={styles.codeContainer}>
                            <Text style={[
                                styles.codeTextDisplay,
                                { color: attendanceStopped ? '#666' : 'red' }
                            ]}>
                                {codevaluedate}
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={handleStop}
                            style={[
                                styles.stopButton,
                                attendanceStopped && styles.stopButtonDisabled
                            ]}
                            disabled={stopping || attendanceStopped}
                        >
                            {stopping ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <>
                                    <Ionicons
                                        name={attendanceStopped ? "checkmark-circle" : "stop-circle"}
                                        size={20}
                                        color="#fff"
                                    />
                                    <Text style={styles.stopText}>
                                        {attendanceStopped ? "Attendance Stopped" : "Stop Attendance"}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.warningContainer}>
                        <Text style={styles.warningText}>
                            *** Please stop the attendance process within the next 10 minutes to avoid any delays or issues. ***
                        </Text>
                    </View>
                </>
            )}

            {/* <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Class:</Text>
                    <Text style={styles.summaryValue}>{maxTotalClass}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Class Taken By You:</Text>
                    <Text style={styles.summaryValue}>{maxTotalClassTaken}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Total Student:</Text>
                    <Text style={styles.summaryValue}>{totalStudents}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryLabel, { color: '#28a745' }]}>Present:</Text>
                    <Text style={[styles.summaryValue, { color: '#28a745' }]}>{totalPresent}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryLabel, { color: '#dc3545' }]}>Absent:</Text>
                    <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{totalAbsent}</Text>
                </View>
            </View> */}

            {/* <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Student:</Text>
                        <Text style={styles.summaryValue}>{totalStudents}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryLabel, { color: '#28a745' }]}>Present:</Text>
                        <Text style={[styles.summaryValue, { color: '#28a745' }]}>{totalPresent}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryLabel, { color: '#dc3545' }]}>Absent:</Text>
                        <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{totalAbsent}</Text>
                    </View>
                </View>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Class:</Text>
                        <Text style={styles.summaryValue}>{maxTotalClass}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Taken By You:</Text>
                        <Text style={styles.summaryValue}>{maxTotalClassTaken}</Text>
                    </View>
                    <View style={[styles.summaryItem, { opacity: 0 }]}>
                        <Text style={styles.summaryLabel}>Total Student:</Text>
                        <Text style={styles.summaryValue}>{totalStudents}</Text>
                    </View>
                </View>
            </View> */}

            <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.inlineText}>
                            <Text style={styles.summaryLabel}>TS: </Text>
                            <Text style={styles.summaryValue}>{totalStudents}</Text>
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.inlineText}>
                            <Text style={[styles.summaryLabel, { color: '#28a745' }]}>P: </Text>
                            <Text style={[styles.summaryValue, { color: '#28a745' }]}>{totalPresent}</Text>
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.inlineText}>
                            <Text style={[styles.summaryLabel, { color: '#dc3545' }]}>A: </Text>
                            <Text style={[styles.summaryValue, { color: '#dc3545' }]}>{totalAbsent}</Text>
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.inlineText}>
                            <Text style={styles.summaryLabel}>TC: </Text>
                            <Text style={styles.summaryValue}>{maxTotalClass}</Text>
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.inlineText}>
                            <Text style={styles.summaryLabel}>You: </Text>
                            <Text style={styles.summaryValue}>{maxTotalClassTaken}</Text>
                        </Text>
                    </View>
                </View>

                {
                    /*
                    <View style={styles.summaryRow}>

                    <View style={[styles.summaryItem, { opacity: 0 }]}>
                        <Text style={styles.inlineText}>
                            <Text style={styles.summaryLabel}>Total Student: </Text>
                            <Text style={styles.summaryValue}>{totalStudents}</Text>
                        </Text>
                    </View>
                </View> */
                }
            </View>


            <View style={[styles.row, styles.headerRow]}>
                <TouchableOpacity
                    style={styles.checkboxContainer}
                    onPress={toggleSelectAll}
                >
                    <Icon
                        name={selectAll ? 'check-box' : 'check-box-outline-blank'}
                        size={24}
                        color={selectAll ? 'green' : '#fff'}
                    />
                </TouchableOpacity>
                <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
                <Text style={[styles.headerText, styles.smallCell]}>Present</Text>
                {/* <Text style={[styles.headerText, styles.smallCell]}>Absent</Text> */}
            </View>

            <FlatList
                data={studentData}
                keyExtractor={(item) => item.StudentId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />

            <TouchableOpacity
                style={[
                    styles.submitButton,
                    (codevaluedate && codevaluedate !== "" && !attendanceStopped) && styles.disabledButton
                ]}
                onPress={handleSubmit}
                // disabled={submitLoading}
                disabled={submitLoading || (codevaluedate && codevaluedate !== "" && !attendanceStopped)}
            >
                {submitLoading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Attendance</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: width * 0.03,
        paddingTop: 10,
        backgroundColor: '#f0f4f7',
    },
    criteriaContainer: {
        backgroundColor: '#fff',
        padding: 5,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2
    },
    criteriaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    criteriaText: {
        flex: 1,
        fontSize: 14,
        marginRight: 10,
        color: '#333',
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    summaryContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryItem: {
        alignItems: 'center',
        flex: 1,
        padding: 5,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },

    summaryValue: {
        fontSize: 12,
    },

    inlineText: {
        fontSize: 12,
        textAlign: 'center',
        flexWrap: 'wrap',
    },


    // summaryContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     backgroundColor: '#fff',
    //     padding: 5,
    //     borderRadius: 8,
    //     marginBottom: 5,
    //     elevation: 2,
    // },
    // summaryItem: {
    //     alignItems: 'center',
    //     flex: 1,
    // },
    // summaryLabel: {
    //     fontSize: 14,
    //     fontWeight: 'bold',
    //     marginBottom: 4,
    // },
    // summaryValue: {
    //     fontSize: 18,
    //     fontWeight: 'bold',
    // },
    // criteriaText: {
    //     fontSize: 14,
    //     marginBottom: 4,
    // },
    criteriaLabel: {
        fontWeight: 'bold',
        color: '#555',
    },
    list: {
        paddingBottom: 100,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        marginVertical: 6,
        backgroundColor: '#fff',
        elevation: 2,
    },
    headerRow: {
        backgroundColor: '#4a90e2',
        marginBottom: 8,
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.037,
    },
    checkboxContainer: {
        width: width * 0.1,
        alignItems: 'center',
    },
    nameColumn: {
        flex: 2,
    },
    nameText: {
        fontSize: width * 0.038,
        fontWeight: '600',
    },
    codeText: {
        fontSize: width * 0.036,
        color: '#555',
    },
    smallCell: {
        flex: 0.7,
        textAlign: 'center',
    },
    boldValue: {
        flex: 0.7,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: width * 0.038,
    },
    submitButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#4a90e2',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 4,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    codeStopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    codeContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    codeTextDisplay: {
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    stopButtonDisabled: {
        backgroundColor: '#6c757d',
    },
    stopText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    warningContainer: {
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    warningText: {
        color: 'red',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: 'bold'
    },
});

export default StudentAttendanceList;