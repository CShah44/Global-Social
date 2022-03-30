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
import { useRouter } from "next/router";
import Link from "next/link";
import getUser from "./Actions/getUser";
import { signOut } from "firebase/auth";

function Navbar() {
  const router = useRouter();
  const user = getUser();

  function processSignOut() {
    signOut(auth);
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
          <Link href="/" passHref>
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
          </Link>

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
              <Link href={`${router.basePath}/user/${user.uid}`} passHref>
                <MenuItem>Your Profile</MenuItem>
              </Link>
              <Link href="/post" passHref>
                <MenuItem>Create Post</MenuItem>
              </Link>
              <MenuItem onClick={processSignOut}>Log out</MenuItem>
            </Menu>
          </Box>
          <Link href="/" passHref>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
            >
              GLOBAL SOCIAL
            </Typography>
          </Link>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              gap: 2,
              mx: 2,
            }}
          >
            <Link href={`${router.basePath}/user/${user.uid}`} passHref>
              <Button sx={{ my: 2, color: "white", display: "block" }}>
                Profile
              </Button>
            </Link>

            <Link href="/post" passHref>
              <Button sx={{ my: 2, color: "white", display: "block" }}>
                Create Post
              </Button>
            </Link>
            <Button
              onClick={processSignOut}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              Log Out
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Link href={`${router.basePath}/user/${user.uid}`} passHref>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </Link>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
