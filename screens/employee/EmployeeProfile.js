import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  BackHandler, 
  SafeAreaView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../services/api';
import { useNavigation } from '@react-navigation/native';

const EmployeeProfile = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [Empid, setEmpId] = useState('');
    const [Empcode, setEmpcode] = useState('');
    const [dept, setDept] = useState('');
    const [desg, setDesg] = useState('');
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [email, setEmmail] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        const backAction = () => {
            navigation.goBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        getEmployeeData();

        return () => backHandler.remove();
    }, []);

    const getEmployeeData = async () => {
        try {
            setLoading(true);
            const empId = await AsyncStorage.getItem('empid');
            const employeeDetails = await getData(`Employee/EmployeeDetails?EmployeeId=${empId}`);
            
            setEmpcode(employeeDetails.EmpCode || '');
            setDept(employeeDetails.Department || '');
            setName(`${employeeDetails.FirstName || ''} ${employeeDetails.MiddleName || ''} ${employeeDetails.LastName || ''}`.trim());
            setMobile(employeeDetails.ContactNo1 || '');
            setDesg(employeeDetails.Designation || '');
            setEmmail(employeeDetails.ContactEmail1 || '');
            setAddress(employeeDetails.PermanentAddress || '');
            setPhoto(employeeDetails.Photo || '');
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {loading ? (
                    <LoadingAnimation />
                ) : (
                    <View style={styles.container}>
                        <Image 
                            source={require('../assets/Malda3.png')} 
                            style={styles.header} 
                            resizeMode="cover"
                        />
                        <Image
                            style={styles.avatar}
                             source={{ uri: photo }}
                            resizeMode="cover"
                        />
                        <View style={styles.body}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.info}>{desg}</Text>
                            <Text style={styles.info}>Mobile No: {mobile}</Text>
                            
                            <View style={styles.detailsContainer}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.desc}>Employee Code</Text>
                                    <Text style={styles.descinfo}>{Empcode}</Text>
                                </View>
                                
                                <View style={styles.detailItem}>
                                    <Text style={styles.desc}>Department</Text>
                                    <Text style={styles.descinfo}>{dept}</Text>
                                </View>
                                
                                <View style={styles.detailItem}>
                                    <Text style={styles.desc}>Email Id</Text>
                                    <Text style={styles.descinfo}>{email}</Text>
                                </View>
                                
                                <View style={styles.detailItem}>
                                    <Text style={styles.desc}>Address</Text>
                                    <Text style={styles.descinfo}>{address}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#00517c" />
            <Text style={styles.indicatorText}>Loading Profile...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 200,
        width: '100%',
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 4,
        borderColor: 'white',
        alignSelf: 'center',
        position: 'absolute',
        top: 130,
        backgroundColor: '#f0f0f0',
    },
    body: {
        marginTop: 70,
        paddingHorizontal: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00517c',
        textAlign: 'center',
        marginBottom: 5,
    },
    info: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 15,
    },
    detailsContainer: {
        marginTop: 10,
    },
    detailItem: {
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        backgroundColor: '#fff',
    },
    desc: {
        fontSize: 16,
        color: 'white',
        fontWeight: 'bold',
        backgroundColor: '#00517c',
        padding: 10,
    },
    descinfo: {
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    indicatorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorText: {
        marginTop: 15,
        fontSize: 16,
        color: '#00517c',
    },
});

export default EmployeeProfile;