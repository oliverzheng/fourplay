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
    paths: PropTypes.arrayOf(FilePathPropType).isRequired,
  },

  render() {
    const derp = this.props.paths.map(path => {
      return (
        <View key={path.filepath}>
          <Text>
            {path.isDir ? '(D)' : '(F)'}
            {' '}
            {path.filepath}
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
