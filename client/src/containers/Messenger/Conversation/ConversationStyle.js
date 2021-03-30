import { makeStyles } from "@material-ui/core/styles";

const conversationStyle = makeStyles(theme => ({
    messageBar: {
      margin: '10px 10px 10px 0',
      width: '90%',
      backgroundColor: '#f2f5fa',
      padding: '10px 20px',
      boxShadow: '1px 1px 2px #faf7f7',
      height: '80px',
      borderRadius: '5px',
    }
}));

export default conversationStyle;