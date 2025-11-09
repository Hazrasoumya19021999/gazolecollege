import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image} from 'react-native'
import React from 'react'


const EmployeeCustomDrawerHeader = ({HeaderDrawer}) => {
    return (
        <SafeAreaView >
            <View style={styles.ViewStyle}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ marginTop: '10%',justifyContent:'center',paddingHorizontal:20 }} onPress={HeaderDrawer} >
                         <Image source={require('../assets/hamburger.png')} style={{width:40,height:40}} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 25, marginTop: '10%', textAlignVertical: 'center', color:'#ffffff' }}>Dashboard</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    // ViewStyle: {
    //     width: '100%',
    //     backgroundColor: '#75c7a1',
    //     flexDirection: 'row',
    // }
    ViewStyle: {
        width: '100%',
        backgroundColor: '#00517c',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 10
    }
})
export default EmployeeCustomDrawerHeader