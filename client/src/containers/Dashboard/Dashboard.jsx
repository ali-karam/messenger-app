import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Typography, Modal, CircularProgress } from '@material-ui/core';
import AuthContext from '../../context/auth-context';
import UserAvatar from '../../components/UI/UserAvatar/UserAvatar';
import ImgUploadConfirm from '../../components/Dashboard/ImgUploadConfirm/ImgUploadConfirm';
import PopupMessage from '../../components/UI/PopupMessage/PopupMessage';
import NavBar from '../../components/Dashboard/NavBar/NavBar';
import dashboardStyle from './DashboardStyle';

const Dashboard = () => {
  const classes = dashboardStyle();
  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const authContext = useContext(AuthContext);
  const fileSelectBtnRef = useRef();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/users/${authContext.user.id}`)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg('Oops! Something went wrong');
        setLoading(false);
      });
  }, [authContext]);

  const fileSelectedHandler = (event) => {
    const file = event.target.files[0];
    if (file && file.size > 1000000) {
      setErrorMsg('File too large. Max size 1MB');
    } else if (file && !file.type.match(/^image\/(jpe?g|png)$/)) {
      setErrorMsg('Image must be either a png, jpg, or jpeg');
    } else {
      setSelectedFile(file);
      setErrorMsg('');
    }
  };

  const fileUploadHandler = () => {
    setLoading(true);
    const fd = new FormData();
    fd.append('avatar', selectedFile);
    axios
      .patch(`/users/${authContext.user.id}`, fd)
      .then((res) => {
        setUser(res.data);
        setSelectedFile('');
        setSuccess(true);
        setLoading(false);
      })
      .catch((err) => {
        setErrorMsg('Oops! Something went wrong');
        setLoading(false);
      });
  };

  let userContent;
  if (user) {
    userContent = (
      <>
        <Typography className={classes.username}>{user.username}</Typography>
        <UserAvatar className={classes.avatar} user={user} />
        <Button
          variant="contained"
          color="primary"
          className={classes.changeAvatarBtn}
          onClick={() => fileSelectBtnRef.current.click()}
        >
          Change Avatar
        </Button>
      </>
    );
  }
  return (
    <>
      <NavBar />
      <div className={classes.content}>
        {userContent}
        {loading ? <CircularProgress /> : null}
        <input
          type="file"
          style={{ display: 'none' }}
          ref={fileSelectBtnRef}
          onChange={fileSelectedHandler}
        />
        <Modal open={selectedFile !== ''} onClose={() => setSelectedFile('')}>
          <ImgUploadConfirm
            src={selectedFile}
            noClick={() => setSelectedFile('')}
            yesClick={fileUploadHandler}
          />
        </Modal>
        <PopupMessage
          type="success"
          open={success}
          handleClose={() => setSuccess(false)}
          message="Avatar Changed!"
        />
        <PopupMessage
          type="error"
          open={errorMsg !== ''}
          handleClose={() => setErrorMsg('')}
          message={errorMsg}
        />
      </div>
    </>
  );
};

export default Dashboard;
