import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/styles";
import Styles, { CustomTextField } from "./style";
import axios from "axios";
import InputAdornment from "@material-ui/core/InputAdornment";
import MailIcon from "@material-ui/icons/Mail";

class Login extends React.Component {
  state = {
    email: "",
    password: ""
  };

  copyright = () => {
    return (
      <Typography variant="body2" color="textSecondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="#">
          Rafiky Connect
        </Link>{" "}
        {new Date().getFullYear()}
      </Typography>
    );
  };

  onChangeText = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();
    if (this.state.email && this.state.password) {
      //   axios
      //     .post("api/users/login", {
      //       password: this.state.password,
      //       email: this.state.email
      //     })
      //     .then(val => {
      //       localStorage.setItem("token", val.headers["x-auth-token"]);
      //       if (val.data && !val.data.privacy_approval) {
      //         this.toggle(val.data);
      //       } else {
      //         localStorage.setItem("user", JSON.stringify(val.data));
      //         this.props.history.push("/");
      //       }
      //     })
      //     .catch(err => {
      //       if (err.response && err.response.data) {
      //         alert(err.response.data);
      //       }
      //     });
    } else {
      alert("Please fill complete form");
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid container component="main" className={classes.root}>
          <CssBaseline />
          <Grid item xs={false} sm={4} md={7} className={classes.image} />
          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
          >
            <div className={classes.paper}>
              <img
                className={classes.avatar}
                height="40px"
                width="60px"
                src="/static/portale.png"
                alt="my image"
              />
              <Typography component="h1" variant="h5">
                Member Login
              </Typography>
              <form
                onSubmit={this.onSubmit}
                className={classes.form}
                noValidate
                autoComplete="off"
              >
                <CustomTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  placeholder="Email"
                  onChange={this.onChangeText}
                  value={this.state.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon style={{ color: "#6d6f6e" }} />
                      </InputAdornment>
                    )
                  }}
                />
                <CustomTextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  placeholder="Password"
                  type="password"
                  onChange={this.onChangeText}
                  value={this.state.password}
                  id="password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon style={{ color: "#6d6f6e" }} />
                      </InputAdornment>
                    )
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  classes={{
                    root: classes.submit
                  }}
                >
                  LOGIN
                </Button>
                <Box mt={5}>{this.copyright}</Box>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(Styles)(Login);
