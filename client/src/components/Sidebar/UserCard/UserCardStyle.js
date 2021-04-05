import { makeStyles } from '@material-ui/core/styles';

const userCardStyle = makeStyles((theme) => ({
  card: {
    padding: '0px 10px',
    minHeight: 75,
    marginBottom: 5,
    boxShadow: '1px 1px 2px #faf7f7',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  avatar: {
    marginRight: 2
  },
  username: {
    textTransform: 'Capitalize',
    fontSize: '0.92rem'
  },
  currentUser: {
    boxShadow: 'none',
    width: '90%'
  },
  optionIcon: {
    marginLeft: 'auto',
    marginRight: 0
  },
  badge: {
    color: 'white',
    backgroundColor: '#00AFD7'
  }
}));

export default userCardStyle;
