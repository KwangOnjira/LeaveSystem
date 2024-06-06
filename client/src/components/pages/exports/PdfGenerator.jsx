import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { font } from "./THSarabun-normal";
import { fontBold } from "./THSarabun Bold-bold";
import sickleave from "./format/sickleave";
import personalleave from "./format/personalleave";
import maternityleave from "./format/maternityleave";
import { getSignatureDeputy } from "../../../function/auth";
import vacationleave from "./format/vacationleave";
import ordinationleave from "./format/ordinationleave";
import studyleave from "./format/studyleave";

// Define the PdfGenerator component
const PdfGenerator = ({ userData, leaveData, userSignature,inspectorSignature,firstSignature,secondSignature, prevStat }) => {
console.log("leaveData[0].leaveID: ",leaveData[0].leaveID)
  switch (leaveData[0].type) {
    case "sickleave":
      sickleave({userData, leaveData, userSignature,inspectorSignature,firstSignature,secondSignature, prevStat})
      break;
      case "personalleave":
        personalleave({userData, leaveData, userSignature,inspectorSignature,firstSignature,secondSignature, prevStat})
        break;
      case "maternityleave":
        maternityleave({userData, leaveData, userSignature,inspectorSignature,firstSignature,secondSignature, prevStat})
        break;
      case "vacationleave":
        const getDeputySignature = getSignatureDeputy(leaveData[0].leaveID,localStorage.getItem("token"));
        console.log("getDeputySignature: ",getDeputySignature)
        getDeputySignature.then(response => {
          const deputySignature = import.meta.env.VITE_APP_API+`/signatures/${response.data}`;
          console.log("Deputy Signature URL:", deputySignature);
          vacationleave({userData, leaveData, userSignature,deputySignature,inspectorSignature,firstSignature,secondSignature, prevStat})
      }).catch(error => {
          console.error("Error fetching deputy signature:", error);
      });
        break;
        case "ordinationleave":
          ordinationleave({userData, leaveData, userSignature,firstSignature,secondSignature, prevStat})
          break;
        case "studyleave":
          studyleave({userData, leaveData, userSignature,firstSignature,secondSignature, prevStat})
          break;
  }
};

export default PdfGenerator;
