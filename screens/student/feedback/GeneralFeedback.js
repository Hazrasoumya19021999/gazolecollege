import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Animated,
    Easing,
    BackHandler,
    TextInput
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, postData } from '../../services/api';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const GeneralFeedback = ({ route, navigation }) => {
    const {
        feedbackId: StudentFeedbackRegistrationId,
        studentFeedbackMasterId: StudentFeedbackMasterId,
        feedbackName
    } = route.params;

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [descriptiveAnswers, setDescriptiveAnswers] = useState({});
    const [submitPressed, setSubmitPressed] = useState(false);
    const QuestionCategoryId = 0;
    const TeacherId = 0;
    const progressAnim = new Animated.Value(0);

    // Get color based on option position
    const getColorByPosition = (index) => {
        switch (index) {
            case 0: return '#10B981'; // Green for first option
            case 1: return '#F59E0B'; // Amber for second option
            case 2: return '#F97316'; // Orange for third option
            default: return '#94a3b8'; // Gray for all other options
        }
    };

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('Feedback');
                return true;
            };

            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress
            );

            return () => backHandler.remove();
        }, [navigation])
    );

    useEffect(() => {
        loadQuestions();
    }, []);

    useEffect(() => {
        const answeredQuestions = Object.keys(answers).length + Object.keys(descriptiveAnswers).length;
        Animated.timing(progressAnim, {
            toValue: (answeredQuestions / questions.length) * 100,
            duration: 500,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false
        }).start();
    }, [answers, descriptiveAnswers, questions.length]);

    const getDefaultOptions = () => {
        return [
            { OptionId: 1, OptionText: 'Completely Agree' },
            { OptionId: 2, OptionText: 'Somewhat Agree' },
            { OptionId: 3, OptionText: 'Somewhat Disagree' },
            { OptionId: 4, OptionText: 'Completely Disagree' }
        ];
    };

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const url = `Student/GeneralFeedbackFormGetAll?StudentFeedbackRegistrationId=${StudentFeedbackRegistrationId}&TeacherId=${TeacherId}&QuestionCategoryId=${QuestionCategoryId}&StudentFeedbackMasterId=${StudentFeedbackMasterId}`;
            const response = await getData(url);

            if (Array.isArray(response)) {
                const formattedQuestions = response.map((q, index) => ({
                    QuestionId: q.FeedbackQuestionMasterId,
                    QuestionText: q.QuestionDescription,
                    QuestionTypeId: q.QuestionTypeId
                }));

                const questionsWithOptions = await Promise.all(
                    formattedQuestions.map(async (q) => {
                        if (q.QuestionTypeId === 1) {
                            try {
                                console.log(`Student/FeedbackAnswer_GetAll?FeedbackQuestionId=${q.QuestionId}`)
                                const optionsUrl = `Student/FeedbackAnswer_GetAll?FeedbackQuestionId=${q.QuestionId}`;
                                const optionsResponse = await getData(optionsUrl);

                                let options = [];
                                if (Array.isArray(optionsResponse)) {
                                    options = optionsResponse
                                        .filter(opt => opt.FeedbackAnswerId !== 0)
                                        .map((opt, idx) => ({
                                            OptionId: opt.FeedbackAnswerId,
                                            OptionText: opt.Answer,
                                            color: getColorByPosition(idx)
                                        }));
                                }

                                // If no options from API, use defaults with position-based colors
                                if (options.length === 0) {
                                    options = getDefaultOptions().map((opt, idx) => ({
                                        OptionId: opt.OptionId,
                                        OptionText: opt.OptionText,
                                        color: getColorByPosition(idx)
                                    }));
                                }

                                return {
                                    ...q,
                                    Options: options
                                };
                            } catch (error) {
                                console.error(`Error loading options for question ${q.QuestionId}:`, error);
                                // Use defaults with position-based colors if API fails
                                return {
                                    ...q,
                                    Options: getDefaultOptions().map((opt, idx) => ({
                                        OptionId: opt.OptionId,
                                        OptionText: opt.OptionText,
                                        color: getColorByPosition(idx)
                                    }))
                                };
                            }
                        }
                        return q;
                    })
                );

                setQuestions(questionsWithOptions);
            } else {
                setQuestions([]);
                Alert.alert('Info', 'No questions found for general feedback.');
            }
        } catch (error) {
            console.error('Error loading general feedback questions:', error);
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

    const handleDescriptiveAnswerChange = (questionId, text) => {
        setDescriptiveAnswers(prev => ({
            ...prev,
            [questionId]: text
        }));
    };

    const handleSubmit = () => {
        const unansweredQuestions = questions.filter(q => {
            if (q.QuestionTypeId === 1) {
                return !answers[q.QuestionId];
            } else if (q.QuestionTypeId === 2) {
                return !descriptiveAnswers[q.QuestionId] || descriptiveAnswers[q.QuestionId].trim() === '';
            }
            return true;
        });

        if (unansweredQuestions.length > 0) {
            const questionNumbers = unansweredQuestions.map(q =>
                `Q${questions.findIndex(question => question.QuestionId === q.QuestionId) + 1}`
            ).join(', ');

            Alert.alert(
                'Incomplete Feedback',
                `Please answer the following questions before submitting: ${questionNumbers}`,
                [{ text: 'OK' }]
            );
            return;
        }

        Alert.alert(
            'Submit General Feedback',
            'Are you sure you want to submit your general feedback?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Submit', onPress: submitFeedback }
            ]
        );
    };

    const submitFeedback = async () => {
        setSubmitPressed(true);
        try {
            // Prepare radio button answers
            const radioAnswers = Object.keys(answers).map(qid => {
                const question = questions.find(q => q.QuestionId === parseInt(qid));
                const selectedOption = question.Options.find(opt => opt.OptionId === answers[qid]);

                return {
                    StudentFeedbackRegistrationId_FK: StudentFeedbackRegistrationId,
                    FeedbackQuestionMasterId_FK: parseInt(qid),
                    FeedbackQuestionMasterId: parseInt(qid),
                    FeedbackAnswerId: answers[qid],
                    FeedbackAnswer: selectedOption?.OptionText || '',
                    QuestionTypeId: question.QuestionTypeId,
                    QuestionDescription: question.QuestionText
                };
            });

            // Prepare descriptive answers
            const textAnswers = Object.keys(descriptiveAnswers).map(qid => {
                const question = questions.find(q => q.QuestionId === parseInt(qid));

                return {
                    StudentFeedbackRegistrationId_FK: StudentFeedbackRegistrationId,
                    FeedbackQuestionMasterId_FK: parseInt(qid),
                    FeedbackQuestionMasterId: parseInt(qid),
                    FeedbackAnswerId: 0, // For descriptive answers, set to 0
                    FeedbackAnswer: descriptiveAnswers[qid],
                    QuestionTypeId: question.QuestionTypeId,
                    QuestionDescription: question.QuestionText
                };
            });

            // Combine all answers
            const payload = {
                StudentFeedbackRegistrationId: StudentFeedbackRegistrationId,
                generalFeedbacks: [...radioAnswers, ...textAnswers]
            };

            console.log(payload)

            // Submit to API
            const response = await postData('Student/SaveGeneralFeedback', payload);

            //const response = -1;

            if (response > 0) {
                navigation.navigate('Feedback');
            } else {
                Alert.alert('Error', 'Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting general feedback:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
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
                <Text style={styles.loadingText}>Preparing general feedback form</Text>
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
                                <Icon name="information-outline" size={22} color="white" />
                                <Text style={styles.teacherName}>General Feedback</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.progressContainer}>
                        <View style={styles.progressLabels}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressPercentage}>
                                {Math.round(
                                    ((Object.keys(answers).length + Object.keys(descriptiveAnswers).length) /
                                        questions.length) * 100
                                )}%
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
                            {Object.keys(answers).length + Object.keys(descriptiveAnswers).length} of {questions.length} questions answered
                        </Text>
                    </View>
                </LinearGradient>

                {questions.map((q, index) => (
                    <Animated.View
                        key={q.QuestionId}
                        style={[
                            styles.questionCard,
                            {
                                borderColor: (q.QuestionTypeId === 1 && !answers[q.QuestionId]) ||
                                    (q.QuestionTypeId === 2 && !descriptiveAnswers[q.QuestionId]) ?
                                    '#ef4444' : '#f1f5f9',
                                borderWidth: (q.QuestionTypeId === 1 && !answers[q.QuestionId]) ||
                                    (q.QuestionTypeId === 2 && !descriptiveAnswers[q.QuestionId]) ?
                                    1.5 : 1
                            }
                        ]}
                    >
                        <View style={styles.questionHeader}>
                            <View style={styles.questionNumberContainer}>
                                <Text style={styles.questionNumber}>Q{index + 1}</Text>
                            </View>
                            <Text style={styles.questionText}>{q.QuestionText}</Text>
                        </View>

                        {q.QuestionTypeId === 1 ? (
                            <RadioButton.Group
                                onValueChange={value => handleAnswerSelect(q.QuestionId, parseInt(value))}
                                value={answers[q.QuestionId] || ''}
                            >
                                {q.Options && q.Options.map((option, idx) => (
                                    <TouchableOpacity
                                        key={option.OptionId}
                                        style={[
                                            styles.optionContainer,
                                            answers[q.QuestionId] === option.OptionId ? {
                                                backgroundColor: `${option.color}15`,
                                                borderColor: option.color
                                            } : {
                                                backgroundColor: 'white',
                                                borderColor: '#e2e8f0'
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
                        ) : q.QuestionTypeId === 2 ? (
                            <View style={styles.descriptiveAnswerContainer}>
                                <TextInput
                                    style={[
                                        styles.descriptiveInput,
                                        descriptiveAnswers[q.QuestionId] && {
                                            borderColor: '#4f46e5',
                                            backgroundColor: '#f8fafc'
                                        }
                                    ]}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Type your answer here..."
                                    placeholderTextColor="#94a3b8"
                                    value={descriptiveAnswers[q.QuestionId] || ''}
                                    onChangeText={(text) => handleDescriptiveAnswerChange(q.QuestionId, text)}
                                />
                                <Text style={styles.characterCount}>
                                    {descriptiveAnswers[q.QuestionId] ? descriptiveAnswers[q.QuestionId].length : 0} characters
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.unsupportedQuestionType}>
                                Unsupported question type
                            </Text>
                        )}

                        {((q.QuestionTypeId === 1 && !answers[q.QuestionId]) ||
                            (q.QuestionTypeId === 2 && !descriptiveAnswers[q.QuestionId])) && (
                                <Text style={styles.requiredText}>This question is required</Text>
                            )}
                    </Animated.View>
                ))}

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
        backgroundColor: 'white',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    optionText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    descriptiveAnswerContainer: {
        marginTop: 12,
    },
    descriptiveInput: {
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#334155',
        textAlignVertical: 'top',
        minHeight: 120,
        backgroundColor: 'white',
    },
    characterCount: {
        textAlign: 'right',
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
    },
    unsupportedQuestionType: {
        color: '#ef4444',
        fontStyle: 'italic',
        marginTop: 12,
    },
    requiredText: {
        color: '#ef4444',
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
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

export default GeneralFeedback;