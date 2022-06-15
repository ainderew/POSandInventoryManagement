import React, { useState, useEffect } from "react";
import ModalAddItem from "../components/modal-addItem.component";
import ModalCategory from "../components/modal-category.component";
import { Line } from "react-chartjs-2";
import {
  Chart,
  Tooltip,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

import SearchBar from "../components/search-bar.component";
import { toCurrencyString } from "../scripts/common";
import {
  getAllItems,
  getCurrentMonthItemStatistics,
  searchItem,
  getCategories,
} from "../preload";

const InventoryPage: React.FC = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  );


  //- - - useStates
  const [modalCategoryFlag, setModalCategoryFlag] = useState<boolean>(false);
  const [modalItemFlag, setModalItemFlag] = useState<boolean>(false);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [chartDataSet, setChartDataSet] = useState<number[]>([]);
  const [itemDataHistory, setItemDataHistory] = useState<any[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  const [items, setItems] = useState<
    {
      itemID: number;
      itemName: string;
      itemQuantity: number;
      wholePrice: string;
      retailPrice: string;
      barcode: string;
      categoryName: string;
      categoryID: number;
    }[]
  >([]);

  // Edit input usestates
  const [inputBarcode, setInputBarcode] = useState<string>("");
  const [inputItemName, setInputItemName] = useState<string>("");
  const [inputItemQuantity, setInputItemQuantity] = useState<number>(0);
  const [inputWholePrice, setInputWholePrice] = useState<string>("");
  const [inputRetailPrice, setInputRetailPrice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number>(2);

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

  const handleOnRowClick = async (item: {
    itemID: number;
    itemName: string;
    itemQuantity: number;
    wholePrice: string;
    retailPrice: string;
    barcode: string;
    categoryName: string;
    categoryID: number;
  }) => {
    console.log(item);
    //CLEARS DATA STATES
    setItemDataHistory([]);
    setChartDataSet([]);
    // Loop query item data for each month of the current year
    for (let i = 1; i <= 12; i++) {
      const response: unknown = await getCurrentMonthItemStatistics({
        itemID: item.itemID,
        month: `0${i}`,
      });
      setItemDataHistory((prev) => [...prev, response]);
    }
    console.log(itemDataHistory);
    // initialize inputs on the left column
    setInputBarcode(item.barcode);
    setInputItemName(item.itemName);
    setInputItemQuantity(item.itemQuantity);
    setInputWholePrice(item.wholePrice);
    setInputRetailPrice(item.retailPrice);
    setSelectedCategory(item.categoryID);
  };

  const setEditInputs = () => { };

  const queryCategories = async () => {
    const response: unknown = await getCategories({});
    if (response instanceof Array) {
      setCategoryOptions(response);
    }
  };

  // - - - USEEFFECTS - - -

  useEffect(() => {
    queryItems();
    setInitialLoad(false);
    queryCategories();
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
          <div className="w-full h-full border-b-2 border-gray-300 p-4">
            <Line
              options={{

                hover: {
                  mode: "nearest",
                  intersect: true,
                },
                elements: {
                  line: {
                    tension: 0.5,
                  },
                },
                scales: {
                  y: {
                    suggestedMax: 100,
                    grid: {
                      drawOnChartArea: true,
                      drawTicks: false,
                    },
                  },
                  x: {
                    grid: {
                      drawOnChartArea: false,
                      drawTicks: false,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
              datasetIdKey="id"
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
                    data: chartDataSet,
                    backgroundColor: "white",
                    borderColor: "limegreen",


                  },
                ],
              }}
            />
          </div>

          <div className="flex flex-col gap-2 p-4 overflow-y-auto">
            <div className="row ">
              <p className="text-sm font-medium">Barcode</p>
              <input
                value={inputBarcode}
                type="text"
                className="w-full px-4 text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm font-medium">Item Name</p>
              <input
                value={inputItemName}
                type="text"
                className="w-full px-4 text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm font-medium">In Stock</p>
              <input
                value={inputItemQuantity}
                type="text"
                className="w-full px-4 text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm font-medium">Whole Price</p>
              <input
                type="text"
                value={inputWholePrice}
                className="w-full px-4 text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm font-medium">Retail Price</p>
              <input
                value={inputRetailPrice}
                type="text"
                className="w-full px-4 text-sm border-[1px] border-gray-300"
              />
            </div>
            <div className="row ">
              <p className="text-sm font-medium">Category</p>
              <select
                value={selectedCategory}
                name=""
                id=""
                className="w-full px-4 border-[1px] border-gray-300"
              >
                {categoryOptions.map((el: any) => {
                  return (
                    <option value={el.categoryID} className="">
                      {el.categoryName}
                    </option>
                  );
                })}
              </select>
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
        <div className="right_div grid grid-rows-[3rem_1fr] gap-4">
          <div className="flex gap-1 p-2 overflow-hidden">
            <div className="w-[60%]">
              <SearchBar
                searchInputSetter={setSearchInput}
                searchInput={searchInput}
              />
            </div>

            <div className="flex-1 justify-end flex gap-2">
              <button
                onClick={() => toggleFlag(setModalCategoryFlag)}
                className="w-32 bg-white rounded text-sm text-[#237AF8] border-2 border-[#237AF8]"
              >
                Add Category
              </button>
              <button
                onClick={() => toggleFlag(setModalItemFlag)}
                className="w-32 bg-white rounded text-sm text-[#237AF8] border-2 border-[#237AF8]"
              >
                Add Item
              </button>
            </div>
          </div>
          <div className="table_div w-full px-2 overflow-y-auto">
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
                <tr className="bg-[#237AF8] text-white h-10">
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
                        onClick={() => handleOnRowClick(item)}
                        className="cursor-pointer h-10 bg-gray-100"
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
                        onClick={() => handleOnRowClick(item)}
                        className="cursor-pointer h-10"
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
