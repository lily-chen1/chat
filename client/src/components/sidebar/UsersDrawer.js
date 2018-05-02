import React, { Component } from "react";
import FAChevronDown from "react-icons/lib/md/keyboard-arrow-down";
import FAMenu from "react-icons/lib/fa/list-ul";
import FASearch from "react-icons/lib/fa/search";
import MdEject from "react-icons/lib/md/eject";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import SwipeableViews from "react-swipeable-views";
import AppBar from "material-ui/AppBar";
import Tabs, { Tab } from "material-ui/Tabs";
import MenuItem from "material-ui/Menu/MenuItem";
import TextField from "material-ui/TextField";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import Drawer from "material-ui/Drawer";
import Toolbar from "material-ui/Toolbar";
import Chip from "material-ui/Chip";
import List from "material-ui/List";
import IconButton from "material-ui/IconButton";
import Delete from "@material-ui/icons/Delete";
import Hidden from "material-ui/Hidden";
import Divider from "material-ui/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import Avatar from "material-ui/Avatar";
// import { mailFolderListItems, otherMailFolderListItems } from "./tileData";
import SideBarOption from "./SideBarOption";
import { last, get, differenceBy } from "lodash";
import { createChatNameFromUsers } from "../../Factories";
import SideBarOptionChats from "./SideBarOptionChats";
import { FormGroup, FormControlLabel } from "material-ui/Form";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import Checkbox from "material-ui/Checkbox";
import CreateChat from "./CreateChat";
import IslandImage from "../../images/island.svg";
import "./UsersDrawer.scss";

const drawerWidth = 240;

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

const styles = theme => ({
  // card: {
  //   minWidth: 275
  // },
  root: {
    width: "100%"
  },
  details: {
    display: "flex",
    flexDirection: "column"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: 50,
    height: 50
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    color: "#ccccc1"
  },
  menu: {
    width: 200
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class UsersDrawer extends Component {
  static type = {
    USERS: "users",
    CHATS: "chats"
  };

  constructor(props) {
    super(props);
    this.state = {
      reciever: "",
      activeSideBar: UsersDrawer.type.CHATS,
      value: 0,
      mobileOpen: false,
      expanded: null,
      open: false
    };
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { reciever } = this.state;
    const { onSendPrivateMessage } = this.props;

    onSendPrivateMessage(reciever);
    this.setState({ reciever: "" });
  };

  addChatForUser = reciever => {
    this.props.onSendPrivateMessage(reciever);
    this.setActiveSideBar(UsersDrawer.type.CHATS);
  };

  setActiveSideBar = type => {
    this.setState({ activeSideBar: type });
  };

  handleChangePanel = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  handleDialogOpen = () => {
    this.setState({ open: true });
  };

  handleDialogClose = () => {
    this.setState({ open: false });
  };

  renderUsers = () => {
    const {
      chats,
      activeChat,
      user,
      setActiveChat,
      logout,
      users
    } = this.props;
    if (users.length > 1) {
      return differenceBy(users, [user], "name").map(user => {
        return (
          <SideBarOption
            key={user.id}
            name={user.name}
            color={user.color}
            onClick={() => {
              this.addChatForUser(user.name);
              this.props.changeTabs(1);
              this.setState({ expanded: null });
            }}
            handleChangePanel={this.handleChangePanel}
            expanded={this.state.expanded}
            version="users"
          />
        );
      });
    } else {
      return (
        <div>
          <Typography variant="headline" className="no-users-message">
            Looks like there's nobody here yet
          </Typography>
          <img src={IslandImage} alt="no users" />
        </div>
      );
    }
  };

  render() {
    const { classes, theme } = this.props;
    const {
      chats,
      activeChat,
      user,
      setActiveChat,
      logout,
      users
    } = this.props;
    const { reciever, activeSideBar } = this.state;
    const drawer = (
      <Card id="side-bar">
        <Card className="user-list-header">
          <div className={classes.details}>
            <CardContent>
              <Typography variant="headline" className="grey">
                Users
              </Typography>
            </CardContent>
          </div>
        </Card>
        <div className="side-bar-option-users">{this.renderUsers()}</div>
      </Card>
    );
    return (
      <React.Fragment>
        <Hidden mdUp>
          <Drawer
            variant="temporary"
            anchor={"right"}
            open={this.props.mobileOpen}
            onClose={this.props.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </React.Fragment>
    );
  }
}

UsersDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(UsersDrawer);
