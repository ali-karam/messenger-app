import { makeStyles } from "@material-ui/core/styles";

const conversationStyle = makeStyles(theme => ({
  root: {
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  messageBar: {
    margin: '10px 10px 30px 0',
    width: '90%',
    backgroundColor: '#f2f5fa',
    padding: '10px 20px',
    boxShadow: '1px 1px 2px #faf7f7',
    minHeight: '70px',
    borderRadius: '5px',
  },
  messages: {
    overflow: 'scroll',
    width: '90%',
    display: 'flex',
    flexDirection: 'column-reverse',
    alignItems: 'flex-end',
    minHeight: '70vh',
    paddingRight: 13
  }
}));

export default conversationStyle;