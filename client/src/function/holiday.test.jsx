import { describe, expect, it, vi } from "vitest";
import axios from "axios";
import { getHoliday } from "./holiday";

vi.mock("axios")

describe("holiday",()=>{
  it("get holidays correctly",async()=>{
    const mockResponse= {data:[{
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
    }]}

    axios.get.mockResolvedValueOnce(mockResponse)
    
    const result = await getHoliday();

    expect(result).toEqual(mockResponse);
    expect(axios.get).toHaveBeenCalledWith(
      `${import.meta.env.VITE_APP_API}/getHoliday`
    );
  })
})