import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SignatureCanvas from "react-signature-canvas";
import "../../../Signature.css";
import {
  differenceInCalendarDays,
  differenceInYears,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  createTheme,
  ThemeProvider,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { register } from "../../../function/auth";

const Register = () => {
  const navigate = useNavigate();
  const [otherPrefix, setOtherPrefix] = useState(false);
  const [otherDivision, setOtherDivision] = useState("");
  const [otherSub, setOtherSub] = useState("");
  console.log(otherDivision);
  console.log(otherSub);
  const [isSignatureDrawn, setIsSignatureDrawn] = useState(false);
  const [errorSignature, setErrorSignature] = useState();

  const divisions = [
    "--กรุณาเลือกกองที่สังกัด--",
    "องค์การบริหารส่วนจังหวัดลำปาง",
    "สำนักปลัด อบจ.",
    "สำนักงานเลขานุการ อบจ.",
    "กองยุทธศาสตร์และงบประมาณ",
    "กองคลัง",
    "กองช่าง",
    "กองการศึกษา ศาสนาและวัฒนธรรม",
    "กองพัสดุและทรัพย์สิน",
    "กองสาธารณสุข",
    "กองการเจ้าหน้าที่",
    "หน่วยตรวจสอบภายใน",
    "อื่นๆ",
  ];

  const subDivisions = {
    "--กรุณาเลือกกองที่สังกัด--": ["--กรุณาเลือกฝ่ายที่สังกัด--"],
    องค์การบริหารส่วนจังหวัดลำปาง: [
      "นายกองค์การบริหารส่วนจังหวัดลำปาง",
      "รองนายกองค์การบริหารส่วนจังหวัดลำปาง",
      "ปลัดองค์การบริหารส่วนจังหวัดลำปาง",
      "รองปลัดองค์การบริหารส่วนจังหวัดลำปาง",
      "อื่นๆ",
    ],
    "สำนักปลัด อบจ.": [
      "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง",
      "ฝ่ายอำนวยการ",
      "กลุ่มงานนิติการ",
      "ฝ่ายส่งเสริมการท่องเที่ยว",
      "ฝ่ายสวัสดิการสังคม",
      "อื่นๆ",
    ],
    "สำนักงานเลขานุการ อบจ.": [
      "เลขานุการองค์การบริหารส่วนจังหวัดลำปาง",
      "ฝ่ายการประชุม",
      "ฝ่ายกิจการสภา อบจ.",
      "ฝ่ายกิจการคณะผู้บริหาร",
      "อื่นๆ",
    ],
    กองยุทธศาสตร์และงบประมาณ: [
      "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ",
      "ฝ่ายนโยบายและแผนงาน",
      "ฝ่ายงบประมาณ",
      "ฝ่ายวิจัยและประเมินผล",
      "ฝ่ายประชาสัมพันธ์",
      "ฝ่ายบริหารงานทั่วไป",
      "อื่นๆ",
    ],
    กองคลัง: [
      "ผู้อำนวยการกองคลัง",
      "ฝ่ายการเงินและบัญชี",
      "ฝ่ายบริหารงานคลัง",
      "ฝ่ายเร่งรัดและจัดเก็บรายได้",
      "ฝ่ายบริหารงานทั่วไป",
      "อื่นๆ",
    ],
    กองช่าง: [
      "ผู้อำนวยการกองช่าง",
      "ฝ่ายสำรวจและออกแบบ",
      "ฝ่ายก่อสร้างและซ่อมบำรุง",
      "ฝ่ายเครื่องจักรกล",
      "ฝ่ายสาธารณูปโภค",
      "ฝ่ายผังเมือง",
      "ฝ่ายบริหารงานทั่วไป",
      "อื่นๆ",
    ],
    "กองการศึกษา ศาสนาและวัฒนธรรม": [
      "ผู้อำนวยการกองการศึกษา ศาสนาและวัฒนธรรม",
      "ฝ่ายบริหารการศึกษา",
      "ฝ่ายส่งเสริมการศึกษา ศาสนาและวัฒนธรรม",
      "อื่นๆ",
    ],
    กองพัสดุและทรัพย์สิน: [
      "ผู้อำนวยการกองพัสดุและทรัพย์สิน",
      "ฝ่ายจัดซื้อ",
      "ฝ่ายทะเบียนพัสดุและทรัพย์สิน",
      "ฝ่ายจัดจ้าง",
      "ฝ่ายบริหารงานทั่วไป",
      "อื่นๆ",
    ],
    กองสาธารณสุข: [
      "ผู้อำนวยการกองสาธารณสุข",
      "ฝ่ายบริหารงานสาธารณสุข",
      "ฝ่ายป้องกันและควบคุมโรค",
      "ฝ่ายส่งเสริมสุขภาพ",
      "ฝ่ายบริหารงานทั่วไป",
      "โรงพยาบาลส่งเสริมสุขภาพตำบล",
      "อื่นๆ",
    ],
    กองการเจ้าหน้าที่: [
      "ผู้อำนวยการกองการเจ้าหน้าที่",
      "ฝ่ายสรรหาและบรรจุแต่งตั้ง",
      "ฝ่ายส่งเสริมและพัฒนาบุคลากร",
      "ฝ่ายวินัยและส่งเสริมคุณธรรม",
      "ฝ่ายการเจ้าหน้าที่",
      "อื่นๆ",
    ],
    หน่วยตรวจสอบภายใน: [
      "หัวหน้าหน่วยตรวจสอบภายใน",
      "หน่วยตรวจสอบภายใน",
      "อื่นๆ",
    ],
    อื่นๆ: ["อื่นๆ"],
  };

  const [formData, setFormData] = useState({
    citizenID: "",
    prefix: "นางสาว",
    name: "",
    surname: "",
    role: "user",
    email: "",
    phone: "",
    divisionName: "--กรุณาเลือกกองที่สังกัด--",
    sub_division: "--กรุณาเลือกฝ่ายที่สังกัด--",
    position: "",
    password: "",
    birthday: null,
    type_of_employee: "",
    start_of_work_on: null,
    position_first_supeior: "",
    position_second_supeior: "",
  });
  console.log(formData);
  const [alreadyCitizenID, setAlreadyCitizenID] = useState(false);
  const [formErrors, setFormErrors] = useState({
    citizenID: "",
    prefix: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    divisionName: "",
    sub_division: "",
    position: "",
    password: "",
    birthday: "",
    type_of_employee: "",
    start_of_work_on: "",
    signature: "",
    otherDivision: "",
    otherSub: "",
  });
  console.log(formErrors);

  const setSuperior = (divisionName, sub_division) => {
    let position_first_supeior = "";
    let position_second_supeior = "";
    let role = "";

    switch (divisionName) {
      case "องค์การบริหารส่วนจังหวัดลำปาง":
        switch (sub_division) {
          case "นายกองค์การบริหารส่วนจังหวัดลำปาง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = null;
            break;
          case "รองนายกองค์การบริหารส่วนจังหวัดลำปาง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = null;
            break;
          case "ปลัดองค์การบริหารส่วนจังหวัดลำปาง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "นายกองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "รองปลัดองค์การบริหารส่วนจังหวัดลำปาง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          default:
            break;
        }
        break;

      case "สำนักปลัด อบจ.":
        switch (sub_division) {
          case "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายอำนวยการ":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายอำนวยการ";
            position_second_supeior =
              "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "กลุ่มงานนิติการ":
            role = "user";
            position_first_supeior = "หัวหน้ากลุ่มงานนิติการ";
            position_second_supeior =
              "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายส่งเสริมการท่องเที่ยว":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายส่งเสริมการท่องเที่ยว";
            position_second_supeior =
              "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายสวัสดิการสังคม":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายสวัสดิการสังคม";
            position_second_supeior =
              "หัวหน้าสำนักปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;

          default:
            break;
        }
        break;

      case "สำนักงานเลขานุการ อบจ.":
        switch (sub_division) {
          case "เลขานุการองค์การบริหารส่วนจังหวัด":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัด";
            break;
          case "ฝ่ายการประชุม":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายการประชุม";
            position_second_supeior = "เลขานุการองค์การบริหารส่วนจังหวัด";
            break;
          case "ฝ่ายกิจการสภา อบจ.":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายกิจการสภา อบจ.";
            position_second_supeior = "เลขานุการองค์การบริหารส่วนจังหวัด";
            break;
          case "ฝ่ายกิจการคณะผู้บริหาร":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายกิจการคณะผู้บริหาร";
            position_second_supeior = "เลขานุการองค์การบริหารส่วนจังหวัด";
            break;
          default:
            break;
        }
        break;

      case "กองยุทธศาสตร์และงบประมาณ":
        switch (sub_division) {
          case "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายนโยบายและแผนงาน":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายนโยบายและแผนงาน";
            position_second_supeior = "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ";
            break;
          case "ฝ่ายงบประมาณ":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายงบประมาณ";
            position_second_supeior = "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ";
            break;
          case "ฝ่ายวิจัยและประเมินผล":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายวิจัยและประเมินผล";
            position_second_supeior = "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ";
            break;
          case "ฝ่ายประชาสัมพันธ์":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายประชาสัมพันธ์";
            position_second_supeior = "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ";
            break;
          case "ฝ่ายบริหารงานทั่วไป":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานทั่วไป";
            position_second_supeior = "ผู้อำนวยการกองยุทธศาสตร์และงบประมาณ";
            break;
          default:
            break;
        }
        break;

      case "กองคลัง":
        switch (sub_division) {
          case "ผู้อำนวยการกองคลัง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายการเงินและบัญชี":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายการเงินและบัญชี";
            position_second_supeior = "ผู้อำนวยการกองคลัง";
            break;
          case "ฝ่ายบริหารงานคลัง":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานคลัง";
            position_second_supeior = "ผู้อำนวยการกองคลัง";
            break;
          case "ฝ่ายเร่งรัดและจัดเก็บรายได้":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายเร่งรัดและจัดเก็บรายได้";
            position_second_supeior = "ผู้อำนวยการกองคลัง";
            break;
          case "ฝ่ายบริหารงานทั่วไป":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานทั่วไป";
            position_second_supeior = "ผู้อำนวยการกองคลัง";
            break;
          default:
            break;
        }
        break;

      case "กองช่าง":
        switch (sub_division) {
          case "ผู้อำนวยการกองช่าง":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายสำรวจและออกแบบ":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายสำรวจและออกแบบ";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          case "ฝ่ายก่อสร้างและซ่อมบำรุง":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายก่อสร้างและซ่อมบำรุง";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          case "ฝ่ายเครื่องจักรกล":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายเครื่องจักรกล";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          case "ฝ่ายสาธารณูปโภค":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายสาธารณูปโภค";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          case "ฝ่ายผังเมือง":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายผังเมือง";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          case "ฝ่ายบริหารงานทั่วไป":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานทั่วไป";
            position_second_supeior = "ผู้อำนวยการกองช่าง";
            break;
          default:
            break;
        }
        break;

      case "กองการศึกษา ศาสนาและวัฒนธรรม":
        switch (sub_division) {
          case "ผู้อำนวยการกองการศึกษา ศาสนาและวัฒนธรรม":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายบริหารการศึกษา":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารการศึกษา";
            position_second_supeior = "ผู้อำนวยการกองการศึกษา ศาสนาและวัฒนธรรม";
            break;
          case "ฝ่ายส่งเสริมการศึกษา ศาสนาและวัฒนธรรม":
            role = "user";
            position_first_supeior =
              "หัวหน้าฝ่ายส่งเสริมการศึกษา ศาสนาและวัฒนธรรม";
            position_second_supeior = "ผู้อำนวยการกองการศึกษา ศาสนาและวัฒนธรรม";
            break;
          default:
            break;
        }
        break;

      case "กองพัสดุและทรัพย์สิน":
        switch (sub_division) {
          case "ผู้อำนวยการกองพัสดุและทรัพย์สิน":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายจัดซื้อ":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายจัดซื้อ";
            position_second_supeior = "ผู้อำนวยการกองพัสดุและทรัพย์สิน";
            break;
          case "ฝ่ายทะเบียนพัสดุและทรัพย์สิน":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายทะเบียนพัสดุและทรัพย์สิน";
            position_second_supeior = "ผู้อำนวยการกองพัสดุและทรัพย์สิน";
            break;
          case "ฝ่ายจัดจ้าง":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายจัดจ้าง";
            position_second_supeior = "ผู้อำนวยการกองพัสดุและทรัพย์สิน";
            break;
          case "ฝ่ายบริหารงานทั่วไป":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานทั่วไป";
            position_second_supeior = "ผู้อำนวยการกองพัสดุและทรัพย์สิน";
            break;
          default:
            break;
        }
        break;

      case "กองสาธารณสุข":
        switch (sub_division) {
          case "ผู้อำนวยการกองสาธารณสุข":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายบริหารงานสาธารณสุข":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานสาธารณสุข";
            position_second_supeior = "ผู้อำนวยการกองสาธารณสุข";
            break;
          case "ฝ่ายป้องกันและควบคุมโรค":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายป้องกันและควบคุมโรค";
            position_second_supeior = "ผู้อำนวยการกองสาธารณสุข";
            break;
          case "ฝ่ายส่งเสริมสุขภาพ":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายส่งเสริมสุขภาพ";
            position_second_supeior = "ผู้อำนวยการกองสาธารณสุข";
            break;
          case "ฝ่ายบริหารงานทั่วไป":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายบริหารงานทั่วไป";
            position_second_supeior = "ผู้อำนวยการกองสาธารณสุข";
            break;
          case "โรงพยาบาลส่งเสริมสุขภาพตำบล":
            role = "user";
            position_first_supeior = "หัวหน้าโรงพยาบาลส่งเสริมสุขภาพตำบล";
            position_second_supeior = "ผู้อำนวยการกองสาธารณสุข";
            break;
          default:
            break;
        }
        break;

      case "กองการเจ้าหน้าที่":
        switch (sub_division) {
          case "ผู้อำนวยการกองการเจ้าหน้าที่":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "ฝ่ายสรรหาและบรรจุแต่งตั้ง":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายสรรหาและบรรจุแต่งตั้ง";
            position_second_supeior = "ผู้อำนวยการกองการเจ้าหน้าที่";
            break;
          case "ฝ่ายส่งเสริมและพัฒนาบุคลากร":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายส่งเสริมและพัฒนาบุคลากร";
            position_second_supeior = "ผู้อำนวยการกองการเจ้าหน้าที่";
            break;
          case "ฝ่ายวินัยและส่งเสริมคุณธรรม":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายวินัยและส่งเสริมคุณธรรม";
            position_second_supeior = "ผู้อำนวยการกองการเจ้าหน้าที่";
            break;
          case "ฝ่ายการเจ้าหน้าที่":
            role = "user";
            position_first_supeior = "หัวหน้าฝ่ายการเจ้าหน้าที่";
            position_second_supeior = "ผู้อำนวยการกองการเจ้าหน้าที่";
            break;
          default:
            break;
        }
        break;

      case "หน่วยตรวจสอบภายใน":
        switch (sub_division) {
          case "หัวหน้าหน่วยตรวจสอบภายใน":
            role = "superior";
            position_first_supeior = null;
            position_second_supeior = "ปลัดองค์การบริหารส่วนจังหวัดลำปาง";
            break;
          case "หน่วยตรวจสอบภายใน":
            role = "user";
            position_first_supeior = null;
            position_second_supeior = "หัวหน้าหน่วยตรวจสอบภายใน";
            break;

          default:
            break;
        }
        break;

        default:
          role = "user"
          break;
    }

    return { position_first_supeior, position_second_supeior, role };
  };
  const { position_first_supeior, position_second_supeior, role } = setSuperior(
    formData.divisionName,
    formData.sub_division
  );

  const [imageURL, setImageURL] = useState("");

  const sig = useRef({});

  const clear = (e) => {
    e.preventDefault();
    sig.current.clear();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let errors = { ...formErrors };

    if (name === "position") {
      const invalidPositionSubstrings = [
        "หัวหน้าฝ่าย",
        "หัวหน้ากลุ่ม",
        "หัวหน้าโรงพยาบาล",
      ];

      if (
        invalidPositionSubstrings.some((substring) => value.includes(substring))
      ) {
        setFormData((prevData) => ({
          ...prevData,
          position_first_supeior: null,
          [name]: value,
        }));
        errors[name] = "";
      } else {
        // Otherwise, update the position_first_supeior accordingly
        setFormData((prevData) => ({
          ...prevData,
          position_first_supeior: value,
          [name]: value,
        }));
        errors[name] = "";
      }
    } else if (name === "citizenID") {
      setAlreadyCitizenID(false);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...setSuperior(prevData.divisionName, prevData.sub_division),
      }));
      errors[name] = "";
    } else if (name === "divisionName") {
      if (value === "อื่นๆ") {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          sub_division: value,
          ...setSuperior(prevData.divisionName, prevData.sub_division),
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          ...setSuperior(prevData.divisionName, prevData.sub_division),
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...setSuperior(prevData.divisionName, prevData.sub_division),
      }));
      errors[name] = "";
    }
    setFormErrors(errors);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/login");
  };

  useEffect(() => {
    const canvas = sig.current.getCanvas();
    const ctx = canvas.getContext("2d");

    const checkSignature = () => {
      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      ).data;
      const isSignatureBlank = imageData.every((val) => val === 0);
      setIsSignatureDrawn(!isSignatureBlank);
    };

    canvas.addEventListener("mouseup", checkSignature);

    return () => {
      canvas.removeEventListener("mouseup", checkSignature);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.prefix) {
      errors.prefix = "กรุณากรอกคำนำหน้า";
    }
    if (!formData.name) {
      errors.name = "กรุณากรอกชื่อ";
    }
    if (!formData.surname) {
      errors.surname = "กรุณากรอกนามสกุล";
    }
    if (!formData.position) {
      errors.position = "กรุณากรอกตำแหน่ง";
    }
    if (formData.divisionName === "--กรุณาเลือกกองที่สังกัด--") {
      errors.divisionName = "กรุณาเลือกกองที่สังกัด";
    }
    if (formData.sub_division === "--กรุณาเลือกฝ่ายที่สังกัด--") {
      errors.sub_division = "กรุณาเลือกฝ่ายที่สังกัด";
    }
    if (!formData.citizenID) {
      errors.citizenID = "กรุณากรอกหมายเลขประจำตัวประชาชน";
    }
    if (!formData.password) {
      errors.password = "กรุณากรอกรหัสผ่าน";
    }
    if (!formData.email) {
      errors.email = "กรุณากรอกอีเมล";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!formData.phone) {
      errors.phone = "กรุณากรอกเบอร์โทร";
    }
    if (!formData.birthday) {
      errors.birthday = "กรุณาเลือกวันที่ท่านเกิด";
    }
    if (!formData.type_of_employee) {
      errors.type_of_employee = "กรุณาเลือกประเภทการว่าจ้าง";
    }
    if (
      formData.type_of_employee != "ข้าราชการการเมือง" &&
      !formData.start_of_work_on
    ) {
      errors.start_of_work_on = "กรุณาเลือกวันที่เริ่มทำงาน";
    }
    if (formData.divisionName === "อื่นๆ" && !otherDivision) {
      errors.otherDivision = "กรุณาระบุกองที่สังกัด";
    }
    if (formData.sub_division === "อื่นๆ" && !otherSub) {
      errors.otherSub = "กรุณาระบุฝ่ายที่สังกัด";
    }

    if (!isSignatureDrawn) {
      errors.signature = "กรุณาลงชื่อ";
      console.log("Please draw your signature");
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const signatureDataURL = sig.current
      .getTrimmedCanvas()
      .toDataURL("image/png");
    setImageURL(signatureDataURL);

    console.log(
      "setImageURL: ",
      sig.current.getTrimmedCanvas().toDataURL("image/png")
    );

    try {
      if (formData.divisionName === "อื่นๆ") {
        const formDataWithOtherDivision = {
          ...formData,
          imageURL: signatureDataURL,
          divisionName: otherDivision,
          sub_division: otherSub,
        };
        await register(formDataWithOtherDivision);
        console.log("Registration Successful");
        navigate("/login");
      } else if (
        formData.divisionName != "อื่นๆ" &&
        formData.sub_division === "อื่นๆ"
      ) {
        const formDataWithOtherSub = {
          ...formData,
          sub_division: otherSub,
          imageURL: signatureDataURL,
        };
        await register(formDataWithOtherSub);
        console.log("Registration Successful");
        navigate("/login");
      } else {
        const formDataWithSignature = {
          ...formData,
          imageURL: signatureDataURL,
        };
        await register(formDataWithSignature);
        console.log("Registration Successful");
        navigate("/login");
      }
    } catch (error) {
      setAlreadyCitizenID(true);
      console.log("Registration Failed: " + error.message);
    }
  };

  console.log(formData);

  document.body.style.backgroundColor = "#F3F3EA";

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 300,
        md: 660,
        lg: 980,
        xl: 1620,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        fixed
        sx={{
          position: "relative",
          height: "110vh",
        }}
      >
        <Box
          sx={{
            display: "grid",
            padding: "3rem",
            textAlign: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#EDDCAE",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            maxHeight: "90vh", // Adjusted height to 90% of viewport height
            overflowY: "auto", // Ensure scrolling for overflow
            width: "80%", // Adjusted width for responsiveness
            [theme.breakpoints.up("xl")]: {
              width: "60%", // Adjusted width for extra-large screens
            },
            [theme.breakpoints.down("xl")]: {
              width: "100%",
              height: "auto",
            },
          }}
        >
          <Button
            style={{
              marginTop: "1rem",
              borderRadius: 50,
              width: "15%",
              marginBottom: "-30px",
              backgroundColor: "#5F692E",
              color: "#FFFDD5",
            }}
            sx={{
              fontFamily: "Kodchasan",
            }}
            onClick={handleLogin}
          >
            เข้าสู่ระบบ
          </Button>
          <p className="register-header">ลงทะเบียน</p>
          <form>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                <FormControl sx={{ color: "#333" }}>
                  <FormLabel sx={{ fontFamily: "Kodchasan", fontSize: "18px" }}>
                    คำนำหน้า
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="prefix"
                    onChange={handleChange}
                    value={formData.prefix}
                    sx={{ color: "#656d4f" }}
                  >
                    <FormControlLabel
                      value="นางสาว"
                      control={<Radio sx={{ color: "#656d4f" }} />}
                      label={
                        <Typography
                          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                        >
                          นางสาว
                        </Typography>
                      }
                      onClick={() => {
                        setOtherPrefix(false);
                      }}
                    />
                    <FormControlLabel
                      value="นาง"
                      control={<Radio sx={{ color: "#656d4f" }} />}
                      label={
                        <Typography
                          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                        >
                          นาง
                        </Typography>
                      }
                      onClick={() => {
                        setOtherPrefix(false);
                      }}
                    />
                    <FormControlLabel
                      value="นาย"
                      control={<Radio sx={{ color: "#656d4f" }} />}
                      label={
                        <Typography
                          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                        >
                          นาย
                        </Typography>
                      }
                      onClick={() => {
                        setOtherPrefix(false);
                      }}
                    />
                    <FormControlLabel
                      control={<Radio sx={{ color: "#656d4f" }} />}
                      label={
                        <Typography
                          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                        >
                          อื่นๆ
                        </Typography>
                      }
                      onClick={() => {
                        setOtherPrefix(true);
                      }}
                      checked={
                        formData.prefix !== "นาย" &&
                        formData.prefix !== "นาง" &&
                        formData.prefix !== "นางสาว"
                      }
                    />
                  </RadioGroup>
                </FormControl>
                {otherPrefix === true && (
                  <>
                    <br />
                    <label
                      style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                    >
                      อื่นๆ
                    </label>
                    <input
                      type="text"
                      name="prefix"
                      value={formData.prefix}
                      onChange={handleChange}
                      required
                      style={{
                        width: "80%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    {formErrors.prefix && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.prefix}
                      </span>
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "16px",
                        textAlign: "left",
                        display: "block",
                      }}
                    >
                      ชื่อ
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="กรุณากรอกชื่อ"
                      style={{
                        width: "100%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    {formErrors.name && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.name}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "16px",
                        textAlign: "left",
                        display: "block",
                      }}
                    >
                      นามสกุล
                    </label>

                    <input
                      type="text"
                      name="surname"
                      value={formData.surname}
                      onChange={handleChange}
                      required
                      placeholder="กรุณากรอกนามสกุล"
                      style={{
                        width: "100%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    {formErrors.surname && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.surname}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "16px",
                        textAlign: "left",
                        display: "block",
                      }}
                    >
                      ตำแหน่ง
                    </label>

                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      placeholder="กรุณากรอกตำแหน่ง"
                      style={{
                        width: "100%",
                        padding: "6px",
                        marginTop: "0.5rem",

                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    {formErrors.position && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.position}
                      </span>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ fontFamily: "Kodchasan" }}
                    id="divisionName"
                  >
                    กองที่สังกัด
                  </InputLabel>
                  <Select
                    sx={{
                      fontFamily: "Kodchasan",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                    labelId="divisionName"
                    id="division"
                    value={formData.divisionName}
                    label={
                      <Typography
                        style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                      >
                        กองที่สังกัด
                      </Typography>
                    }
                    name="divisionName"
                    onChange={handleChange}
                  >
                    {divisions.map((division) => {
                      return (
                        <MenuItem
                          sx={{ fontFamily: "Kodchasan" }}
                          value={division}
                        >
                          {division}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {formErrors.divisionName && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.divisionName}
                  </span>
                )}
                {formData.divisionName === "อื่นๆ" && (
                  <>
                  <br/>
                    <label
                      style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                    >
                      อื่นๆ
                    </label>
                    <input
                      type="text"
                      name="otherDivision"
                      value={otherDivision}
                      onChange={(event) => setOtherDivision(event.target.value)}
                      required
                      style={{
                        width: "80%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    <br />
                    {formErrors.otherDivision && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.otherDivision}
                      </span>
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontFamily: "Kodchasan" }} id="subDivision">
                    ฝ่าย
                  </InputLabel>
                  {formData.divisionName && (
                    <Select
                      sx={{
                        fontFamily: "Kodchasan",
                        backgroundColor: "#fff",
                        borderRadius: "18px",
                      }}
                      labelId="subDivision"
                      id="sub_division"
                      value={formData.sub_division}
                      label={
                        <Typography
                          style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                        >
                          ฝ่าย
                        </Typography>
                      }
                      name="sub_division"
                      onChange={handleChange}
                    >
                      {subDivisions[formData.divisionName].map(
                        (subDivision) => {
                          return (
                            <MenuItem
                              sx={{ fontFamily: "Kodchasan" }}
                              value={subDivision}
                            >
                              {subDivision}
                            </MenuItem>
                          );
                        }
                      )}
                    </Select>
                  )}
                </FormControl>
                {formErrors.sub_division && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.sub_division}
                  </span>
                )}
                {(formData.divisionName === "อื่นๆ" ||
                  formData.sub_division === "อื่นๆ") && (
                  <>
                  <br/>
                    <label
                      style={{ fontFamily: "Kodchasan", fontSize: "14px" }}
                    >
                      อื่นๆ
                    </label>
                    <input
                      type="text"
                      name="otherSub"
                      value={otherSub}
                      onChange={(event) => setOtherSub(event.target.value)}
                      required
                      style={{
                        width: "80%",
                        padding: "6px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    />
                    <br/>
                    {formErrors.otherSub && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.otherSub}
                      </span>
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <label
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  หมายเลขประจำตัวประชาชน
                </label>

                <input
                  type="text"
                  name="citizenID"
                  value={formData.citizenID}
                  onChange={handleChange}
                  required
                  placeholder="กรุณากรอกหมายเลขประจำตัวประชาชน"
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                  }}
                />
                {alreadyCitizenID === true && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    หมายเลขประจำตัวประชาชนนี้ลงทะเบียนไปแล้ว
                  </span>
                )}
                {formErrors.citizenID && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.citizenID}
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <label
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  รหัสผ่าน
                </label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="กรุณากรอกรหัสผ่าน"
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                  }}
                />
                {formErrors.password && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.password}
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <label
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  อีเมล
                </label>

                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="กรุณากรอกอีเมล"
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                  }}
                />
                {formErrors.email && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.email}
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <label
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "16px",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  เบอร์โทร
                </label>

                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="กรุณากรอกเบอร์โทร"
                  style={{
                    width: "100%",
                    padding: "6px",
                    marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                  }}
                />
                {formErrors.phone && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.phone}
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <label
                  style={{
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                    paddingTop: "6px",
                    textAlign: "left",
                    display: "block",
                  }}
                  for="birthday"
                >
                  เกิดวันที่(ปีค.ศ.)
                </label>
                <input
                  required
                  type="date"
                  name="birthday"
                  value={formData.birthday || null}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "6px",
                    // marginTop: "0.5rem",
                    marginBottom: "0.6rem",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    fontFamily: "Kodchasan",
                    fontSize: "14px",
                  }}
                ></input>
                {formErrors.birthday && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.birthday}
                  </span>
                )}
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                <FormControl fullWidth>
                  <InputLabel
                    sx={{ margin: "0.5rem", fontFamily: "Kodchasan" }}
                    id="type"
                  >
                    ประเภทการว่าจ้าง
                  </InputLabel>
                  <Select
                    sx={{
                      margin: "0.5rem",
                      fontFamily: "Kodchasan",
                      backgroundColor: "#fff",
                      borderRadius: "18px",
                    }}
                    labelId="type"
                    id="type_of_employee"
                    label={
                      <Typography
                        style={{ fontFamily: "Kodchasan", fontSize: "16px" }}
                      >
                        ประเภทการว่าจ้าง
                      </Typography>
                    }
                    name="type_of_employee"
                    onChange={handleChange}
                    value={formData.type_of_employee}
                  >
                    <MenuItem style={{ fontFamily: "Kodchasan", fontSize: "16px" }} value="ข้าราชการการเมือง">
                      ข้าราชการการเมือง
                    </MenuItem>
                    <MenuItem style={{ fontFamily: "Kodchasan", fontSize: "16px" }} value="ข้าราชการ">ข้าราชการ</MenuItem>
                    <MenuItem style={{ fontFamily: "Kodchasan", fontSize: "16px" }} value="ลูกจ้างประจำ">ลูกจ้างประจำ</MenuItem>
                    <MenuItem style={{ fontFamily: "Kodchasan", fontSize: "16px" }} value="พนักงานจ้างตามภารกิจ">
                      พนักงานจ้างตามภารกิจ
                    </MenuItem>
                    <MenuItem style={{ fontFamily: "Kodchasan", fontSize: "16px" }} value="จ้างทั่วไป">จ้างทั่วไป</MenuItem>
                  </Select>
                </FormControl>
                {formErrors.type_of_employee && (
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.type_of_employee}
                  </span>
                )}
                {formData.type_of_employee &&
                formData.type_of_employee != "ข้าราชการการเมือง" ? (
                  <>
                    <label
                      style={{
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                        paddingTop: "6px",
                        textAlign: "left",
                        display: "block",
                      }}
                      for="start_of_work_on"
                    >
                      เริ่มทำงานวันที่(ปีค.ศ.)
                    </label>
                    <input
                      required
                      type="date"
                      name="start_of_work_on"
                      value={formData.start_of_work_on || null}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "6px",
                        // marginTop: "0.5rem",
                        marginBottom: "0.6rem",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                        boxSizing: "border-box",
                        fontFamily: "Kodchasan",
                        fontSize: "14px",
                      }}
                    ></input>
                    {formErrors.start_of_work_on && (
                      <span
                        style={{
                          fontFamily: "Kodchasan",
                          fontSize: "14px",
                          color: "#c1012D",
                          fontWeight: "bold",
                        }}
                      >
                        {formErrors.start_of_work_on}
                      </span>
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <label
                style={{
                  fontFamily: "Kodchasan",
                  fontSize: "16px",
                  // display: "block",
                }}
              >
                ลงชื่อเพื่อนำมาใช้ในการแจ้งลา
              </label>
              <br />
              <SignatureCanvas
                ref={sig}
                canvasProps={{
                  style: { backgroundColor: "#ffffff" },
                  width: "auto",
                  height: "auto",
                  className: "signature",
                }}
              ></SignatureCanvas>
              <br />
              {formErrors.signature && (
                <>
                  <span
                    style={{
                      fontFamily: "Kodchasan",
                      fontSize: "14px",
                      color: "#c1012D",
                      fontWeight: "bold",
                    }}
                  >
                    {formErrors.signature}
                  </span>
                  <br />
                </>
              )}

              <Button
                style={{
                  borderRadius: 50,
                  width: "20%",
                  margin: "15px",
                  backgroundColor: "#C25258",
                  color: "#FFFDD5",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                onClick={clear}
              >
                ล้างลายเซ็น
              </Button>

              <br />
              <Button
                style={{
                  borderRadius: 50,
                  width: "40%",
                  margin: "15px",
                  backgroundColor: "#424530",
                  color: "#FFEFCD",
                }}
                sx={{
                  fontFamily: "Kodchasan",
                }}
                onClick={handleSubmit}
              >
                Register
              </Button>
            </Grid>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
export default Register;
