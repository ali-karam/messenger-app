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
    marginRight: 10
  },
  username: {
    textTransform: 'Capitalize',
    fontSize: '0.92rem'
  },
  currentUser: {
    boxShadow: 'none',
    width: '90%',
    padding: 0,
    '& $avatar': {
      marginRight: 2
    },
    '@media (max-width:600px)': {
      '& $username': {
        display: 'none'
      },
      '& $optionBtn': {
        paddingLeft: 0,
        position: 'relative',
        right: 11
      },
      '& $avatar': {
        marginRight: 0
      }
    },
    '@media (max-width:365px)': {
      flexWrap: 'wrap',
      '& $optionBtn': {
        right: 0,
        margin: '0 auto',
        paddingTop: 0,
        paddingBottom: 0
      }
    }
  },
  optionBtn: {
    marginLeft: 'auto',
    marginRight: 0
  },
  badge: {
    color: 'white',
    backgroundColor: '#00AFD7'
  }
}));

export default userCardStyle;
