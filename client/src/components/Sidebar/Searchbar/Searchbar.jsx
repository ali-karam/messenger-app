import React from 'react';
import { InputBase, InputAdornment, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import searchbarStyle from './SearchbarStyle';

const Searchbar = ({ query, searchHandler, clearHandler }) => {
  const classes = searchbarStyle();
  return (
    <>
      <InputBase
        className={classes.searchBar}
        variant="outlined"
        value={query}
        onChange={searchHandler}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        }
        endAdornment={
          query ? (
            <InputAdornment position="end">
              <IconButton onClick={clearHandler}>
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }
      />
    </>
  );
};

export default Searchbar;
