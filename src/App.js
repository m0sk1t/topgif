/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Picker,
  StyleSheet,
  AsyncStorage,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
} from "react-native-admob";

import {
  TAGS,
  API_KEY,
  STRINGS,
  SMART_AD,
  FLAG_IMAGES,
  INTERSTITIAL_AD,
} from "./constants";


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gif: '',
      count: 7,
      tag: 'dog',
      lang: 'us',
      disabled: false,
    };
    AsyncStorage.getItem('@App:lang')
      .then(lang => this.setState({ lang }))
      .catch(err => this.setState({ lang: 'us' }));
    AdMobInterstitial.setAdUnitId(INTERSTITIAL_AD);
  }

  requestImage() {
    this.setState({ disabled: true });
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${this.state.tag}&rating=G`)
      .then(res => res.json())
      .then(res => this.setState({ gif: res.data.images.downsized.url, disabled: false }))
      .catch(_ => this.setState({ disabled: false }));
  }

  showFullAd() {
    AdMobInterstitial.requestAd()
      .then(_ => AdMobInterstitial.showAd());
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.container}
          source={require('./bg.jpg')}
        />
        <View>
          <Image
            style={styles.flagImage}
            source={{ uri: FLAG_IMAGES.us}}
            onClick={_ => this.setState({ lang: 'us' })}
          />
          <Image
            style={styles.flagImage}
            source={{ uri: FLAG_IMAGES.ru}}
            onClick={_ => this.setState({ lang: 'ru' })}
          />
        </View>
        <Text style={styles.welcome}>
          {STRINGS[this.state.lang]}
        </Text>
        <Picker
          selectedValue={this.state.tag}
          style={{
            height: 50,
            width: 100
          }}
          onValueChange={tag => this.setState({ tag })}
        >
          {TAGS.keys().map(_ => <Picker.Item label={TAGS[_][this.state.lang]} value={_} />)}
        </Picker>
        {this.state.gif && <Image source={{ uri: this.state.gif }} />}
        <AdMobBanner
          adSize="smartBanner"
          adUnitID={SMART_AD}
        />
        <TouchableOpacity
          onPress={_ => {
            this.state.count
              ? this.setState(_ => ({ count: _.count - 1 }))
              : this.setState({ count: 7 });
            return this.requestImage();
          }}
          disabled={this.state.disabled}
        >
          {
            this.state.disabled
              ? <ActivityIndicator
                  size="large"
                  color="#fafafa"
              />
              : <Text style={{fontSize: 48}}> ⭮ </Text>
          }
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3a3a3a',
  },
  flagImage: {
    height: 50,
  },
  welcome: {
    margin: 10,
    fontSize: 32,
    color: '#fafafa',
    textAlign: 'center',
  },
});
