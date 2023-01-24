import {Container, Paper} from "@mui/material";
import {theme} from "../contexts/theme_context";

export function RoundedBoxedText({borderColor, backgroundColor, children, elevation}) {
    return(
        <Paper style={{height:"100%", width:"100%"}} elevation={elevation}>
            <Container style={{border: "2px solid", borderRadius: "5px", borderColor: borderColor,
                height:"100%", width:"100%", padding: "2vh 2vw", backgroundColor: backgroundColor
            }}>
                {children}
            </Container>
        </Paper>

    )
}

RoundedBoxedText.defaultProps = {
    borderColor: theme.secondary,
    backgroundColor: theme.background,
    elevation: 0
}
