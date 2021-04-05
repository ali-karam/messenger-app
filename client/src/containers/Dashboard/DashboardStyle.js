import { makeStyles } from "@material-ui/core/styles";

const dashboardStyle = makeStyles(theme => ({
  content: {
    margin: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  username: {
    textTransform: 'capitalize',
    fontSize: '1.7rem'
  },
  avatar: {
    height: 200,
    width: 200
  },
  changeAvatarBtn: {
    fontWeight: 'bold',
    marginTop: 10
  }
}));

export default dashboardStyle;
