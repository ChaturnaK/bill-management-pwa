// src/App.js
import React, { useState, useMemo, useEffect, Suspense, lazy } from "react";
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grow,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import SignIn from "./components/SignIn";

const AddBill = lazy(() => import("./components/AddBill"));
const BillList = lazy(() => import("./components/BillList"));

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });
    const [user, setUser] = useState(null);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                },
            }),
        [darkMode],
    );

    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    const handleThemeToggle = () => {
        setDarkMode((prev) => !prev);
    };

    if (!user) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Bill Management
                        </Typography>
                        <IconButton color="inherit" onClick={handleThemeToggle}>
                            {darkMode ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container
                    maxWidth="lg"
                    sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}
                >
                    <SignIn />
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Bill Management
                    </Typography>
                    <IconButton color="inherit" onClick={handleThemeToggle}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <IconButton color="inherit" onClick={() => auth.signOut()}>
                        Sign Out
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container
                maxWidth="lg"
                sx={{ py: 2, px: { xs: 2, sm: 3, md: 4 } }}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    <Grow in={true} timeout={1000}>
                        <div>
                            <AddBill />
                            <BillList />
                        </div>
                    </Grow>
                </Suspense>
            </Container>
        </ThemeProvider>
    );
}

export default App;
