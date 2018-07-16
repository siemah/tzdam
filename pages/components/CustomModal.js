import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get("window");

const CustomModal = props => (
  <Animated.View style={{ top: props.top, backgroundColor: "white", position: 'absolute', left: 0, width: '100%', height: "100%", ...props.style }} >
    <Header color="green" title={ props.title } _onPress={props.onHideModel} />
    {props.children}
  </Animated.View>
);

const Header = props => (
  <View  >
    <LinearGradient 
      style={{ flexDirection: 'row', alignItems: "center", height: 50, padding: 10, backgroundColor: props.color, elevation: 4, }}
      start={{ x: 0.3, y: 0.0 }} end={{ x: 1.0, y: .0 }}
      locations={[0, .6, 1]} colors={['#1dd1a1', '#1dd1a1', '#1dd1a1']}>
      <TouchableNativeFeedback onPress={ props._onPress } >
        <MaterialIcons name="arrow-back" size={30} color='white' />
      </TouchableNativeFeedback>
      <View style={{marginLeft: 10}}><Text style={{ color: 'white', fontSize: 20, fontWeight: '400',  }} >{props.title}</Text></View>
    </LinearGradient>
  </View>
)

export default CustomModal