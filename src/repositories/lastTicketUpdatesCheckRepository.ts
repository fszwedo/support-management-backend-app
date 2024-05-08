import dayjs, { Dayjs } from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Repository } from "./repository";
dayjs.extend(utc);
dayjs.extend(timezone);

export default class LastTicketUpdatesCheck extends Repository {
  async storeTicketUpdatesCheckDate() {
    const lastTicketUpdatesCheck = await this.findOne({});
    const now = new Date();
    const utcDateString = now.toISOString();

    if (lastTicketUpdatesCheck) {
      await this.updateById(lastTicketUpdatesCheck._id, {
        utcDateString,
      });
    } else {
      await this.create({
        utcDateString,
      });
    }
  }

  async getLastTicketUpdatesCheck(): Promise<Dayjs | null> {
    const lastTicketUpdatesCheck = await this.findOne({});

    if (lastTicketUpdatesCheck) {
      const result = dayjs(lastTicketUpdatesCheck.utcDateString).utc();
      return result;
    }

    return null;
  }
}
