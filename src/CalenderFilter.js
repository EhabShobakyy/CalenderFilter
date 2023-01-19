import React, { useEffect, useState, useRef } from "react";
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
// Calender Style
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calender.css";
// Calender Init
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";

const FinancialRatios = () => {
  const [historicalPrice, setHistoricalPrice] = useState([]);

  // Date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const refOne = useRef(null);

  const formatDate = (date) => Moment(date).format("YYYY-MM-DD");
  const SignRemove = (num) => Math.abs(num).toFixed(2);
  const formatNum = (num) => {
    let number = num;
    return number.toLocaleString(num);
  };

  let startDate = formatDate(range[0].startDate);
  let endDate = formatDate(range[0].endDate);

  // console.log(formatDate(state[0].startDate).split("/").join("-"));

  useEffect(() => {
    AccessRefreshTokens.getAccessToken();

    axios
      .get(
        `https://data.argaam.com/api/v1/json/ir-api/chart-data-table/${startDate}/${endDate}`,
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

  useEffect(() => {
    document.addEventListener("keydown", hideOnEscape, true);
    document.addEventListener("click", hideOnClickOutside, true);
  }, []);

  // Hide Calendar on ESC press
  const hideOnEscape = (e) => {
    if (e.key === "Escape") {
      setOpenCalendar(false);
    }
  };
  // Hide Calendar on outside click
  const hideOnClickOutside = (e) => {
    console.log(refOne.current);
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenCalendar(false);
    }
  };
  // console.log(formatDate(range[0].startDate));

  console.log(startDate, endDate);
  return (
    <>
      <div className="container-md">
        <div className="historical-price py-5">
          <h2>HISTORICAL PRICE</h2>

          <div className="calendarWrap">
            <input
              value={`${formatDate(range[0].startDate)} to ${formatDate(
                range[0].endDate
              )}`}
              readOnly
              className="inputBox"
              onClick={() => setOpenCalendar((open) => !open)}
            />
            <div ref={refOne}>
              {openCalendar && (
                <DateRange
                  onChange={(item) => setRange([item.selection])}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={range}
                  direction="horizontal"
                />
              )}
            </div>{" "}
          </div>

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
