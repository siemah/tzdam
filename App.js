/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  AsyncStorage,
  StatusBar,
} from 'react-native';

import Auth from './pages/Auth';
import Drawer from './pages/Home';
import Splash from './pages/Splash';

export default class App extends Component {

  state = {
    mainScreen: "/",
    loading: true,
  }

  
  componentDidMount = () => {

    /** 
     * TODO
     * retreive a current time 
     * try to retreive a AsyncStorage index
     * if this take less than 1s than wait until a 1s + time to get Async index
     * then update a state of loading
     */
    let now = Date.now();
    AsyncStorage.getItem('__token__id__', (err, res) => {
      if( err ) {
        AsyncStorage.removeItem('__token__id__', () => this.setState({loading: false }));
        return null;
      }
      let newState = { loading: false }
      if (res !== null) newState.mainScreen = "/Home";
      setTimeout(() => {
        this.setState( newState );
      }, 1600);
    })
    //AsyncStorage.setItem('__token__id__', `fsf`)
    /*let token = await AsyncStorage.getItem('__token__id__');
    if (token !== null) this.setState({ mainScreen: "/Home", loading: false  });*/
  }

  _onLoginWithSuccess = async ( token, nom ) => {
    console.warn(token, nom)
    try {
      await AsyncStorage.setItem('__token__id__', `${token}`);
      await AsyncStorage.setItem('username', nom);
      this.setState({ mainScreen: '/Home', loading: false })
    } catch (error) {
      // Error saving data
      console.warn("asyncStorage error", error)
      this.setState({ loading: false })
    }
  }

  _onLogout = () => {
    AsyncStorage.removeItem('__token__id__', err => {
      this.setState({ mainScreen: '/'});
      console.warn('logout')
    })
  }

  /**
   * to resolve a probleme of rendering use a splash (wait 1 to 3 seconds)
   * screen and wait until asyncStorage get response
   */
  render = () => {
    let MAINSCREEN = this.state.mainScreen == "/Home" ? <Drawer logOut={this._onLogout} /> : <Auth _onLogin={this._onLoginWithSuccess} />;

    if( this.state.loading ) 
      return (
        <Splash />
      )
    else
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#1dd1a1" hidden={false} />
          { MAINSCREEN } 
        </View>
      );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
