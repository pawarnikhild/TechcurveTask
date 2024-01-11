import 'react-native-gesture-handler';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import Camera from './screens/Camera';
import Videox from './screens/Video'

const App = () => {

const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={Camera} options={{headerShown: false}} />
      <Stack.Screen name="VideoScreen" component={Videox} />
    </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})
