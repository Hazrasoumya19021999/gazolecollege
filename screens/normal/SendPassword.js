import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import {
    Text,
    TextInput,
    Button,
    RadioButton,
    Card,
    Title,
    useTheme,
    HelperText
} from 'react-native-paper';
import { getData } from '../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SendPassword = () => {
    const theme = useTheme();
    const [userType, setUserType] = useState('Student');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState(false);

    const handleSend = async () => {
        if (!code.trim()) {
            Alert.alert('Error', 'Please enter your code');
            return;
        }

        setLoading(true);

        try {
            console.log(`EmployeeNew/GetPasswordForStudentEmployee?Type=${userType}&UserCode=${code}`)
            const response = await getData(
                `EmployeeNew/GetPasswordForStudentEmployee?Type=${userType}&UserCode=${code}`
            );

            console.log('API Response:', response);

            if (response?.message) {
                Alert.alert('Alert', response.message);
            } else if (typeof response === 'string') {
                Alert.alert('Success', response);
                setCode('');
            } else if (response?.error) {
                Alert.alert('Error', response.error);
            } else {
                Alert.alert('Unexpected', 'An unknown response was received.');
            }

        } catch (error) {
            console.error('API Error:', error);
            let errorMessage = 'Something went wrong. Please try again.';

            if (error.response) {
                if (error.response.status === 400) {
                    errorMessage = error.response.data || 'Invalid request';
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
            }

            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const hasError = touched && !code.trim();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.colors.surface }]}
        >
            <View style={styles.background}>
                <View style={[styles.circle, styles.circleTop, { backgroundColor: '#00517c' }]} />
                <View style={[styles.circle, styles.circleBottom, { backgroundColor: '#00517c' }]} />
            </View>

            <Card style={[styles.card, { backgroundColor: theme.colors.background }]}>
                <Card.Content>
                    <View style={styles.iconContainer}>
                        <Icon
                            name="shield-key"
                            size={40}
                            color={'#00517c'}
                            style={styles.icon}
                        />
                    </View>

                    <Title style={[styles.title, { color: '#00517c' }]}>
                        Password Recovery
                    </Title>

                    <Text style={[styles.subtitle, { color: '#00517c' }]}>
                        Select your account type and enter your details to recover your password
                    </Text>

                    <RadioButton.Group onValueChange={value => setUserType(value)} value={userType}>
                        <View style={styles.radioContainer}>
                            <View style={styles.radioItem}>
                                <RadioButton
                                    value="Student"
                                    color={'#00517c'}
                                    uncheckedColor={theme.colors.secondary}
                                />
                                <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Student</Text>
                            </View>
                            <View style={styles.radioItem}>
                                <RadioButton
                                    value="Employee"
                                    color={'#00517c'}
                                    uncheckedColor={theme.colors.secondary}
                                />
                                <Text style={[styles.radioLabel, { color: theme.colors.onSurface }]}>Employee</Text>
                            </View>
                        </View>
                    </RadioButton.Group>

                    <TextInput
                        mode="outlined"
                        label={`${userType} ID`}
                        placeholder={`Enter your ${userType} ID`}
                        style={styles.input}
                        value={code}
                        onChangeText={setCode}
                        onBlur={() => setTouched(true)}
                        autoCapitalize="none"
                        keyboardType="default"
                        error={hasError}
                        left={
                            <TextInput.Icon
                                name={userType === 'Student' ? 'account-school' : 'badge-account'}
                                color={theme.colors.primary}
                            />
                        }
                        theme={{
                            colors: {
                                primary: theme.colors.primary,
                                background: theme.colors.surface,
                                placeholder: theme.colors.secondary,
                                text: theme.colors.onSurface
                            },
                            roundness: 12
                        }}
                    />
                    <HelperText type="error" visible={hasError}>
                        Please enter your {userType.toLowerCase()} ID
                    </HelperText>

                    <Button
                        mode="contained"
                        onPress={handleSend}
                        loading={loading}
                        disabled={loading}
                        style={[styles.button, { backgroundColor: '#00517c' }]}
                        labelStyle={styles.buttonLabel}
                        contentStyle={styles.buttonContent}
                        icon="send"
                    >
                        {loading ? 'Sending...' : 'Send Password'}
                    </Button>

                    <Text style={[styles.footerText, { color: '#00517c' }]}>
                        You'll receive your password in your registered email
                    </Text>
                </Card.Content>
            </Card>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 500,
        opacity: 0.1,
    },
    circleTop: {
        width: 400,
        height: 400,
        top: -100,
        right: -100,
    },
    circleBottom: {
        width: 500,
        height: 500,
        bottom: -150,
        left: -150,
    },
    card: {
        paddingVertical: 20,
        borderRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 1,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        backgroundColor: 'rgba(0, 81, 124, 0.1)',
        padding: 16,
        borderRadius: 50,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 24,
        textAlign: 'center',
        lineHeight: 20,
    },
    radioContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 16,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
    },
    radioLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    input: {
        marginVertical: 8,
        backgroundColor: 'transparent',
    },
    button: {
        marginTop: 16,
        marginBottom: 8,
        paddingVertical: 8,
        borderRadius: 12,
        elevation: 2,
    },
    buttonContent: {
        height: 48,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerText: {
        marginTop: 24,
        fontSize: 13,
        textAlign: 'center',
    },
});

export default SendPassword;