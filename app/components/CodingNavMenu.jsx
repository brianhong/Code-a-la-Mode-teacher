import React from 'react';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Link } from 'react-router-dom';

export default function CodingNavMenu({ githubLogout, view }) {
  return (
    <IconMenu
      iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
    {
      view === 'lesson'
      ? null
      : <MenuItem
        containerElement={<Link to="/lessonInit" />}
        primaryText="Back to Lessons"
      />
    }
      <MenuItem
        containerElement={<Link to="/" />}
        primaryText="Logout"
        onTouchTap={() => githubLogout()}
      />
    </IconMenu>
  );
}
