import { makeStyles } from '@material-ui/core/styles';

const messageStyle = makeStyles((theme) => ({
  userContent: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    '& $avatar': {
      height: 22,
      width: 22,
      marginRight: 2,
      top: 8
    }
  },
  otherUserContent: {
    marginBottom: 12,
    alignSelf: 'flex-start',
    display: 'flex',
    '& $messageText': {
      background: 'linear-gradient(to left, #66bdff 0%, #358dff 100%)',
      borderRadius: '0 12px 12px',
      color: 'white'
    },
    '& $messageImg': {
      borderRadius: '0 16px 16px'
    },
    '& div': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  messageText: {
    backgroundColor: '#f2f5fa',
    borderRadius: '12px 12px 0',
    color: '#959cb0',
    padding: 10,
    overflowWrap: 'break-word',
    maxWidth: '30vw'
  },
  messageImg: {
    maxHeight: 300,
    maxWidth: 300,
    borderRadius: '16px 16px 0',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  avatar: {
    marginRight: 10,
    height: 30,
    width: 30,
    top: 6
  },
  messageInfo: {
    color: '#c8cfd9',
    fontSize: '0.77rem',
    marginBottom: 3
  }
}));

export default messageStyle;
