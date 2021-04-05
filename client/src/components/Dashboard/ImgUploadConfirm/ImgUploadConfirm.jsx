import React from 'react';
import { Typography, Button } from '@material-ui/core';
import imgUploadConfirmStyle from './ImgUploadConfirmStyle';

const ImgUploadConfirm = React.forwardRef(({ src, yesClick, noClick }, ref) => {
  const classes = imgUploadConfirmStyle();

  return (
    <div className={classes.root} ref={ref} tabIndex={-1}>
      <img src={src ? URL.createObjectURL(src) : null} alt="Preview" className={classes.img} />
      <Typography>Would you like to upload this image as your avatar?</Typography>
      <div>
        <Button variant="contained" color="primary" className={classes.button} onClick={yesClick}>
          Yes
        </Button>
        <Button variant="contained" color="secondary" className={classes.button} onClick={noClick}>
          No
        </Button>
      </div>
    </div>
  );
});

export default ImgUploadConfirm;
