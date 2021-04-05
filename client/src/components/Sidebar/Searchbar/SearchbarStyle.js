import { makeStyles } from "@material-ui/core/styles";

const searchbarStyle = makeStyles(theme => ({
  searchBar: {
    margin: '12px 0',
    width: '90%',
    backgroundColor: '#e7eef8',
    padding: 10,
    boxShadow: '1px 1px 2px #faf7f7',
    height: '45px',
    borderRadius: '0.4em',
    fontSize: 13
  }
}));

export default searchbarStyle;
