import { makeStyles } from "@material-ui/core/styles";

const messageBarStyle = makeStyles(theme => ({
  messageBar: {
    margin: '10px 10px 30px 0',
    width: '90%',
    backgroundColor: '#f2f5fa',
    padding: '10px 20px',
    boxShadow: '1px 1px 2px #faf7f7',
    minHeight: '12vh',
    borderRadius: '5px',
    boxSizing: 'border-box'
  }
}));

export default messageBarStyle;
