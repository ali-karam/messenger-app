import { makeStyles } from "@material-ui/core/styles";

const conversationStyle = makeStyles(theme => ({
  root: {
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  messages: {
    overflow: 'scroll',
    width: '90%',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'flex-end',
    minHeight: '65vh',
    paddingRight: 13
  },
  emojiSelector: {
    position: 'absolute', 
    alignSelf: 'flex-end', 
    marginRight: '85px'
  },
  loading: {
    position: 'absolute',
    top: 100
  }
}));

export default conversationStyle;
