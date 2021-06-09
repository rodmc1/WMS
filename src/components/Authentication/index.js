import './style.scss';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import Cookies from 'universal-cookie';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

function Authentication(props) {
  const [open, setOpen] = React.useState(false);

  const handleLogin = () => {
    if (process.env.NODE_ENV === 'development') {
      window.location.href = `${process.env.REACT_APP_INTELUCK_ACCOUNT_API_ENDPOINT}/wms/login`;
    } else {
      window.location.href = process.env.REACT_APP_INTELUCK_LOGIN_API_ENDPOINT;
    }
  }

  React.useEffect(() => {
    const cookie = new Cookies();
    if (!cookie.get('user-token')){
      setOpen(true);
    }
  }, [])

  React.useEffect(() => {
    if (!_.isEmpty(props.error)) {
      switch(props.error.status) {
        case 401: 
          setOpen(true);
          break;
        default:
          return;
      }
    }
  }, [props.error])

  return (
    <Dialog aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth="md">
      <DialogContent>
        <div className="authentication">
          <img src="/assets/images/session-expired.svg" className="authentication__img" alt="Session Expired"/>
          <Typography variant="h5" className="authentication__heading">Your Session has expired</Typography>
          <Typography>Please re-login to continue.</Typography>
          <Typography>Don't worry we kept all of your inputs and data in place.</Typography>
          <Button variant="contained" className="authentication__btn btn btn--emerald btn--small" onClick={handleLogin} disableElevation>Go To Log In</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const mapStateToProps = state => {
  return {
    error: state.error
  }
}

export default connect(mapStateToProps, null)(Authentication);