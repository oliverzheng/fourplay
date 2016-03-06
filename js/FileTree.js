/* @flow */

import React, {
  PropTypes,
  Text,
  View,
} from 'react-native-desktop';

import {FilePathPropType} from './FilePath';

export default React.createClass({
  propTypes: {
    homeDirectory: PropTypes.string.isRequired,
    filepaths: PropTypes.arrayOf(FilePathPropType).isRequired,
  },

  render() {
    const derp = this.props.filepaths.map(filepath => {
      return (
        <View key={filepath.path}>
          <Text>
            {filepath.isDir ? '(D)' : '(F)'}
            {' '}
            {filepath.path}
          </Text>
        </View>
      );
    });
    return (
      <View>
        {derp}
      </View>
    );
  },
});
