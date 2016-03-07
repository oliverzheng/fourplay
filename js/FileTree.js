/* @flow */

import React, {
  PropTypes,
  StyleSheet,
  Text,
  View,
} from 'react-native-desktop';

import {FilePathPropType} from './FilePath';
import FileFilter from './FileFilter';
import FileHierarchy from './FileHierarchy';

import type {FilePath} from './FilePath';

function HierarchyView(props: Object): ReactElement {
  const {hierarchy, fileFilter, isRoot} = props;
  const childrenHierarchy = hierarchy.getChildren().map(child => {
    return (
      <HierarchyView
        key={child.getAbsolutePath()}
        hierarchy={child}
        fileFilter={fileFilter}
        isRoot={false}
      />
    );
  });

  const shouldInclude = fileFilter.shouldIncludeFile(
    hierarchy.getFilepath()
  );
  return (
    <View style={styles.fileHierarchy}>
      <View>
        <Text style={shouldInclude ? null : styles.fileNotIncluded}>
          {isRoot ? '/' : ''}
          {hierarchy.getRelativePath()}
          {hierarchy.getIsDir() ? '/' : ''}
        </Text>
      </View>
      <View>
        {childrenHierarchy}
      </View>
    </View>
  );
}

/**
 * This displays a list of files.
 *
 * A user may specify a directory or all the files in the directory to list.
 * These are different: selecting a directory will pick up new file additions,
 * while all the files in a directory will not. This component does not care
 * about the difference, since it expects the caller to pass in new files when
 * they are picked up.
 */
export default React.createClass({
  propTypes: {
    homeDirectory: PropTypes.string.isRequired,
    filepaths: PropTypes.arrayOf(FilePathPropType).isRequired,
    fileFilter: PropTypes.instanceOf(FileFilter).isRequired,
  },

  getInitialState() {
    return {
      fileHierarchies: this._getFileHierarchies(this.props.filepaths),
    };
  },

  componentWillReceiveProps(nextProps: Object): void {
    this.setState({
      fileHierarchies: this._getFileHierarchies(nextProps.filepaths),
    });
  },

  render() {
    const hierarchies = this.state.fileHierarchies.map(hierarchy => {
      console.log(this.props.fileFilter);
      return (
        <HierarchyView
          key={hierarchy.getAbsolutePath()}
          hierarchy={hierarchy}
          fileFilter={this.props.fileFilter}
          isRoot={true}
        />
      );
    });
    return (
      <View>
        {hierarchies}
      </View>
    );
  },

  _getFileHierarchies(filepaths: Array<FilePath>): Array<FileHierarchy> {
    return FileHierarchy.createFromFilepaths(filepaths);
  },
});

const styles = StyleSheet.create({
  fileNotIncluded: {
    color: '#999999',
  },
  fileHierarchy: {
    flexDirection: 'row',
  },
});
