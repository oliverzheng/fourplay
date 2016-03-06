/* @flow */

import {PropTypes} from 'react-native-desktop';

export type FilePath = {
  filepath: string;
  isDir: boolean;
};

export const FilePathPropType = PropTypes.shape({
  filepath: PropTypes.string.isRequired,
  isDir: PropTypes.bool.isRequired,
});

