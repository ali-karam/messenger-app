import { makeStyles } from "@material-ui/core/styles";

const userCardStyle = makeStyles(theme => ({
    card: {
      padding: '0px 10px',
      minHeight: 75,
      marginBottom: 5,
      boxShadow: '1px 1px 2px #faf7f7'
    },
    avatar: {
        float: 'left',
        backgroundColor: theme.palette.primary.main,
        height: 50,
        width: 50,
        margin: '18px 8px',
    },
    username: {
        textTransform: 'Capitalize',
        marginTop: 34,
        fontSize: 16
    }
}));

export default userCardStyle;