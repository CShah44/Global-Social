import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  Avatar,
  MenuItem,
} from "@mui/material";
import { AiOutlineMenu } from "react-icons/ai";
import { useState } from "react";
import { auth } from "../firebase";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import getUser from "./Actions/getUser";

function Navbar() {
  const router = useRouter();
  const user = getUser();
  const theme = useTheme();

  function processSignOut() {
    auth.signOut();
    router.replace("/");
  }

  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Expose",
            }}
          >
            GLOBAL SOCIAL
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <AiOutlineMenu />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem>
                <Button
                  onClick={() =>
                    router.push(`${router.basePath}/user/${user.uid}`)
                  }
                >
                  Your Profile
                </Button>
              </MenuItem>
              <MenuItem>
                <Button onClick={() => router.push("/post")}>
                  Create Post
                </Button>
              </MenuItem>
              <MenuItem>
                <Button onClick={processSignOut}>Log out</Button>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            GLOBAL SOCIAL
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 2,
              mx: 2,
            }}
          >
            <Button
              onClick={() => router.push(`${router.basePath}/user/${user.uid}`)}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Profile
            </Button>
            <Button
              onClick={() => router.push("post")}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Create Post
            </Button>
            <Button
              onClick={processSignOut}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Log Out
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Avatar alt={user.displayName} src={user.photoURL} />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
