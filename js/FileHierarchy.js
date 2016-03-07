/* @flow */

import path from 'path';
import invariant from 'invariant';

import type {FilePath} from './FilePath';

const PATH_SEP = path.sep;

function getSortedFilepaths(
  filepaths: Array<FilePath>,
): Array<FilePath> {
  const sortedFilepaths = filepaths.slice(0);
  sortedFilepaths.sort((a, b) => a.path.localeCompare(b.path));
  return sortedFilepaths;
}

type ChunkedPath = {
  isDir: boolean,
  chunks: Array<string>,
};
type GroupOfChunkedPaths = {
  nonSharedChunk: ?string;
  chunkedPaths: Array<ChunkedPath>;
};

function convertFilepathToChunkedPath(filepath: FilePath): ChunkedPath {
  return {
    isDir: filepath.isDir,
    chunks: filepath.path.split(PATH_SEP).filter(dir => dir),
  };
}

/**
 * This represents hierarchy of a list of files. Files are grouped by common
 * directories, and directories are collapsed so we don't have unnecessary
 * levels in the tree.
 */
export default class FileHierarchy {
  _parentDir: string;
  _filepath: FilePath; // the path is relative to the parent Dir
  _children: Array<FileHierarchy>;

  static createFromFilepaths(filepaths: Array<FilePath>): Array<FileHierarchy> {
    const sortedFilepaths = getSortedFilepaths(filepaths);

    return FileHierarchy._createFromSortedChunkedPaths(
      [],
      sortedFilepaths.map(convertFilepathToChunkedPath),
    );
  }

  static _createFromSortedChunkedPaths(
    parentChunks: Array<string>,
    chunkedPaths: Array<ChunkedPath>,
  ): Array<FileHierarchy> {
    if (chunkedPaths.length === 0) {
      return [];
    }

    let sharedChunkCount = 0;
    while (true) {
      const chunksEqual = chunkedPaths.every(
        ({chunks}) =>
          chunks.length > sharedChunkCount &&
          chunks[sharedChunkCount] === chunkedPaths[0].chunks[sharedChunkCount]
      );
      if (!chunksEqual) {
        break;
      }
      sharedChunkCount++;
    }

    const chunkedPathsGroupByNonSharedChunk: Array<GroupOfChunkedPaths> = [];
    let currentGroup: ?GroupOfChunkedPaths;

    chunkedPaths.forEach(
      ({isDir, chunks}, i) => {
        /**
         * This would only happen for the first path. There are two
         * possibilities:
         *
         * This is a file. In that case, there's no other files in the list.
         *
         * Or this is a directory. Its entire path is the prefix for all other
         * paths, then our children should not include this one.
         */
        if (chunks.length === sharedChunkCount) {
          if (chunkedPaths.length > 1) {
            // There are other paths, and this must be a directory. We want to
            // skip this. It's a directory that'll get included in some other
            // path.
            invariant(isDir, 'Wat');
          } else {
            // This is a terminal directory without other paths, or this is
            // a file without other paths. Let's include it.
            invariant(!currentGroup, 'Wat2');

            currentGroup = {
              nonSharedChunk: null,
              chunkedPaths: [
                {
                  isDir,
                  chunks: [],
                }
              ],
            };
            chunkedPathsGroupByNonSharedChunk.push(currentGroup);
          }

          return;
        }

        const nonSharedChunk = chunks[sharedChunkCount];
        if (!currentGroup || nonSharedChunk !== currentGroup.nonSharedChunk) {
          currentGroup = {
            nonSharedChunk: nonSharedChunk,
            chunkedPaths: [],
          };
          chunkedPathsGroupByNonSharedChunk.push(currentGroup);
        }
        currentGroup.chunkedPaths.push({
          isDir: isDir,
          chunks: chunks.slice(sharedChunkCount),
        });
      }
    );

    const sharedChunks = chunkedPaths[0].chunks.slice(0, sharedChunkCount);
    const sharedPath = sharedChunks.join(PATH_SEP);

    const parentDir = '/' + parentChunks.join(PATH_SEP);
    const parentChunksForChildren = parentChunks.slice(0);
    sharedChunks.forEach(
      sharedChunk => parentChunksForChildren.push(sharedChunk)
    );

    const hierarchies = chunkedPathsGroupByNonSharedChunk.map(
      ({nonSharedChunk, chunkedPaths}) => {
        if (!nonSharedChunk) {
          return new FileHierarchy(
            parentDir,
            {
              isDir: chunkedPaths[0].isDir,
              path: sharedPath,
            },
            [],
          );
        } else {
          const children =
            FileHierarchy._createFromSortedChunkedPaths(
              parentChunksForChildren,
              chunkedPaths,
            );
          // We should have exactly 1 child here.
          invariant(children.length === 1, 'Wat');
          return children[0];
        }
      }
    );

    if (hierarchies.length > 1 && sharedChunkCount > 0) {
      return [
        new FileHierarchy(
          parentDir,
          {
            isDir: true,
            path: sharedPath,
          },
          hierarchies,
        )
      ];
    } else {
      return hierarchies;
    }
  }

  constructor(
    parentDir: string,
    filepath: FilePath,
    children: Array<FileHierarchy>,
  ) {
    this._parentDir = parentDir;
    this._filepath = filepath;
    this._children = children;
  }

  getParentDir(): string {
    return this._parentDir;
  }

  getRelativePath(): string {
    return this._filepath.path;
  }

  getAbsolutePath(): string {
    return path.join(this._parentDir, this._filepath.path);
  }

  getIsDir(): boolean {
    return this._filepath.isDir;
  }

  getFilepath(): FilePath {
    return {
      isDir: this.getIsDir(),
      path: this.getAbsolutePath(),
    };
  }

  getChildren(): Array<FileHierarchy> {
    return this._children;
  }
}
