import React from 'react'
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler'

import Login from './normal/Login';
import Parent from './normal/Parent';
import Dashboard from './student/Dashboard';
import Profile from './student/Profile';
import Notice from './student/Notice';
import NoticeDetails from './student/NoticeDetails';
import StudentICard from './student/StudentICard';
import Fees from './student/Fees';
import FeesDetails from './student/FeesDetails';
import AdmissionFee from './student/AdmissionFee';
import CodeOfConduct from './student/CodeOfConduct';
import AcademicCalender from './student/AcademicCalender';
import Routine from './student/Routine';
import StudyMaterial from './student/StudyMaterial';
import StudentMarksView from './student/StudentMarksView';
import AttendanceSummaryReport from './student/AttendanceSummaryReport';
import DownloadDocument from './student/DownloadDocuments';
import DownloadDetails from './student/DownloadDetails';
import InstantFeedback from './student/InstantFeedback';
import SemWiseAttendanceReport from './student/SemWiseAttendanceReport';
import Attendance from './student/Attendence';

import CustomDrawer from './student/CustomDrawer';
import EmployeeParent from './normal/EmployeeParent';
import MyComponent from './student/MyComponent';
import CollegeLeavingCertificate from './student/CollegeLeavingCertificate';
import ChangePassword from './normal/ChangePassword';
import AboutUs from './normal/AboutUs';

import Feedback from './student/feedback/Feedback';
import FeedbackForm from './student/feedback/FeedbackForm';
import GeneralFeedback from './student/feedback/GeneralFeedback';
import TeacherSelection from './student/feedback/TeacherSelection';
import Test from './student/feedback/Test';

import SendPassword from './normal/SendPassword';
import ForgottenPassword from './normal/ForgottenPassword';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const EmpStack = createNativeStackNavigator();
const EmpDrawer = createDrawerNavigator();

const AppNavigator = () => {
  let a = 1;
  return (
    <NavigationContainer independent={true}>
      <StackNavigation />
    </NavigationContainer>
  )
}
export default AppNavigator

const StackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Parent" component={Parent} options={{ headerShown: false }} />
      <Stack.Screen name='Dashboard' component={Dashboard} />
      <Stack.Screen name="Employee" component={EmployeeParent} options={{ headerShown: false }} />
      <Stack.Screen name='Profile' component={Profile} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },

      }} />
      <Stack.Screen name='Notice' component={Notice} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='NoticeDetails' component={NoticeDetails} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='StudentICard' component={StudentICard} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='Fees' component={Fees} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='SendPassword' component={SendPassword} options={{
        title: 'Forgot password',
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='Student Fees' component={FeesDetails} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' }, headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Admission Fees' component={AdmissionFee} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' }, headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Code Of Conduct' component={CodeOfConduct} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Academic Calender' component={AcademicCalender} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Routine' component={Routine} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Study Material' component={StudyMaterial} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Student Marks View' component={StudentMarksView} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Feedback' component={Feedback} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }

      }} />

      <Stack.Screen
        name="Teacher Selection"
        component={TeacherSelection} options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          }
        }}
      />
      <Stack.Screen
        name="Feedback Form"
        component={FeedbackForm} options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          }
        }}
      />
      <Stack.Screen
        name="General Feedback"
        component={GeneralFeedback}
        options={{
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: '#00517c',
          }
        }}
      />
      <Stack.Screen name='AttendanceSummaryReport' component={AttendanceSummaryReport} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Download Document' component={DownloadDocument} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Download Details' component={DownloadDetails} options={{
        headerTintColor: 'white',
        drawerItemStyle: { display: 'none' },
        headerStyle: {
          backgroundColor: '#00517c',
        },
      }} />
      <Stack.Screen name='Instant Feedback' component={InstantFeedback} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Sem Wise Attendance Report' component={SemWiseAttendanceReport} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Attendance' component={Attendance} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='College Leaving Certificate' component={CollegeLeavingCertificate} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Change Password' component={ChangePassword} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='Forgot Password' component={ForgottenPassword} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        }
      }} />
      <Stack.Screen name='AboutUs' component={AboutUs} options={{
        headerTintColor: 'white',
        headerStyle: {
          backgroundColor: '#00517c',
        },
        // headerShown: false
      }} />
    </Stack.Navigator>
  )
}
