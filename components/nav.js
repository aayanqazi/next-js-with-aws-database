import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Router from "next/router";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: "#561bbe",
    height: 40
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  toolbar: {
    minHeight: 10
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <style jsx global>{`
        body {
          margin: 0;
        }
        #zmmtg-root {
          margin-top: 20px;
          margin-left: 20px;
        }
        #zmmtg-root,#wc-loading, .meeting-client, .meeting-client-inner, .meeting-app {
          width: 800px !important;
          height: 400px !important;
          position: relative !important;
        }
        .loading-layer{
          display: none !important;
        }
        #wc-footer {
          width: 800px !important;
        }

        #wc-container-right{
          position: absolute !important;
          left: 0 !important;
          z-index: 1000000 !important;
          top: 0 !important;
          height: 60% !important;
        }
        .participant-scrollbar{
          height: 100% !important;
        }
        #wc-container-left{
        }

        #wc-content{
          display: flex !important;
        }
        
        #dialog-join {
          width: 800px !important;
        }
        
        #sv-active-video, .active-main, #sv-active-speaker-view, .main-layout {
          height: 400px !important;
          width: 800px !important;
        }
        
        .suspension-window {
          transform: translate(-570px, 30px) !important;
        }
      `}</style>
      <AppBar classes={{
        root: classes.appBar
      }} position="static">
        <Toolbar classes={{
          root: classes.toolbar
        }}>
          <Typography variant="h6" className={classes.title}>
          </Typography>
          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/";
                  handleClose();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
