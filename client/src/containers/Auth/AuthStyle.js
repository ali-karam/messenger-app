import { makeStyles } from "@material-ui/core/styles";

const authStyle = makeStyles(theme => ({
    root: {
      minHeight: "100vh",
      "& .MuiInput-underline:before": {
        borderBottom: "1.2px solid rgba(0, 0, 0, 0.2)"
      }
    },
    welcome: {
      fontSize: 26,
      paddingBottom: 20,
      color: "#000000"
    },
    buttonHeader: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      flexDirection: "column",
      bgcolor: "background.paper",
      minHeight: "100vh",
      paddingTop: 23
    },
    accBtn: {
      fontSize: 14,
      width: 170,
      height: 54,
      borderRadius: 5,
      filter: "drop-shadow(0px 2px 6px rgba(74,106,149,0.2))",
      backgroundColor: "#ffffff",
      color: "#3a8dff",
      boxShadow: "none",
      marginRight: 35,
      textTransform: "none",
      fontWeight: "bold"
    },
    noAccBtn: {
      fontSize: 14,
      color: "#b0b0b0",
      textAlign: "center",
      marginRight: 21,
      whiteSpace: "nowrap",
      textTransform: "none",
    },
    box: {
      padding: 24,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      flexDirection: "column",
      maxWidth: 900,
      margin: "auto"
    },
    form: {
      width: "100%", // Fix IE 11 issue.
      marginTop: theme.spacing(1)
    },
    submit: {
      margin: theme.spacing(3, 2, 2),
      padding: 10,
      width: 160,
      height: 56,
      borderRadius: 3,
      marginTop: 49,
      fontSize: 16,
      backgroundColor: "#3a8dff",
      fontWeight: "bold",
      textTransform: "none"
    }
  }));

export default authStyle;