import React from "react";

const Button = ({ buttonText, resetButton = false, onClickHandler }) => {
  return (
    <button onClick={onClickHandler}>
      {buttonText}
    </button>
  );
};

const SettingButtons = ({handleNext, handleReset}) => {
  return (
    <div>
      <Button 
        buttonText="Next"
        onClickHandler={handleNext}
      />
      <Button 
        buttonText="Reset"
        resetButton={true}
        onClickHandler={handleReset}
      />
    </div>
  );
};

export default SettingButtons;