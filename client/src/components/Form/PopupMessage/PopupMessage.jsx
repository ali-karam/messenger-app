import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert"

const PopupMessage = ({open, handleClose, message}) => (
  <Snackbar
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    open={open}
    autoHideDuration={6000}
    onClose={handleClose}
    action={
      <React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  >
    <Alert variant="filled" onClose={handleClose} severity="error">{message}</Alert>
  </Snackbar>
);

export default PopupMessage;