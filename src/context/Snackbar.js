import { SNACKBAR } from 'config/constants';
import React from 'react';
export const SnackbarContext = React.createContext();

export function SnackbarProvider(props) {
  const [snackbarConfig, setSnackbarConfig] = React.useState({
    type: SNACKBAR.TYPE.INFO,
    message: SNACKBAR.DEFAULT_MESSAGE
  });
  
  return (
    <SnackbarContext.Provider value={[snackbarConfig, setSnackbarConfig]}>
      {props.children}
    </SnackbarContext.Provider>
  );
}
