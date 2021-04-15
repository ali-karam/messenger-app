import { makeStyles } from '@material-ui/core/styles';

const messageBarStyle = makeStyles((theme) => ({
  messageBar: {
    margin: '10px 10px 30px 0',
    width: '90%',
    backgroundColor: '#f2f5fa',
    padding: '10px 20px',
    boxShadow: '1px 1px 2px #faf7f7',
    minHeight: '80px',
    borderRadius: '5px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    '@media (max-width:600px)': {
      padding: '5px 0 5px 8px',
      minHeight: 50
    }
  }
}));

export default messageBarStyle;
