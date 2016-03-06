/* @flow */

import {PropTypes} from 'react-native-desktop';

export type FilePath = {
  path: string;
  isDir: boolean;
};

export const FilePathPropType = PropTypes.shape({
  path: PropTypes.string.isRequired,
  isDir: PropTypes.bool.isRequired,
});

