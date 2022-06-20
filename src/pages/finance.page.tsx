import React, { useEffect, useState } from "react";
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import SearchBar from "../components/search-bar.component";
import { getCurrentMonthOrders } from "../preload";
import { toCurrencyString } from "../scripts/common";

const FinancePage: React.FC = () => {
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    BarController,
    Filler,
    Tooltip
  );

  const [initial, setInitial] = useState<boolean>(true);
  const [inputSearch, setInputSearch] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const getOrders = async () => {
    const response: unknown = await getCurrentMonthOrders({});

    if (response instanceof Array) {
      setOrders(response);
    }
  };

  const getTotalRevenue = () => {
    let total = orders
      .map((order) => order.totalAmount)
      .reduce((prev: any, next: any) => parseFloat(prev) + parseFloat(next), 0);
    console.log(total);
    setTotalRevenue(total);
  };

  const getTotalProfit = () => {
    let total = orders
      .map((order) => order.profit)
      .reduce((prev, next) => parseFloat(prev) + parseFloat(next));
    setTotalProfit(total);
  };

  useEffect(() => {
    if (initial) setInitial(false);
    getOrders();
  }, []);

  useEffect(() => {
    if (initial) return;
    getTotalRevenue();
    getTotalProfit();
  }, [orders]);


  return (
    <div className="h-screen w-full  grid grid-cols-[0.7fr_2fr] overflow-hidden">
      {/* left */}
      <div className="left  flex flex-col gap-4 p-8 bg-slate-100">
        <p className="text-lg font-medium">Profit of transaction</p>
        <div className="bg-main w-full h-[20%] text-white p-8 rounded-xl flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-medium">Transaction 81</p>
            <p className="">30% profit margin of P18,000.00</p>
          </div>
          <p className=" font-bold text-3xl">P12,000.00</p>
        </div>

        <p className="text-medium font-medium">Transaction Information</p>
        <div className="bg-white w-full h-[15%] p-8 flex flex-col gap-2 rounded-xl">
            <p className="font-medium">Employee Name: <span className="text-main">John Doe</span></p>
            <p className="font-medium">Location | Platoform: <span className="text-main">Palompon Leyte</span></p>
            <p className="font-medium">Payment: <span className="text-main">Cash</span></p>
        </div>

        <p className="text-medium font-medium">Order Details</p>
        
      </div>
      {/* right */}
      <div className="right grid grid-rows-[3rem_1fr] px-4 py-2 overflow-hidden">
        <div className="search_container py-2">
          <SearchBar
            searchInput={inputSearch}
            searchInputSetter={setInputSearch}
          />
        </div>

        <div className="RIGHT_BOTTOM_ROW_CONTAINER grid grid-rows-[1.5fr_1fr_2fr] gap-2 overflow-hidden">
          <div className="CHART_ROW_CONTAINER grid grid-cols-[1.3fr_1fr] gap-2">
            <div className="w-full h-full flex flex-col p-2 ">
              <div className="h-6">
                <p className="text-sm font-semibold">Sales Report</p>
              </div>
              <div className="flex-1">
                <Line
                  options={
                    {
                      backgroundColor: "#237AF8",

                      elements: {

                        line: {
                          tension: 0.5,
                        },
                      },
                      maintainAspectRatio: false,

                      scales: {
                        x: {
                          grid: {
                            drawOnChartArea: false,

                            drawTicks: false,
                          },
                        },

                        y: {
                          grid: {
                            drawOnChartArea: false,
                            //   drawTicks: false,
                          },
                        },
                      },
                    }}
                  data={{

                    labels: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    // labels: [
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    //   "i",
                    // ],
                    datasets: [
                      {
                        label: "No. of sales",
                        data: [14, 20, 16, 13, 15, 15, 17, 18, 23, 30, 35, 44],
                        // data: [
                        //   10, 1, 6, 23, 14, 50, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                        //   15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
                        //   28, 29, 30, 31,
                        // ],
                        fill: { target: true, above: "rgba(52, 143, 235, 0.2)" },
                        backgroundColor: "white",
                        borderColor: "#237AF8",
                        pointBorderWidth: 3,
                        pointRadius: 3,
                      },

                    ],
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col p-2">
              <div className="h-6">
                <p className="text-sm font-semibold">Weekly Report</p>
              </div>
              <div className="flex-1">
                <Bar
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                      y: {
                        grid: {
                          drawOnChartArea: false,
                        },
                      },
                    },
                  }}
                  data={{
                    labels: [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ],
                    datasets: [
                      {
                        label: "No. of sales",
                        data: [4, 2, 6, 3, 6, 9, 7, 8, 3, 10, 5, 4],
                        backgroundColor: "#237AF8",
                        //   borderColor: "blue",
                        borderRadius: 10,
                      },
                      {
                        label: "Last Month",
                        data: [3, 1, 4, 3, 5, 5, 4, 7, 4, 7, 4, 7],
                        backgroundColor: "limegreen",
                        borderRadius: 10,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          </div>

          <div className="NUMBERS_CONTAINER border-t-[1px] border-b-[1px] border-gray-200 grid grid-cols-3 p-2">
            <div className="flex flex-col justify-center px-4 ">
              <p className="text-sm font-medium text-[#237AF8]">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold">
                {toCurrencyString(totalRevenue)}
              </p>
              <p className="text-sm text-gray-500">
                Increased 10% from last month
              </p>
            </div>
            <div className="border-l-[1px] border-r-[1px] border-gray-200 flex flex-col justify-center px-4">
              <p className="text-sm font-medium text-green-400">Profit</p>
              <p className="text-2xl font-semibold">
                {toCurrencyString(totalProfit)}
              </p>
              <p className="text-sm text-gray-500">
                Increased 15% from last month
              </p>
            </div>
            <div className="flex flex-col justify-center px-4">
              <p className="text-sm font-medium text-red-400">
                Total Number of Sales
              </p>
              <p className="text-2xl font-semibold">{orders.length}</p>
              <p className="text-sm text-gray-500">
                Increased 15% from last month
              </p>
            </div>
          </div>

          <div className="table-container w-full h-full relative overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="w-full bg-[#237AF8] h-7 text-white text-left sticky top-0 ">
                  <th className="text-xs px-2">Order ID</th>
                  <th className="text-xs">Transaction Date</th>
                  <th className="text-xs">Transaction Time</th>
                  <th className="text-xs">Profit</th>
                  <th className="text-xs">Total Revenue</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => {
                  if (index % 2 === 0) {
                    return (
                      <tr key={order.orderID} className="w-full h-7">
                        <td className="text-sm px-2">{order.orderID}</td>
                        <td className="text-sm">{order.transactionDate}</td>
                        <td className="text-sm">{order.transactionTime}</td>
                        <td className="text-sm">{order.profit}</td>
                        <td className="text-sm">{order.totalAmount}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        key={order.orderID}
                        className="w-full h-7 bg-gray-100"
                      >
                        <td className="text-sm px-2">{order.orderID}</td>
                        <td className="text-sm">{order.transactionDate}</td>
                        <td className="text-sm">{order.transactionTime}</td>
                        <td className="text-sm">{order.profit}</td>
                        <td className="text-sm">{order.totalAmount}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
