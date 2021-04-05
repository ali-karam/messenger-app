import { makeStyles } from '@material-ui/core/styles';

const userAvatarStyle = makeStyles((theme) => ({
  default: {
    backgroundColor: theme.palette.primary.main,
    height: 50,
    width: 50
  },
  status: {
    position: 'relative',
    right: 18,
    top: 18,
    backgroundColor: '#d2dbec',
    height: 8,
    minWidth: 8,
    borderRadius: '50%',
    border: '3.5px solid white',
    margin: 0
  },
  online: {
    backgroundColor: '#2de787'
  }
}));

export default userAvatarStyle;
