import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";


export default function Prayer({ name, time, img }) {
  return (
    <Card
      sx={{
        minWidth: 285,
        maxWidth: "100%",
        display: "inline-block",
      }}
    >
      <CardMedia
        sx={{ height: 140, width: "100%" }}
        image={img}
        title="green iguana"
      />
      <CardContent>
        <h2>{name}</h2>
        <Typography variant="h1" color="text.secondary">
          {time ? time : <span className="loading">Loading</span>}
        </Typography>
      </CardContent>
    </Card>
  );
}
