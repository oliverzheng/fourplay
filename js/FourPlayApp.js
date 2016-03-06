/* @flow */

import React from 'react-native-desktop';

import FileTree from './FileTree';

const {
  PropTypes,
  NativeModules,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} = React;
const {FourPlayNativeModule} = NativeModules;

export default React.createClass({
  propTypes: {
    homeDirectory: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      filepaths: null,
    };
  },

  render() {
    let fileTree;
    if (this.state.filepaths) {
      fileTree = (
        <FileTree
          homeDirectory={this.props.homeDirectory}
          filepaths={this.state.filepaths}
        />
      );
    }
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
        {fileTree}
      </View>
    );
  },

  _openFilePicker(): void {
    FourPlayNativeModule.openFilePicker(
      {
        chooseDirectories: true,
        allowMultiple: false,
      },
      directories => {
        const directory = directories[0];
        if (!directory) {
          return;
        }

        FourPlayNativeModule.subpathsInDirectory(directory, filepaths => {
          this.setState({filepaths});
        });
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
