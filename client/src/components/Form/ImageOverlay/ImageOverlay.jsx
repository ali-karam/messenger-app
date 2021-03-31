import React from 'react';
import { Grid, Box, Hidden, Typography } from '@material-ui/core';
import imageOverlayStyle from './ImageOverlayStyle';

const ImageOverlay = () => {
    const classes = imageOverlayStyle();
    return (
        <Grid item xs={false} sm={4} md={5} className={classes.image}>
        <Box className={classes.overlay}>
          <Hidden xsDown>
            <img width={67} src="/images/chatBubble.png" alt="Chat bubble"/>
            <Hidden smDown>
              <Typography className={classes.heroText}> 
                Converse with anyone with any language
              </Typography>
            </Hidden>
          </Hidden>
        </Box>
      </Grid>
    );
};

export default React.memo(ImageOverlay);