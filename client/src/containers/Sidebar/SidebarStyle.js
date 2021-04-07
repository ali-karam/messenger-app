import { makeStyles } from '@material-ui/core/styles';

const sidebarStyle = makeStyles((theme) => ({
  root: {
    minHeight: '100vh'
  },
  sideBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 10,
    maxHeight: '100vh'
  },
  conversations: {
    width: '90%',
    overflow: 'scroll',
    paddingRight: 15
  },
  title: {
    marginTop: 20
  },
  loading: {
    alignSelf: 'center'
  }
}));

export default sidebarStyle;
