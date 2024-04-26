import React, { useState } from "react";
import { useParams } from "react-router-dom";
import SickLeave from "./type/SickLeave";
import PersonalLeave from "./type/PersonalLeave";
import VacationLeave from "./type/VacationLeave";
import MaternityLeave from "./type/MaternityLeave";
import OrdinationLeave from "./type/OrdinationLeave";
import StudyLeave from "./type/StudyLeave";

const FormLeave = () => {
    const {type} = useParams()
    
    const renderLeaveForm = ()=>{
      switch (type) {
        case "sickleave":
          return <SickLeave/>
          break;

        case "personalleave":
          return <PersonalLeave/>
          break;

        case "vacationleave":
          return <VacationLeave/>
          break;

        case "maternityleave":
          return <MaternityLeave/>
          break;

        case "ordinationleave":
          return <OrdinationLeave/>
          break;

        case "studyleave":
          return <StudyLeave/>
          break;
      
        default:
          <div>No form available for this leave type</div>;
          break;
      }
    }

  return (
    <div>
      <h2>{renderLeaveForm()}</h2>

    </div>
  );
};

export default FormLeave;
