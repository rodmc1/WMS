import React from 'react';
import { SNACKBAR } from 'config/constants';
import { SnackbarContext } from 'context/Snackbar';

import { Snackbar as MuiSnackbar } from '@material-ui/core';
import MuiAlert from '@mui/material/Alert';
import Fade from '@mui/material/Fade';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Snackbar() {
  const [snackbarConfig] = React.useContext(SnackbarContext);
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    Transition: Fade
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  React.useEffect(() => {
    setState(s => ({
      ...s, open: true
    }))
  }, [snackbarConfig])

  return (
    <MuiSnackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      autoHideDuration={snackbarConfig.message === SNACKBAR.DEFAULT_MESSAGE ? null : 3000}
      TransitionComponent={state.Transition}
      >
      <Alert onClose={handleClose} severity={snackbarConfig.type}>
        {snackbarConfig.message}
      </Alert>
    </MuiSnackbar>
  );
}

export default Snackbar;