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
  searchBar: {
    margin: '12px 0',
    width: '90%',
    backgroundColor: '#e7eef8',
    padding: 10,
    boxShadow: '1px 1px 2px #faf7f7',
    height: '45px',
    borderRadius: '0.4em',
    fontSize: 13
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
  },
  currentUser: {
    width: '90%'
  }
}));

export default sidebarStyle;
