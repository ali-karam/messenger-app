import React, { useRef } from 'react';
import { InputBase, IconButton, InputAdornment } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import messageBarStyle from './MessageBarStyle';

const MessageBar = ({ text, inputKeyDown, inputChange, emojiBtnClick, fileChange }) => {
  const classes = messageBarStyle();
  const fileUploadBtnRef = useRef();

  const controls = (
    <InputAdornment position="end">
      <IconButton onClick={emojiBtnClick}>
        <EmojiEmotionsIcon />
      </IconButton>
      <IconButton onClick={() => fileUploadBtnRef.current.click()}>
        <PhotoLibraryIcon />
      </IconButton>
    </InputAdornment>
  );
  return (
    <>
      <InputBase
        className={classes.messageBar}
        placeholder="Type something..."
        autoFocus
        multiline
        variant="outlined"
        rowsMax={4}
        spellCheck
        value={text}
        onKeyDown={inputKeyDown}
        onChange={inputChange}
        endAdornment={controls}
      />
      <input type="file" onChange={fileChange} style={{ display: 'none' }} ref={fileUploadBtnRef} />
    </>
  );
};

export default MessageBar;
