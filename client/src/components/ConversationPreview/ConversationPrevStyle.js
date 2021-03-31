import { makeStyles } from "@material-ui/core/styles";

const conversationPrevStyle = makeStyles(theme => ({
    card: {
       minHeight: 75,
       boxShadow: '1px 1px 2px #faf7f7',
       display: 'flex',
       justifyContent: 'flex-start',
       alignItems: 'center',
       marginBottom: 10,
    },
    avatar: {
        backgroundColor: theme.palette.primary.main,
        height: 47,
        width: 47,
        marginRight: 10
    },
    info: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
    username: {
        textTransform: 'Capitalize',
        fontSize: '0.9rem',
        margin: 1
    },
    lastMessage: {
        fontSize: '0.75rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        margin: 1
    },
    unread: {
        fontWeight: 'bold'
    },
    notification: {
      backgroundColor: theme.palette.primary.main,
      height: 18,
      minWidth: 18,
      color: 'white',
      borderRadius: '50%',
      padding: '1.5px',
      fontSize: '0.65rem',
      fontWeight: 'bold',
      textAlign: 'center',
      marginLeft: 'auto',
      marginRight: '10px',
      lineHeight: '1rem'
    }
}));

export default conversationPrevStyle;