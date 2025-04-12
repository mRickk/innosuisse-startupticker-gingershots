import { createTheme } from "@mui/material";

const customTheme = createTheme({
    palette: {
        mode:"light",
        primary: {
            main: "#4202a3"
        },
        secondary: {
            main: "#EAF0F1"
        },
    },
    breakpoints: {  
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1280,  
          xl: 1920,
        },
      },
})

export default customTheme;