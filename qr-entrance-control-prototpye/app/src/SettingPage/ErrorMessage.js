import React from "react";

const ErrorMessage = ({err}) => {
  return (
    <div>
      { err.length > 0 && (
        <p style={{color: "red"}}>{err}</p>
      )}
    </div>
  );
};

export default ErrorMessage;