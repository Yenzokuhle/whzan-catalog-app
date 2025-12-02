import { CustomText } from "../../elements";
import { IoIosTrash } from "react-icons/io";

type SlimImageCardProps = {
  title: string;
  image: string;
  isActive?: boolean;
  handleDelete: () => void;
};

export const SlimImageCard: React.FC<SlimImageCardProps> = ({
  title,
  handleDelete,
  image,
  isActive = false,
}: SlimImageCardProps) => {
  return (
    <div
      className={`w-full h-[76px] flex flex-row  border-solid border-[1.5px] ${
        isActive ? "border-whzan-orange" : "border-[#E2E2E2]"
      }  rounded-2xl bg-white gap-x-[12px] overflow-hidden`}
    >
      <div className="w-auto h-auto flex flex-col justify-center items-center rounded-l-2xl bg-[#F8FCFF]">
        <img
          src={image}
          alt="whzan-logo"
          className="w-auto h-full object-fill"
        />
      </div>
      <div className="w-full h-auto flex flex-row justify-between gap-x-2 tSM2:gap-x-1">
        <div className="grow h-auto flex flex-col justify-center py-[4px] tSM2:py[2px]">
          <CustomText
            textLabel={
              title.length >= 26 ? `${title.substring(0, 25)}...` : title
            }
            fontWeight="font-medium"
            fontSize="text-[15px] tSM2:[14px]"
            fontColor={`text-black`}
          />
        </div>
        <div className="w-fit h-full flex flex-row justify-center items-center border-solid border-l-[1.5px] px-[4px] border-[#E2E2E2] active:bg-whzan-blue active:scale-[1.05] hover:scale-[1.02]">
          <IoIosTrash
            className="w-[24px] h-[24px]"
            onClick={handleDelete}
            fill={`#B4B4B4`}
          />
        </div>
      </div>
    </div>
  );
};

export default SlimImageCard;
