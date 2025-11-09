import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native';
import { postData, getData } from '../services/api';

const Attendance = () => {
    const navigation = useNavigation()
    const [studentid, SetStudentId] = useState(0)
    const [data, Setdata] = useState([])
    const [loading, setLoading] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        const value = AsyncStorage.getItem('studenttokenid')
        console.log(value)
        setLoading(false);
    }, [])

    const onDateChange = (event, selected) => {
        setShowDatePicker(false);
        if (selected) {
            setSelectedDate(selected);
        }
    };

    const GetStudentData = async () => {
        try {
            setLoading(true);
            const value = await AsyncStorage.getItem('studentid')
            if (value !== null) {
                SetStudentId(value)
                const result = await getData(`StudentNewReactNative/StudentAttendance?studentid=${parseInt(value)}&attendancedate=${formatDate(selectedDate)}`)
                console.log(result)
                if (result != "No Data Found") {
                    Setdata(result)
                    setLoading(false);
                } else {
                    Setdata([])
                    setLoading(false);
                    Alert.alert("No Data Found");
                }
            }
        } catch (e) {
            console.log(e)
            setLoading(false);
        }
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.subjectName}>{item.SubjectName}</Text>
                    <Text style={styles.paperText}>{item.Paper}</Text>
                </View>
                <View style={[
                    styles.statusContainer,
                    item.IsPresent === "Yes" ? styles.presentContainer : styles.absentContainer
                ]}>
                    <Text style={styles.statusText}>
                        {item.IsPresent === "Yes" ? "PRESENT" : "ABSENT"}
                    </Text>
                </View>
            </View>
            
            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Period</Text>
                        <Text style={styles.infoValue}>{item.PeriodName}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Type</Text>
                        <Text style={styles.infoValue}>{item.SubjectType}</Text>
                    </View>
                </View>
                
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Teacher</Text>
                        <Text style={styles.infoValue}>{item.TeacherName}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            {loading ? <LoadingAnimation /> : (
                <View style={styles.container}>
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
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={GetStudentData}
                        style={styles.searchButton}>
                        <Text style={styles.searchButtonText}>Search</Text>
                    </TouchableOpacity>

                    {data.length > 0 ? (
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.listContainer}
                        />
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No attendance records found</Text>
                        </View>
                    )}
                </View>
            )}
        </SafeAreaView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} color="#00517c" />
            <Text style={styles.indicatorText}>Loading Attendance Details...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa'
    },
    container: {
        flex: 1,
        padding: 16,
    },
    datePickerContainer: {
        marginBottom: 20,
    },
    datePickerButton: {
        flexDirection: 'row',
        padding: 15,
        borderWidth: 1,
        borderColor: '#00517c',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        elevation: 3,
    },
    datePickerText: {
        fontSize: 16,
        color: '#00517c',
        fontWeight: 'bold',
    },
    searchButton: {
        backgroundColor: '#00517c',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 3,
    },
    searchButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    subjectName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00517c',
    },
    paperText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusContainer: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    presentContainer: {
        backgroundColor: '#d4edda',
        borderColor: '#c3e6cb',
        borderWidth: 1,
    },
    absentContainer: {
        backgroundColor: '#f8d7da',
        borderColor: '#f5c6cb',
        borderWidth: 1,
    },
    statusText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#155724',
        textTransform: 'uppercase',
    },
    cardBody: {
        paddingTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 8,
        justifyContent: 'space-between',
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#555',
        fontSize: 12,
    },
    infoValue: {
        color: '#333',
        fontSize: 14,
        marginTop: 2,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
    },
    indicator: {
        marginBottom: 20,
    },
    indicatorText: {
        fontSize: 16,
        color: '#00517c',
    },
});

export default Attendance;