import {
    View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, BackHandler, Alert,
    Image, TouchableOpacity, Linking, ActivityIndicator, FlatList
} from 'react-native'
import React, { useEffect, useState } from 'react'

const StudentAttendanceSave = ({ route, navigation }) => {

    const [loading, setLoading] = useState(true);

    const { data } = route.params;
    const [attendanceRecords, setAttendanceRecords] = useState([])

    useEffect(() => {
        setAttendanceRecords(data)
        setLoading(false);
    }, [])

    const GetStudentData = async () => {
        // console.log('Session',Sessionvalue)
        // console.log('YearId',yearId)
        // console.log('SemId',semesterId)
        // console.log('SubjectId',subjectId)
        // console.log('StudentCode',studentcode)
        // const body = {
        //     SessionId: sessionValue,
        //     YearId: yearId,
        //     SemNo: semesterId,
        //     SubjectType : subjectTypeId,
        //     SubjectId: subjectId,
        //     SectionId: sectionId,
        //     Paper : paperId,
        //     PeriodId : periodId,
        //     TeacherId : teacherId,
        //     Date : selectedDate
        // }

        // console.log(body)
        // const studentdata = await postData(`Employee/BindStudent`, body);
        // setData(studentdata);
        // console.log('JSON', studentdata);
        // console.log('Length ', studentdata.length)    
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <FlatList
                        data={attendanceRecords}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, marginHorizontal: 10 }}>
                                <TouchableOpacity onPress={() => abc(item.NoticeBody, item.NoticeDate, item.NoticeTitle, item.NoticeNumber, item.DocumentPath, item.PublishFromDate)} style={{
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
            <Text style={styles.indicatorText}>Loading Student..</Text>
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
        justifyContent: 'space-between',
        flexDirection: 'row',
        padding: 5
    },
    noticetitle: {
        fontSize: 17,
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

export default StudentAttendanceSave