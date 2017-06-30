import axios from 'axios';
import { shell, remote } from 'electron';
import { loadAfterCloning } from './lessonsession-actions';

// Defaults to current directory
// Need to pass in relevant project directory during operations
const git = require('simple-git');

export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const CLONED_REPOSITORY = 'CLONED_REPOSITORY';
export const VIEW_REPOSITORY_LINK = 'VIEW_REPOSITORY_LINK';

export const openRepoLink = (repoLink: string, event: Object) => (dispatch: *) => {
  try {
    event.preventDefault();
    shell.openExternal(repoLink);
    dispatch({ type: VIEW_REPOSITORY_LINK });
  } catch (e) {
    console.dir(e);
  }
};

export const loadLesson = (repoLink: string) => (dispatch: *) => {
  remote.dialog.showSaveDialog({
    title: 'Save Repository',
    properties: ['openDirectory']
  }, (localFilePath) => {
    if (localFilePath === undefined) return; // Cancelled operation
    git()
      .clone(repoLink, localFilePath, () => {
        dispatch({ type: CLONED_REPOSITORY, repositoryPath: localFilePath });
        dispatch(loadAfterCloning(localFilePath));
      });
  });
};


export const selectRepository = (selectedRepository: Object) => (dispatch: *) => {
  dispatch({ type: SELECT_REPOSITORY, selectedRepository });
};
