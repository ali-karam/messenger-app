import { makeStyles } from "@material-ui/core/styles";

const validatedTextFieldStyle = makeStyles(theme => ({
    label: { fontSize: 19, color: "rgb(0,0,0,0.4)", paddingLeft: "5px" },
    inputs: {
      marginTop: ".8rem",
      height: "2rem",
      padding: "5px"
    },
    forgot: {
      paddingRight: 10,
      color: "#3a8dff"
    }
}));

export default validatedTextFieldStyle;