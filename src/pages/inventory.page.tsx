import React, { useState, useEffect, useRef } from "react";
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
  updateItemData,
} from "../preload";
import InputRow from "../components/input-bar.component";
import ModalSuccess from "../components/modal-success.component";

const InventoryPage: React.FC = () => {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip
  );

  //- - - useRef
  const itemName_ref = useRef<HTMLInputElement | null>(null)
  const barcode_ref = useRef<HTMLInputElement | null>(null)
  const itemQuantity_ref = useRef<HTMLInputElement | null>(null)
  const retailPrice_ref = useRef<HTMLInputElement | null>(null)
  const wholePrice_ref = useRef<HTMLInputElement | null>(null)


  //- - - useStates
  const [modalCategoryFlag, setModalCategoryFlag] = useState<boolean>(false);
  const [modalItemFlag, setModalItemFlag] = useState<boolean>(false);
  const [modalSuccessFlag, setModalSuccessFlag] = useState<boolean>(false);
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
  const [itemID, setitemID] = useState<number>(0);
  const [inputBarcode, setInputBarcode] = useState<string>("");
  const [inputItemName, setInputItemName] = useState<string>("");
  const [inputItemQuantity, setInputItemQuantity] = useState<string>("");
  const [inputWholePrice, setInputWholePrice] = useState<string>("");
  const [inputRetailPrice, setInputRetailPrice] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number>(2);

  const toggleFlag: Function = (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ): void => {
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
      setItems(results);
    }
  };

  const clearChart = (): void => {
    setItemDataHistory([]);
    setChartDataSet([]);
  }

  const resetFields = (): void => {
    setitemID(0)
    setInputBarcode("");
    setInputItemName("");
    setInputItemQuantity("");
    setInputWholePrice("");
    setInputRetailPrice("");
    setSelectedCategory(1);

    if (itemName_ref.current && barcode_ref.current && itemQuantity_ref.current && retailPrice_ref.current && wholePrice_ref.current) {
      itemName_ref.current.removeAttribute("style")
      barcode_ref.current.removeAttribute("style")
      itemQuantity_ref.current.removeAttribute("style")
      retailPrice_ref.current.removeAttribute("style")
      wholePrice_ref.current.removeAttribute("style")
    }


  }

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
    clearChart();
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
    setitemID(item.itemID)
    setInputBarcode(item.barcode);
    setInputItemName(item.itemName);
    setInputItemQuantity(String(item.itemQuantity));
    setInputWholePrice(item.wholePrice);
    setInputRetailPrice(item.retailPrice);
    setSelectedCategory(item.categoryID);
  };

  const handleSaveChanges = async () => {
    if (!validateInputFields()) {
      // alert("No blank fields")
      return;
    }

    const newItemData = {
      itemID: itemID,
      itemName: inputItemName,
      barcode: inputBarcode,
      itemQuantity: inputItemQuantity,
      wholePrice: inputWholePrice,
      retailPrice: inputRetailPrice,
      categoryID: selectedCategory
    }

    const response: any = await updateItemData(newItemData)

    if (response instanceof Error) {
      alert(response) // Handle error here
      return;
    }
    // success actions
    setModalSuccessFlag(true)
    setTimeout(() => {
      setModalSuccessFlag(false)
    }, 1000)
    clearChart();
    resetFields();
    queryItems();


  };

  const validateInputFields = (): boolean => {

    if (inputItemName === "") {
      if (itemName_ref.current) {
        itemName_ref.current.style.border = "2px solid red"
      }
      return false
    }
    if (inputBarcode === "") {
      if (barcode_ref.current) {
        barcode_ref.current.style.border = "2px solid red"
      }
      return false
    }

    if (inputItemQuantity === "") {
      if (itemQuantity_ref.current) {
        itemQuantity_ref.current.style.border = "2px solid red"
      }
      return false
    }
    if (inputWholePrice === "") {
      if (wholePrice_ref.current) {
        wholePrice_ref.current.style.border = "2px solid red"
      }
      return false
    }
    if (inputRetailPrice === "") {
      if (retailPrice_ref.current) {
        retailPrice_ref.current.style.border = "2px solid red"
      }
      return false
    }


    return true


  }

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

      {modalSuccessFlag ? <ModalSuccess setter={setModalSuccessFlag} description="You have successfully changed the item's data" /> : null}


      <div className="h-screen w-full grid grid-cols-[1fr_2fr]">
        {/* left */}
        <div className="left_div border-r-2  border-grey-300 grid grid-rows-[1.7fr_2fr] overflow-hidden">
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

          <div className="flex flex-col justify-between gap-2 p-4 overflow-y-auto">

            <InputRow
              value={inputBarcode}
              label="Barcode"
              type="text"
              setter={setInputBarcode}
              ref_input={barcode_ref}
            />

            <InputRow
              value={inputItemName}
              label="Item Name"
              type="text"
              setter={setInputItemName}
              ref_input={itemName_ref}
            />

            <InputRow
              value={inputItemQuantity}
              label="In Stock"
              type="number"
              setter={setInputItemQuantity}
              ref_input={itemQuantity_ref}
            />

            <InputRow
              value={inputWholePrice}
              label="Whole Price"
              type="text"
              setter={setInputWholePrice}
              ref_input={wholePrice_ref}
            />

            <InputRow
              value={inputRetailPrice}
              label="Retail Price"
              type="text"
              setter={setInputRetailPrice}
              ref_input={retailPrice_ref}
            />

            <div className="row flex flex-col gap-2 h-full">
              <p className="text-sm font-medium">Category</p>
              <select
                onChange={(e) => setSelectedCategory(parseInt(e.target.value))}
                value={selectedCategory}
                name=""
                id=""
                className="w-full px-4 h-full border-[1px] border-gray-300"
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

            <div className="buttons flex gap-1 mt-2 w-full">
              <button
                onClick={() => handleSaveChanges()}
                className="h-[2rem] 2xl:h-[3rem] bg-[#237AF8] text-white text-sm flex-1 ">
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
