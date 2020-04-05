import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  interpreter: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    top: "36px",
    left: 0,
  },
  participants: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    top: 200,
    left: 0,
  },
  micSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    background: "#f74343",
    borderRadius: "50%",
    cursor: "pointer"
  },
  black: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    borderRadius: "50%",
    background: "black"
  },
  roomList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    '& li':{
      display: "flex",
      cursor: "pointer",
      alignItems: "center",
      padding: 5
    }
  },
});
export default styles;
