import React from 'react';
import { ScrollView, Text } from 'react-native-gesture-handler';
import { View } from 'react-native-reanimated/lib/typescript/Animated';
import Icon from 'react-native-vector-icons/FontAwesome';

const MyComponent = () => {

    return (
        <ScrollView>
            <Text>Icons : </Text>
            <Icon name="book" size={50} color="#900" />
        </ScrollView>

    );

};

export default MyComponent;