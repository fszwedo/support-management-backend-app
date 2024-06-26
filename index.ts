var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
require("dotenv").config();
import cron from "cron";

import assignNewTickets from "./src/controllers/ticketAssignmentController";
import shiftRota from "./src/routes/shiftRota";

import logModel from "./src/models/logModel";
import LoggerRepository from "./src/repositories/logRepository";
import LoggerService from "./src/services/loggerService";

import ShiftRotaController from "./src/controllers/shiftRotaController";
import shiftRotaModel from "./src/models/shiftRotaModel";
import ShiftRotaRepository from "./src/repositories/shiftRotaRepository";
import ShiftRotaService from "./src/services/shiftRotaService";

import sendEmailstoAgents from "./src/controllers/sendEmailController";
import ShiftChangeController from "./src/controllers/shiftChangeController";
import shiftChangeRequestModel from "./src/models/shiftChangeRequestModel";
import ShiftChangeRepository from "./src/repositories/shiftChangeRequestRepository";
import shiftChangeRoute from "./src/routes/shiftChangeRequest";
import ShiftChangeService from "./src/services/shiftChangeService";

import TicketController from "./src/controllers/ticketController";
import UserController from "./src/controllers/userController";
import userModel from "./src/models/userModel";
import UserRepository from "./src/repositories/userRepository";
import ticketRoutes from "./src/routes/tickets";
import usersRoute from "./src/routes/users";
import UserService from "./src/services/userService";
import TicketService from "./src/services/zendesk/ticketCreationService";

import AuthController from "./src/controllers/authController";
import authRoute from "./src/routes/auth";
import AuthService from "./src/services/authService";

import TimeTrackingController from "./src/controllers/timeTrackingController";
import timeTrackingEventModel from "./src/models/timeTrackingEventModel";
import TimeTrackingEventRepository from "./src/repositories/timeTrackingEventRepository";
import timeTrackingRoutes from "./src/routes/timeTracking";
import NotificationsService from "./src/services/notificationsService/notificationsService";
import TimeTrackingService from "./src/services/timeTrackingService";
import getAgentsService from "./src/services/zendesk/getAgentsService";
import getTicketAuditLogsService from "./src/services/zendesk/getTicketAuditLogs";

import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
dayjs.extend(timezone);

const shiftRotaRepository = new ShiftRotaRepository(shiftRotaModel);
const shiftRotaService = new ShiftRotaService(shiftRotaRepository);
const shiftRotaController = new ShiftRotaController(shiftRotaService);

const shiftChangeRepository = new ShiftChangeRepository(shiftChangeRequestModel);
const shiftChangeService = new ShiftChangeService(shiftChangeRepository, shiftRotaRepository);
const shiftChangeController = new ShiftChangeController(shiftChangeService);

const ticketService = new TicketService();
const ticketController = new TicketController(ticketService);
const userRepository = new UserRepository(userModel);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const authService = new AuthService(userRepository, process.env.JWTPRIVATEKEY);
const authController = new AuthController(authService, userService);

const timeTrackingEventRepository = new TimeTrackingEventRepository(timeTrackingEventModel);
const timeTrackingEventService = new TimeTrackingService(timeTrackingEventRepository);
const timeTrackingEventController = new TimeTrackingController(timeTrackingEventService, getTicketAuditLogsService, getAgentsService);

if (!process.env.JWTPRIVATEKEY || !process.env.PORT) console.log("Either JWTPRIVATEKEY or PORT environment variable is not present!");
if (!process.env.MONGOLOGIN || !process.env.MONGOPW) throw new Error("Either MONGOLOGIN or MONGOPW environment variable is not present!");
console.log("starting for " + process.env.URL);

const app = express();
app.use(
  cors({
    exposedHeaders: "x-auth-token",
  })
);
app.use(express.json());

//API paths
app.use("/api/shiftRota", shiftRota(shiftRotaController));
app.use("/api/shiftChangeRequest", shiftChangeRoute(shiftChangeController));
app.use("/api/tickets", ticketRoutes(ticketController));
app.use("/api", authRoute(authController));
app.use("/api/users", usersRoute(userController));
app.use("/api/timeTracking", timeTrackingRoutes(timeTrackingEventController));

const logger = new LoggerService(new LoggerRepository(logModel));

const mongooseConnection = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(`mongodb+srv://${process.env.MONGOLOGIN}:${process.env.MONGOPW}@${process.env.MONGOCONNECTIONSTRING}`)
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.error("Could not connect to MongoDB!", error));
};
mongooseConnection();

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});

logger.saveLog({
  type: "info/restart",
  message: "App started at " + new Date().toUTCString(),
});

const job = new cron.CronJob(process.env.TICKETASSIGNMENTCRON, async function () {
  assignNewTickets(logger);
});

//Running without ticket assignment
if (process.argv.includes("--noTicketAssignment")) {
  console.log("Running without ticket Assignment");
} else {
  job.start();
}

const timeTrackingSavingJob = new cron.CronJob(process.env.TICKETASSIGNMENTCRON, async function () {
  timeTrackingEventController.saveNewTimeTrackingEvents();
});
timeTrackingSavingJob.start();

const emailJob = new cron.CronJob(process.env.SHIFTEMAILCRON, async function () {
  sendEmailstoAgents(shiftRotaService, userService);
});
emailJob.start();

const notificationsService = new NotificationsService();
const zendeskNotificationsJob = new cron.CronJob(process.env.ZENDESKNOTIFICATIONCRON, async () => {
  const currentDateUTC = dayjs().utc();
  notificationsService.unavailableAgentsTicketNotifications(currentDateUTC);
});
zendeskNotificationsJob.start();
