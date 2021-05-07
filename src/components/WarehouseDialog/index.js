import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

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