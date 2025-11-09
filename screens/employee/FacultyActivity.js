import {
    View, Text, StyleSheet, StatusBar, SafeAreaView, Image, ActivityIndicator, Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { getData } from '../services/api';

const FacultyActivity = () => {
    const { width } = useWindowDimensions();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState('');

    useEffect(() => {
        getStoredData();
    }, []);

    const getStoredData = async () => {
        try {
            const result = await getData('EmployeeNew/GetActivities');
            console.log(result[0].Activities_Body);

            if (result && result.length > 0 && result[0].Activities_Body) {
                setData(result[0].Activities_Body);
            } else {
                Alert.alert('No Data Found');
            }
        } catch (e) {
            console.log(e);
            Alert.alert('Error fetching data.');
        } finally {
            setLoading(false);
        }
    };

    const source = {
        html: data
    };

    const tagsStyles = {
        a: {
            color: '#00517C',
            textDecorationLine: 'underline'
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0 }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {loading ? (
                <LoadingAnimation />
            ) : (
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image source={require('../assets/applogo.png')} style={styles.logo} />
                    </View>
                    <View style={styles.linkContainer}>
                        <Text style={styles.heading}>Faculty Activity</Text>
                        <RenderHtml
                            contentWidth={width}
                            source={source}
                            tagsStyles={tagsStyles}
                        />
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" color="#00517c" />
            <Text style={styles.indicatorText}>Loading ...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    logo: {
        width: 180,
        height: 180,
    },
    linkContainer: {
        margin: 20
    },
    heading: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
        color: '#00517c',
        fontWeight: 'bold'
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
        color: '#00517c'
    }
});

export default FacultyActivity;
