import { CustomText } from "../../elements";
import { IoIosStar } from "react-icons/io";
import type { Product } from "../../helpers/types";
import { useLocation } from "react-router-dom";

type ProductInfoSegmentProps = {
  product: Product;
};

export const ProductInfoSegment: React.FC<ProductInfoSegmentProps> = ({
  product,
}: ProductInfoSegmentProps) => {
  const location = useLocation();

  return (
    <div className="w-full h-auto flex flex-col gap-y-[20px] tSM2:gap-y-[10px]">
      <div className="w-full h-auto flex flex-row justify-between gap-x-[24px]">
        <CustomText
          textLabel={product?.name}
          fontWeight="font-medium"
          fontSize={`${
            location?.pathname === "/admin/inventory"
              ? "text-[20px]"
              : "text-[28px]"
          } tSM2:text-[24px] mMD:text-[20px]`}
          fontColor={`text-black`}
        />
      </div>
      <CustomText
        textLabel={product?.description}
        fontWeight="font-regular"
        fontSize={`${
          location?.pathname === "/admin/inventory"
            ? "text-[16px]"
            : "text-[20px]"
        } tSM2:text-[18px] mMD:text-[16px]`}
        fontColor={`text-black`}
      />

      <div className="w-full h-auto flex flex-row justify-start gap-x-[28px] mMD:gap-x-0 mMD:justify-between items-center bg-[#F8FCFF] p-[16px]">
        <CustomText
          textLabel={"Tags:"}
          fontWeight="font-light"
          fontSize="text-[16px] mMD:text-[14px]"
          fontColor={`text-black`}
        />
        <div className="w-auto h-auto flex flex-row flex-wrap gap-x-[12px]">
          {product?.tags?.map((item, idx: number) => (
            <CustomText
              key={`product-item-${idx + 1}`}
              textLabel={`${item?.name || item?.value} ${
                product?.tags?.length == idx + 1 ? "" : "; "
              }`}
              fontWeight="font-medium"
              fontSize="text-[16px] mMD:text-[14px]"
              fontColor={`text-black`}
            />
          ))}
        </div>
      </div>

      <div className="w-full h-auto flex flex-row justify-between">
        <div className="w-auto h-auto flex flex-row items-center gap-x-[20px] tSM2:gap-x-[8px]">
          <CustomText
            textLabel={`Brand: `}
            fontWeight="font-regular"
            fontSize="text-[18px] mMD:text-[14px]"
            fontColor={`text-[#8D8D8D]`}
          />

          <CustomText
            textLabel={product?.brand}
            fontWeight="font-medium"
            fontSize="text-[18px] tSM2:text-[16px] mMD:text-[14px]"
            fontColor={`text-black`}
          />
        </div>

        <div className="w-auto h-auto flex flex-row gap-x-[4px] items-center">
          <IoIosStar
            className="w-[24px] h-[24px]"
            onClick={() => null}
            fill={`#EA9836`}
          />
          <CustomText
            textLabel={`${
              product?.rating
            }(${product?.reviewCount?.toString()})`}
            fontWeight="font-thin"
            fontSize="text-[18px] tMD:text-[16px] mLG:text-[14px]"
            fontColor={`text-black`}
          />
        </div>
      </div>
      <div className="w-full h-auto flex flex-row justify-between items-center">
        <CustomText
          textLabel={`$${product?.price}`}
          fontWeight="font-light"
          fontSize="text-[28px] tSM2:text-[24px] mMD:text-[20px]"
          fontColor={`text-black`}
        />
        <div
          className={`w-auto h-auto flex flex-row items-center px-[12px] py-[4px] rounded-l-full ${
            product?.inStock ? "bg-whzan-secondary" : "bg-whzan-accent"
          }`}
        >
          <CustomText
            textLabel={`${product?.inStock ? "In stock" : "Out of stock"}`}
            fontWeight="font-regular"
            fontSize="text-[14px] mMD:text-[13px]"
            fontColor={`text-white`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductInfoSegment;
