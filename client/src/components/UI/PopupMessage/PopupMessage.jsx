import React from 'react';
import { Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

const PopupMessage = ({ open, handleClose, message, type }) => {
  const close = (event, reason) => {
    if (reason === 'clickaway') return;
    handleClose();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={close}
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <Alert variant="filled" onClose={close} severity={type}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default PopupMessage;
