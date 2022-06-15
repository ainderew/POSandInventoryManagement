interface props {
  clickFunction: Function;
  categoryID: number;
  name: string;
  numberOfItems: string;
}

const CategoryContainer: React.FC<props> = ({
  clickFunction,
  categoryID,
  name,
  numberOfItems,
}) => {
  return (
    <div
      onClick={() => clickFunction(categoryID)}
      className="neumorphism active:scale-[1.05] duration-[100ms] p-4 flex  flex-col justify-between"
    >
      <p className="text-regular font-semibold">{name}</p>

      <p className="self-end">{numberOfItems} Items</p>
    </div>
  );
};

export default CategoryContainer;
