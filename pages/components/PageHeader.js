import React, { Component } from 'react'
import { Text, View, Animated, TouchableOpacity } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class PageHeader extends Component {
  render() {
    return (
        <View style={{ flexDirection: 'row', paddingTop: 10, paddingHorizontal: 15, overflow: 'visible', justifyContent: 'center', alignItems: 'center' }} >

            <TouchableOpacity activeOpacity={.93} style={{ width: 27, paddingVertical: 5, }} onPress={this.props._onPressMenu} >
                <Animated.View style={[style.menuicon,]} ></Animated.View>
                <Animated.View style={[style.menuicon, { width: 18 }]} ></Animated.View>
                <Animated.View style={[style.menuicon, { width: 24 }]} ></Animated.View>
            </TouchableOpacity>

            <Text style={{ flex: 1, display: "flex", textAlign: 'center', color: "white", fontSize: 16, fontWeight: '400' }} >
            {this.props.title.toUpperCase()}
            </Text>

            <TouchableOpacity activeOpacity={.9}>
                <MaterialIcons name="search" size={16} style={{ color: "white" }} />
            </TouchableOpacity>

        </View>
    )
  }
}

const style = {
    menuicon: {
        height: 2,
        backgroundColor: 'white',
        width: '100%',
        marginBottom: 5,
        borderRadius: 3
    }
};