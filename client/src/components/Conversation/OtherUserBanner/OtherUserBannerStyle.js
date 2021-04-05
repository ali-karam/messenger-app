import { makeStyles } from '@material-ui/core/styles';

const otherUserBannerStyle = makeStyles((theme) => ({
  root: {
    padding: '0px 10px',
    minHeight: 90,
    marginBottom: 5,
    marginRight: 5,
    boxShadow: '1px 1px 15px #dedcdc',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  username: {
    textTransform: 'capitalize',
    fontSize: '1.35rem',
    marginLeft: 20
  },
  optionsIcon: {
    marginLeft: 'auto',
    marginRight: 40,
    color: '#d5d7de',
    height: 30,
    width: 30
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 15,
    position: 'relative',
    top: 3
  },
  badge: {
    height: 8,
    minWidth: 8,
    backgroundColor: '#d2dbec',
    borderRadius: '50%',
    marginRight: 5
  },
  online: {
    backgroundColor: '#2de787'
  }
}));

export default otherUserBannerStyle;
