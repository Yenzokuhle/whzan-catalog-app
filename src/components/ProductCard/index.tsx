import { CustomText } from "../../elements";
import { IoIosStar } from "react-icons/io";

type ProductCardProps = {
  title: string;
  price: string;
  inStock: boolean;
  year: string;
  image: string;
  handleIconClick: () => void;
  handleButtonClick: () => void;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  inStock,
  year,
  image,
  handleIconClick,
  handleButtonClick,
}: ProductCardProps) => {
  return (
    <div
      className={`w-[220px] tMD:w-[200px] mLG:w-full h-auto flex flex-col relative z-0 border-solid border-[1.5px] border-[#E2E2E2] rounded-3xl tSM2:rounded-xl active:scale-[1.06] hover:scale-[1.02] cursor-pointer z-0`}
      onClick={handleButtonClick}
    >
      <div className="w-full h-auto flex flex-col justify-center items-center bg-[#F8FCFF] rounded-t-3xl">
        <img
          src={image}
          alt="whzan-logo"
          className="w-auto h-[180px] mLG:h-[140px] object-fill rounded-t-[20px]"
        />
      </div>
      <div className="w-full h-full rounded-b-[20px] flex flex-col justify-between gap-y-2 p-[16px] mMD:p-[12px] pt-[24px]">
        <CustomText
          textLabel={
            title.length >= 30 ? `${title.substring(0, 29)}...` : title
          }
          fontWeight="font-medium"
          fontSize="text-[18px] tMD:text-[16px] mLG:text-[15px] mMD:text-[14px]"
          fontColor={`text-black`}
        />
        <div className="w-full h-auto flex flex-row justify-between">
          <CustomText
            textLabel={price}
            fontWeight="font-thin"
            fontSize="text-[16px] tMD:text-[15px] mLG:text-[14px] mMD:text-[13px]"
            fontColor={`text-black`}
          />
          <div className="w-auto h-auto flex flex-row gap-x-[4px]">
            <IoIosStar
              className="w-[20px] h-[20px]"
              onClick={handleIconClick}
              fill={`#EA9836`}
            />
            <CustomText
              textLabel={year}
              fontWeight="font-thin"
              fontSize="text-[16px] tMD:text-[15px] mLG:text-[14px] mMD:text-[13px]"
              fontColor={`text-black`}
            />
          </div>
        </div>

        <div className="w-full h-auto flex flex-row justify-between py-[16px] tSM2:py-[14px] absolute top-0 left-0 pr-[16px] tSM2:pr-[12px] z-10">
          <div
            className={`w-auto h-auto flex flex-row items-center px-[8px] rounded-r-full ${
              inStock ? "bg-whzan-secondary" : "bg-whzan-accent"
            }`}
          >
            <CustomText
              textLabel={`${inStock ? "In stock" : "Out of stock"}`}
              fontWeight="font-medium"
              fontSize="text-[12px]"
              fontColor={`text-white`}
            />
          </div>
          {/* <div
            onClick={() => null}
            className={`w-[32px] h-[32px] tSM2:w-[28px] tSM2:h-[28px] active:scale-[1.06] hover:scale-[1.02] border-[#EA9836] flex flex-col bg-[#FFF1E0] rounded-full cursor-pointer items-center justify-center border-solid border-[1.5px]`}
          >
            <FaRegHeart
              className="w-[22px] h-[22px] tSM2:w-[18px] tSM2:h-[18px]"
              onClick={handleIconClick}
              fill={`#EA9836`}
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
