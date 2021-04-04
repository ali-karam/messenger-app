import { makeStyles } from "@material-ui/core/styles";

const userAvatarStyle = makeStyles(theme => ({
    default: {
      backgroundColor: theme.palette.primary.main,
      height: 50,
      width: 50
    }
}));

export default userAvatarStyle;