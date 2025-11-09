import React, { useState } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, Alert, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const MyAttendance = () => {
    const [location, setLocation] = useState(null);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Access Required',
                    message: 'This app needs to access your location for attendance marking.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // iOS automatically handles this
    };

    const getLocation = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            Alert.alert("Permission Denied", "Location permission is required to mark attendance.");
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                setLocation(position.coords);
                Alert.alert("Location Fetched", `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`);
            },
            (error) => {
                console.error("Location Error:", error.message);
                Alert.alert("Error", error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000
            }
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Attendance</Text>
            <Button title="📍 Get Current Location" onPress={getLocation} color="#007BFF" />
            {location && (
                <View style={styles.locationBox}>
                    <Text style={styles.coord}>Latitude: {location.latitude}</Text>
                    <Text style={styles.coord}>Longitude: {location.longitude}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    title: { fontSize: 22, textAlign: 'center', marginBottom: 20, fontWeight: 'bold' },
    locationBox: { marginTop: 20, backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10 },
    coord: { fontSize: 16, marginBottom: 5 }
});

export default MyAttendance;
