/* @flow */

import React, {
  PropTypes,
  StyleSheet,
  Text,
  View,
} from 'react-native-desktop';

import {FilePathPropType} from './FilePath';
import FileFilter from './FileFilter';

export default React.createClass({
  propTypes: {
    homeDirectory: PropTypes.string.isRequired,
    filepaths: PropTypes.arrayOf(FilePathPropType).isRequired,
    fileFilter: PropTypes.instanceOf(FileFilter).isRequired,
  },

  render() {
    const components = this.props.filepaths.map(filepath => {
      const shouldInclude = this.props.fileFilter.shouldIncludeFile(filepath);
      return (
        <View key={filepath.path}>
          <Text style={shouldInclude ? null : styles.fileNotIncluded}>
            {filepath.isDir ? '(D)' : '(F)'}
            {' '}
            {filepath.path}
          </Text>
        </View>
      );
    });
    return (
      <View>
        {components}
      </View>
    );
  },
});

const styles = StyleSheet.create({
  fileNotIncluded: {
    color: '#999999',
  },
});
