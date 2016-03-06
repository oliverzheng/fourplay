/* @flow */

import React from 'react-native-desktop';

const {
  PropTypes,
  Text,
  View,
} = React;

export default React.createClass({
  propTypes: {
    homeDirectory: PropTypes.string.isRequired,
    paths: PropTypes.array.isRequired,
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
