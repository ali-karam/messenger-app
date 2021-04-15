import { makeStyles } from "@material-ui/core/styles";

const navBarStyle = makeStyles(theme => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  navBtn: {
    fontWeight: 'bold',
    fontSize: '0.9rem',
    textTransform: 'capitalize',
    color: 'white'
  },
  title: {
    fontSize: '1rem'
  }
}));

export default navBarStyle;
