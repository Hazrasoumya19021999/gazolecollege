import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Animated,
    Easing
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, postData } from '../../services/api';

const FeedbackForm = ({ route, navigation }) => {
    const {
        teacherId,
        teacherName,
        feedbackId: StudentFeedbackRegistrationId,
        feedbackName,
        studentFeedbackMasterId: StudentFeedbackMasterId,
        teacherType: teacherType
    } = route.params;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitPressed, setSubmitPressed] = useState(false);
    const QuestionCategoryId = 1;
    const progressAnim = new Animated.Value(0);

    const options = [
        { OptionId: 1, OptionText: 'Completely Agree', emoji: '😊', color: '#10B981' },
        { OptionId: 2, OptionText: 'Somewhat Agree', emoji: '🙂', color: '#F59E0B' },
        { OptionId: 3, OptionText: 'Somewhat Disagree', emoji: '😕', color: '#F97316' },
        { OptionId: 4, OptionText: 'Completely Disagree', emoji: '😞', color: '#EF4444' }
    ];

    useEffect(() => {
        loadQuestions();
    }, []);

    useEffect(() => {
        Animated.timing(progressAnim, {
            toValue: (Object.keys(answers).length / questions.length) * 100,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false
        }).start();
    }, [answers, questions.length]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            console.log(`Student/LoadFeedbackForm?StudentFeedbackRegistrationId=${StudentFeedbackRegistrationId}&TeacherId=${teacherId}&QuestionCategoryId=${QuestionCategoryId}&StudentFeedbackMasterId=${StudentFeedbackMasterId}`)
            const url = `Student/LoadFeedbackForm?StudentFeedbackRegistrationId=${StudentFeedbackRegistrationId}&TeacherId=${teacherId}&QuestionCategoryId=${QuestionCategoryId}&StudentFeedbackMasterId=${StudentFeedbackMasterId}`;
            const response = await getData(url);

            if (Array.isArray(response)) {
                const formatted = response.map((q, index) => ({
                    QuestionId: q.FeedbackQuestionMasterId,
                    QuestionText: q.QuestionDescription,
                    Options: options
                }));
                setQuestions(formatted);
            } else {
                setQuestions([]);
                Alert.alert('Info', 'No questions found.');
            }
        } catch (error) {
            console.error('Error loading questions:', error);
            Alert.alert('Error', 'Failed to load questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, answerId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answerId
        }));
    };

    const handleSubmit = () => {
        const unansweredQuestions = questions.filter(q => !answers[q.QuestionId]);

        if (unansweredQuestions.length > 0) {
            // Create a message with the unanswered question numbers
            const unansweredQuestionNumbers = unansweredQuestions.map((q, index) => {
                const questionIndex = questions.findIndex(question => question.QuestionId === q.QuestionId) + 1;
                return `Q${questionIndex}`;
            }).join(', ');

            Alert.alert(
                'Incomplete Feedback',
                `The following questions are not answered:\n\n${unansweredQuestionNumbers}\n\n`,
                [{ text: 'OK' }]
            );
            return;
        }

        confirmSubmission();
    };

    const confirmSubmission = () => {
        Alert.alert(
            'Submit Feedback',
            `Are you sure you want to submit feedback for ${teacherName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: submitFeedback }
            ]
        );
    };

    const submitFeedback = async () => {
        setSubmitPressed(true);
        try {
            // Prepare the data in the format expected by the API
            const feedbackTeachersModels = Object.keys(answers).map(qid => ({
                StudentFeedbackRegistrationId_FK: StudentFeedbackRegistrationId,
                TeacherType: "EMPLOYEE",
                TeacherId_FK: teacherId,
                FeedbackQuestionMasterId_FK: parseInt(qid),
                FeedbackAnswerId: answers[qid],
                TeacherId: teacherId,
                TeacherName: teacherName,
                StudentFeedbackMasterId: StudentFeedbackMasterId,
                FeedbackQuestionMasterId: parseInt(qid),
                CompletedFeedback: 1,
                GivenByTeacherId: 0
            }));

            const payload = {
                feedbackTeachersModels,
                TeacherId: teacherId,
                TeacherName: teacherName,
                StudentFeedbackRegistrationId_FK: StudentFeedbackRegistrationId,
                StudentFeedbackMasterId: StudentFeedbackMasterId
            };

            // Make the actual API call
            const response = await postData('Student/SaveTeacherWiseFeedback', payload);
            console.log('Feedback submission response:', response);

            // Check if response is greater than 0 (success)
            if (response > 0) {
                // Show success popup
                Alert.alert(
                    'Success',
                    `Feedback for ${teacherName} submitted successfully!`,
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // Navigate back to Feedback screen with refresh flag
                                navigation.navigate('Teacher Selection', {
                                    feedbackId: StudentFeedbackRegistrationId,
                                    feedbackName: feedbackName,
                                    studentfeedbackmasterid: StudentFeedbackMasterId
                                });
                            }
                        }
                    ],
                    { cancelable: false }
                );
            } else {
                throw new Error('Server returned unsuccessful status');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            Alert.alert(
                'Error',
                'Failed to submit feedback. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setSubmitPressed(false);
        }
    };

    if (loading) {
        return (
            <LinearGradient colors={['#f8fafc', '#e0e7ff']} style={styles.loadingContainer}>
                <Animated.View style={styles.loadingAnimation}>
                    <Icon name="notebook-edit-outline" size={60} color="#4f46e5" />
                    <ActivityIndicator size="large" color="#4f46e5" style={styles.loadingIndicator} />
                </Animated.View>
                <Text style={styles.loadingText}>Preparing your feedback form</Text>
                <Text style={styles.loadingSubText}>Please wait while we load the questions</Text>
            </LinearGradient>
        );
    }

    return (
        <LinearGradient colors={['#f8fafc', '#e0e7ff']} style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={['#4f46e5', '#6366f1']}
                    style={styles.headerCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.feedbackIcon}>
                            <Icon name="clipboard-edit-outline" size={28} color="white" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.feedbackTitle}>{feedbackName}</Text>
                            <View style={styles.teacherInfo}>
                                <Icon name="account" size={22} color="white" />
                                <Text style={styles.teacherName}>{teacherName}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressPercentage}>
                                {Math.round((Object.keys(answers).length / questions.length) * 100)}%
                            </Text>
                        </View>
                        <View style={styles.progressBar}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 100],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.progressText}>
                            {Object.keys(answers).length} of {questions.length} questions answered
                        </Text>
                    </View>
                </LinearGradient>

                {/* Questions */}
                {questions.map((q, index) => (
                    <Animated.View
                        key={q.QuestionId}
                        style={[
                            styles.questionCard,
                            {
                                opacity: answers[q.QuestionId] ? 1 : 0.9,
                                transform: [
                                    {
                                        scale: answers[q.QuestionId] ?
                                            new Animated.Value(1) :
                                            new Animated.Value(0.98)
                                    }
                                ]
                            }
                        ]}
                    >
                        <View style={styles.questionHeader}>
                            <View style={styles.questionNumberContainer}>
                                <Text style={styles.questionNumber}>Q{index + 1}</Text>
                            </View>
                            <Text style={styles.questionText}>{q.QuestionText}</Text>
                        </View>

                        <RadioButton.Group
                            onValueChange={value => handleAnswerSelect(q.QuestionId, parseInt(value))}
                            value={answers[q.QuestionId] || ''}
                        >
                            {q.Options.map(option => (
                                <TouchableOpacity
                                    key={option.OptionId}
                                    style={[
                                        styles.optionContainer,
                                        answers[q.QuestionId] === option.OptionId && {
                                            backgroundColor: `${option.color}15`,
                                            borderColor: option.color
                                        }
                                    ]}
                                    onPress={() => handleAnswerSelect(q.QuestionId, option.OptionId)}
                                    activeOpacity={0.7}
                                >
                                    <RadioButton
                                        value={option.OptionId}
                                        color={option.color}
                                        uncheckedColor="#cbd5e1"
                                    />
                                    <View style={styles.optionContent}>
                                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                                        <Text style={[
                                            styles.optionText,
                                            { color: answers[q.QuestionId] === option.OptionId ? option.color : '#334155' }
                                        ]}>
                                            {option.OptionText}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </RadioButton.Group>
                    </Animated.View>
                ))}

                {/* Submit Button - Always enabled */}
                <TouchableOpacity
                    style={[
                        styles.submitButton,
                        submitPressed && styles.submittingButton
                    ]}
                    onPress={handleSubmit}
                    disabled={submitPressed}
                    activeOpacity={0.8}
                >
                    {submitPressed ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <>
                            <Icon name="check-circle-outline" size={22} color="white" />
                            <Text style={styles.submitText}>Submit Feedback</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    loadingAnimation: {
        alignItems: 'center',
        marginBottom: 30,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '600',
        color: '#1e293b',
        textAlign: 'center',
    },
    loadingSubText: {
        marginTop: 8,
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    headerCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#4f46e5',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    feedbackIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    headerTextContainer: {
        flex: 1,
    },
    feedbackTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: 'white',
        marginBottom: 4,
    },
    teacherInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    teacherName: {
        color: 'white',
        fontSize: 16,
        marginLeft: 8,
        fontWeight: '500',
    },
    progressContainer: {
        marginTop: 10,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        color: '#e0e7ff',
        fontSize: 14,
        fontWeight: '500',
    },
    progressPercentage: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        marginBottom: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#facc15',
        borderRadius: 4,
    },
    progressText: {
        color: '#e0e7ff',
        fontSize: 13,
        textAlign: 'right',
    },
    questionCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    questionHeader: {
        marginBottom: 16,
    },
    questionNumberContainer: {
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 10,
    },
    questionNumber: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#4f46e5',
    },
    questionText: {
        fontSize: 16,
        color: '#1e293b',
        lineHeight: 24,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionEmoji: {
        fontSize: 20,
        marginRight: 10,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    submitButton: {
        backgroundColor: '#10b981',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    disabledButton: {
        backgroundColor: '#cbd5e1',
        shadowColor: '#94a3b8',
    },
    submittingButton: {
        backgroundColor: '#059669',
    },
    submitText: {
        fontSize: 17,
        color: 'white',
        fontWeight: '600',
        marginLeft: 10,
    },
});

export default FeedbackForm;