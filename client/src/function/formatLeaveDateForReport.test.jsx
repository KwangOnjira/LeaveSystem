import { describe, expect, it } from "vitest";
import { formatLeaveDateForReport } from "./formatLeaveDateForReport";

describe("formatLeaveData",()=>{
  it("should format date correctly",()=>{
    const inputDate = "2024-09-10"
    const expectOutput = "10 ก.ย. 2567"
    const formatted = formatLeaveDateForReport(inputDate)

    expect(formatted).toBe(expectOutput)
  })

  it("empty date",()=>{
    const inputDate = ""
    const expectOutput = "-"
    const formatted = formatLeaveDateForReport(inputDate)

    expect(formatted).toBe(expectOutput)
  })

  it("invalid date",()=>{
    const inputDate = "13 มกราคม 2527"
    const expectOutput = "-"
    const formatted = formatLeaveDateForReport(inputDate)

    expect(formatted).toBe(expectOutput)
  })
})