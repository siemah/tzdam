import React, { Component } from 'react'
import { 
  Text, 
  View, 
  TouchableHighlight, 
  KeyboardAvoidingView, 
  StyleSheet,
  TouchableOpacity,
  Animated, 
  Modal,
  Button,
  ViewPagerAndroid,
  AsyncStorage,
  BackHandler,
  NetInfo,
  Dimensions,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import InputField from './components/InputField';
import Header from './components/Header';
import Signup from './Signup';
import httpFetch from '../assets/include/fetch';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const { width, height } = Dimensions.get('window');
const APIURL = 'http://192.168.1.39:8888';

export default class Auth extends Component {

  static navigationOptions = ({ focused, tintColor }) => ({
    showIcon: true,
    drawerLabel: 'Logout',
    drawerIcon: ({ tintColor }) => (
      <MaterialIcons name="flip-to-back" size={25} style={{ color: tintColor }} />
    ),
  })

  state = {
    topOffset: new Animated.Value(height),
    modalIsVisible: false,
    email: '',
    mot_de_passe: '',
    loading: false,
  }

  _toggleModal = () => {
    Animated.timing(
        this.state.topOffset,
        {
            duration: 150,
            toValue: this.state.modalIsVisible ? height : 0
        }
    ).start();
    this.setState({ modalIsVisible: !this.state.modalIsVisible });
  }

  componentDidMount= () => {
    NetInfo.isConnected.fetch().then(isConnected => {
        if ( !isConnected ) alert('Pleas check your network')
    });  
  }

  _login = () => {
      let { email, mot_de_passe } = this.state;
      this.setState({ loading: true });
      httpFetch(APIURL + '/auth/signin', { email, mot_de_passe }, 'POST')
          .then(res => {
              if (res.status.toUpperCase() === "OK") {
                  console.warn("object", res)
                  this.props._onLogin(res.token, res.nom);
              }
              else alert(res.message)
              this.setState({ loading: false });
          })
          .catch(e => {
              this.setState({ loading: false });
              console.warn('err', e)
          })
  }

  render() {
    return (
        <ScrollView style={ style.mainContainer } >
            <KeyboardAvoidingView behavior="position">
                
                <Header title='TZDAM.'/>

                <View style={[standardStyle.centrize, { borderRadius: 10, backgroundColor: '#dfe3e4', marginTop: 20, } ]} >
                    <InputField _onChangeText={ email => this.setState({email})} style={standardStyle.hr} placeholder="Username" img={require('../assets/images/user-silhouette.png')} />
                    <InputField _onChangeText={ mot_de_passe => this.setState({mot_de_passe})} style={standardStyle.hr} placeholder="Password" img={require('../assets/images/lock.png')} secureTextEntry={ true } />
                    <TouchableOpacity activeOpacity={.99} style={{ elevation: 0, width: "100%", backgroundColor: "#58B19F", height: 40, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} 
                      onPress={ this._login } >
                        {
                            !this.state.loading && <Text style={{ textAlign: 'center', lineHeight: 20, paddingVertical: 10, color: "white", fontWeight: '600' }} >LOGIN</Text>
                            || <ActivityIndicator size={"large"} color='white' />
                        }
                    </TouchableOpacity>
                </View>

                <View style={{ margin: 15, }} >
                    <TouchableOpacity activeOpacity={1} >
                        <Text style={{ color:"#58a17F",}} >Forget password?</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginHorizontal: 15, marginBottom: 15 }} >
                  <TouchableOpacity activeOpacity={.9} style={style.signup} onPress={this._toggleModal} >
                    <Text style={style.signupTxt}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>

            <Animated.View style={{ position: "absolute", top: this.state.topOffset, left: 0, width: '100%', }} >

                <View style={{ marginTop: 0, flex: 1, }}>

                    <Signup _onClose={this._toggleModal} isVisible={this.state.modalIsVisible} />

                </View>

            </Animated.View>

        </ScrollView>
    )
  }
}



const style = StyleSheet.create({
    mainContainer: { 
        flex: 1,
        backgroundColor: '#ecf0f1', 
        position: 'relative',
    },
    keyboardAvoiding: {

    }, 
    signup: { backgroundColor: "#1dd1a1", borderRadius: 40, elevation: 10 },
    signupTxt: { textAlign: 'center', lineHeight: 20, paddingVertical: 10, color: "white", fontWeight: '600' },
});

const standardStyle = {
    centrize: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15,
    },
    hr: { 
      borderBottomWidth: 1, 
      borderBottomColor: '#cfd3d4', 
      height: 40, 
      textAlign: 'center' 
    }
};