require("dotenv").config();
var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
import timeTrackingEventModel from "../src/models/timeTrackingEventModel";
import TimeTrackingEventRepository from "../src/repositories/timeTrackingEventRepository";
import TimeTrackingService from "../src/services/timeTrackingService";
import TimeTrackingController from "../src/controllers/timeTrackingController";
import timeTrackingRoutes from "../src/routes/timeTracking";
import getTicketAuditLogs from '../src/services/zendesk/getTicketAuditLogs';
import getAgents from '../src/services/zendesk/getAgentsService';

const mongooseConnection = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@${process.env.MONGOCONNECTIONSTRING}`
    )
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.error("Could not connect to MongoDB!", error));
};
mongooseConnection();

const timeTrackingEventRepository = new TimeTrackingEventRepository(
  timeTrackingEventModel
);
const timeTrackingEventService = new TimeTrackingService(
  timeTrackingEventRepository
);
const timeTrackingEventController = new TimeTrackingController(
  timeTrackingEventService, getTicketAuditLogs, getAgents
);

const saveTrackingEvents = async () => {
  await timeTrackingEventController.saveNewTimeTrackingEvents(new Date('01/06/2023'));
};

const getTrackingEvents = async () => {
  const app = express();
  app.use(
    cors({
      exposedHeaders: "x-auth-token",
    })
  );
  app.use(express.json());
  app.use("/api/timeTracking", timeTrackingRoutes(timeTrackingEventController));

  app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
  });
};

//saveTrackingEvents();
getTrackingEvents();
