import { describe, expect, it } from "vitest";
import { formatLeaveDate } from "./formatLeaveDate";

describe("formatLeaveData",()=>{
  it("should format date correctly",()=>{
    const inputDate = "2024-09-10"
    const expectOutput = "10 ก.ย. 2567"
    const formatted = formatLeaveDate(inputDate)

    expect(formatted).toBe(expectOutput)
  })
})