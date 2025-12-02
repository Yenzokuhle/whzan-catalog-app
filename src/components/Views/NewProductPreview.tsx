import { useEffect, useState, type FC } from "react";
import { CustomText, PrimaryButton } from "../../elements";
import { DefaultFile, type Product } from "../../helpers/types";
import ProductCard from "../ProductCard";
type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: Product;
};

type NewProductPreviewProps = {
  handleCloseButton: () => void;
  productId: number;
  isUpdate?: boolean;
};

const NewProductPreview: FC<NewProductPreviewProps> = ({
  handleCloseButton,
  productId,
  isUpdate = false,
}: NewProductPreviewProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [productFromApi, setProductFromApi] = useState<Product | undefined>();

  const customHandleSubmit = async () => {
    handleCloseButton();
  };

  const handleGetMyProduct = async () => {
    try {
      setIsLoading(true);
      await fetch(
        `${
          import.meta.env.VITE_PUBLIC_API_HOST
        }/api/Product/GetProdutById/${productId}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `${onboardingJWT}`,
          },
        }
      ).then((res) => {
        res.json().then(async (data: DataResponse) => {
          setIsLoading(false);
          if (data?.isSuccess && data?.data) {
            setProductFromApi({
              ...data?.data,
              imagesPostAdd: data?.data?.images as unknown as {
                id: string;
                imageURL: string;
              }[],
              images: [
                { value: DefaultFile },
                { value: DefaultFile },
                { value: DefaultFile },
                { value: DefaultFile },
              ],
            });
            //setProductsFromAPI(data?.data?.products);
          } else {
            setErrorMessage("Oops, something went wrong");
          }
        });
      });
    } catch (error) {
      console.log(`Error: `, error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetMyProduct();
  }, []);

  return (
    <div className="w-[350px] h-auto flex flex-col gap-y-4 rounded-[20px] mMD:rounded-[18px] overflow-hidden py-8 relative bg-white">
      <div className="w-full h-auto flex flex-col justify-center items-center gap-y-[20px] tSM2:gap-y-[10px]">
        <div className="w-full h-auto flex flex-col justify-center items-center gap-y-2">
          <CustomText
            textLabel={
              isUpdate
                ? "Latest version of the product"
                : "Your newly created product"
            }
            fontWeight="font-regular"
            fontSize="text-[18px]"
            fontColor={`text-black`}
            customClass="text-center px-[8px]"
          />
        </div>

        <div className="mLG:w-[180px] h-auto flex flex-row justify-center">
          {isLoading && (
            <div className="grow flex justify-center items-center pt-[80px]">
              <CustomText
                textLabel={"Refreshing product ..."}
                fontWeight="font-regular"
                fontSize="text-[18px] tSM2:text-[16px]"
                fontColor={`text-black`}
              />
            </div>
          )}
          {!isLoading && productFromApi && (
            <ProductCard
              title={productFromApi?.name}
              price={`R${productFromApi?.price}`}
              inStock={productFromApi?.inStock as boolean}
              year={`${
                productFromApi?.rating
              }(${productFromApi?.reviewCount?.toString()})`}
              image={
                (productFromApi?.imagesPostAdd &&
                  productFromApi?.imagesPostAdd[0]?.imageURL) ||
                ""
              }
              handleIconClick={() => {
                console.log(`FilterView`);
              }}
              handleButtonClick={() => null}
            />
          )}
        </div>
        <div className="w-full h-auto flex flex-col gap-y-4 justify-center items-center">
          {errorMessage && (
            <div className="w-full h-auto flex justify-start">
              <span className="text-sm font-medium text-[#e22b2b] text-[16px] tMD:text-[16px] mMD:text-[14px] mSM:text-[12px] font-poppins">
                {errorMessage}
              </span>
            </div>
          )}
          <div className="w-full h-auto flex flex-col justify-center items-center pt-[32px] tSM2:pt-[20px]">
            <div className="w-fit h-auto">
              <PrimaryButton
                label={"Done"}
                buttonType={"blue"}
                handleClick={() => {
                  if (isUpdate) {
                    console.log(`Here 1`);

                    handleCloseButton();
                  } else {
                    console.log(`Here 2`);
                    customHandleSubmit();
                  }
                }}
                isValid={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductPreview;
