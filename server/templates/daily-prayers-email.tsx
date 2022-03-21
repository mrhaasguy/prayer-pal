import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PrayerRequest } from "../interfaces/types";
import { Avatar, CardHeader, IconButton, Paper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AssignmentIcon from "@mui/icons-material/Assignment";

function stringToHslColor(str: string, s: number, l: number) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  var h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
}

function stringAvatar(name: string) {
  return {
    sx: {
      backgroundColor: stringToHslColor(name, 80, 65),
      width: 56,
      height: 56,
    },
    children: name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2),
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
          borderRadius: "1rem",
          boxShadow: "5px 6px 10px 5px #dbdbe8",
          backgroundColor: "#fff",
          //marginRight: "-8px",
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
              <div>{prayerRequest.subject}</div>
              <div>{prayerRequest.date.toDateString()}</div>
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
          <Button size="small">Prayed for</Button>
        </CardActions>
      </Card>
    </Grid>
  );
}

const UserStats: React.FC<DailyPrayerEmailArgs> = (args) => {
  return (
    /*<Grid item key={prayerRequest.id} xs={12} sm={12} md={12}>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: "1rem",
          boxShadow: "5px 6px 10px 5px #dbdbe8",
          backgroundColor: "#fff",
          //marginRight: "-8px",
        }}
      >
        <CardHeader
          title={prayerRequest.from}
          subheader={
            <div>
              <div>{prayerRequest.subject}</div>
              <div>{prayerRequest.date.toDateString()}</div>
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
          <Button size="small">Prayed for</Button>
        </CardActions>
      </Card>
    </Grid>*/
    <div>{JSON.stringify(args.stats)}</div>
  );
};

const Footer: React.FC<DailyPrayerEmailArgs> = (args) => {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <div>
        <Button variant="contained" href={args.prayedForUrl}>
          I prayed for these today
        </Button>
      </div>
      <div>
        <Button variant="outlined" href={args.getMoreUrl}>
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
};

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

export interface DailyPrayerEmailStats {
  prayedForCount: number;
  prayedForThisWeek: number;
  prayedForDaily: (boolean | null)[];
  userStats?: any;
}

export interface DailyPrayerEmailArgs {
  prayerRequests: PrayerRequest[];
  user: {
    id: string;
    name: string;
  };
  prayedForUrl: string;
  getMoreUrl: string;
  stats: DailyPrayerEmailStats | undefined;
}

const DailyPrayerEmail: React.FC<DailyPrayerEmailArgs> = (args) => {
  const centerStyle = {
    display: "flex",
    justifyContent: "center",
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        <Paper sx={{ backgroundColor: "#f0f0f0" }}>
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
        </Paper>
      </main>
      <div style={centerStyle}>
        <img
          src="https://thehaashaus.com/prayer/images/image-5.jpeg"
          alt="cur"
          width="580"
        />
      </div>

      <Footer {...args}></Footer>
      <UserStats {...args}></UserStats>
    </ThemeProvider>
  );
};

export default DailyPrayerEmail;
