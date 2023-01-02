import React, { useEffect, useState } from "react";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

function Calender(props) {
  const [value, setValue] = useState([null, null]);

  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        localeText={{ start: "Check-in", end: "Check-out" }}
      >
        <DateRangePicker
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={(startProps, endProps) => (
            <React.Fragment>
              {/* {console.log("Start Date", startProps.inputProps.value)} */}
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} />
              {/* {console.log("End Date", endProps.inputProps.value)} */}
            </React.Fragment>
          )}
        />
      </LocalizationProvider>
    </>
  );
}

export default Calender;
