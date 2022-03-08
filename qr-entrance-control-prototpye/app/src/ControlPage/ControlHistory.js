import React from "react";

const ControlHistory = ({history}) => {
  const historyItems = history.map( (item)=> <p>{item}</p>);
  return (
    <div>
      {historyItems}
    </div>
  );
};

export default ControlHistory;
