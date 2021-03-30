import { makeStyles } from "@material-ui/core/styles";

const messengerStyle = makeStyles(theme => ({
  searchBar: {
    margin: '5px 10px',
    width: '90%',
    backgroundColor: '#e7eef8',
    padding: 10,
    boxShadow: '1px 1px 2px #faf7f7',
    height: '45px',
    borderRadius: '5px',
    fontSize: 13
  },
  conversations: {
    margin: '5px 10px',
    width: '90%'
  },
  title: {
    margin: '5px 10px'
  },
  loading: {
    display: 'flex', 
    justifyContent: 'center'
  }
}));

export default messengerStyle;