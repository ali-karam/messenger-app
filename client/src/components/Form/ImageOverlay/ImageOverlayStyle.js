import { makeStyles } from "@material-ui/core/styles";

const imageOverlayStyle = makeStyles(theme => ({
    heroText: {
      fontSize: 26,
      textAlign: "center",
      color: "white",
      marginTop: 30,
      maxWidth: 300
    },
    overlay: {
      backgroundImage:
        "linear-gradient(180deg, rgba(58,141,255, 0.85) 0%, rgba(134,185,255, 0.85) 100%)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      flexDirection: "column",
      minHeight: "100vh",
      paddingBottom: 145,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%"
    },
    image: {
      backgroundImage: "url(./images/bg-img.png)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
      backgroundPosition: "center"
    }
  }));

export default imageOverlayStyle;