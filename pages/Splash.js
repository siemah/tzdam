import React, { Component } from 'react'
import { Text, View, Animated, Dimensions, StatusBar, } from 'react-native'


const { height } = Dimensions.get('window')

export default class Splash extends Component {

  state = {
    fadeAnim: new Animated.Value(0),
    position: new Animated.Value( height )
  }

  componentDidMount = () => {
    // chage animation statr
    Animated.sequence([
      Animated.timing(
        this.state.position,
        {
          toValue: 0,
          duration: 200
        }
      ),
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 800
        }
      ),
      Animated.timing(
        this.state.fadeAnim,
        {
          toValue: 1,
          duration: 400
        }
      ),
      Animated.timing(
        this.state.position,
        {
          toValue: -height,
          duration: 200
        }
      )
    ]).start();
  }


  render() {
    return (
      <Animated.View style={{ position: "relative", top: this.state.position , flex: 1, backgroundColor: '#1dd1a1', justifyContent: "center", alignItems: 'center', opacity: this.state.fadeAnim }} >
        <StatusBar backgroundColor="#1dd1a1" />
        <Text style={{ fontSize: 30, color: 'white', fontWeight: '600'}} > TZDAM. </Text>
      </Animated.View>
    )
  }
}