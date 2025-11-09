import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { DarkTheme } from '@react-navigation/native';
import Dashboard from '../Dashboard';
import CustomDrawer from '../CustomDrawer';
import Profile from '../Profile';
import Notice from '../Notice';
import NoticeDetails from '../NoticeDetails';
import StudentICard from '../StudentICard';
import AboutUs from '../../normal/AboutUs';
import Attendance from '../Attendence';
import AttendanceSummaryReport from '../AttendanceSummaryReport';
import Fees from '../Fees';
import FeesDetails from '../FeesDetails';
import AdmissionFee from '../AdmissionFee';
import StudyMaterial from '../StudyMaterial';

import InstantFeedback from '../InstantFeedback';
import Routine from '../Routine';
import AcademicCalender from '../AcademicCalender';
import CodeOfConduct from '../CodeOfConduct';
import DownloadDocument from '../DownloadDocuments';
import DownloadDetails from '../DownloadDetails';
import SemWiseAttendanceReport from '../SemWiseAttendanceReport';
import StudentMarksView from '../StudentMarksView';
import CollegeLeavingCertificate from '../CollegeLeavingCertificate';
import ChangePassword from '../../normal/ChangePassword';
import Feedback from '../feedback/Feedback';

import GiveAttendance from '../GiveAttendance';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer  {...props} />}
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

      <Drawer.Screen name='Dashboard' component={Dashboard} options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name='My Profile' component={Profile} />
      <Drawer.Screen name='My Notice' component={Notice} options={{ headerTitle: 'My Notice', drawerLabel: 'My Notice' }} />
      <Drawer.Screen name='NoticeDetails' component={NoticeDetails} options={{
        headerTitle: 'Notice Details', drawerLabel: 'Notice Details',
        drawerItemStyle: { display: 'none' }
      }} />
      <Drawer.Screen name='StudentICard' component={StudentICard} options={{ headerTitle: 'Id Card', drawerLabel: 'Id Card', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name='Attendance' component={Attendance} options={{ headerTitle: 'My Attendance', drawerLabel: 'My Attendance', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name='AttendanceSummaryReport' component={AttendanceSummaryReport} options={{ headerTitle: 'Attendance Summery Report', drawerLabel: 'Attendance Report', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name='Fees' component={Fees} options={{ headerTitle: 'My Fees', drawerLabel: 'My Fees',  drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name='Student Fees' component={FeesDetails} options={{ headerTitle: 'Fees Details', drawerLabel: 'Fees Details', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name='Admission Fees' component={AdmissionFee} options={{ headerTitle: 'Admission Fees', drawerLabel: 'Admission Fees', drawerItemStyle: { display: 'none' } }} />

      {/* <Drawer.Screen name='Study Material' component={StudyMaterial} options={{ headerTitle: 'Study Material', drawerLabel: 'Study Material' }} />
      <Drawer.Screen name='Feedback' component={Feedback} options={{ headerTitle: 'Feedback', drawerLabel: 'Feedback' }} />
      <Drawer.Screen name='Instant Feedback' component={InstantFeedback} options={{ headerTitle: 'Instant Feedback', drawerLabel: 'Instant Feedback' }} />
      <Drawer.Screen name='Routine' component={Routine} options={{ headerTitle: 'Routine', drawerLabel: 'Routine' }} />
      <Drawer.Screen name='Academic Calender' component={AcademicCalender} options={{ headerTitle: 'Academic Calender', drawerLabel: 'Academic Calender' }} />
      <Drawer.Screen name='Code Of Conduct' component={CodeOfConduct} options={{ headerTitle: 'Code Of Conduct', drawerLabel: 'Code Of Conduct' }} />
      <Drawer.Screen name='Download Document' component={DownloadDocument} options={{ headerTitle: 'Download Documents', drawerLabel: 'Download Documents' }} />
      <Drawer.Screen name='Download Details' component={DownloadDetails}
        options={{
          headerTitle: 'Download Details',
          drawerLabel: 'Download Details',
          drawerItemStyle: { display: 'none' }
        }}
      /> */}
      <Drawer.Screen name='GiveAttendance' component={GiveAttendance}
        options={{
          headerTitle: 'Give Attendance',
          drawerLabel: 'Give Attendance',
          drawerItemStyle: { display: 'none' }
        }}
      />
      {/* <Drawer.Screen name='Sem Wise Attendance Report' component={SemWiseAttendanceReport} options={{ headerTitle: 'Sem Wise Attendance Report', drawerLabel: 'Attendance Report(SEM)' }} />
      <Drawer.Screen name='Student Marks View' component={StudentMarksView} options={{ headerTitle: 'Student Marks View', drawerLabel: 'Student Marks View' }} />
      <Drawer.Screen name='College Leaving Certificate' component={CollegeLeavingCertificate} options={{ headerTitle: 'College Leaving Certificate', drawerLabel: 'College Leaving Certificate' }} /> */}
      <Drawer.Screen name='Change Password' component={ChangePassword} options={{ headerTitle: 'Change Password', drawerLabel: 'Change Password' }} />
      <Drawer.Screen name='AboutUs' component={AboutUs} options={{ headerTitle: 'About College', drawerLabel: 'About College' }} />
    </Drawer.Navigator>
  )
}
export default DrawerNavigation;