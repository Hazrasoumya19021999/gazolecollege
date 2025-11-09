import React, { useState, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    StatusBar,
    SafeAreaView,
    ActivityIndicator,
    Image
} from 'react-native';
import {
    TextInput,
    Card,
    Title,
    Paragraph,
    Button,
    Text,
    Searchbar,
    Avatar,
    Divider
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { postData, getData } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CollegeDirectory = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [empMobileNo, setEmpMobileNo] = useState('');
    const [empCode, setEmpCode] = useState('');
    const [empFirstName, setEmpFirstName] = useState('');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setLoading(false);
    }, []);

    const GetEmployeeData = async () => {
        // if (!empMobileNo && !empCode && !empFirstName) {
        //     Alert.alert('Warning', 'Please enter at least one search criteria');
        //     return;
        // }

        setLoading(true);
        const body = {
            EmpCode: empCode,
            FirstName: empFirstName,
            MobileNo: empMobileNo
        };

        try {
            const employeeData = await postData(`EmployeeNew/GetAllEmployeeList`, body);
            if (employeeData != "No Data Found") {
                setData(employeeData);
            } else {
                setData([]);
                Alert.alert("No Results", "No employees found matching your criteria");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch employee data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const GetEmployeeProfileDetails = async (empId) => {
        setLoading(true);
        try {
            const employeeDetails = await getData(`Employee/EmployeeDetails?EmployeeId=${empId}`);
            if (employeeDetails != "No Data Found") {
                navigation.navigate('Employee Details', { data: employeeDetails });
            } else {
                Alert.alert("No Data Found");
            }
        } catch (error) {
            Alert.alert("Error", "Failed to fetch employee details");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = data.filter(item => 
        item.FullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.DepartmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.Designation && item.Designation.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
            
            {/* <View style={styles.header}>
                <Text style={styles.headerTitle}>College Directory</Text>
            </View> */}

            <View style={styles.searchContainer}>
                {/* <Searchbar
                    placeholder="Search employees..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor="#6200ee"
                /> */}
            </View>

            <View style={styles.filterContainer}>
                <TextInput
                    label="Mobile Number"
                    mode="outlined"
                    style={styles.input}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={empMobileNo}
                    onChangeText={(text) => {
                        const formatted = text.replace(/[^0-9]/g, '');
                        if (formatted.length <= 10) {
                            setEmpMobileNo(formatted);
                        }
                    }}
                    left={<TextInput.Icon name="phone" />}
                />

                <TextInput
                    label="Employee Code"
                    mode="outlined"
                    style={styles.input}
                    value={empCode}
                    onChangeText={setEmpCode}
                    left={<TextInput.Icon name="card-account-details" />}
                />

                <TextInput
                    label="First Name"
                    mode="outlined"
                    style={styles.input}
                    value={empFirstName}
                    onChangeText={setEmpFirstName}
                    left={<TextInput.Icon name="account" />}
                />

                <Button
                    mode="contained"
                    onPress={GetEmployeeData}
                    style={styles.searchButton}
                    labelStyle={styles.buttonLabel}
                    icon="magnify"
                    loading={loading}
                    disabled={loading}
                >
                    Search
                </Button>
            </View>

            {loading ? (
                <LoadingAnimation />
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.EmployeeId.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="account-search" size={60} color="#6200ee" />
                            <Text style={styles.emptyText}>No employees found</Text>
                            <Text style={styles.emptySubText}>Try adjusting your search criteria</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.cardHeader}>
                                    <Avatar.Image 
                                        size={60}
                                        source={{
                                            uri: `https://gmg.ac.in/erp/Common/${item.Photo}`,
                                        }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.headerText}>
                                        <Title style={styles.name}>{item.FullName}</Title>
                                        <Paragraph style={styles.department}>{item.DepartmentName}</Paragraph>
                                    </View>
                                </View>

                                <View style={styles.detailsContainer}>
                                    <Divider style={styles.divider} />
                                    
                                    <View style={styles.detailRow}>
                                        <Icon name="briefcase" size={20} color="#6200ee" />
                                        <Text style={styles.detailText}>
                                            {item.Designation || 'Not specified'}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Icon name="phone" size={20} color="#6200ee" />
                                        <Text style={styles.detailText}>
                                            {item.MobileNo || 'Not specified'}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Icon name="email" size={20} color="#6200ee" />
                                        <Text style={styles.detailText}>
                                            {item.Email || 'Not specified'}
                                        </Text>
                                    </View>

                                    <Button
                                        mode="outlined"
                                        style={styles.profileButton}
                                        onPress={() => GetEmployeeProfileDetails(item.EmployeeId)}
                                        icon="account-details"
                                    >
                                        View Full Profile
                                    </Button>
                                </View>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.indicatorText}>Loading employee data...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#6200ee',
        padding: 16,
        elevation: 4,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    searchBar: {
        borderRadius: 8,
        elevation: 2,
        backgroundColor: 'white',
    },
    searchInput: {
        fontSize: 14,
    },
    filterContainer: {
        padding: 16,
        paddingTop: 8,
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    searchButton: {
        marginTop: 8,
        borderRadius: 8,
        backgroundColor: '#6200ee',
        paddingVertical: 6,
    },
    buttonLabel: {
        color: 'white',
        fontSize: 16,
    },
    listContent: {
        padding: 16,
        paddingTop: 8,
    },
    card: {
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 16,
        backgroundColor: '#e0e0e0',
    },
    headerText: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    department: {
        fontSize: 14,
        color: '#666',
    },
    detailsContainer: {
        marginTop: 12,
    },
    divider: {
        marginVertical: 8,
        backgroundColor: '#e0e0e0',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#444',
    },
    profileButton: {
        marginTop: 12,
        borderColor: '#6200ee',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#6200ee',
        marginTop: 16,
        fontWeight: 'bold',
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
    indicatorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorText: {
        marginTop: 16,
        color: '#6200ee',
    },
});

export default CollegeDirectory;