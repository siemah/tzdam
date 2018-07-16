import React, { Component } from 'react'
import { Text, View, TextInput, Image, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class InputField extends Component {
  
  constructor( props ){
    super(props);
    this.state = {
      secureTextEntry: props.secureTextEntry ? props.secureTextEntry : false
    }
  }

  _toggleSecureText = () => this.setState({ secureTextEntry: !this.state.secureTextEntry })

  render() {
    
    return (
      <View style={{ width: '100%', position: 'relative', }} >
        
        <Image source={ this.props.img } style={{ height: 16, width: 16, position: "absolute", left: 10, top: 10, }} />
        
        <TextInput
          placeholder={ this.props.placeholder || '' }
          onChangeText={ this.props._onChangeText }
          secureTextEntry={this.state.secureTextEntry}
          style={{ ...this.props.style, backgroundColor: "transparent", paddingHorizontal: 30, color: "#879987", paddingTop: 5,}}
          underlineColorAndroid={this.props.underlineColor || "transparent"}
          placeholderTextColor='#97a997'
          autoCapitalize={'none'}
          autoCorrect={false}
          returnKeyType={ this.props.returnType || 'next' }
          
          onSubmitEditing={ this.props.submit || null }
        />

        {
          this.props.secureTextEntry &&
          <TouchableOpacity activeOpacity={.9} style={{ position: "absolute", right: 15, top: 12, }} onPress={ this._toggleSecureText }>
            <MaterialIcons name={this.state.secureTextEntry? "visibility-off" : "visibility"} size={20} color="#58B19F"/>
          </TouchableOpacity>
        }
        
      </View>
    )
  }
}