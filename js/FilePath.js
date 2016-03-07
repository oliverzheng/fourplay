/* @flow */

import {PropTypes} from 'react-native-desktop';

// We don't want to check the disk for every path string, since that's async
// across the bridge.

export type FilePath = {
  path: string;
  isDir: boolean;
};

export const FilePathPropType = PropTypes.shape({
  path: PropTypes.string.isRequired,
  isDir: PropTypes.bool.isRequired,
});

