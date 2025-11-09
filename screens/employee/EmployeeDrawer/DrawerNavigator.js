import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import EmployeeProfile from '../EmployeeProfile';
import EmployeeDashboard from '../EmployeeDashboard';
import EmployeeCustomDrawer from '../EmployeeCustomDrawer';
import EmployeeNotice from '../EmployeeNotice';
import EmployeeNoticeDetails from '../EmployeeNoticeDetails';
import MyDairy from '../MyDairy';
import StudentAttendance from '../StudentAttendance';
import StudentAttendanceList from '../StudentAttendanceList';
import AttendanceSummeryReport from '../AttendanceSummeryReport';
import AttendanceReportList from '../AttendanceReportList';
import ApplyLeave from '../ApplyLeave';
import FacultyActivity from '../FacultyActivity';
import DownloadDocument from '../DownloadDocument';
import DownloadDetails from '../DownloadDetails';
import MyClass from '../MyClass';
import Vcard from '../Vcard';
import CollegeDirectory from '../CollegeDirectory';
import AttendanceHistory from '../AttendanceHistory';
import ChangePassword from '../../normal/ChangePassword';
import AboutUs from '../../normal/AboutUs';

import MonthlyBiometricAttendanceCountReportTeaching from '../MonthlyBiometricAttendanceCountReportTeaching';
import TeacherClassTakenReport from '../TeacherClassTakenReport';
import MonthlyPerformanceList from '../MonthlyPerformanceList';
import MonthlyBiometricAttendanceCountReportNonTeaching from '../MonthlyBiometricAttendanceCountReportNonTeaching';
import BiometricInoutReportNonTeaching from '../BiometricInoutReportNonTeaching';
import DailyStudentAttedanceReport from '../DailyStudentAttedanceReport';
import EmployeeDetails from '../EmployeeDetails';

import MonthlyPerformanceListTeacherWise from '../MonthlyPerformanceListTeacherWise';
import Meeting from '../Meeting';
import EmployeeBiometricAttendanceReportInDetails1 from '../EmployeeBiometricAttendanceReportInDetails1';

import MyPerformanceEntry from '../MyPerformanceEntry';


