import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateYear } from "./YearInWork";

describe("calculateYear",()=>{
  beforeEach(()=>{
    vi.setSystemTime(new Date("2024-09-10"))
  });
  afterEach(()=>{
    vi.useRealTimers();
  })
  
  it("should calculate year work correctly with year,month,date",()=>{
    const inputDate = "2020-09-18"
    const expectOutput = "3 ปี, 11 เดือน, 23 วัน"
    const formatted = calculateYear(inputDate)

    expect(formatted).toBe(expectOutput)
  })

  it("should calculate year work correctly with month,date",()=>{
    const inputDate = "2024-06-18"
    const expectOutput = "2 เดือน, 23 วัน"
    const formatted = calculateYear(inputDate)

    expect(formatted).toBe(expectOutput)
  })
  
  it("should calculate year work correctly with date",()=>{
    const inputDate = "2024-09-8"
    const expectOutput = "2 วัน"
    const formatted = calculateYear(inputDate)

    expect(formatted).toBe(expectOutput)
  })

  it("should calculate year work correctly with not full day",()=>{
    const inputDate = "2024-09-10"
    const expectOutput = ""
    const formatted = calculateYear(inputDate)

    expect(formatted).toBe(expectOutput)
  })
})