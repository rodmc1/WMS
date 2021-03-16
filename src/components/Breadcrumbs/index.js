import './style.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core' ;
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

function Breadcrumbs(props) {
  return (
    <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb" classes={{ root: 'breadcrumbs', li: 'breadcrumbs__list-item' }}>
      {
        props.routes.map(item => (
          <NavLink key={item.label} color="inherit" to={item.path} className="breadcrumbs__link">
            {item.label}
          </NavLink>
        ))
      }
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs;