import React from "react";

const ControlHistory = ({history}) => {
  const historyItems = history.map( (item, index) => 
    <p key={(history.length - index).toString()}>
      {item}
    </p>
  );
  return (
    <div>
      {historyItems}
    </div>
  );
};

export default ControlHistory;
