import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  interpreter: {
    position: "relative"
  },
  micSection: {
    position: "absolute",
    top: "31px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    background: "#f74343",
    borderRadius: "50%"
  }
});
export default styles;
