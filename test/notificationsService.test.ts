import { Comment } from "src/services/notificationsService/INotificationsService";
import { ShiftRota } from "../src/models/shiftRotaModel";
import NotificationsService from "../src/services/notificationsService/notificationsService";

describe("Test evaluating whether notification should be sent", () => {
  const notificationsService = new NotificationsService();

  test("Shouldn't send notification if agent is in office", () => {
    const comment: Comment = {
      id: 1,
      public: true,
      message: "Hello world!",
      from: "Michael Jordan",
      createdAt: new Date("March 29, 2024 10:00:00"),
    };

    const shift: ShiftRota = {
      date: "24-03-29",
      agents: ["Michal"],
      hours: ["9-15"],
      workHours: ["8-16"],
      overwatchAssignments: [false],
    };

    const shouldSendNotification = notificationsService.shouldSendNotification(shift.workHours[0], comment);
    expect(shouldSendNotification.should).toBe(false);
  });

  test("Should send notification if update was made during the day and agent is out of office", () => {
    const comment: Comment = {
      id: 1,
      public: true,
      message: "Hello world!",
      from: "Michael Jordan",
      createdAt: new Date("March 29, 2024 10:00:00"),
    };

    const shift: ShiftRota = {
      date: "24-03-29",
      agents: ["Michal"],
      hours: ["11-16"],
      workHours: ["11-16"],
      overwatchAssignments: [false],
    };

    const shouldSendNotification = notificationsService.shouldSendNotification(shift.workHours[0], comment);
    expect(shouldSendNotification.should).toBe(true);
  });

  test("Should send notification if ticket came in a night and agent is on 2nd shift", () => {
    const comment: Comment = {
      id: 1,
      public: true,
      message: "Hello world!",
      from: "Michael Jordan",
      createdAt: new Date("March 29, 2024 3:00:00"),
    };

    const shift: ShiftRota = {
      date: "24-03-29",
      agents: ["Michal"],
      hours: ["14-22"],
      workHours: ["14-22"],
      overwatchAssignments: [false],
    };

    const shouldSendNotification = notificationsService.shouldSendNotification(shift.workHours[0], comment);
    expect(shouldSendNotification.should).toBe(true);
  });

  test("Shouldn't send notification if ticket came in a night and agent is on first shift", () => {
    const comment: Comment = {
      id: 1,
      public: true,
      message: "Hello world!",
      from: "Michael Jordan",
      createdAt: new Date("March 29, 2024 3:00:00"),
    };

    const shift: ShiftRota = {
      date: "24-03-29",
      agents: ["Michal"],
      hours: ["8-16"],
      workHours: ["8-16"],
      overwatchAssignments: [false],
    };

    const shouldSendNotification = notificationsService.shouldSendNotification(shift.workHours[0], comment);
    expect(shouldSendNotification.should).toBe(false);
  });

  test("Shouldn't send notification if comment came from the agent himself", () => {
    const comment: Comment = {
      id: 1,
      public: true,
      message: "Hello world!",
      from: undefined,
      createdAt: new Date("March 29, 2024 9:00:00"),
    };

    const shift: ShiftRota = {
      date: "24-03-29",
      agents: ["Michal"],
      hours: ["16-24"],
      workHours: ["16-24"],
      overwatchAssignments: [false],
    };

    const shouldSendNotification = notificationsService.shouldSendNotification(shift.workHours[0], comment);
    expect(shouldSendNotification.should).toBe(false);
  });
});
