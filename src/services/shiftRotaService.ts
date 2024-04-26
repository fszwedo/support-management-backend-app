import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import shiftRotaModel, { ShiftRota } from "../models/shiftRotaModel";
import ShiftRotaRepository from "../repositories/shiftRotaRepository";
import { agents } from "./agents";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export default class ShiftRotaService {
  private shiftRepository: ShiftRotaRepository;

  constructor(shiftRepository) {
    this.shiftRepository = shiftRepository;
  }

  getAllShifts = async () => {
    return this.shiftRepository.getAll();
  };

  getTodayShifts = async (): Promise<ShiftRota> => {
    return this.shiftRepository.getShiftForToday();
  };

  getNextWeekShifts = async () => {
    const days = [1, 7, 6, 5, 4, 3, 2];
    const day1 = new Date();
    let date1 = null;
    let date2 = null;
    if (day1.getDate() == 1) {
      date1 = day1;
    } else {
      date1 = day1.setDate(day1.getDate() + days[day1.getDay()]);
      date2 = day1.setDate(day1.getDate() + days[day1.getDay()] - 3);
    }

    let date3 = new Date(date1).toISOString().substring(2).split("T")[0];
    let date4 = new Date(date2).toISOString().substring(2).split("T")[0];
    return this.shiftRepository.getShiftsForDateScope(date3, date4);
  };

  getShiftsForSpecifiedDay = async (day: string) => {
    return this.shiftRepository.getShiftsForSpecifiedDay(day);
  };

  getShiftsFromCurrentMonthOnwards = async (day: string) => {
    return this.shiftRepository.getShiftsForCurrentMonthOnwards(day);
  };

  saveShiftRotaEntry = async (shiftRotaEntry: ShiftRota) => {
    const newShiftRota = new shiftRotaModel(shiftRotaEntry);

    try {
      await newShiftRota.validate();
      const checkIfThisShiftExists = await this.shiftRepository.getShiftsForSpecifiedDay(shiftRotaEntry.date);

      if (checkIfThisShiftExists) {
        await this.shiftRepository.updateByDate(shiftRotaEntry);
        console.log(`Updating entry for ${shiftRotaEntry.date}...`);
      } else {
        await this.shiftRepository.create(shiftRotaEntry);
        console.log(`Creating entry for ${shiftRotaEntry.date}...`);
      }
    } catch (ex) {
      console.log(ex.message);
      throw ex.message;
    }

    return shiftRotaEntry;
  };

  saveShiftRotaEntriesFromCsv = async (shiftData) => {
    let formattedShiftData: ShiftRota[] = [];

    shiftData.forEach((shift) => {
      const { date, agents, workSchedules } = this.extractShiftRotaData(shift);
      let allWorkHours = [];
      let allTicketAssignmentHours = [];
      let overwatchAssignments = [];

      for (const workSchedule of workSchedules) {
        const [workHours, ticketAssignmentHours, overwatch] = workSchedule.split("/");

        if (workHours) {
          const workHoursUtc = this.convertShiftRotaHoursToUTC(workHours);
          allWorkHours.push(workHoursUtc);
        } else {
          allWorkHours.push("");
        }

        if (ticketAssignmentHours) {
          const ticketAssignmentHoursUtc = this.convertShiftRotaHoursToUTC(ticketAssignmentHours);
          allTicketAssignmentHours.push(ticketAssignmentHoursUtc);
        } else {
          allTicketAssignmentHours.push("");
        }

        overwatchAssignments.push(Boolean(overwatch));
      }

      formattedShiftData.push({
        date,
        agents,
        hours: allTicketAssignmentHours,
        workHours: allWorkHours,
        overwatchAssignments,
      });
    });

    for (const shiftEntry of formattedShiftData) {
      await this.saveShiftRotaEntry(shiftEntry);
    }
  };

  convertShiftRotaHoursToUTC(hours: string) {
    const timezone = dayjs.tz.guess();
    const hasMultipleTimeframes = hours.indexOf(";") !== -1;

    if (hasMultipleTimeframes) {
      const [firstTimeframe, secondTimeframe] = hours.split(";");
      const firstTimeframeUtc = timeframeToUTC(firstTimeframe);
      const secondTimeframeUtc = timeframeToUTC(secondTimeframe);
      return `${firstTimeframeUtc};${secondTimeframeUtc}`;
    } else {
      return timeframeToUTC(hours);
    }

    function timeframeToUTC(timeframe: string) {
      const [startHour, endHour] = timeframe.split("-");
      const startDate = dayjs().hour(Number(startHour));
      const endDate = dayjs().hour(Number(endHour));
      let startHourUtc = dayjs.tz(startDate, timezone).utc().hour();
      let endHourUtc = dayjs.tz(endDate, timezone).utc().hour();

      if (startHourUtc === 0 && Number(startHour) > 24) {
        startHourUtc = 24;
      }

      if (endHourUtc === 0 && Number(endHour) > 24) {
        endHourUtc = 24;
      }

      return `${startHourUtc}-${endHourUtc}`;
    }
  }

  extractShiftRotaData(shift: any) {
    const keys: string[] = Object.keys(shift);
    const rows: string[] = Object.values(shift);
    const date = dayjs(rows[0], "YY-MM-DD").format("YY-MM-DD");
    const agents = keys.filter((column) => column !== "date");
    const workSchedules: string[] = rows.filter((value) => !dayjs(value, "YY-MM-DD", true).isValid());

    return { date, agents, workSchedules };
  }

  getAgentTeam(agentName: string): "Conversation" | "Search" | undefined {
    const agent = agents.find((agent) => agent.shiftRotaName === agentName);
    return agent.team;
  }
}
