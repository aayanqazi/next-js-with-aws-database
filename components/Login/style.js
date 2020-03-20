import { withStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";

const styles = {
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center"
  },
  paper: {
    margin: "64px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    width: 40,
    height: 40
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 8
  },
  submit: {
    margin: "24px 0px 16px",
    borderRadius: 25,
    backgroundColor: "#57b845",
    "&:hover":{
        background: "rgba(87, 184, 69, 0.7)"
    }
  },
  input: {
    borderRadius: 25,
  }
};

export const CustomTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: `25px`
      }
    }
  }
})(TextField);
export default styles;
