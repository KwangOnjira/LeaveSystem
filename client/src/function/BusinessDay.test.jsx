import { beforeEach, describe, expect, it } from "vitest";
import { findBusinessDays, isnotHoliday } from "./BusinessDay";
import { getHoliday } from "./holiday";

vi.mock("./holiday", () => ({
  getHoliday: vi.fn(),
}));

const holidays = [
  {
    id: 1,
    name: "วันปีใหม่",
    date: "2024-01-01",
  },
  {
    id: 2,
    name: "วันมาฆบูชา",
    date: "2024-02-24",
  },
  {
    id: 3,
    name: "ชดเชยวันมาฆบูชา",
    date: "2024-02-26",
  },
  {
    id: 4,
    name: "วันจักรี",
    date: "2024-04-06",
  },
  {
    id: 5,
    name: "ชดเชยวันจักรี",
    date: "2024-04-08",
  },
  {
    id: 6,
    name: "วันสงกรานต์",
    date: "2024-04-13",
  },
  {
    id: 7,
    name: "วันสงกรานต์",
    date: "2024-04-14",
  },
  {
    id: 8,
    name: "วันสงกรานต์",
    date: "2024-04-15",
  },
  {
    id: 9,
    name: "ชดเชยวันสงกรานต์",
    date: "2024-04-16",
  },
  {
    id: 10,
    name: "วันแรงงาน",
    date: "2024-05-01",
  },
  {
    id: 11,
    name: "วันฉัตรมงคล",
    date: "2024-05-04",
  },
  {
    id: 12,
    name: "ชดเชยวันฉัตรมงคล",
    date: "2024-05-06",
  },
  {
    id: 13,
    name: "วันวิสาขบูชา",
    date: "2024-05-22",
  },
  {
    id: 14,
    name: "วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี",
    date: "2024-06-03",
  },
  {
    id: 15,
    name: "วันอาสาฬหบูชา",
    date: "2024-07-20",
  },
  {
    id: 16,
    name: "วันเข้าพรรษา",
    date: "2024-07-21",
  },
  {
    id: 17,
    name: "ชดเชยวันเข้าพรรษา",
    date: "2024-07-22",
  },
  {
    id: 18,
    name: "วันเฉลิมพระชนมพรรษารัชกาลที่10",
    date: "2024-07-28",
  },
  {
    id: 19,
    name: "ชดเชยวันเฉลิมพระชนมพรรษารัชกาลที่10",
    date: "2024-07-29",
  },
  {
    id: 20,
    name: "วันคล้ายวันสวรรคต ร.9",
    date: "2024-10-13",
  },
  {
    id: 21,
    name: "ชดเชยวันคล้ายวันสวรรคต ร.9",
    date: "2024-10-14",
  },
  {
    id: 22,
    name: "วันปิยมหาราช",
    date: "2024-10-23",
  },
  {
    id: 23,
    name: "วันพ่อแห่งชาติ",
    date: "2024-12-05",
  },
  {
    id: 24,
    name: "วันรัฐธรรมนูญ",
    date: "2024-12-10",
  },
  {
    id: 25,
    name: "วันสิ้นปี",
    date: "2024-12-31",
  },
];

describe("findBusinessDays", () => {
  beforeEach(() => {
    getHoliday.mockReturnValue(holidays);
  });
  it("should find number that business day correctly", () => {
    const firstDate = "2024-07-19";
    const lastDate = "2024-08-20";
    const expectOutput = 21;

    const formatted = findBusinessDays(firstDate, lastDate, getHoliday());

    expect(formatted).toBe(expectOutput);
  });

  it("should isnotHoliday return correctly if it is business day", () => {
    const firstDate = "2024-07-19";

    const checkIsNotHoliday = isnotHoliday(firstDate, getHoliday());

    expect(checkIsNotHoliday).toBe(false);
  });

  it("should isnotHoliday return correctly if it is holiday", () => {
    const firstDate = "2024-07-20";

    const checkIsNotHoliday = isnotHoliday(firstDate, getHoliday());

    expect(checkIsNotHoliday).toBe(true);
  });

  it("invalid first day", () => {
    const firstDate = "19-07-2024";
    const lastDate = "2024-08-20";
    const expectOutput = 0;

    const formatted = findBusinessDays(firstDate, lastDate, getHoliday());

    expect(formatted).toBe(expectOutput);
  });

  it("invalid last day", () => {
    const firstDate = "2024-07-19";
    const lastDate = "20-08-2024";
    const expectOutput = 0;

    const formatted = findBusinessDays(firstDate, lastDate, getHoliday());

    expect(formatted).toBe(expectOutput);
  });

  it("first day more than last day", () => {
    const firstDate = "2024-08-20";
    const lastDate = "2024-07-19";
    const expectOutput = 0;

    const formatted = findBusinessDays(firstDate, lastDate, getHoliday());

    expect(formatted).toBe(expectOutput);
  });
});
