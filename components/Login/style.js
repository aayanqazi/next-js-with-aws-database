import { withStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";

const styles = {
  root: {
    height: "100vh"
  },
  image: {
    backgroundImage: "url(/static/shutterstock_92526319.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "100% center"
  },
  paper: {
    margin: "64px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: 8,
    width: 60,
    height: 40
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 8
  },
  submit: {
    margin: "24px 0px 16px",
    borderRadius: 25,
    backgroundColor: "#561bbe",
    "&:hover":{
        background: "rgba(86, 27, 190, 0.7)"
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
