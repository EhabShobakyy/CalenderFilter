import React, { useEffect, useState, useRef } from "react";
// to call data
import axios from "axios";
import AccessRefreshTokens from "./RefreshToken/AccessRefreshTokens";

import Moment from "moment";
// style
import "./Test.css";
// Calender Style
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./Calender.css";
// Calender Init
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";

const FinancialRatios = () => {
  const [historicalPrice, setHistoricalPrice] = useState([]);

  // Date state
  const [range, setRange] = useState([
    {
      endDate: new Date(),
      startDate: addDays(new Date(), -10),
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
        // console.log(res.data.chartsData);
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
    // console.log(refOne.current);
    if (refOne.current && !refOne.current.contains(e.target)) {
      setOpenCalendar(false);
    }
  };

  // Handel Function To Auto Close Calendar When Choose Start & End DATE
  let rangeArray = []; // array to store start & end date
  const handelRange = (item) => {
    if (item.selection.startDate === item.selection.endDate) {
      rangeArray.push(item.selection.startDate);
    } else if (item.selection.startDate != item.selection.endDate) {
      rangeArray.push(item.selection.startDate);
      rangeArray.push(item.selection.endDate);
    }
    setRange([item.selection]);
    if (rangeArray.length > 1) {
      setOpenCalendar(false);
    }
  };

  return (
    <>
      <div className="container-md">
        <div className="historical-price py-5">
          <h2 className="global-heading">HISTORICAL PRICE</h2>

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
                  onChange={handelRange}
                  showSelectionPreview={true}
                  moveRangeOnFirstSelection={false}
                  months={2}
                  ranges={range}
                  direction="horizontal"
                />
              )}
            </div>{" "}
          </div>

          <div className="historical-table">
            <table>
              <thead>
                <tr className="table-head">
                  <td>Date</td>
                  <td>Price</td>
                  <td>Change</td>
                  <td>Change(%)</td>
                  <td>Volume</td>
                  <td>Tournover</td>
                  <td>Open</td>
                  <td>High</td>
                  <td>Low</td>
                </tr>
              </thead>
              <tbody>
                {historicalPrice
                  .map((item, idx) => {
                    return (
                      <tr key={idx}>
                        <td className="historical-date">
                          {formatDate(item?.forDate)}
                        </td>
                        <td
                          style={{ color: item?.close < 0 ? "red" : "green" }}
                        >
                          {SignRemove(item?.close)}
                        </td>
                        <td
                          style={{ color: item?.change < 0 ? "red" : "green" }}
                        >
                          ({SignRemove(item?.change)})
                        </td>
                        <td
                          style={{
                            color: item?.percentageChange < 0 ? "red" : "green",
                          }}
                        >
                          ({SignRemove(item?.percentageChange)})
                        </td>
                        <td>{formatNum(item?.volume)}</td>
                        <td>{formatNum(item?.amount)}</td>
                        <td
                          style={{
                            color: item?.open < 0 ? "red" : "green",
                          }}
                        >
                          {SignRemove(item?.open)}
                        </td>
                        <td
                          style={{
                            color: item?.max < 0 ? "red" : "green",
                          }}
                        >
                          {SignRemove(item?.max)}
                        </td>
                        <td
                          style={{
                            color: item?.min < 0 ? "red" : "green",
                          }}
                        >
                          {SignRemove(item?.min)}
                        </td>
                      </tr>
                    );
                  })
                  .reverse()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinancialRatios;
