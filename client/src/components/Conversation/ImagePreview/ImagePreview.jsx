import React from 'react';
import { IconButton } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import imagePreviewStyle from './ImagePreviewStyle';

const ImagePreview = React.forwardRef(({ src, closeClicked }, ref) => {
  const classes = imagePreviewStyle();
  return (
    <div className={classes.root} ref={ref} tabIndex={-1}>
      <IconButton onClick={closeClicked} className={classes.closeBtn}>
        <ClearIcon className={classes.closeIcon} />
      </IconButton>
      <img src={src ? src : null} alt="Enlarged" className={classes.img} />
    </div>
  );
});

export default ImagePreview;