const Drawer = createDrawerNavigator();
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            drawerContent={props => <EmployeeCustomDrawer {...props} />}
            screenOptions={{
                drawerActiveBackgroundColor: '#00517c',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#333',
                drawerLabelStyle: {
                    fontSize: 15,
                },
                headerStyle: {
                    backgroundColor: '#00517c',
                },
                headerTintColor: 'white',
                headerTitleAlign: 'center'
            }}>
            <Drawer.Screen name='Employee Dashboard' component={EmployeeDashboard} options={{ headerTitle: 'Dashboard', drawerLabel: 'Dashboard' }} />
            <Drawer.Screen
                name="Employee Profile"
                component={EmployeeProfile}
                options={{
                    headerTitle: 'My Profile',
                    drawerLabel: 'My Profile'
                }}
            />
            <Drawer.Screen
                name="Employee Notice"
                component={EmployeeNotice}
                options={{
                    headerTitle: 'My Notice',
                    drawerLabel: 'My Notice',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Employee Details"
                component={EmployeeDetails}
                options={{
                    headerTitle: 'Employee Details',
                    drawerLabel: 'Employee Details',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Employee Notice Details"
                component={EmployeeNoticeDetails}
                options={{
                    headerTitle: 'Notice Details',
                    drawerLabel: 'Notice Details',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="MonthlyBiometricAttendanceCountReportTeaching"
                component={MonthlyBiometricAttendanceCountReportTeaching}
                options={{
                    headerTitle: 'Monthly Biometric Attendance Count Report Teaching',
                    drawerLabel: 'Monthly Biometric Attendance Count Report Teaching',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="DailyStudentAttedanceReport"
                component={DailyStudentAttedanceReport}
                options={{
                    headerTitle: 'Daily Student Attedance Report',
                    drawerLabel: 'Daily Student Attedance Report',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="TeacherClassTakenReport"
                component={TeacherClassTakenReport}
                options={{
                    headerTitle: 'Teacher Class Taken Report',
                    drawerLabel: 'Teacher Class Taken Report',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="BiometricInoutReportNonTeaching"
                component={BiometricInoutReportNonTeaching}
                options={{
                    headerTitle: 'Biometric In Out Report NonTeaching',
                    drawerLabel: 'Biometric In Out Report NonTeaching',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="MonthlyPerformanceList"
                component={MonthlyPerformanceList}
                options={{
                    headerTitle: 'Monthly Performance List (All)',
                    drawerLabel: 'Monthly Performance List (All)',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="MonthlyBiometricAttendanceCountReportNonTeaching"
                component={MonthlyBiometricAttendanceCountReportNonTeaching}
                options={{
                    headerTitle: 'Monthly Biometric Attendance Count Report NonTeaching',
                    drawerLabel: 'Monthly Biometric Attendance Count Report NonTeaching',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="MonthlyPerformanceListTeacherWise"
                component={MonthlyPerformanceListTeacherWise}
                options={{
                    headerTitle: 'Monthly Performance List',
                    drawerLabel: 'My Performance List',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Meeting"
                component={Meeting}
                options={{
                    headerTitle: 'Meeting',
                    drawerLabel: 'Meeting',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Student Attendance"
                component={StudentAttendance}
                options={{
                    headerTitle: 'Class Attendance',
                    drawerLabel: 'Class Attendance',
                    drawerItemStyle: { display: 'none' }

                }}
            />
            <Drawer.Screen
                name="Student Attendance List"
                component={StudentAttendanceList}
                options={{
                    headerTitle: 'Student Attendance List',
                    drawerLabel: 'Student Attendance List',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Attendance summary Report"
                component={AttendanceSummeryReport}
                options={{
                    headerTitle: 'Student Attendance Report',
                    drawerLabel: 'Attendance Report',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Attendance Report List"
                component={AttendanceReportList}
                options={{
                    headerTitle: 'Student List',
                    drawerLabel: 'Attendance Report List',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="EmployeeBiometricAttendanceReportInDetails1"
                component={EmployeeBiometricAttendanceReportInDetails1}
                options={{
                    headerTitle: 'Biometric in and out Time Report(Teaching)',
                    drawerLabel: 'Biometric in and out Time Report(Teaching)',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Apply Leave"
                component={ApplyLeave}
                options={{
                    headerTitle: 'Leave Count',
                    drawerLabel: 'Leave Count',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Faculty Activity"
                component={FacultyActivity}
                options={{
                    headerTitle: 'Activities',
                    drawerLabel: 'Activity',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Download Document"
                component={DownloadDocument}
                options={{
                    headerTitle: 'Download Document',
                    drawerLabel: 'Download Document',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Download Details"
                component={DownloadDetails}
                options={{
                    headerTitle: 'Download Details',
                    drawerLabel: 'Download Details',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="My Class"
                component={MyClass}
                options={{
                    headerTitle: 'My Class',
                    drawerLabel: 'My Class',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="MyPerformanceEntry"
                component={MyPerformanceEntry}
                options={{
                    headerTitle: 'Monthly Performance Entry',
                    drawerLabel: 'My Performance Entry',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="V-Card"
                component={Vcard}
                options={{
                    headerTitle: 'V-Card',
                    drawerLabel: 'V-Card',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="College Directory"
                component={CollegeDirectory}
                options={{
                    headerTitle: 'College Directory',
                    drawerLabel: 'College Directory'
                }}
            />
            <Drawer.Screen
                name="Attendance History"
                component={AttendanceHistory}
                options={{
                    headerTitle: 'My Biometric Report',
                    drawerLabel: 'Attendance History',
                    drawerItemStyle: { display: 'none' }
                }}
            />
            <Drawer.Screen
                name="Change Password"
                component={ChangePassword}
                options={{
                    headerTitle: 'Change Password',
                    drawerLabel: 'Change Password'
                }}
            />
            <Drawer.Screen
                name="About Us"
                component={AboutUs}
                options={{
                    headerTitle: 'About College',
                    drawerLabel: 'About Us'
                }}
            />
            {/* <Drawer.Screen
                name="TestOne"
                component={TestOne}
                options={{
                    headerTitle: 'TestOne',
                    drawerLabel: 'TestOne'
                }}
            /> */}

        </Drawer.Navigator>
    );
};
const styles = StyleSheet.create({
    menuContainer: {
        flex: 1,
        marginTop: 10,
    },

    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginHorizontal: 20,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f2f2f2',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutText: {
        marginLeft: 10,
        color: '#d90429',
        fontSize: 16,
        fontWeight: 'bold',
    },

    drawerHeader: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
    },
    logo: {
        width: '100%',
        height: 120,
        marginBottom: 10,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#000',
        marginTop: 5,
    },
    // Regular menu item
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    menuIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
    },
    menuLabel: {
        fontSize: 16,
        color: '#444',
        fontWeight: '600',
    },

    // Dropdown menu item
    dropdownMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Arrow aligns right
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    menuTextContainer: {
        flexDirection: 'row', // Icon and label align left
        alignItems: 'center',
    },
    dropdownArrowIcon: {
        width: 16,
        height: 16,
        tintColor: '#444',
        transform: [{ rotate: '0deg' }], // Default rotation
    },
    dropdownArrowIconOpen: {
        transform: [{ rotate: '180deg' }], // Rotate arrow when open
    },

    // Dropdown container
    dropdownContainer: {
        marginLeft: 30, // Indent for hierarchy
        marginTop: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor: '#f9f9f9',
    },
    dropdownLabel: {
        fontSize: 16,
        color: '#0077b6',
        fontWeight: '500',
    },
    dropdownSeparator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 5,
    },
});


export default DrawerNavigator;