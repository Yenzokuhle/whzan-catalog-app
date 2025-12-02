import { useState, type FC } from "react";
import { CustomText, IconButton, PrimaryButton } from "../../elements";
import { IoMdClose } from "react-icons/io";
import { type Product } from "../../helpers/types";
import ProductCard from "../ProductCard";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: number;
};

type RemoveProductViewProps = {
  handleCloseButton: () => void;
  activeProduct?: Product;
  handleDelete?: (e: Product) => void;
};

const RemoveProductView: FC<RemoveProductViewProps> = ({
  handleCloseButton,
  activeProduct,
  handleDelete,
}: RemoveProductViewProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const customHandleSubmit = async (id: string) => {
    setIsLoading(true);

    try {
      await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/Delete/${id}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        res.json().then(async (data: DataResponse) => {
          if (data?.isSuccess) {
            if (handleDelete && activeProduct) {
              handleDelete(activeProduct);
              // handleCloseButton();
            } else {
              // handleCloseButton();
            }
            setIsLoading(false);

            handleCloseButton();
          } else {
            //set error message\
            setErrorMessage("Oops, something went wrong.");
          }
        });
      });
    } catch (error) {
      console.warn(`Error: `, error);
      setIsLoading(false);
      setErrorMessage(error as unknown as string);
    }
  };

  return (
    <div className="w-[350px] h-auto flex flex-col gap-y-4 bg-white rounded-[20px] mMD:rounded-[18px] overflow-hidden py-8 relative">
      <div className="grow h-auto bg-whzan-primary flex flex-row justify-between px-[20px] py-[16px] rounded-r-full mr-[24px] tSM2:mr-[16px]">
        <CustomText
          textLabel={"Remove product"}
          fontWeight="font-regular"
          fontSize="text-[22px] tSM2:text-[18px]"
          fontColor={`text-white`}
        />

        <IconButton isNegative={false} handleClick={() => null}>
          <IoMdClose
            className="w-[24px] h-[24px]"
            onClick={handleCloseButton}
            fill="#black"
          />
        </IconButton>
      </div>
      <div className="w-full h-auto flex flex-col justify-center items-center gap-y-[20px]  tSM2:gap-y-[10px]">
        <div className="mLG:w-[180px] h-auto flex flex-row justify-center">
          {activeProduct && activeProduct?.imagesPostAdd && (
            <ProductCard
              title={activeProduct?.name}
              price={`R${activeProduct?.price}`}
              inStock={activeProduct?.inStock as boolean}
              year={`${
                activeProduct?.rating
              }(${activeProduct?.reviewCount?.toString()})`}
              image={activeProduct?.imagesPostAdd[0]?.imageURL}
              handleIconClick={() => {
                console.log(`FilterView`);
              }}
              handleButtonClick={() => null}
            />
          )}
        </div>
        <div className="w-full h-auto flex flex-col gap-y-4 justify-center items-center">
          <div className="w-full h-auto flex flex-col justify-center items-center gap-y-2">
            <CustomText
              textLabel={"Are you sure you want to delete this product?"}
              fontWeight="font-regular"
              fontSize="text-[18px]"
              fontColor={`text-black`}
              customClass="text-center px-[8px]"
            />
          </div>

          {errorMessage && (
            <div className="w-full h-auto flex justify-start">
              <span className="text-sm font-medium text-[#e22b2b] text-[16px] tMD:text-[16px] mMD:text-[14px] mSM:text-[12px] font-poppins">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="w-full h-auto flex flex-col justify-center items-center gap-y-2">
            <CustomText
              textLabel={"This action cannot be undone."}
              fontWeight="font-regular"
              fontSize="text-[12px]"
              fontColor={`text-black`}
            />

            <div className="w-fit h-auto">
              {isLoading ? (
                <CustomText
                  textLabel={"Loading ..."}
                  fontWeight="font-medium"
                  fontSize="text-[18px] text-[16px]"
                  fontColor={`text-black`}
                />
              ) : (
                <PrimaryButton
                  label={"Delete product"}
                  buttonType={"accent"}
                  handleClick={() =>
                    customHandleSubmit(activeProduct?.id || "")
                  }
                  isValid={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveProductView;
