import {
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import SearchBar from "../components/search-bar.component";
import { getCurrentMonthOrders } from "../preload";

const FinancePage: React.FC = () => {
  ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    BarController,
    Tooltip
  );

  const [inputSearch, setInputSearch] = useState<string>("");
  const [orders, setOrders] = useState<any[]>([]);

  const getOrders = async () => {
    const response: unknown = await getCurrentMonthOrders({});

    if (response instanceof Array) {
      setOrders(response);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="h-screen w-full  grid grid-cols-[1fr_2fr] overflow-hidden">
      {/* left */}
      <div className="left border-r-2 border-gray-300"></div>
      {/* right */}
      <div className="right grid grid-rows-[3rem_1fr] px-2 overflow-hidden">
        <div className="search_container py-2">
          <SearchBar
            searchInput={inputSearch}
            searchInputSetter={setInputSearch}
          />
        </div>

        <div className="RIGHT_BOTTOM_ROW_CONTAINER grid grid-rows-[1.5fr_2fr] gap-2 overflow-hidden">
          <div className="CHART_ROW_CONTAINER grid grid-cols-[1.3fr_1fr] gap-2">
            <div className="w-full h-full flex flex-col p-2 border-gray-300 border">
              <div className="h-6">
                <p className="text-sm font-semibold">Sales Report</p>
              </div>
              <div className="flex-1">
                <Line
                  options={{
                    elements: {
                      line: {
                        tension: 0.4,
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
                    // labels: [
                    //   "Jan",
                    //   "Feb",
                    //   "Mar",
                    //   "Apr",
                    //   "May",
                    //   "Jun",
                    //   "Jul",
                    //   "Aug",
                    //   "Sep",
                    //   "Oct",
                    //   "Nov",
                    //   "Dec",
                    // ],
                    labels: [
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                      "i",
                    ],
                    datasets: [
                      {
                        label: "No. of sales",
                        // data: [4, 2, 6, 3, 5, 5, 7, 8, 3, 10, 5, 4],
                        data: [
                          10, 1, 6, 23, 14, 50, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                          16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                          29, 30, 31,
                        ],
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

            <div className="border-gray-300 border flex flex-col p-2">
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
                  if(index%2 === 0){
                    return (
                        <tr key={order.orderID} className="w-full h-7">
                          <td className="text-sm px-2">{order.orderID}</td>
                          <td className="text-sm">{order.transactionDate}</td>
                          <td className="text-sm">{order.transactionTime}</td>
                          <td className="text-sm">{order.profit}</td>
                          <td className="text-sm">{order.totalAmount}</td>
                        </tr>
                      );
                  }else{
                    return (
                        <tr key={order.orderID} className="w-full h-7 bg-gray-100">
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
