import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { Appbar, Card, Title, Divider, TextInput, Button } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const leaveData = [
  { type: 'CASUAL LEAVE (CL)', credit: '5.00', taken: '2.00', balance: '3.00', icon: 'beach' },
  { type: 'EARNED LEAVE (EL)', credit: '10.00', taken: '4.00', balance: '6.00', icon: 'wallet' },
  { type: 'DUTY LEAVE (DL)', credit: '8.00', taken: '1.00', balance: '7.00', icon: 'briefcase' },
  { type: 'ABSENCE ON DUTY (AOD)', credit: '5.00', taken: '0.00', balance: '5.00', icon: 'account-alert' },
  { type: 'MEDICAL LEAVE (ML)', credit: '15.00', taken: '3.00', balance: '12.00', icon: 'hospital-box' },
  { type: 'CHILD CARE LEAVE', credit: '30.00', taken: '5.00', balance: '25.00', icon: 'baby-carriage' },
  { type: 'MATERNITY LEAVE', credit: '180.00', taken: '0.00', balance: '180.00', icon: 'human-pregnant' },
  { type: 'PATERNITY LEAVE', credit: '30.00', taken: '0.00', balance: '30.00', icon: 'human-male-child' },
];

const leaveOptions = [
  { label: 'Casual Leave (CL)', value: 'CL', icon: 'beach' },
  { label: 'Earned Leave (EL)', value: 'EL', icon: 'wallet' },
  { label: 'Duty Leave (DL)', value: 'DL', icon: 'briefcase' },
  { label: 'Absence On Duty (AOD)', value: 'AOD', icon: 'account-alert' },
  { label: 'Medical Leave (ML)', value: 'ML', icon: 'hospital-box' },
  { label: 'Child Care Leave', value: 'CCL', icon: 'baby-carriage' },
  { label: 'Maternity Leave', value: 'MAT', icon: 'human-pregnant' },
  { label: 'Paternity Leave', value: 'PAT', icon: 'human-male-child' },
];

const ApplyLeaveScreen = () => {
  const [leaveType, setLeaveType] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [description, setDescription] = useState('');

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => {}} color="#fff" />
        <Appbar.Content 
          title="Apply Leave" 
          titleStyle={styles.headerTitle} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.pageTitle}>My Leave Balance</Text>
          <Text style={styles.pageSubtitle}>Available leave credits for current year</Text>
        </View>

        <View style={styles.cardContainer}>
          {leaveData.map((leave, index) => (
            <Card key={index} style={[styles.card, styles.cardElevated]}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Icon name={leave.icon} size={24} color="#4a6da7" />
                  <Title style={styles.leaveType}>{leave.type.split(' (')[0]}</Title>
                </View>
                <Divider style={styles.divider} />
                <View style={styles.leaveRow}>
                  <Text style={styles.text}>Credit:</Text>
                  <Text style={styles.value}>{leave.credit}</Text>
                </View>
                <View style={styles.leaveRow}>
                  <Text style={styles.text}>Taken:</Text>
                  <Text style={styles.value}>{leave.taken}</Text>
                </View>
                <View style={styles.leaveRow}>
                  <Text style={styles.text}>Balance:</Text>
                  <Text style={[styles.value, styles.balanceValue]}>{leave.balance}</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Apply Leave</Text>
            <View style={styles.sectionLine} />
          </View>

          <Dropdown
            data={leaveOptions}
            labelField="label"
            valueField="value"
            placeholder="Select Leave Type"
            value={leaveType}
            onChange={item => setLeaveType(item.value)}
            style={styles.dropdown}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedTextStyle={styles.dropdownSelectedText}
            iconColor="#4a6da7"
            renderLeftIcon={() => (
              <Icon 
                name={leaveType ? leaveOptions.find(item => item.value === leaveType)?.icon : 'format-list-bulleted'} 
                size={20} 
                color="#4a6da7" 
                style={styles.dropdownIcon}
              />
            )}
            itemTextStyle={styles.dropdownItemText}
            activeColor="#f0f4f8"
          />

          <View style={styles.dateInputContainer}>
            <View style={styles.dateInput}>
              <TextInput
                label="From Date"
                value={fromDate}
                onChangeText={setFromDate}
                style={styles.input}
                placeholder="DD/MM/YYYY"
                left={<TextInput.Icon name="calendar-start" color="#4a6da7" />}
                mode="outlined"
                outlineColor="#e0e0e0"
                activeOutlineColor="#4a6da7"
              />
            </View>
            <View style={styles.dateInput}>
              <TextInput
                label="To Date"
                value={toDate}
                onChangeText={setToDate}
                style={styles.input}
                placeholder="DD/MM/YYYY"
                left={<TextInput.Icon name="calendar-end" color="#4a6da7" />}
                mode="outlined"
                outlineColor="#e0e0e0"
                activeOutlineColor="#4a6da7"
              />
            </View>
          </View>

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.descriptionInput}
            multiline
            numberOfLines={4}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor="#4a6da7"
            left={<TextInput.Icon name="text" color="#4a6da7" />}
          />

          <Button 
            mode="contained" 
            style={styles.submitButton} 
            labelStyle={styles.submitButtonLabel}
            onPress={() => {}}
            icon="send"
          >
            Submit Application
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#4a6da7',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 20,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 0,
  },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  leaveType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 10,
  },
  leaveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  text: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  value: {
    fontWeight: '600',
    color: '#2c3e50',
  },
  balanceValue: {
    color: '#27ae60',
  },
  divider: {
    marginVertical: 8,
    backgroundColor: '#ecf0f1',
    height: 1,
  },
  formContainer: {
    marginTop: 10,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionLine: {
    height: 3,
    width: 50,
    backgroundColor: '#4a6da7',
    borderRadius: 2,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dropdownPlaceholder: {
    color: '#95a5a6',
    fontSize: 15,
  },
  dropdownSelectedText: {
    color: '#2c3e50',
    fontSize: 15,
    marginLeft: 8,
  },
  dropdownItemText: {
    color: '#2c3e50',
  },
  dropdownIcon: {
    marginRight: 8,
  },
  dateInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInput: {
    width: '48%',
  },
  input: {
    backgroundColor: '#fff',
  },
  descriptionInput: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#4a6da7',
    shadowColor: '#4a6da7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default ApplyLeaveScreen;