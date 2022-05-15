import { Link } from "react-router-dom";
const SideBar: React.FC = () => {
  return (
    <div className="w-full h-full grid grid-rows-[6rem_1fr_2fr] border-r-2 border-grey-300">
      <div className="logo m-auto font-bold ">TP</div>
      <div className=" flex flex-col">
        <Link className="m-auto" to="/">
          <div className="">R</div>
        </Link>
        <Link className="m-auto" to="/inventory">
          <div className="">I</div>
        </Link>
        <Link className="m-auto" to="/analytics">
          <div className="">A</div>
        </Link>
        <Link className="m-auto" to="/Financial">
          <div className="">F</div>
        </Link>
        
      </div>
      <div className=""></div>
    </div>
  );
};

export default SideBar;
