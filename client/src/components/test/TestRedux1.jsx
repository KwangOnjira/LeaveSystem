import React from "react";
import { useSelector } from "react-redux";

const TestRedux1 = () => {
  const { user } = useSelector((state) => ({ ...state }));

  console.log("user", user);
  return (
    <div>
      TestRedux1
      <br />
      {user.value}
    </div>
  );
};

export default TestRedux1;
