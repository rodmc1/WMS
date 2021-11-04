import './style.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import Cookies from 'universal-cookie';

function Header() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [account, setAccount] = React.useState(null)
  const prevOpen = React.useRef(open);
  const cookie = new Cookies();

  React.useEffect(() => {
    if (cookie.get('user-token')) {
      const data = cookie.get('userData');
      setAccount(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleLogout = () => {
    document.cookie = "user-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.inteluck.com";
    window.location.href = process.env.REACT_APP_INTELUCK_LOGIN_API_ENDPOINT;
    return false; 
  }

  return (
    <header>
      <Toolbar>
      <NavLink to="/" style={{ flex: 1 }}>
        <img src="/assets/images/logo.svg" alt="Warehouse Management System"/>
      </NavLink>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          color="inherit"
          onClick={handleToggle}
        >
          <Avatar 
            alt={account && account.username[0].toUpperCase()}
            src={account && `${process.env.REACT_APP_INTELUCK_API_ENDPOINT}assets/images/user/${account.id ? account.id.substring(3) : ''}.jpg`}
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? 'composition-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
          />
        </IconButton>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement ===  'right bottom',
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={open}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                  >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Toolbar>
    </header>
  )
}

export default Header;