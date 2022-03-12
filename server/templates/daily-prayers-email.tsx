import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PrayerRequest } from "../interfaces/types";
import { Avatar, CardHeader, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

function PrayerRequestCard(args: { prayerRequest: PrayerRequest }) {
  let prayerRequest = args.prayerRequest;
  return (
    <Grid item key={prayerRequest.id} xs={12} sm={12} md={12}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          avatar={<Avatar {...stringAvatar(prayerRequest.from)}></Avatar>}
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={prayerRequest.from}
          subheader={
            <div>
              <div>{prayerRequest.date.toDateString()}</div>
              <div>{prayerRequest.subject}</div>
            </div>
          }
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography>
            {prayerRequest.category ? `[${prayerRequest.category}] ` : ""}
            {prayerRequest.message}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">View</Button>
          <Button size="small">Edit</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

function Footer(args: { args: DailyPrayerEmailArgs }) {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <div>
        <Button variant="contained" href={args.args.prayedForUrl}>
          I prayed for these today
        </Button>
      </div>
      <div>
        <Button variant="outlined" href={args.args.getMoreUrl}>
          Click here for more prayer requests
        </Button>
      </div>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        Something here to give the footer a purpose!
      </Typography>
      <Copyright />
    </Box>
  );
}

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export interface DailyPrayerEmailArgs {
  prayerRequests: PrayerRequest[];
  user: {
    id: string;
    name: string;
  };
  prayedForUrl: string;
  getMoreUrl: string;
}

export default function DailyPrayerEmail(args: DailyPrayerEmailArgs) {
  const centerStyle = {
    display: "flex",
    "justify-content": "center",
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* Hero unit 
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Album layout
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Something short and leading about the collection below—its
              contents, the creator, etc. Make it short and sweet, but not too
              short so folks don&apos;t simply skip over it entirely.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained">Main call to action</Button>
              <Button variant="outlined">Secondary action</Button>
            </Stack>
          </Container>
        </Box>*/}
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {args.prayerRequests.map((prayerRequest) => (
              <PrayerRequestCard
                prayerRequest={prayerRequest}
              ></PrayerRequestCard>
            ))}
          </Grid>
        </Container>
      </main>
      <div style={centerStyle}>
        <img
          src="https://thehaashaus.com/prayer/images/image-5.jpeg"
          alt="cur"
          width="580"
        />
      </div>

      <Footer args={args}></Footer>
    </ThemeProvider>
  );
}
