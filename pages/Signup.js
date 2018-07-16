import React, { Component } from 'react'
import { 
  Text, 
  View, 
  Dimensions, 
  ViewPagerAndroid, 
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  BackHandler
 } from 'react-native'

//Ecternal component & package
import LinearGradient from 'react-native-linear-gradient';

// Custom component
import Header from './components/Header';
import InputField from './components/InputField';

const { width, height } = Dimensions.get('window');

// internal module
import httpPost from '../assets/include/fetch';

const APIURL = 'http://192.168.1.2:8888';

export default class Signup extends Component {

  constructor( props ) {
    super(props);
    this.state = {
      nom: '',
      email: '',
      num_tlf: '',
      mot_de_passe: '',
      confirmation: '',
      page: 0
    }
  }

  _onChangeText = obj => {
    this.setState( obj )
  }

  _swipeTo = page => {
    this._signUpSlider.setPage(page)
  }

  _onInsertNewUser = () => {
    let { nom, email, num_tlf, mot_de_passe, confirmation } = this.state;
    if (
      this.state.nom.trim().length > 4 && 
      /[a-zA-Z]+@[a-z]+\.[a-z]+/.test(this.state.email) && 
      this.state.mot_de_passe.length >= 6 && 
      this.state.mot_de_passe === this.state.confirmation 
    ) {
      console.warn('eftch')
      httpPost( APIURL + '/auth/signup', { nom, email, num_tlf, mot_de_passe }, 'POST')
        .then(res => {
          console.warn("rees", res)
        })
        .catch(e => console.warn(e))
    }
    else alert('Check your inputs')
  }
  
  componentDidMount = () => {
    // prevent to exit from app if sign up activity is shoxed
    BackHandler.addEventListener('hardwareBackPress', () => {
      if( this.props.isVisible ) {
        this.props._onClose();
        return true;
      }
      return false;
    });
  }

  render() {
    return (
      <View style={style.mainContainer} >
        <Header transform='5' title="TZDAM." />
        
        <ViewPagerAndroid 
          scrollEnabled={false} 
          initialPage={0}
          ref={ component => this._signUpSlider = component }
          style={{ backgroundColor: '#ecf0f1', height, marginHorizontal: 15, }}
         >

          <View>
            <InputField _onChangeText={input => this._onChangeText({ nom: input })} underlineColor="#cdcdcd" style={{ height: 40,  }} placeholder="Nom et prenom" img={require('../assets/images/user-silhouette.png')} />
            <InputField _onChangeText={input => this._onChangeText({ email: input })} underlineColor="#cdcdcd" style={{ height: 40,  }} placeholder="Email" img={require('../assets/images/black-envelope.png')} />
            <View style={{ position: "relative", flexDirection: 'row', justifyContent: "space-between"}} >
              <TouchableOpacity onPress={ this.props._onClose } style={[ style.btn, { marginRight: 5} ]} activeOpacity={.9}>
                <Text style={{ color: "#788778", fontSize: 16 }}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={ () => this._swipeTo(1) } style={[ style.btn, style.btnGreen ]} activeOpacity={.9}>
                <Text style={{ color: "#fff", fontSize: 16 }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <InputField _onChangeText={input => this._onChangeText({ num_tlf: input })} underlineColor="#cdcdcd" style={{ bottom: 3 }} placeholder="Phone number" img={require('../assets/images/phone.png')} />
            <InputField _onChangeText={input => this._onChangeText({ adresse: input })} underlineColor="#cdcdcd" style={{ bottom: 3 }} placeholder="Address" img={require('../assets/images/phone.png')} />
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }} >
              <TouchableOpacity onPress={() => this._swipeTo(0)} style={[ style.btn, { marginRight: 5} ]} activeOpacity={.9}>
                <Text style={{ color: "#788778", fontSize: 16 }}>prev</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this._swipeTo(2)} style={[ style.btn, style.btnGreen ]} activeOpacity={.9}>
                <Text style={{ color: "#FFF", fontSize: 16, flex: 1, }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <InputField _onChangeText={input => this._onChangeText({ mot_de_passe: input })} underlineColor="#cdcdcd" style={{ bottom: 3 }} secureTextEntry placeholder="Password" img={require('../assets/images/lock.png')} />
            <InputField _onChangeText={input => this._onChangeText({ confirmation: input })} underlineColor="#cdcdcd" style={{ bottom: 3 }} secureTextEntry placeholder="Confirmation" img={require('../assets/images/lock.png')} />
            <LinearGradient
              start={{ x: 1, y: 0 }} end={{ x: 0.0, y: 1.0 }}
              locations={[0, 1]} colors={['#1da1d1', '#1dd1a1']}
              style={style.gradient} >
              <TouchableOpacity activeOpacity={.9} style={style.signin} onPress={this._onInsertNewUser} >
                <Text style={{ textAlign: "center", color: "white", fontWeight: "bold"}}>SIGN UP</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

        </ViewPagerAndroid>

      </View>
    )
  }
}

const style = {
  mainContainer: {
    position: 'relative',
    backgroundColor: "#ecf0f1",
    flex: 1,
  },
  header: {
    borderBottomLeftRadius: width * 10,
    borderBottomRightRadius: width * 10,
    height: width,
    position: 'absolute',
    top: -width/1.5,
    left: -50,
    right: -50,
    justifyContent: "center",
    alignItems: 'center',
  },
  headerTxt: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "normal",
    position: 'absolute',
    bottom: 50,
    fontWeight: "bold"
  },
  gradient: { 
    marginTop: 10, 
    marginBottom: 20, 
    borderRadius: 40, 
    elevation: 10, 
  },
  signin: {
     height: 40,
     padding: 10,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    backgroundColor: 'transparent',
    borderColor: "#1dd1a1",
    borderWidth: 2,
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    borderRadius: 40,
    marginHorizontal: 15
  },
  btnGreen: {
    backgroundColor: '#1dd1a1',
  }
};