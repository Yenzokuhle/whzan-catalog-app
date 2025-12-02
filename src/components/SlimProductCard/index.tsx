import { type ReactElement } from "react";
import { CustomText } from "../../elements";

type SlimProductCardProps = {
  title: string;
  price: string;
  image: string;
  isActive?: boolean;
  children: ReactElement;
};

export const SlimProductCard: React.FC<SlimProductCardProps> = ({
  title,
  price,
  children,
  image,
  isActive = false,
}: SlimProductCardProps) => {
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
          className="w-auto h-full object-fill rounded-t-[20px] rounded-l-2xl"
        />
      </div>
      <div className="w-full h-auto flex flex-row justify-between gap-x-2 tSM2:gap-x-1">
        <div className="grow h-auto flex flex-col justify-between py-[4px] tSM2:py[2px]">
          <CustomText
            textLabel={
              title.length >= 26 ? `${title.substring(0, 25)}...` : title
            }
            fontWeight="font-medium"
            fontSize="text-[15px] tSM2:[14px]"
            fontColor={`text-black`}
          />

          <CustomText
            textLabel={price}
            fontWeight="font-thin"
            fontSize="text-[13px] tSM2:[12px]"
            fontColor={`text-black`}
          />
        </div>
        <div className="w-fit h-full flex flex-row justify-center items-center border-solid border-l-[1.5px] px-[4px] border-[#E2E2E2] active:bg-whzan-blue active:scale-[1.05] hover:scale-[1.02]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlimProductCard;
