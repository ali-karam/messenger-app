import { makeStyles } from '@material-ui/core/styles';

const imgUploadConfirmStyle = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: 'white',
    outline: 'none',
    margin: 'auto',
    marginTop: 20,
    width: 500,
    height: 500,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '1em',
    border: '4px solid black',
    boxSizing: 'border-box',
    padding: 10,
    borderColor: theme.palette.primary.main,
    '@media (max-width:600px)': {
      width: 300,
      height: 300
    }
  },
  img: {
    height: 300,
    width: 300,
    borderRadius: '50%',
    marginBottom: 10,
    '@media (max-width:600px)': {
      width: 150,
      height: 150
    }
  },
  button: {
    fontWeight: 'bold',
    margin: '20px 10px 0 10px',
    padding: '6px 40px'
  }
}));

export default imgUploadConfirmStyle;
