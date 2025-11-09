import { View, Text, FlatList, StyleSheet, TouchableOpacity, 
    Linking, StatusBar, SafeAreaView, Image, ActivityIndicator, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'
import { getData } from '../services/api';

const MyDairy = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    const firstDairy = () => {
        var uri = "https://docs.google.com/forms/d/e/1FAIpQLSfJvGcDGxWXU-3hcHTacZmDjjK20ZdZISV3OU7DNxco6963Hg/viewform";
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }
    const secondDairy = () => {
        var uri = "https://docs.google.com/forms/d/e/1FAIpQLSfQs9k4uo3OkBJuoaFtdBj7mcjLHg3LQyeOha9enzwTdVpIug/closedform";
        Linking.openURL(uri).catch(err => console.error("Couldn't load page", err));
    }

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight || 0, }}>
            <StatusBar barStyle="light-content" hidden={false} backgroundColor="#00517c" translucent={true} />
            {
                loading ?
                    <LoadingAnimation /> :
                    <View style={styles.container}>

                        <TouchableOpacity
                            onPress={() => firstDairy()}
                            style={styles.btnDownload}>
                            <Text style={styles.btnDownloadText}>1_SUBMIT YOUR E_DIARY DURING COLLEGE HOURS (ON CAMPUS)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => secondDairy()}
                            style={styles.btnDownload}>
                            <Text style={styles.btnDownloadText}>2_SUBMIT YOUR E_DIARY DURING COLLEGE HOURS (OFF CAMPUS)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           // onPress={() => secondDairy()}
                            style={styles.btnDownload}>
                            <Text style={styles.btnDownloadText}>INDIVIDUAL TEACHER ON CAMPUS REPORT (CH)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           // onPress={() => secondDairy()}
                            style={styles.btnDownload}>
                            <Text style={styles.btnDownloadText}>INDIVIDUAL TEACHER OFF CAMPUS REPORT (BCH)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           // onPress={() => secondDairy()}
                            style={styles.btnDownload}>
                            <Text style={styles.btnDownloadText}>LEAVE REGISTAR</Text>
                        </TouchableOpacity>
                    </View>
            }
        </SafeAreaView>
    )
}

function LoadingAnimation() {
    return (
        <View style={styles.indicatorWrapper}>
            <ActivityIndicator size="large" style={styles.indicator} />
            <Text style={styles.indicatorText}>Loading ...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    indicatorWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {},
    indicatorText: {
        fontSize: 18,
        marginTop: 12,
    },
    btnDownload: {
        backgroundColor: '#00517c',
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10,
        borderColor: '#00517c',
        borderWidth: 1
    },
    btnDownloadText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center'
    }
});
export default MyDairy