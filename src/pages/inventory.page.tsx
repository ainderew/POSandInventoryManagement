import React, { useState, useEffect } from "react";
import ModalAddItem from "../components/modal-addItem.component";
import ModalCategory from "../components/modal-category.component";
import { Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend
} from "chart.js";

import SearchBar from "../components/search-bar.component";
import { toCurrencyString } from "../scripts/common";
import {
  getAllItems,
  getCurrentMonthItemStatistics,
  searchItem,
} from "../preload";

const InventoryPage: React.FC = () => {
  Chart.register(CategoryScale, LinearScale, PointElement, LineElement,Legend);
  //   FLAGS
  const [modalCategoryFlag, setModalCategoryFlag] = useState<boolean>(false);
  const [modalItemFlag, setModalItemFlag] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [chartDataSet, setChartDataSet] = useState<number[]>([]);
  const [itemDataHistory, setItemDataHistory] = useState<any[]>([]);
  const [items, setItems] = useState<
    {
      itemID: number;
      itemName: string;
      itemQuantity: number;
      wholePrice: string;
      retailPrice: string;
      barcode: string;
      categoryName: string;
    }[]
  >([]);

  const toggleFlag: Function = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setter((prev) => !prev);
  };

  const queryItems = async () => {
    const itemsArray: unknown = await getAllItems({});
    if (itemsArray instanceof Array) {
      setItems(itemsArray);
      return;
    }
    // ADD ERROR HANDLING !!IMPORTANT!!
  };

  const handleItemSearch = async (seachInputValue: string) => {
    const results: unknown = await searchItem({ name: seachInputValue });
    if (results instanceof Array) {
      console.log(results);
      setItems(results);
    }
  };

  const handleOnRowClick = async (itemID: number) => {
    //CLEARS DATA STATES
    setItemDataHistory([]);
    setChartDataSet([]);
    // Loop query item data for each month of the current year
    for (let i = 1; i <= 12; i++) {
      const response: unknown = await getCurrentMonthItemStatistics({
        itemID: itemID,
        month: `0${i}`,
      });
      setItemDataHistory((prev) => [...prev, response]);
    }
    console.log(itemDataHistory);
  };

  // - - - USEEFFECTS - - -

  useEffect(() => {
    queryItems();
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (initialLoad) return;

    handleItemSearch(searchInput);
  }, [searchInput]);

  // EXTRACTS THE QUANTITY OF SOLD EACH MONTH AND PLACES IT IN AN ARRAY
  useEffect(() => {
    if (itemDataHistory.length !== 12) return;

    let temp = [];
    temp = itemDataHistory.map((el) => {
      let ans = 0;
      el.map((order: any) => (ans += order.quantityOfOrdered));
      return ans;
    });
    console.log(temp);
    setChartDataSet(temp);
  }, [itemDataHistory]);

  return (
    <div className="wrapper relative">
      {modalItemFlag ? (
        <ModalAddItem toggleModal={toggleFlag} stateSetter={setModalItemFlag} />
      ) : null}
      {modalCategoryFlag ? (
        <ModalCategory
          toggleModal={toggleFlag}
          stateSetter={setModalCategoryFlag}
        />
      ) : null}

      <div className="h-screen w-full grid grid-cols-[1fr_2fr]">
        {/* left */}
        <div className="left_div border-r-2  border-grey-300 grid grid-rows-[1.6fr_2fr] overflow-hidden">
          <div className="w-full h-full border-b-2  border-gray-300 ">
            <Line
              // height={"324px"}
              width={100}
              options={{
                maintainAspectRatio: false,
                scales: {
                  yAxis: {
                    // The axis for this scale is determined from the first letter of the id as `'x'`
                    // It is recommended to specify `position` and / or `axis` explicitly.
                    suggestedMax: 100,
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
                    label: "# of Sales",
                    data: chartDataSet,
                    backgroundColor: "white",
                    borderColor: "limegreen",
                    // backgroundColor: [
                    //   "rgba(255, 99, 132, 0.2)",
                    //   "rgba(54, 162, 235, 0.2)",
                    //   "rgba(255, 206, 86, 0.2)",
                    //   "rgba(75, 192, 192, 0.2)",
                    //   "rgba(153, 102, 255, 0.2)",
                    //   "rgba(255, 159, 64, 0.2)",
                    // ],
                  },
                ],
              }}
            />
          </div>

          <div className="flex flex-col gap-2 p-4 overflow-y-auto">
            <div className="row ">
              <p className="text-sm">Barcode</p>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm">Item Name</p>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm">In Stock</p>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm">Whole Price</p>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm">Retail Price</p>
              <input
                type="text"
                className="w-full border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm">Category</p>
              <select
                name=""
                id=""
                className="w-full border-[1px] border-gray-300"
              ></select>
            </div>
            <div className="buttons flex gap-1 mt-4">
              <button className="bg-[#237AF8] text-white text-sm flex-1">
                Save Changes
              </button>
              <button className="bg-white text-black text-sm border-2 border-gray-500 w-[30%]">
                Reset
              </button>
            </div>
          </div>
        </div>
        {/* right */}
        <div className="right_div grid grid-rows-[3rem_1fr]">
          <div className="flex gap-1 p-2">
            <SearchBar
              searchInputSetter={setSearchInput}
              searchInput={searchInput}
            />
            <button
              onClick={() => toggleFlag(setModalCategoryFlag)}
              className="w-32 bg-[#237AF8] rounded text-sm text-white"
            >
              Add Category
            </button>
            <button
              onClick={() => toggleFlag(setModalItemFlag)}
              className="w-32 bg-[#237AF8] rounded text-sm text-white"
            >
              Add Item
            </button>
          </div>
          <div className="table_div w-full px-2 ">
            <table className=" w-full text-sm">
              <colgroup>
                <col span={1} className="w-[30%]" />
                <col span={1} className="w-[10%]" />
                <col span={1} className="w-[15%]" />
                <col span={1} className="w-[15%]" />
                <col span={1} className="w-[15%]" />
                <col span={1} className="w-[15%]" />
              </colgroup>

              <thead className="h-7">
                <tr className="bg-[#237AF8] text-white">
                  <th className=" text-left px-4 ">Item Name</th>
                  <th className=" text-left ">In Stock</th>
                  <th className=" text-left ">Whole Price</th>
                  <th className=" text-left ">Retail Price</th>
                  <th className=" text-left ">Category</th>
                  <th className=" text-left">Barcode</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => {
                  if (index % 2) {
                    return (
                      <tr
                        onClick={() => handleOnRowClick(item.itemID)}
                        className="cursor-pointer h-7 bg-slate-200"
                        key={item.itemID}
                      >
                        <td className="px-4">{item.itemName}</td>
                        <td className="">{item.itemQuantity}</td>
                        <td className="">
                          {toCurrencyString(parseFloat(item.wholePrice))}
                        </td>
                        <td className="">
                          {toCurrencyString(parseFloat(item.retailPrice))}
                        </td>
                        <td className="">{item.categoryName}</td>
                        <td className="">{item.barcode}</td>
                      </tr>
                    );
                  } else {
                    return (
                      <tr
                        onClick={() => handleOnRowClick(item.itemID)}
                        className="cursor-pointer h-7"
                        key={item.itemID}
                      >
                        <td className="px-4">{item.itemName}</td>
                        <td className="">{item.itemQuantity}</td>
                        <td className="">
                          {toCurrencyString(parseFloat(item.wholePrice))}
                        </td>
                        <td className="">
                          {toCurrencyString(parseFloat(item.retailPrice))}
                        </td>
                        <td className="">{item.categoryName}</td>
                        <td className="">{item.barcode}</td>
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

export default InventoryPage;
