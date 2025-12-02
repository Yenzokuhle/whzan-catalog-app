import { CustomText } from "../Text/CustomText";
import { IoMdCheckmark } from "react-icons/io";

type FilterItemButtonProps = {
  width: string;
  countLabel?: string;
  label: string;
  handleClick: () => void;
  isActive: boolean;
};

export const FilterItemButton: React.FC<FilterItemButtonProps> = ({
  width,
  countLabel,
  label,
  handleClick,
  isActive,
}) => {
  return (
    <div
      className={`${width} h-auto flex flex-row items-center gap-x-[12px] py-[4px] px-[8px] rounded-[10px] cursor-pointer ${
        isActive
          ? "bg-whzan-orange"
          : "bg-white border-solid border-[1.5px] border-[#E2E2E2]"
      }`}
      onClick={handleClick}
    >
      {isActive && countLabel && (
        <div
          className={`w-[20px] h-[20px] rounded-full p-[2px] flex flex-row justify-center items-center bg-[#FDEAD6]`}
        >
          <IoMdCheckmark
            className="w-[22px] h-[22px] mMD:w-[20px] mMD:h-[20px]"
            onClick={() => {}}
            fill="#black"
          />
        </div>
      )}
      <CustomText
        textLabel={label}
        fontWeight="font-regular"
        fontSize="text-[14px]"
        fontColor={`${isActive ? "text-white" : "text-[#101042]"}`}
      />
    </div>
  );
};

export default FilterItemButton;
