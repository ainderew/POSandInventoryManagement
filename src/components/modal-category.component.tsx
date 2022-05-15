import React, { useEffect, useState } from "react";
import { addCategory, getCategories } from "../preload";
import ModalSuccess from "./modal-success.component";

interface props {
  toggleModal: Function;
  stateSetter: React.Dispatch<React.SetStateAction<boolean>>; //closes the entire category modal
}

interface optionsProps {
  handleHistory: Function;
  handleBackButtonPress: Function;
  // activeModalStateSetter: React.Dispatch<React.SetStateAction<number>>;
}

interface optionModalProps {
  historyReset: React.Dispatch<React.SetStateAction<number[]>>;
}

const ModalCategory: React.FC<props> = ({ toggleModal, stateSetter }) => {
  const [activeModal, setActiveModal] = useState<number>(3);
  const [modalHistory, setModalHistory] = useState<number[]>([3]);

  const handleBackButtonPress = () => {
    const temp = [...modalHistory];
    temp.pop();
    setModalHistory(temp);

    const lastModalNumber: any = temp[temp.length - 1];
    setActiveModal(lastModalNumber);
  };

  const handleHistory = (modalNumber: number) => {
    setActiveModal(modalNumber);
    setModalHistory((prev) => [...prev, modalNumber]);
    // console.log(modalHistory)
  };

  const renderSwitch = () => {
    switch (activeModal) {
      case 1:
        return (
          <ModalAddCategory
            toggleModal={toggleModal}
            stateSetter={stateSetter}
            handleHistory={handleHistory}
            handleBackButtonPress={handleBackButtonPress}
            // activeModalStateSetter={setActiveModal}
          />
        );
      case 2:
        return (
          <ModalEditCategory
            toggleModal={toggleModal}
            stateSetter={stateSetter}
            handleHistory={handleHistory}
            handleBackButtonPress={handleBackButtonPress}
            // activeModalStateSetter={setActiveModal}
          />
        );
      case 3:
        return (
          <ModalOptions
            toggleModal={toggleModal}
            stateSetter={stateSetter}
            handleHistory={handleHistory}
            handleBackButtonPress={handleBackButtonPress}
            // activeModalStateSetter={setActiveModal}
            historyReset={setModalHistory}
          />
        );

      case 4:
        return <ModalSuccess />;
    }
  };

  return (
    <div className="h-full w-full fixed top-0 flex justify-center items-center bg-[rgba(0,0,0,0.4)]">
      {renderSwitch()}
    </div>
  );
};

// MODAL OPTIONS
export const ModalOptions: React.FC<props & optionsProps & optionModalProps> = ({
  toggleModal,
  stateSetter,
  handleHistory,
  handleBackButtonPress,
  historyReset,

}) => {
  useEffect(() => {
    historyReset([3]);
  }, []);

  return (
    <div className="h-auto w-[30vw] bg-white p-4 relative">
      <div className="w-full h-7 px-4 bg-gray-200 absolute left-0 top-0 flex justify-end items-center">
        <button
          onClick={() => toggleModal(stateSetter)}
          className="text-gray-600 font-bold text-2xl "
        >
          x
        </button>
      </div>
      <p className="text-center text-gray-500 mt-8 px-4">
        You can either add a new category or edit and existing one
      </p>

      <div className="flex gap-4 pt-8">
        <button
          onClick={() => handleHistory(1)}
          className="text-white bg-[#58B7F5] w-1/2 h-10"
        >
          Add Category
        </button>
        <button
          onClick={() => handleHistory(2)}
          className="text-white bg-[#58B7F5] w-1/2 h-10"
        >
          Edit Category
        </button>
      </div>
    </div>
  );
};

// MODAL ADD CATEGORY
export const ModalAddCategory: React.FC<props & optionsProps> = ({
  toggleModal,
  stateSetter,
  handleHistory,
  handleBackButtonPress,
}) => {
  const [categoryName, setCategoryName] = useState<string>("");

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };

  const handleSubmission = async () => {
    const response: unknown = await addCategory({ categoryName: categoryName });
    if (response instanceof Array) {
      if (response.length === 0) {
        handleHistory(4);

        setTimeout(() =>{
          toggleModal(stateSetter)
        },1500)
      }
    }
  };

  return (
    <div className="modal h-auto w-[30vw] bg-white flex flex-col gap-4 p-4 relative">
      <div className="w-full h-7 px-4 bg-gray-200 absolute left-0 top-0 flex justify-between items-center">
        <button
          onClick={() => handleBackButtonPress()}
          className="text-gray-600 font-bold text-2xl"
        >
          {"<"}
        </button>
        <button
          onClick={() => toggleModal(stateSetter)}
          className="text-gray-600 font-bold text-2xl"
        >
          x
        </button>
      </div>

      <div className="info flex justify-center items-center mt-6 py-4">
        <p className="text-base font-medium text-center text-gray-500">
          Categories help to organize items in your store. <br />
          Find items easier under their category
        </p>
      </div>
      <div className="row flex flex-col gap-2">
        <p className="label text-sm font-semibold">Category Name</p>
        <input
          onChange={onInputChange}
          type="text"
          className=" h-10 px-2 border-2 border-gray-300 focus: outline-[#58B7F5]"
        />
      </div>
      <div className="buttons flex flex-col gap-1">
        <button
          onClick={handleSubmission}
          className="text-sm py-2 bg-[#58B7F5] text-white"
        >
          Add Category
        </button>
        <button
          onClick={() => toggleModal(stateSetter)}
          className="text-sm py-2 bg-none border-2 border-gray-300 text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// MODAL EDIT CATEGORY
export const ModalEditCategory: React.FC<props & optionsProps> = ({
  toggleModal,
  stateSetter,
  handleHistory,
  handleBackButtonPress,
}) => {
  const [categories, setCategories] = useState<object[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");

  const handleInputChagne = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategoryName(e.target.value);
  };
  const handleSelectChang = (e: any) => {
    setCategoryName(e.target.value);
  };

  const queryCategories = async () => {
    const nCategories: any = await getCategories({});
    setCategories(nCategories);
  };

  useEffect(() => {
    queryCategories();
  }, []);

  return (
    <div className="h-auto w-[30vw] flex flex-col bg-[white] p-4 gap-4 relative">
      <div className="w-full h-7 px-4 bg-gray-200 absolute left-0 top-0 flex justify-between items-center">
        <button
          onClick={() => handleBackButtonPress()}
          className="text-gray-600 font-bold text-2xl"
        >
          {"<"}
        </button>
        <button
          onClick={() => toggleModal(stateSetter)}
          className="text-gray-600 font-bold text-2xl"
        >
          x
        </button>
      </div>
      <div className="info flex justify-center items-center py-4">
        <p className="text-base font-medium text-center text-gray-500">
          Edit the names of existing categories
        </p>
      </div>

      <div className="row flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-400">
          Select Categories to Edit
        </p>
        <select
          onChange={handleSelectChang}
          className="h-10 border-2 border-gray-300 focus:outline-[#58B7F5]"
        >
          {categories.map((el: any) => {
            return (
              <option value={el.categoryId} className="">
                {el.categoryName}
              </option>
            );
          })}
        </select>
      </div>

      <div className="w-full row flex flex-col gap-2">
        <button className="h-10 text-white text-sm font-medium bg-[#58B7F5]">
          Edit Selected Category
        </button>
        <button
          onClick={() => toggleModal(stateSetter)}
          className="text-sm py-2 bg-none border-2 border-gray-300 text-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ModalCategory;
