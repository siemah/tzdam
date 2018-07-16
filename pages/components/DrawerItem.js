import React, { Component } from 'react'
import { Text, View, Button, TouchableNativeFeedback, Image, } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class DrawerItem extends Component {
  render() {
    return (
      <View style={{ ...this.props.style, height: 40, paddingTop: 10, justifyContent: 'center'  }}>
        <TouchableNativeFeedback 
          onPress={this.props._onPressItem || null}>
          <View style={{ flexDirection: "row", ...this.props.containerStyle}} >
            <MaterialIcons name={this.props.iconName} color={this.props.color} size={25} style={{...this.props.imgStyle, marginLeft: 30,  }} />
            <Text style={{...this.props.labelStyle, fontWeight: "400", fontSize: 16, color: "#999"}} >{this.props.title}</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}