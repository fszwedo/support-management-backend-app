import ShiftRotaRepository from "../src/repositories/shiftRotaRepository";
import shiftRotaService from "../src/services/shiftRotaService";
import shiftRotaModel from "../src/models/shiftRotaModel";
import mongoose from "mongoose";
import "dotenv/config";
import { readTextFile } from "../src/services/readWriteCsv";

const updateShiftsInDb = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@cluster0.mgkhb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.error("Could not connect to MongoDB!", error));

  //path is set rigidly to my documents folder - Phil
  const shiftData: any = await readTextFile("../SHIFTROTA.csv");

  console.log(shiftData)

  for (let i = 0; i < shiftData.length; i++) {
    for (const key in shiftData[i]) {
      if (key === "date") continue;

      let time = shiftData[i][key];

      //for empty times like ""
      if (time === "") continue;
      //for times like "9-13;15-16"
      else if (time.split("").includes(";")) {
        let subTimes = time.split(";");
        let convertedSubTimes: string[] = [];
        subTimes.forEach((time) => {
          let [startTimeLocal, endTimeLocal]: string[] = time.split("-");
          let convertedTime = UTCTimeConversion(startTimeLocal, endTimeLocal);
          convertedSubTimes.push(convertedTime);
        });

        shiftData[i][key] = convertedSubTimes.join(";");
      }
      //for times like "9-17"
      else {
        let [startTimeLocal, endTimeLocal]: string[] = time.split("-");
        let convertedTime = UTCTimeConversion(startTimeLocal, endTimeLocal);

        shiftData[i][key] = convertedTime;
      }
    }
  }

  const shiftRota = new shiftRotaService(
    new ShiftRotaRepository(shiftRotaModel)
  );

  //@ts-ignore
  await shiftRota.saveShiftRotaEntriesFromCsv(shiftData);
};

const doBatchUpdate = async () => {
  await updateShiftsInDb();
  process.exit();
};

doBatchUpdate();

//UTC time conversion
const UTCTimeConversion = (startTimeLocal: string, endTimeLocal: string) => {
  function convertMinsToHrsMins(a: number) {
    let hours = Math.trunc(a / 60);
    let minutes = a % 60;
    //If offset is full hours then result 8-16, if not 8:15-16:15
    if (minutes > 0) return hours + ":" + minutes;
    else return hours;
  }

  //Calculating offset(time diff bw local and UTC time)
  let offset: number = new Date().getTimezoneOffset();

  //Converting start time to UTC
  let startTimeLocalMinutes: number;
  if (startTimeLocal.length > 2)
    startTimeLocalMinutes =
      Number(startTimeLocal.split(":")[0]) * 60 +
      Number(startTimeLocal.split(":")[1]);
  else startTimeLocalMinutes = +startTimeLocal * 60;

  let startTimeLocalUTCMinutes: number = startTimeLocalMinutes + offset;
  let startTimeUTC = convertMinsToHrsMins(startTimeLocalUTCMinutes);

  //Converting end time to UTC
  let endTimeLocalMinutes: number;
  if (endTimeLocal.length > 2)
    endTimeLocalMinutes =
      Number(endTimeLocal.split(":")[0]) * 60 +
      Number(endTimeLocal.split(":")[1]);
  else endTimeLocalMinutes = +endTimeLocal * 60;

  let endTimeLocalUTCMinutes: number = endTimeLocalMinutes + offset;
  let endTimeUTC = convertMinsToHrsMins(endTimeLocalUTCMinutes);

  return `${startTimeUTC}-${endTimeUTC}`;
};
