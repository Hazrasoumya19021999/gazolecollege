import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Dimensions,
    Alert
} from 'react-native';
import { getData } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Badge } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TeacherSelection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { feedbackId, feedbackName, studentfeedbackmasterid } = route.params || {};
    const studentFeedbackRegistrationId = feedbackId;
    const studentFeedbackMasterId = studentfeedbackmasterid;

    useEffect(() => {
        if (studentFeedbackRegistrationId) {
            fetchTeachers();
        }
    }, [studentFeedbackRegistrationId]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;

            const loadData = async () => {
                if (isActive) {
                    console.log('Loading feedback teachers...');
                    fetchTeachers();
                }
            };

            loadData();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            console.log(`StudentReactNative/LoadFeedbackTeachers?StudentFeedbackRegistrationId=${studentFeedbackRegistrationId}`)
            const response = await getData(
                `StudentReactNative/LoadFeedbackTeachers?StudentFeedbackRegistrationId=${studentFeedbackRegistrationId}`
            );

            console.log('Fetched Teachers:', response);

            if (Array.isArray(response)) {
                setTeachers(response);
                // Check if all teachers have completed feedback
                const teachersNotCompleted = response.filter(item => item.CompletedFeedback === 0);
                if (teachersNotCompleted.length === 0) {
                    await markFeedbackAsComplete();
                    endFeedbackProcess();
                    return;
                }
            } else if (response?.Message === 'No Data Found') {
                navigation.navigate('General Feedback', {
                    feedbackId: studentFeedbackRegistrationId,
                    studentFeedbackMasterId: studentFeedbackMasterId
                });
            } else {
                setTeachers([]);
            }
        } catch (error) {
            navigation.navigate('General Feedback', {
                feedbackId: studentFeedbackRegistrationId,
                studentFeedbackMasterId: studentFeedbackMasterId
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const markFeedbackAsComplete = async () => {
        try {
            const response = await getData(
                `Student/StudentFeedBackCompleteStatus?StudentFeedbackRegistrationId_FK=${studentFeedbackRegistrationId}`,
                {} // Empty body since it's just a status update
            );
            console.log('Feedback marked as complete:', response);
            return response;
        } catch (error) {
            console.error('Error marking feedback as complete:', error);
            throw error;
        }
    };

    const endFeedbackProcess = () => {
        Alert.alert(
            'Feedback Completed',
            'You have successfully submitted feedback for all teachers.',
            [{
                text: 'OK',
                onPress: () => navigation.reset({
                    index: 0,
                    routes: [{ name: 'Feedback' }]
                })
            }]
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchTeachers();
    };

    const handleTeacherSelect = (teacher) => {
        if (teacher.CompletedFeedback === 1) {
            Alert.alert(
                'Feedback Submitted',
                `You've already submitted feedback for ${teacher.TeacherName}`,
                [{ text: 'OK', style: 'default' }]
            );
            return;
        }

        console.log('Selected Teacher:', teacher);

        navigation.navigate('Feedback Form', {
            teacherId: teacher.TeacherId,
            teacherName: teacher.TeacherName,
            feedbackId: studentFeedbackRegistrationId,
            feedbackName: feedbackName,
            studentFeedbackMasterId: studentFeedbackMasterId,
            teacherType: teacher.TeacherType,
        });
    };

    const getTeacherStatus = (completedFeedback) => {
        return completedFeedback === 1
            ? {
                color: '#10B981',
                bgColor: '#ECFDF5',
                icon: 'check-circle',
                text: 'Submitted',
                badgeColor: '#10B981'
            }
            : {
                color: '#F59E0B',
                bgColor: '#FFFBEB',
                icon: 'clock-outline',
                text: 'Pending',
                badgeColor: '#F59E0B'
            };
    };

    const renderTeacherItem = ({ item }) => {
        const status = getTeacherStatus(item.CompletedFeedback);
        const initials = item.TeacherName.split(' ').map(n => n[0]).join('').toUpperCase();

        return (
            <TouchableOpacity
                style={[styles.teacherCard, { backgroundColor: status.bgColor }]}
                onPress={() => handleTeacherSelect(item)}
            >
                <View style={styles.teacherContent}>
                    <View style={[styles.avatar, { backgroundColor: `${status.color}20` }]}>
                        <Text style={[styles.avatarText, { color: status.color }]}>
                            {initials}
                        </Text>
                    </View>

                    <View style={styles.teacherInfo}>
                        <Text style={styles.teacherName}>{item.TeacherName}</Text>
                        <Text style={styles.teacherType}>
                            {item.TeacherType === 'EMPLOYEE' ? 'Faculty' : item.TeacherType}
                        </Text>
                    </View>

                    <Badge
                        size={24}
                        style={[styles.statusBadge, { backgroundColor: status.badgeColor }]}
                    >
                        <View style={styles.badgeContent}>
                            <Icon name={status.icon} size={14} color="white" />
                            <Text style={styles.badgeText}>{status.text}</Text>
                        </View>
                    </Badge>
                </View>
            </TouchableOpacity>
        );
    };

    if (!studentFeedbackRegistrationId) {
        return (
            <LinearGradient
                colors={['#F8FAFC', '#E0E7FF']}
                style={styles.errorContainer}
            >
                <View style={styles.errorContent}>
                    <Icon name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorTitle}>Missing Information</Text>
                    <Text style={styles.errorMessage}>
                        We couldn't find the feedback details. Please go back and try again.
                    </Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.actionButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        );
    }

    if (loading) {
        return (
            <LinearGradient
                colors={['#F8FAFC', '#E0E7FF']}
                style={styles.loadingContainer}
            >
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Loading Teachers</Text>
                <Text style={styles.loadingSubtext}>Please wait while we fetch your teachers</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient
            colors={['#F8FAFC', '#E0E7FF']}
            style={styles.container}
        >
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#3B82F6']}
                        tintColor="#3B82F6"
                    />
                }
            >
                <View style={styles.header}>
                    {/* <Text style={styles.headerTitle}>Feedback Portal</Text> */}
                    <Text style={styles.feedbackName}>{feedbackName}</Text>
                </View>

                <View style={styles.instructionSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="information-outline" size={20} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>Instructions</Text>
                    </View>
                    <View style={styles.instructionCard}>
                        <View style={styles.instructionItem}>
                            <View style={styles.instructionIcon}>
                                <Icon name="numeric-1-box" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.instructionText}>
                                8 simple MCQ questions per teacher
                            </Text>
                        </View>
                        <View style={styles.instructionItem}>
                            <View style={styles.instructionIcon}>
                                <Icon name="numeric-2-box" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.instructionText}>
                                Takes just 2-3 minutes to complete
                            </Text>
                        </View>
                        <View style={styles.instructionItem}>
                            <View style={styles.instructionIcon}>
                                <Icon name="numeric-3-box" size={20} color="#3B82F6" />
                            </View>
                            <Text style={styles.instructionText}>
                                Your honest feedback helps us improve
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.teacherSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="account-group" size={20} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>Select Teacher</Text>
                    </View>

                    {teachers.length > 0 ? (
                        <FlatList
                            data={teachers}
                            renderItem={renderTeacherItem}
                            keyExtractor={(item) => item.TeacherId.toString()}
                            scrollEnabled={false}
                            contentContainerStyle={styles.teacherList}
                        />
                    ) : (
                        <View style={styles.emptyState}>
                            <Icon name="account-question" size={48} color="#9CA3AF" />
                            <Text style={styles.emptyTitle}>No Teachers Found</Text>
                            <Text style={styles.emptyMessage}>
                                There are no teachers available for this feedback
                            </Text>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={onRefresh}
                            >
                                <Text style={styles.actionButtonText}>
                                    <Icon name="refresh" size={16} color="white" /> Refresh
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 24,
        paddingBottom: 16,
        backgroundColor: 'white',
        marginBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 4,
    },
    feedbackName: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '500',
    },
    instructionSection: {
        marginHorizontal: 16,
        marginBottom: 24,
    },
    teacherSection: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginLeft: 8,
    },
    instructionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    instructionIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    instructionText: {
        fontSize: 15,
        color: '#475569',
        flex: 1,
        lineHeight: 22,
    },
    teacherList: {
        paddingBottom: 24,
    },
    teacherCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    teacherContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    teacherInfo: {
        flex: 1,
    },
    teacherName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 4,
    },
    teacherType: {
        fontSize: 14,
        color: '#64748B',
    },
    statusBadge: {
        marginLeft: 12,
        borderRadius: 12,
        paddingHorizontal: 8,
    },
    badgeContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    emptyState: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 32,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 16,
    },
    emptyMessage: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    actionButton: {
        backgroundColor: '#3B82F6',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 16,
    },
    loadingSubtext: {
        fontSize: 14,
        color: '#64748B',
        marginTop: 8,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1E293B',
        marginTop: 16,
    },
    errorMessage: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
});

export default TeacherSelection;