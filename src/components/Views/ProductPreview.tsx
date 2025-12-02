import { CustomText, IconButton, PrimaryButton } from "../../elements";
import type { Product } from "../../helpers/types";
import ImageGridViewer from "./ImageGridViewer";
import ProductInfoSegment from "./ProductInfoSegment";
import { IoClose } from "react-icons/io5";
import { useLocation } from "react-router-dom";

type ProductPreviewProps = {
  product: Product;
  handleClear: () => void;
  handleDelete: (e: Product) => void;
  handleEdit: (e: Product) => void;
};

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  product,
  handleClear,
  handleDelete,
  handleEdit,
}: ProductPreviewProps) => {
  const location = useLocation();

  return (
    <div className="w-full h-auto flex flex-col gap-y-[16px] pl-[32px] tMD:pl-[22px] tSM2:pl-0">
      <div
        className={`w-full flex flex-row justify-center pl-[40px] tSM2:pl-0 ${
          location?.pathname?.includes("product") ? "flex-row-reverse" : ""
        }`}
      >
        {product?.imagesPostAdd && (
          <ImageGridViewer
            images={product?.imagesPostAdd?.map((item) => `${item?.imageURL}`)}
            mainImgHeight={"h-[300px] mMD:h-[280px]"}
            secondaryImgHeight={"h-[60px] mMD:h-[50px]"}
            isRow={!location?.pathname?.includes("product")}
          />
        )}

        <IconButton isNegative={false} handleClick={() => null}>
          <IoClose
            className="w-[24px] h-[24px] mMD:w-[22px]  mMD:h-[22px]"
            onClick={handleClear}
            fill="#black"
          />
        </IconButton>
      </div>
      <div className="w-full h-auto flex flex-col items-center gap-y-[24px] tSM2:px-[16px]  mLG:px-[10px]">
        <div className="w-fit h-auto flex flex-col gap-y-[24px]">
          <ProductInfoSegment product={product} />
          {!product?.isPredefined && (
            <div className="w-full h-auto flex flex-row justify-between items-center">
              <div className="w-full h-auto flex flex-row gap-x-8 pt-2">
                <PrimaryButton
                  label={"Edit product"}
                  buttonType={"orange"}
                  handleClick={() => handleEdit(product)}
                  isValid={true}
                />
              </div>
              <PrimaryButton
                label={"Delete"}
                buttonType={"accent"}
                handleClick={() => handleDelete(product)}
                isValid={true}
              />
            </div>
          )}

          {product?.isPredefined && (
            <div className="w-full h-auto flex flex-row items-center justify-center bg-[#dcc4c4] text-center">
              <CustomText
                textLabel={
                  "This product is not eligible for edits and delete operations"
                }
                fontWeight="font-regular"
                fontSize="text-[16px] tSM2:text-[15px] mMD:text-[14px]"
                fontColor={`text-[#b90000]`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
