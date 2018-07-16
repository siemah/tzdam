import React, { Component } from 'react'
import { Text, View, Animated, StyleSheet, TouchableOpacity } from 'react-native'

export default class Drawer extends Component {

  render() {
    return (
      <Animated.View style={[ style.main, { left: this.props.left } ]} >
        <TouchableOpacity activeOpacity={1} style={[ style.toggler, ]} onPress={ this.props._onPress } >
					{this.props.children}
				</TouchableOpacity>
      </Animated.View>
    )
  }
}

const style = StyleSheet.create({
	main: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: '100%',
		zIndex: 99999999
	},
	toggler: {
		backgroundColor: 'rgba(45, 45, 45, .2)',
		flex: 1,
		display: 'flex',
	}
})