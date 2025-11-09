import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import EmployeeDashboard from './EmployeeDashboard';
import EmployeeProfile from './EmployeeProfile';
import EmployeeNotice from './EmployeeNotice';
import EmployeeNoticeDetails from './EmployeeNoticeDetails';
import AttendanceSummeryReport from './AttendanceSummeryReport';
import StudentAttendance from './StudentAttendance';
import AttendanceReportList from './AttendanceReportList';
import MyDairy from './MyDairy';
import FacultyActivity from './FacultyActivity';
import MonthlyBiometricAttendanceCountReportTeaching from './MonthlyBiometricAttendanceCountReportTeaching';
import TeacherClassTakenReport from './TeacherClassTakenReport';
import MonthlyPerformanceList from './MonthlyPerformanceList';
import MonthlyBiometricAttendanceCountReportNonTeaching from './MonthlyBiometricAttendanceCountReportNonTeaching';
import BiometricInoutReportNonTeaching from './BiometricInoutReportNonTeaching';
import DailyStudentAttedanceReport from './DailyStudentAttedanceReport';
import DownloadDocument from './DownloadDocument';
import DownloadDetails from './DownloadDetails';
import MyClass from './MyClass';
import Vcard from './Vcard';
import PeerFeedback from './PeerFeedback';
import SelfAssessment from './SelfAssessment';
import CollegeDirectory from './CollegeDirectory';
import AttendanceHistory from './AttendanceHistory';
import AppNavigator from '../AppNavigator';
import EmployeeDetails from './EmployeeDetails';
import StudentAttendanceList from './StudentAttendanceList';
import ApplyLeave from './ApplyLeave';
import ChangePassword from '../normal/ChangePassword';
import AboutUs from '../normal/AboutUs';
import MyAttendance from './MyAttendance';
import TestOne from './TestOne';


const EmpStack = createNativeStackNavigator();
const EmpDrawer = createDrawerNavigator();

const EmployeeNavigator = () => {
  return (

    <NavigationContainer independent={true}>
      <EmployeeStackNavigator />
    </NavigationContainer>
  )
}

export default EmployeeNavigator

const EmployeeStackNavigator = () => {
  return (
    <EmpStack.Navigator initialRouteName='Login'>
      <EmpStack.Screen name="Employee Dashboard" component={EmployeeDashboard} />
      <EmpStack.Screen name="Employee Profile" component={EmployeeProfile}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}

      />
      <EmpStack.Screen name="MonthlyBiometricAttendanceCountReportTeaching" component={MonthlyBiometricAttendanceCountReportTeaching}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}

      />
      <EmpStack.Screen name="TeacherClassTakenReport" component={TeacherClassTakenReport}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}
      />
      <EmpStack.Screen name="MonthlyPerformanceList" component={MonthlyPerformanceList}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}
      />
      <EmpStack.Screen name="MonthlyBiometricAttendanceCountReportNonTeaching" component={MonthlyBiometricAttendanceCountReportNonTeaching}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}
      />
      <EmpStack.Screen name="DailyStudentAttedanceReport" component={DailyStudentAttedanceReport}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}
      />
      <EmpStack.Screen name="BiometricInoutReportNonTeaching" component={BiometricInoutReportNonTeaching}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          },
        }}
      />
      <EmpStack.Screen name="Employee Notice" component={EmployeeNotice} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Employee Notice Details' component={EmployeeNoticeDetails} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Student Attendance' component={StudentAttendance} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Attendance summary Report' component={AttendanceSummeryReport} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Attendance Report List' component={AttendanceReportList} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='My Diary' component={MyDairy} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Faculty Activity' component={FacultyActivity} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Download Document' component={DownloadDocument} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Download Details' component={DownloadDetails} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='My Class' component={MyClass} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />

      <EmpStack.Screen name='V-Card' component={Vcard} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Peer Feedback' component={PeerFeedback} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Self Assessment' component={SelfAssessment} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='College Directory' component={CollegeDirectory} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Attendance History' component={AttendanceHistory} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Student Attendance List' component={StudentAttendanceList} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='AppNavigator' component={AppNavigator} options={{
        headerShown: false,
        drawerItemStyle: { display: 'none' },
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Employee Details' component={EmployeeDetails} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />

      <EmpStack.Screen name='Apply Leave' component={ApplyLeave} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='Change Password' component={ChangePassword} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='About Us' component={AboutUs} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <EmpStack.Screen name='My Attendance' component={MyAttendance} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />

      <EmpStack.Screen name='TestOne' component={TestOne} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />


    </EmpStack.Navigator>
  )
}

