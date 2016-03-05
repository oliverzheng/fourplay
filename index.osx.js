/**
 * Sample React Native Desktop App
 * https://github.com/ptmt/react-native-desktop
 */
import React from 'react-native-desktop';
const {
  AppRegistry,
  NativeModules,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;

const {FourPlayNativeModule} = NativeModules;

const fourplay = React.createClass({
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native Desktop!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.osx.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Or use Developer Menu
        </Text>
        <TouchableHighlight
          onPress={this._openFilePicker}>
          <Text>Open file picker</Text>
        </TouchableHighlight>
      </View>
    );
  },

  _openFilePicker(): void {
    FourPlayNativeModule.openFilePicker(
      {
        chooseDirectories: false,
        allowMultiple: true,
      },
      filenames => {
        console.log(filenames);
      },
    );
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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

AppRegistry.registerComponent('fourplay', () => fourplay);
