import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import fajr from "../images/fajr.png";
import dhhr from "../images/dhhr.png";
import asr from "../images/asr.png";
import night from "../images/night.png";
import sunset from "../images/sunset.png";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import "moment/dist/locale/ar-dz";

moment.locale("ar-dz");

export default function MainContent() {
  const [time, setTime] = useState();
  const [today, setToday] = useState();
  const [timer, setTimer] = useState(10);
  const [nextPrayer, setNextPrayer] = useState(0);
  const [selectedCity, setSelectedCity] = useState({
    displayedName: "القاهرة",
    apiName: "Cairo",
  });
  const [renderedTime, setRenderdTime] = useState("");

  const avilableCities = [
    {
      displayedName: "القاهرة",
      apiName: "Cairo",
    },
    {
      displayedName: "الأسكندرية",
      apiName: "Alexandria",
    },
    {
      displayedName: "المنصورة",
      apiName: "Mansoura",
    },
    {
      displayedName: "أسوان",
      apiName: "Aswan",
    },
  ];

  async function getCity() {
    const api = `https://api.aladhan.com/v1/timingsByCity?country=EG&city=${cityName}`;
    await axios
      .get(api)
      .then((response) => {
        setTime(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  const cityName = selectedCity.apiName;
  useEffect(() => {
    getCity();
    const currentTime = moment();
    setToday(currentTime.format("Do - MMM - YYYY | h:mm"));
  }, [cityName]);

  useEffect(() => {
    if (time) {
      setupCountDownTimer();
    }
    // let interval = setInterval(() => {
    //   setTimer((prev) => prev - 1);
    // }, 1000);
    // return () => {
    //   clearInterval(interval);
    // };
  }, [time]);

  const prayerArray = [
    { key: "Fajr", displayedName: "الفجر" },
    { key: "Dhuhr", displayedName: "الظهر" },
    { key: "Asr", displayedName: "العصر" },
    { key: "Sunset", displayedName: "المغرب" },
    { key: "Isha", displayedName: "العشاء" },
  ];

  const setupCountDownTimer = () => {
    const currentMoment = moment();
    let prayerIndex = 2;

    // moment(time.timings["Fajr"], "hh:mm"); here i make it an object

    if (
      currentMoment.isAfter(moment(time.timings["Fajr"], "hh:mm")) &&
      currentMoment.isBefore(moment(time.timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      currentMoment.isAfter(moment(time.timings["Dhuhr"], "hh:mm")) &&
      currentMoment.isBefore(moment(time.timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      currentMoment.isAfter(moment(time.timings["Asr"], "hh:mm")) &&
      currentMoment.isBefore(moment(time.timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      currentMoment.isAfter(moment(time.timings["Sunset"], "hh:mm")) &&
      currentMoment.isBefore(moment(time.timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayer(prayerIndex);

    //now after knowing what the next prayer is , we can setup the countdown timer by getting the prayer's time

    const nextPrayerObject = prayerArray[prayerIndex];
    const nextPrayerTime = time.timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");
    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(currentMoment);
    const duratuionRemainingTime = moment.duration(remainingTime);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(currentMoment);
      const fajrToMidnight = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiff = midnightDiff + fajrToMidnight;
      remainingTime = totalDiff;
    }

    const interval = setInterval(() => {
      remainingTime -= 1000;
      if (remainingTime < 0) {
        clearInterval(interval);
      } else {
        const durationRemainingTime = moment.duration(remainingTime);
        setRenderdTime(
          `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
        );
      }
    }, 1000);
  };

  const handleChange = (event) => {
    setSelectedCity(event.target.value);
  };
  return (
    <main>
      <Grid container>
        <Grid xs={6}>
          {today ? (
            <h2>{today}</h2>
          ) : (
            <span className="loading" style={{ fontSize: "1.5rem" }}>
              Loading
            </span>
          )}

          <h1>{selectedCity.displayedName}</h1>
        </Grid>

        <Grid xs={6}>
          <h2>متبقى حتى صلاة {prayerArray[nextPrayer].displayedName}</h2>
          <h1>
            {renderedTime ? (
              renderedTime
            ) : (
              <span className="loading">Loading</span>
            )}
          </h1>
        </Grid>
      </Grid>

      <Divider style={{ borderColor: "white", opacity: "0.1" }} />

      <Stack
        className="prayer-stack"
        direction="row"
        justifyContent={"space-between"}
        style={{ margin: "2rem 0 0" }}
      >
        <Prayer name="الفجر" time={time?.timings?.Fajr} img={fajr} />
        <Prayer name="الظهر" time={time?.timings?.Dhuhr} img={dhhr} />
        <Prayer name="العصر" time={time?.timings?.Asr} img={asr} />
        <Prayer name="المغرب" time={time?.timings?.Maghrib} img={night} />
        <Prayer name="العشاء" time={time?.timings?.Isha} img={sunset} />
      </Stack>

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ margin: "1.5rem 0" }}
      >
        <FormControl
          style={{
            width: "25%",
            background: "#333",
          }}
        >
          <InputLabel id="demo-simple-select-label">
            <span
              style={{
                color: "white",
                fontWeight: "500",
                fontFamily: "IBM Plex Sans Arabic",
              }}
            >
              {selectedCity.displayedName}
            </span>
          </InputLabel>

          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedCity}
            label="المدينة"
            onChange={handleChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem key={city.apiName} value={city}>
                  {city.displayedName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </main>
  );
}
