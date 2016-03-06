/* @flow */

import type {FilePath} from './FilePath';

export default class FileFilter {
  constructor() {
  }

  shouldIncludeFile(filepath: FilePath): boolean {
    if (filepath.isDir) {
      return true;
    }
    return filepath.path.endsWith('.mp3');
  }

  static getDefault(): FileFilter {
    if (!_defaultFileWatcher) {
      _defaultFileWatcher = new FileFilter();
    }
    return _defaultFileWatcher;
  }
}

let _defaultFileWatcher: ?FileFilter = null;
