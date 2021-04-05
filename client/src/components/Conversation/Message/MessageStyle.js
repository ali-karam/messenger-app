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
      borderRadius: '0 0.75em 0.75em',
      color: 'white',
      padding: 10
    },
    '& $messageImg': {
      borderRadius: '0 1em 1em'
    }
  },
  messageText: {
    backgroundColor: '#f2f5fa',
    borderRadius: '0.75em 0.75em 0',
    color: '#959cb0',
    padding: 10
  },
  messageImg: {
    maxHeight: 300,
    maxWidth: 300,
    borderRadius: '1em 1em 0'
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
