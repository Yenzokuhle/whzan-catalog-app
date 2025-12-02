import { useCallback, useEffect, useState, type FC } from "react";
import SlimProductCard from "../SlimProductCard";
import { DefaultFile, type Product } from "../../helpers/types";
import { CustomText, IconButton } from "../../elements";
import { IoMdClose, IoIosTrash } from "react-icons/io";
import ClipLoader from "react-spinners/ClipLoader";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: Product[];
};

type WishlistModalProps = {
  handleClose: () => void;
  handleShowToast: () => void;
};

const WishlistModal: FC<WishlistModalProps> = ({
  handleClose,
  handleShowToast,
}: WishlistModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [removeItem, setToRemove] = useState<Product | undefined>();
  const [, setErrorMessage] = useState<string>();
  const [responseProducts, setResponseObject] = useState<
    Product[] | undefined
  >();

  const customHandleSubmit = async (id: string) => {
    try {
      setIsLoadingDelete(true);
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
          console.log(`Results: `, data);

          if (data?.isSuccess) {
            const itemsLeft = responseProducts?.filter(
              (item) => item?.id !== id
            );
            handleShowToast();
            setResponseObject(itemsLeft);
            setToRemove(undefined);
          } else {
            //set error message\
            setErrorMessage("Oops, something went wrong.");
          }
          setIsLoadingDelete(false);
        });
      });
    } catch (error) {
      console.warn(`Error: `, error);
      setIsLoadingDelete(false);
      setErrorMessage(error as unknown as string);
    }
  };

  const handleGetAllFavs = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Favourite/GetAll`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        res.json().then(async (data: DataResponse) => {
          setIsLoading(false);
          console.log(`data: `, data);

          if (data?.isSuccess && data?.message === "Favourite Added") {
            const arrayTouched = data?.data?.map((item) => {
              return {
                ...item,
                imagesPostAdd: item?.images as unknown as {
                  id: string;
                  imageURL: string;
                }[],
                images: [
                  { value: DefaultFile },
                  { value: DefaultFile },
                  { value: DefaultFile },
                  { value: DefaultFile },
                ],
              };
            });

            setResponseObject(arrayTouched);
          } else {
            //setErrorMessage("Oops, something went wrong");
          }
        });
      });
    } catch (error) {
      console.log(`Error: `, error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!responseProducts) handleGetAllFavs();
  }, [responseProducts]);

  return (
    <div className="w-[500px] tSM2:w-[400px] mLG:w-dvw h-dvh flex flex-col gap-y-4 bg-white overflow-hidden pt-[24px] mLG:py-[16px] absolute top-0 right-0">
      <div className="w-full h-auto flex flex-row items-center justify-between px-[16px]">
        <CustomText
          textLabel={"Wishlist"}
          fontWeight="font-regular"
          fontSize="text-[22px]"
          fontColor={`text-[#101042]`}
        />
        <IconButton isNegative={false} handleClick={handleClose}>
          <IoMdClose
            className="w-[22px] h-[22px]"
            onClick={() => null}
            fill="#000000"
          />
        </IconButton>
      </div>

      {isLoading && (
        <div className="grow flex justify-center items-center">
          <CustomText
            textLabel={"Loading wishlist ..."}
            fontWeight="font-medium"
            fontSize="text-[20px] tSM2:text-[16px]"
            fontColor={`text-black`}
          />
        </div>
      )}
      {!isLoading && responseProducts?.length == 0 && (
        <div className="grow flex justify-center items-center">
          <CustomText
            textLabel={"Your basket is empty!"}
            fontWeight="font-medium"
            fontSize="text-[20px] tSM2:text-[16px]"
            fontColor={`text-black`}
          />
        </div>
      )}
      {!isLoading && responseProducts && (
        <div className="w-full h-auto flex flex-col tSM:justify-center gap-y-[16px] p-[16px] overflow-scroll">
          {responseProducts?.map((item: Product, idx: number) => (
            <SlimProductCard
              key={`wishlist-item-${idx + 1}`}
              title={item?.name}
              price={`R${item?.price}`}
              image={
                (item?.imagesPostAdd && item?.imagesPostAdd[0]?.imageURL) || ""
              }
            >
              {isLoadingDelete && removeItem?.id === item?.id ? (
                <div className="w-[24px] h-[24px]">
                  <ClipLoader
                    color={"#FFBE00"}
                    loading={true}
                    size={20}
                    cssOverride={{
                      display: "block",
                      margin: "0 auto",
                      borderColor: "#FFBE00",
                    }}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              ) : (
                <IoIosTrash
                  className="w-[24px] h-[24px]"
                  onClick={() => {
                    setToRemove(item);
                    customHandleSubmit(item?.id || "");
                  }}
                  fill={`#B4B4B4`}
                />
              )}
            </SlimProductCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistModal;
