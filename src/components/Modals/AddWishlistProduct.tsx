import { useState, type FC } from "react";
import { CustomText, IconButton, PrimaryButton } from "../../elements";
import { IoMdClose } from "react-icons/io";
import { type Product } from "../../helpers/types";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: number;
};

type AddWishlistProductProps = {
  handleCloseButton: () => void;
  activeProduct?: Product;
  handleShowToast?: () => void;
  handleDeleteEffects?: () => void;
  isDelete: boolean;
};

const AddWishlistProduct: FC<AddWishlistProductProps> = ({
  handleCloseButton,
  activeProduct,
  handleShowToast,
  isDelete = false,
  handleDeleteEffects,
}: AddWishlistProductProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const customHandleSubmit = async (id: string) => {
    setIsLoading(true);

    try {
      setIsLoading(true);
      await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Favourite/addFav/${id}`,
        {
          method: "PATCH",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        res.json().then(async (data: DataResponse) => {
          setIsLoading(false);
          console.log(`Results: `, data);

          if (data?.isSuccess) {
            if (handleShowToast && activeProduct) {
              handleShowToast();
            } else {
              //something went wrong
            }

            if (isDelete && handleDeleteEffects) {
              handleDeleteEffects();
            }
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
          textLabel={isDelete ? `Remove from wishlist` : "Add product"}
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
        <div className="w-full h-auto flex flex-col gap-y-4 justify-center items-center">
          <div className="w-full h-auto flex flex-col justify-center items-center gap-y-2">
            <CustomText
              textLabel={isDelete ? "We are removing" : `We are adding`}
              fontWeight="font-regular"
              fontSize="text-[16px]"
              fontColor={`text-black`}
              customClass="text-center"
            />

            <CustomText
              textLabel={`${activeProduct?.name}`}
              fontWeight="font-medium"
              fontSize="text-[16px]"
              fontColor={`text-black`}
              customClass="text-center px-[20px]"
            />

            <CustomText
              textLabel={` ${isDelete ? "from " : "to "}your wishlist`}
              fontWeight="font-regular"
              fontSize="text-[16px]"
              fontColor={`text-black`}
              customClass="text-center"
            />
          </div>

          {errorMessage && (
            <div className="w-full h-auto flex justify-start">
              <span className="text-sm font-medium text-[#e22b2b] text-[16px] tMD:text-[16px] mMD:text-[14px] mSM:text-[12px] font-poppins">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="w-full h-auto flex flex-col justify-center items-center pt-[24px]">
            <div className="w-fit h-auto">
              {isLoading ? (
                <CustomText
                  textLabel={"Loading ..."}
                  fontWeight="font-medium"
                  fontSize="text-[18px] tSM2:text-[16px]"
                  fontColor={`text-black`}
                />
              ) : (
                <PrimaryButton
                  label={isDelete ? "Remove item" : "Update"}
                  buttonType={isDelete ? "accent" : "blue"}
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

export default AddWishlistProduct;
