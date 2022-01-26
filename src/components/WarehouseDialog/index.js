import './style.scss';
import React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

/*
 * @props string { diaglogText, dialogTitle, buttonConfirmText, buttonCancelText}
 * @props dialogAction invoke props function when user click confirm button
 * Return Dialog modal
 */
const WarehouseDialog = props => {
  const { diaglogText, dialogTitle, buttonConfirmText, buttonCancelText, dialogAction } = props;
  const [open, setOpen] = React.useState(false);

  // Open dialog if props openDialog is true
  React.useEffect(() => {
    if (props.openDialog) setOpen(true);
  }, [props]);

  return (
    <Dialog
      key={diaglogText}
      open={open}
      fullWidth
      keepMounted
      m={2}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      { dialogTitle && <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle> }
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">{diaglogText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} variant="outlined">{buttonCancelText}</Button>
        <Button onClick={dialogAction} variant="contained" color="primary" style={props.style}>{buttonConfirmText}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default WarehouseDialog;