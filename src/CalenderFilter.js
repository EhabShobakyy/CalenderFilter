import React, { useEffect, useState } from "react";
// to call data
import axios from "axios";
import AccessRefreshTokens from "./RefreshToken/AccessRefreshTokens";
// Tables Import
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Moment from "moment";
// style
import "./Test.css";

// Calender Init
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";

const FinancialRatios = () => {
  const [historicalPrice, setHistoricalPrice] = useState([]);
  const [startDate, setStartDate] = useState("2022-10-18");
  const [endDate, setEndDate] = useState("2022-10-25");
  const [value, setValue] = useState([startDate, endDate]);

  const formatDate = (date) => Moment(date).format("DD/MM/YYYY");
  const SignRemove = (num) => Math.abs(num).toFixed(2);
  const formatNum = (num) => {
    let number = num;
    return number.toLocaleString(num);
  };

  useEffect(() => {
    AccessRefreshTokens.getAccessToken();

    axios
      .get(
        `https://data.argaam.com/api/v1/json/ir-api/chart-data-table/${startDate
          .split("/")
          .join("-")}/${endDate.split("/").join("-")}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.chartsData);
        setHistoricalPrice(res.data.chartsData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [startDate, endDate, localStorage.getItem("token")]);

  return (
    <>
      <div className="container-md">
        <div className="historical-price py-5">
          <h2>HISTORICAL PRICE</h2>
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            localeText={{ start: "Start-Date", end: "End-Date" }}
          >
            <DateRangePicker
              value={value}
              onChange={(newValue) => {
                setValue(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <>
                  {setStartDate(startProps.inputProps.value)}
                  {setEndDate(endProps.inputProps.value)}

                  <TextField {...startProps} />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} />
                </>
              )}
            />
          </LocalizationProvider>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow className="table-head">
                  <TableCell>Date</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Change</TableCell>
                  <TableCell>Change(%)</TableCell>
                  <TableCell>Volume</TableCell>
                  <TableCell>Tournover</TableCell>
                  <TableCell>Open</TableCell>
                  <TableCell>High</TableCell>
                  <TableCell>Low</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicalPrice
                  .map((item, idx) => {
                    return (
                      <TableRow key={idx}>
                        <TableCell className="historical-date">
                          {formatDate(item?.forDate)}
                        </TableCell>
                        <TableCell>{SignRemove(item?.close)}</TableCell>
                        <TableCell>({SignRemove(item?.change)})</TableCell>
                        <TableCell>
                          ({SignRemove(item?.percentageChange)})
                        </TableCell>
                        <TableCell>{formatNum(item?.volume)}</TableCell>
                        <TableCell>{formatNum(item?.amount)}</TableCell>
                        <TableCell>{SignRemove(item?.open)}</TableCell>
                        <TableCell>{SignRemove(item?.max)}</TableCell>
                        <TableCell>{SignRemove(item?.min)}</TableCell>
                      </TableRow>
                    );
                  })
                  .reverse()}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
};

export default FinancialRatios;
