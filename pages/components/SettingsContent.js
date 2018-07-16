import React, { Component } from 'react'
import { Text, View, ScrollView, Image, TouchableOpacity, AsyncStorage } from 'react-native'

export default class SettingsContent extends Component {
  
  state = {
    username: '',
  }

  componentWillMount = async () => {
    let username = await AsyncStorage.getItem('username');
    username = username.toUpperCase();
    this.setState({username});
  }

  render() {
    
    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', marginHorizontal: 10, marginTop: 10, borderTopLeftRadius: 5, borderTopRightRadius: 5 }} >
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 20, }} >
                <Image source={require('../../assets/images/user.png')} style={style.userImg} />
            <Text>{this.state.username}</Text>
            </View>
            <View >
                <ListItem title='Change password' _onPress={this.props._onChangePassword} />
                <ListItem title='History' _onPress={this.props._onShowHistoryModal} />
                <ListItem title='Settings' />
            </View>
        </ScrollView>
    )
  }
}

const ListItem = props => (
    <View style={{ flexDirection: 'column', marginTop: 5 }} >
        <TouchableOpacity activeOpacity={.9} onPress={ props._onPress || null } style={{ height: 35, justifyContent: 'center', }} >
            <Text style={{ textAlign: 'center' }}>{ props.title }</Text>
        </TouchableOpacity>
    </View>
);

const style = {
    userImg: {
        width: 64,
        height: 64,
        borderRadius: 64,
        borderWidth: 2,
        borderColor: "#FF5722",
        marginBottom: 10
    }
}