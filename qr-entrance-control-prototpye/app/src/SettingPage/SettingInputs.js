import React from "react";

const Input = ( {placeholder, value, changeHandler }) => {
  return (
    <input 
      value={value}
      onChange={changeHandler}
      placeholder={placeholder}
    />
  );
};

const SettingInputs = (props) => {
  const { appIdValue, setAppIdValue, eventIdValue, setEventIdValue, serverInfoValue, setServerInfoValue} = props;

  const handleAppIdValueChange = (event) => {
    setAppIdValue(event.target.value);
  };

  const handleEventIdValueChange = (event) => {
    setEventIdValue(event.target.value);
  };

  const handleServerInfoValueChange = (event) => {
    setServerInfoValue(event.target.value);
  };

  return (
    <div>
      <Input
        placeholder="Enter event ID"
        value={eventIdValue}
        changeHandler={handleEventIdValueChange}
      />
      <Input
        placeholder="Enter app ID - generate by yourself"
        value={appIdValue}
        changeHandler={handleAppIdValueChange}
      />
      <Input
        placeholder="Enter server info - http://(ipaddr):(service_port)"
        value={serverInfoValue}
        changeHandler={handleServerInfoValueChange}
      />
    </div>
  );
};

export default SettingInputs;