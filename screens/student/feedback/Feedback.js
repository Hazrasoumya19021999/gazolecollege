import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Animated,
  Easing,
  Alert,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getData } from '../../services/api';
import {
  Card,
  Text,
  Divider,
  ActivityIndicator,
  Button,
  Badge
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Feedback = () => {
  const navigation = useNavigation();
  const [studentId, setStudentId] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const [activeTab, setActiveTab] = useState('current');

  useEffect(() => {
    fetchFeedbackData();
    animateScreen();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadData = async () => {
        if (isActive) {
          await fetchFeedbackData();
          animateScreen();
        }
      };

      loadData();

      return () => {
        isActive = false;
      };
    }, [])
  );


  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      const value = await AsyncStorage.getItem('studentid');
      if (!value) {
        Alert.alert('Error', 'Student ID not found');
        setLoading(false);
        return;
      }

      setStudentId(value);
      console.log(`StudentReactNative/LoadFeedbackList?StudentId=${parseInt(value)}`)
      const [currentResponse, historyResponse] = await Promise.all([
        getData(`StudentReactNative/LoadFeedbackList?StudentId=${parseInt(value)}`),
        getData(`StudentReactNative/usp_StudentFeedbackHistory_GetAllForStudentPortal?StudentId=${parseInt(value)}`)
      ]);

      setCurrentData(Array.isArray(currentResponse) ? currentResponse : []);
      setHistoryData(Array.isArray(historyResponse) ? historyResponse : []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load feedback data. Please try again.');
      console.error('Feedback fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbackData();
  };

  const renderFeedbackItem = ({ item, index }) => {
    if (!item) return null;

    const status = item.FeedbackSubmitionStatus?.toUpperCase();
    const isSubmitted = status === "DONE";
    const isPending = status === "PENDING";
    const isExpired = status === "NOT GIVEN" || status === "EXPIRED";

    // Status configurations
    let statusConfig;
    if (isSubmitted) {
      statusConfig = {
        cardColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        badgeColor: '#16a34a',
        statusText: 'Completed',
        statusIcon: 'check-circle',
        textColor: '#166534',
        iconColor: '#4d7c0f'
      };
    } else if (isPending) {
      statusConfig = {
        cardColor: '#fff7ed',
        borderColor: '#fed7aa',
        badgeColor: '#ea580c',
        statusText: 'Pending',
        statusIcon: 'clock-outline',
        textColor: '#9a3412',
        iconColor: '#9a3412'
      };
    } else { // Expired/Not Given
      statusConfig = {
        cardColor: '#f5f5f5',
        borderColor: '#e5e5e5',
        badgeColor: '#6b7280',
        statusText: 'Expired',
        statusIcon: 'alert-circle-outline',
        textColor: '#4b5563',
        iconColor: '#6b7280'
      };
    }

    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          marginBottom: 16,
          marginHorizontal: 8,
        }}
      >
        <Card style={[
          styles.feedbackCard,
          {
            backgroundColor: statusConfig.cardColor,
            borderLeftWidth: 4,
            borderLeftColor: statusConfig.borderColor
          }
        ]}>
          <Card.Title
            title={item.FeedbackMasterName || 'Unnamed Feedback'}
            titleStyle={[
              styles.cardTitle,
              { color: statusConfig.textColor }
            ]}
            // subtitle={`ID: ${item.StudentFeedbackRegistrationId || 'N/A'}`}
            subtitleStyle={styles.cardSubtitle}
            right={() => (
              <Badge
                style={[
                  styles.badge,
                  {
                    backgroundColor: statusConfig.badgeColor,
                    borderRadius: 12
                  }
                ]}
                size={24}
              >
                <View style={styles.badgeContainer}>
                  <Icon name={statusConfig.statusIcon} size={16} color="white" />
                  <Text style={styles.badgeText}>
                    {statusConfig.statusText}
                  </Text>
                </View>
              </Badge>
            )}
          />
          <Card.Content>
            <View style={styles.infoRow}>
              <Icon name="book-open-page-variant" size={16} color={statusConfig.iconColor} />
              <Text style={[
                styles.infoText,
                { color: statusConfig.textColor }
              ]}>
                Session: {item.SessionName || 'N/A'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={16} color={statusConfig.iconColor} />
              <Text style={[
                styles.infoText,
                { color: statusConfig.textColor }
              ]}>
                {item.FeedbackEndDate ?
                  `Due: ${new Date(item.FeedbackEndDate).toLocaleDateString()}` :
                  'No deadline'
                }
              </Text>
            </View>

            {isPending && (
              <Button
                mode="contained"
                icon="send"
                style={styles.submitButton}
                labelStyle={styles.submitLabel}
                onPress={() =>
                  navigation.navigate('Teacher Selection', {
                    feedbackId: item.StudentFeedbackRegistrationId,
                    feedbackName: item.FeedbackMasterName,
                    studentfeedbackmasterid: item.StudentFeedbackMasterId
                  })
                }
                contentStyle={styles.buttonContent}
              >
                Submit Feedback
              </Button>
            )}

            {/* <Button
                                mode="contained"
                                icon="send"
                                style={styles.submitButton}
                                labelStyle={styles.submitLabel}
                                onPress={() =>
                                    navigation.navigate('Teacher Selection', {
                                        feedbackId: item.StudentFeedbackRegistrationId,
                                        feedbackName: item.FeedbackMasterName,
                                        studentfeedbackmasterid: item.StudentFeedbackMasterId
                                    })
                                }
                                contentStyle={styles.buttonContent}
                            >
                                Submit Feedback
                            </Button> */}

            {isSubmitted && (
              <View style={[
                styles.submittedInfo,
                { backgroundColor: '#dcfce7' }
              ]}>
                <Icon name="check-decagram" size={18} color="#16a34a" />
                <Text style={[
                  styles.submittedText,
                  { color: '#166534' }
                ]}>
                  Feedback submitted successfully
                </Text>
              </View>
            )}

            {isExpired && (
              <View style={[
                styles.submittedInfo,
                { backgroundColor: '#f3f4f6' }
              ]}>
                <Icon name="alert-outline" size={18} color="#6b7280" />
                <Text style={[
                  styles.submittedText,
                  { color: '#4b5563' }
                ]}>
                  Feedback period has ended
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };
  const renderTabContent = () => {
    const data = activeTab === 'current' ? currentData : historyData;

    return (
      <FlatList
        data={data}
        renderItem={renderFeedbackItem}
        keyExtractor={(item, index) => item?.StudentFeedbackRegistrationId?.toString() || `${activeTab}-${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3b82f6']}
            tintColor="#3b82f6"
            progressBackgroundColor="#ffffff"
          />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard} elevation={2}>
            <Card.Content style={styles.emptyContent}>
              <Icon name="text-box-remove" size={40} color="#d1d5db" />
              <Text style={styles.emptyText}>
                No {activeTab === 'current' ? 'current' : 'historical'} feedback available
              </Text>
              <Button
                mode="text"
                onPress={onRefresh}
                icon="refresh"
                textColor="#3b82f6"
                style={styles.refreshButton}
              >
                Refresh
              </Button>
            </Card.Content>
          </Card>
        }
        contentContainerStyle={data.length === 0 ? styles.emptyListContainer : null}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          animating={true}
          size="large"
          color="#3b82f6"
          style={styles.loadingIndicator}
        />
        <Text style={styles.loadingText}>Loading your feedback...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feedback Center</Text>
        <Text style={styles.headerSubtitle}>
          {activeTab === 'current' ?
            'Provide feedback for your current courses' :
            'View your feedback history'
          }
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'current' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('current')}
          style={[styles.tabButton, activeTab === 'current' && styles.activeTab]}
          labelStyle={[styles.tabLabel, activeTab === 'current' && styles.activeTabLabel]}
          icon="clipboard-list"
        >
          Current
        </Button>
        <Button
          mode={activeTab === 'history' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('history')}
          style={[styles.tabButton, activeTab === 'history' && styles.activeTab]}
          labelStyle={[styles.tabLabel, activeTab === 'history' && styles.activeTabLabel]}
          icon="history"
        >
          History
        </Button>
      </View>

      {renderTabContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  header: {
    padding: 20,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabLabel: {
    color: '#64748b',
    fontWeight: '500',
  },
  activeTabLabel: {
    color: '#ffffff',
  },
  feedbackCard: {
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  badge: {
    marginRight: 16,
    paddingHorizontal: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#475569',
  },
  submitButton: {
    marginTop: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonContent: {
    height: 40,
  },
  submitLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  submittedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  submittedText: {
    marginLeft: 8,
    fontSize: 14,
  },
  emptyCard: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    elevation: 1,
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Feedback;