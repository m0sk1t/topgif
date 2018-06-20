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
  // Platform,
  Picker,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableHighlight,
} from 'react-native';

const tags = {
  'dog': 'dog',
  'fun': 'fun',
  'cat': 'cat',
  'kid': 'kid',
  'top': 'top',
  'lol': 'lol',
};

const API_KEY = '49afe9e3340049b78dd7e0fcb74bcb7f';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gif: '',
      count: 5,
      tag: 'dog',
      disabled: false,
    }
  }

  requestImage() {
    this.setState({ disabled: true });
    fetch(`https://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${this.state.tag}&rating=G`)
      .then(res => res.json())
      .then(res => this.setState({ gif: res.data.images.downsized.url, disabled: false }))
      .catch(_ => this.setState({ disabled: false }));
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          resizeMode="cover"
          style={styles.container}
          source={require('./bg.jpg')}
        />
        <Text style={styles.welcome}>
          Свежие гифки!
        </Text>
        <Picker
          selectedValue={this.state.tag}
          style={{
            height: 50,
            width: 100
          }}
          onValueChange={(itemValue, itemIndex) => this.setState({ tag: itemValue })}
        >
          {tags.keys().map(_ => <Picker.Item label={tags[_]} value={tags[_]} />)}
        </Picker>
        {this.state.gif && <Image source={{uri: this.state.gif}} />}
        <TouchableHighlight
          onPress={_ => {
            if (this.state.count) {
              this.setState(_ => ({ count: _.count - 1 }));
            } else {
              this.setState({ count: 5 });
            }
            this.requestImage();
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
        </TouchableHighlight>
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
  welcome: {
    margin: 10,
    fontSize: 32,
    color: '#fafafa',
    textAlign: 'center',
  },
});
