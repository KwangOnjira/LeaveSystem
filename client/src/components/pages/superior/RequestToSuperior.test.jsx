import { render, screen } from "@testing-library/react";
import { vi, describe, beforeEach, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RequestToSuperior from "./RequestToSuperior";
import axios from "axios";
import { currentUser } from "../../../function/auth";
import { getMatchStatus, getUserMatch } from "../../../function/superior";
import { getMatchStatusCancel, getUserMatchCancel } from "../../../function/cancel";

vi.mock("axios");
vi.mock("../../../function/auth", () => ({
  currentUser: vi.fn(),
}));

vi.mock("../../../function/superior", () => ({
  getMatchStatus: vi.fn(),
  getUserMatch: vi.fn()
}));

vi.mock("../../../function/cancel", () => ({
  getUserMatchCancel: vi.fn(),
  getMatchStatusCancel: vi.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("RequestToSuperior Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [],
    });
    currentUser.mockResolvedValueOnce({ data: [{ id: 1, name: "User1" }] });
    render(
      <MemoryRouter>
        <RequestToSuperior />
      </MemoryRouter>
    );
  });

  it("should render Request", () => {
    expect(screen.getByText("คำร้อง")).toBeInTheDocument();
  });

  it("should render words in Header", () => {
    expect(screen.getByText("วันที่แจ้งลา")).toBeInTheDocument();
    expect(screen.getByText("วันที่ขอลา")).toBeInTheDocument();
    expect(screen.getByText("ชื่อ-นามสกุล")).toBeInTheDocument();
    expect(screen.getByText("ประเภทการลา")).toBeInTheDocument();
    expect(screen.getByText("ดูรายละเอียด")).toBeInTheDocument();
  });

});
