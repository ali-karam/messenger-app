import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, CssBaseline, Paper, Hidden, Grid, Typography } from '@material-ui/core';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from 'axios';
import AuthContext from '../../context/auth-context';
import authStyle from './AuthStyle';
import ValidatedTextField from '../Form/ValidatedTextField/ValidatedTextField';
import PopupMessage from '../Form/PopupMessage/PopupMessage';

const Auth = () => {
  const classes = authStyle();
  const [open, setOpen] = React.useState(false);
  const [isLoginPage, setIsLoginPage] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState("Something went wrong");

  const history = useHistory();
  const authContext = useContext(AuthContext);

  let validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email is not valid"),
    password: Yup.string()
      .required("Password is required")
      .max(100, "Password is too long")
      .min(6, "Password too short")
  });
  let usernameField = null;

  if(!isLoginPage) {
    validationSchema = Yup.object().shape({
      username: Yup.string()
        .required("Username is required")
        .max(40, "Username is too long"),
      email: Yup.string()
        .required("Email is required")
        .email("Email is not valid"),
      password: Yup.string()
        .required("Password is required")
        .max(100, "Password is too long")
        .min(6, "Password too short")
    });
    usernameField = (
      <ValidatedTextField name="username" label="Username" autoFocus autoComplete="username"/> 
    );
  };

  const switchAuthModeHandler = () => {
    setIsLoginPage(prevState => !prevState);
  };

  const register = async (username, email, password) => {
    try {
      const res = await axios.post('/auth/register', {username, email, password});
      authContext.login(res.data);
      history.push("/dashboard");
    } catch(err) {
      errorMsgHandler(err);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', {email, password});
      authContext.login(res.data);
      history.push("/dashboard");
    } catch(err) {
      errorMsgHandler(err);
    }
  };

  const errorMsgHandler = (err) => {
    if(err.response.status === 500) {
      setErrorMsg("Something went wrong");
    } else {
      setErrorMsg(err.response.data.error.message);
    }
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const submissionHandler = async (values, setSubmitting) => {
    setSubmitting(true);
    if(isLoginPage) {
      await login(values.email, values.password);
    } else {
      await register(values.username, values.email, values.password);
    }
    setSubmitting(false);
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
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
      <Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
        <Box className={classes.buttonHeader}>
          <Box p={1} alignSelf="flex-end" alignItems="center">
              <Button className={classes.noAccBtn} onClick={switchAuthModeHandler}>
                {isLoginPage ? "Don't have an account?" : "Already have an account?"}
              </Button>
              <Button
                className={classes.accBtn}
                variant="contained"
                onClick={switchAuthModeHandler}
              >
                {isLoginPage ? "Create account" : "Login" }
              </Button>
          </Box>

          <Box width="100%" maxWidth={450} p={3} alignSelf="center">
            <Grid container>
              <Grid item xs>
                <Typography 
                  className={classes.welcome}
                  component="h1"
                  variant="h5"
                > {isLoginPage ? "Welcome back!" : "Create an account"}
                </Typography>
              </Grid>
            </Grid>
            <Formik
              initialValues={{
                email: "",
                password: "",
                username: ""
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => { submissionHandler(values, setSubmitting) }}
            > 
              {({ isSubmitting }) => (
                <Form className={classes.form}>
                  {usernameField}
                  <ValidatedTextField name="email" label="E-mail address" autoComplete="email"/>
                  <ValidatedTextField name="password" label="Password" type="password" autoComplete="current-password" forgotOption={isLoginPage}/>
                  <Box textAlign="center">
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      className={classes.submit}
                    >
                      {isLoginPage ? "Login" : "Create"}
                    </Button>
                  </Box>
                  {isLoginPage ? <div style={{ height: 95 }} /> : null} 
                </Form>
              )}
            </Formik>
          </Box>
          <Box p={1} alignSelf="center" />
        </Box>
        <PopupMessage open={open} handleClose={handleClose} message={errorMsg} />
      </Grid>
    </Grid>
  );
};

export default Auth;