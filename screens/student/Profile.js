import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, ScrollView, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../services/api';

const Profile = () => {
    const [email, setEmail] = useState()
    const [studentemail, setstudentemail] = useState()
    const [imageurl, setprflimage] = useState()
    const [mobileno, setmobileno] = useState()
    const [currsem, setcurrsem] = useState()
    const [curryear, setcurryear] = useState()
    const [course, setcourse] = useState()
    const [village, setvillage] = useState('')
    const [district, setdistrict] = useState('')
    const [studentId, setStudentId] = useState('')
    const [subjectsData, setSubjectsData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [CompulsorySubjectName, setCompulsorySubjectName] = useState('')
    const [PassSub1, setPassSub1] = useState('')
    const [PassSub2, setPassSub2] = useState('')
    const [PassSub3, setPassSub3] = useState('')
    const [AdmissionSessionId, setAdmissionSessionId] = useState('')
    const [StudentPresentAddress, setStudentPresentAddress] = useState('')
    const [StudentPermanentAddress, setStudentPermanentAddress] = useState('')
    const [BloodGroup, setBloodGroup] = useState('')
    const [FatherName, setFatherName] = useState('')
    const [MotherName, setMotherName] = useState('')
    const [AadhaarNo, setAadhaarNo] = useState('')
    const [Gender, setGender] = useState('')
    const [AECSubject, setAECSubject] = useState('')

    // Default image URL
    const DEFAULT_IMAGE_URL = 'https://gmg.ac.in/erp/Student/StudentPhoto/2024/S1.jpg';

    useEffect(() => {
        getProfileData()
    }, [])

    // Watch imageurl updates
    useEffect(() => {
        if (imageurl) {
            console.log("Updated Image URL:", imageurl);
        }
    }, [imageurl]);

    const getProfileData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            const value1 = await AsyncStorage.getItem('studentemail')
            const value3 = await AsyncStorage.getItem('mob')
            const value7 = await AsyncStorage.getItem('currsem')
            const value8 = await AsyncStorage.getItem('curryear')
            const value10 = await AsyncStorage.getItem('coursename')
            const value11 = await AsyncStorage.getItem('village')
            const value13 = await AsyncStorage.getItem('district')
            const value14 = await AsyncStorage.getItem('studentid');
            const compsub = await AsyncStorage.getItem('compsubject');
            const firstsub = await AsyncStorage.getItem('firstsubject');
            const secondsub = await AsyncStorage.getItem('secondsubject');
            const thirdsub = await AsyncStorage.getItem('thirdsubject');
            const admissionsessionid = await AsyncStorage.getItem('admissionsessionid');
            const StudentPresentAddress = await AsyncStorage.getItem('StudentPresentAddress');
            const StudentPermanentAddress = await AsyncStorage.getItem('StudentPermanentAddress');
            const BloodGroup = await AsyncStorage.getItem('BloodGroup');
            const FatherName = await AsyncStorage.getItem('FatherName');
            const MotherName = await AsyncStorage.getItem('MotherName');
            const AadhaarNo = await AsyncStorage.getItem('AadhaarNo');
            const Gender = await AsyncStorage.getItem('Gender');

            console.log("admissionsessionid:", admissionsessionid);

            setEmail(value)
            setstudentemail(value1)
            setmobileno(value3)
            setcurrsem(value7)
            setcurryear(value8)
            setcourse(value10)
            setStudentId(value14)
            if (value11) setvillage(value11)
            if (value13) setdistrict(value13)

            setCompulsorySubjectName(compsub || '')
            setPassSub1(firstsub || '')
            setPassSub2(secondsub || '')
            setPassSub3(thirdsub || '')
            setAdmissionSessionId(admissionsessionid)
            setStudentPresentAddress(StudentPresentAddress || '')
            setStudentPermanentAddress(StudentPermanentAddress || '')
            setBloodGroup(BloodGroup || '')
            setFatherName(FatherName || '')
            setMotherName(MotherName || '')
            setAadhaarNo(AadhaarNo || '')
            setGender(Gender || '')

            // Set default image initially
            setprflimage(DEFAULT_IMAGE_URL);

            // Fetch subjects data only if AdmissionSessionId >= 16
            if (value14 && admissionsessionid && parseInt(admissionsessionid) >= 16) {
                try {
                    console.log("API Call => StudentReactNative/LoadStudentSubjects?studentid=" + value14)
                    const subjectsResponse = await getData("StudentReactNative/LoadStudentSubjects?studentid=" + value14);
                    console.log("Subjects Response:", subjectsResponse);

                    setSubjectsData(subjectsResponse);
                    //setAddress(subjectsResponse.Address || '');

                    setAECSubject(subjectsResponse.AECOneSubjectId || 'N/A');

                    // Update image only if available from API, otherwise keep default
                    if (subjectsResponse.StudentPhoto) {
                        setprflimage(subjectsResponse.StudentPhoto);
                        console.log("Image URL from API:", subjectsResponse.StudentPhoto);
                    } else {
                        console.log("No image from API, using default image");
                        setprflimage(DEFAULT_IMAGE_URL);
                    }
                } catch (error) {
                    console.log("Error fetching subjects:", error);
                    // Keep default image on error
                    setprflimage(DEFAULT_IMAGE_URL);
                }
            }

            setLoading(false);

        } catch (e) {
            console.log(e)
            setprflimage(DEFAULT_IMAGE_URL);
            setLoading(false);
        }
    }

    // Function to handle image loading errors
    const handleImageError = () => {
        console.log("Image failed to load, using default image");
        setprflimage(DEFAULT_IMAGE_URL);
    }

    // Function to get VAC subject based on current semester
    const getVACSubject = () => {
        if (!subjectsData || !currsem) return 'N/A';
        const sem = parseInt(currsem);
        switch (sem) {
            case 1: return subjectsData.FirstVACSubjectName || 'N/A';
            case 2: return subjectsData.SecondVACSubjectName || 'N/A';
            case 4: return subjectsData.FiveVACSubjectName || 'N/A';
            default: return 'N/A';
        }
    }

    // Function to get Minor subject based on current semester
    const getMinorSubject = () => {
        if (!subjectsData || !currsem) return 'N/A';
        const sem = parseInt(currsem);
        switch (sem) {
            case 1: return subjectsData.Minor1Subject || 'N/A';
            case 2: return subjectsData.Minor2Subject || 'N/A';
            case 3: return subjectsData.Minor3Subject || 'N/A';
            case 4: return subjectsData.Minor4Subject || 'N/A';
            case 5: return subjectsData.Minor5Subject || 'N/A';
            case 6: return subjectsData.Minor6Subject || 'N/A';
            case 7: return subjectsData.Minor7Subject || 'N/A';
            case 8: return subjectsData.Minor8Subject || 'N/A';
            default: return 'N/A';
        }
    }

    // Function to get MDC subject based on current semester
    const getMDCSubject = () => {
        if (!subjectsData || !currsem) return 'N/A';
        const sem = parseInt(currsem);
        switch (sem) {
            case 1: return subjectsData.FirstMDCSubjectName || 'N/A';
            case 2: return subjectsData.SecondMDCSubjectName || 'N/A';
            case 3: return subjectsData.ThirdMDCSubjectName || 'N/A';
            default: return 'N/A';
        }
    }

    return (
        <ScrollView>
            {
                loading ?
                    <LoadingAnimation /> :
                    <View style={styles.container}>
                        <Image source={require('../assets/Malda3.png')} style={styles.header} />
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: imageurl || DEFAULT_IMAGE_URL
                            }}
                            onError={handleImageError}

                        // Optional: local placeholder
                        />
                        <View style={styles.body}>
                            <Text style={styles.name}>{email}</Text>
                            <Text style={styles.info}>Email Id : {studentemail}</Text>
                            <Text style={styles.info}>Mobile No : {mobileno}</Text>
                            <Text style={styles.info}>Gender : {Gender}</Text>
                            <Text style={styles.info}>Blood Group : {BloodGroup}</Text>
                            <Text style={styles.info}>Aadhaar No : {AadhaarNo}</Text>

                            <View style={{ marginTop: 5, marginLeft: 7, marginRight: 7 }}>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Father Name</Text>
                                    <Text style={styles.descinfo}>{FatherName}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Mother Name</Text>
                                    <Text style={styles.descinfo}>{MotherName}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Present Address</Text>
                                    <Text style={styles.descinfo}>{StudentPresentAddress}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Permanent Address</Text>
                                    <Text style={styles.descinfo}>{StudentPermanentAddress}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Course</Text>
                                    <Text style={styles.descinfo}>{course}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Current Year</Text>
                                    <Text style={styles.descinfo}>{curryear}</Text>
                                </View>
                                <View style={styles.descheader}>
                                    <Text style={styles.desc}>Current Semester</Text>
                                    <Text style={styles.descinfo}>{currsem}</Text>
                                </View>

                                {/* Conditional subjects display */}
                                {AdmissionSessionId && parseInt(AdmissionSessionId) < 16 ? (
                                    <>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>Compulsory Subject</Text>
                                            <Text style={styles.descinfo}>{CompulsorySubjectName}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>Pass Subject 1</Text>
                                            <Text style={styles.descinfo}>{PassSub1}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>Pass Subject 2</Text>
                                            <Text style={styles.descinfo}>{PassSub2}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>Pass Subject 3</Text>
                                            <Text style={styles.descinfo}>{PassSub3}</Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>VAC Subject</Text>
                                            <Text style={styles.descinfo}>{getVACSubject()}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>AEC Subject</Text>
                                            <Text style={styles.descinfo}>{AECSubject}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>Minor Subject</Text>
                                            <Text style={styles.descinfo}>{getMinorSubject()}</Text>
                                        </View>
                                        <View style={styles.descheader}>
                                            <Text style={styles.desc}>MDC Subject</Text>
                                            <Text style={styles.descinfo}>{getMDCSubject()}</Text>
                                        </View>
                                    </>
                                )}

                                {/* <View style={styles.descheader}>
                                    <Text style={styles.desc}>Address</Text>
                                    <Text style={styles.descinfo}>{Address}</Text>
                                </View> */}
                            </View>
                        </View>
                    </View>
            }
        </ScrollView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading Profile..Please Wait...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00BFFF',
        height: 200,
        width: '100%'
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130,
        backgroundColor: '#f0f0f0', // Background color as fallback
    },
    name: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00517c'
    },
    body: {
        marginTop: "17%",
    },
    info: {
        fontSize: 16,
        marginTop: 2,
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold'
    },
    desc: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#00517c',
        padding: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    descinfo: {
        textAlignVertical: 'center',
        backgroundColor: '#ffffff',
        padding: 10,
        fontSize: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        color: 'black',
    },
    descheader: {
        borderColor: '#78a6c8',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
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
})

export default Profile;