import { makeStyles } from "@material-ui/core/styles";

const messengerStyle = makeStyles(theme => ({
  root: {
    minHeight: '100vh'
  },
  sideBar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginLeft: 10,
    maxHeight: '100vh',
    overflow: 'scroll',
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
    width: '90%'
  },
  title: {
    marginTop: 20
  },
  loading: {
    alignSelf: 'center'
  }
}));

export default messengerStyle;