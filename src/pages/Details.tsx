import React, { useCallback, useEffect, useState } from "react";
import {
  AddWishlistProduct,
  Header,
  ImageGridViewer,
  ModalView,
  ProductInfoSegment,
} from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { CustomText, IconButton, PrimaryButton } from "../elements";
import { IoChevronBackOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import { DefaultFile, type Product } from "../helpers/types";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: Product;
};

type DataFavsResponse = {
  message: string;
  isSuccess: boolean;
  data: Product[];
};

const Details: React.FC = () => {
  const navigate = useNavigate();
  const { prodID } = useParams();
  const [productFromApi, setProductFromApi] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFavs, setIsLoadingFavs] = useState<boolean>(false);
  const [viewModalWishlist, setToShowModalWishlist] = useState<boolean>(false);
  const [readyToWishList, setAddToWishList] = useState<Product | undefined>();
  const notify = () => toast("Successfully deleted item");
  const notifyTwo = () => toast("Successfully added to wishlist");
  //const [errorMessage, setErrorMessage] = useState<string>();
  const [responseProducts, setResponseObject] = useState<
    Product[] | undefined
  >();

  const handleGetMyProduct = async () => {
    try {
      setIsLoading(true);
      await fetch(
        `${
          import.meta.env.VITE_PUBLIC_API_HOST
        }/api/Product/GetProdutById/${prodID}`,
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
            console.log(`data?.data: `, data?.data);
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
            //setErrorMessage("Oops, something went wrong");
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

  const handleGetAllFavs = useCallback(async () => {
    try {
      setIsLoadingFavs(true);
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
        res.json().then(async (data: DataFavsResponse) => {
          setIsLoadingFavs(false);
          console.log(`data: `, data);

          if (data?.isSuccess && data?.message === "Favourite Added") {
            setResponseObject(data?.data);
          } else {
            //setErrorMessage("Oops, something went wrong");
          }
        });
      });
    } catch (error) {
      console.log(`Error: `, error);
      setIsLoadingFavs(false);
    }
  }, []);

  useEffect(() => {
    if (!responseProducts) handleGetAllFavs();
  }, [responseProducts]);

  const handleShowToast = (isDelete: boolean) => {
    if (isDelete) {
      notify();
    } else {
      notifyTwo();
    }
  };

  const handleDeleteItem = useCallback(
    (item: string) => {
      const newArray = responseProducts?.filter(
        (product) => product?.id !== item
      );
      setResponseObject(newArray);
    },
    [responseProducts]
  );

  return (
    <div className="w-full h-auto bg-white flex flex-col items-center p-[48px] gap-y-[32px] tMD:p-[30px] tSM:p-[24px] mLG:p-[16px]">
      <ModalView
        show={viewModalWishlist}
        handleClose={() => setToShowModalWishlist(false)}
      >
        <AddWishlistProduct
          handleCloseButton={() => {
            setToShowModalWishlist(false);
            setAddToWishList(undefined);
          }}
          activeProduct={readyToWishList}
          handleDeleteEffects={() =>
            handleDeleteItem(readyToWishList?.id || "")
          }
          isDelete={
            responseProducts?.find((item) => item?.id === productFromApi?.id)
              ? true
              : false
          }
          handleShowToast={() => {
            handleGetAllFavs();
            handleShowToast(false);
          }}
        />
      </ModalView>

      <Header
        label="Catalog Explorer"
        handleToast={() => handleShowToast(true)}
      />
      {isLoading && (
        <div className="grow flex justify-center items-center">
          <CustomText
            textLabel={"Loading product ..."}
            fontWeight="font-medium"
            fontSize="text-[20px] tSM2:text-[16px]"
            fontColor={`text-black`}
          />
        </div>
      )}
      {!isLoading && !productFromApi && (
        <div className="grow flex justify-center items-center">
          <CustomText
            textLabel={"Oops, something went wrong .."}
            fontWeight="font-medium"
            fontSize="text-[24px]"
            fontColor={`text-red`}
          />
        </div>
      )}
      {!isLoading && productFromApi && (
        <div className="w-full h-[500px] flex flex-row tMD:flex-col gap-x-8 pr-[80px] tMD:pr-[0px] tMD:gap-y-[28px]">
          <div className="w-full h-auto flex flex-row">
            <IconButton isNegative={false} handleClick={() => null}>
              <IoChevronBackOutline
                className="w-[24px] h-[24px]"
                onClick={() => navigate(-1)}
                fill="#black"
              />
            </IconButton>
            <div className="w-auto grow flex flex-row justify-center items-center">
              {productFromApi?.imagesPostAdd && (
                <ImageGridViewer
                  images={productFromApi?.imagesPostAdd?.map(
                    (item) => item?.imageURL
                  )}
                  mainImgHeight={"h-[420px] tSM2:h-[300px]"}
                  secondaryImgHeight="h-[100px] tSM2:h-[60px]"
                  isRow={false}
                />
              )}
            </div>
          </div>
          <div className="w-full flex flex-col justify-between tSM2:pb-[24px] tSM2:gap-y-[24px]">
            <ProductInfoSegment product={productFromApi} />
            <div className="w-full h-auto flex flex-row justify-between items-center">
              <div className="w-full h-auto flex flex-row gap-x-8 pt-2">
                <PrimaryButton
                  label={
                    responseProducts?.find(
                      (item) => item?.id === productFromApi?.id
                    )
                      ? "Remove from wishlist"
                      : "Add to watchlist"
                  }
                  buttonType={
                    responseProducts?.find(
                      (item) => item?.id === productFromApi?.id
                    )
                      ? "blue"
                      : "orange"
                  }
                  handleClick={() => {
                    if (!isLoadingFavs) {
                      setToShowModalWishlist(true);
                      setAddToWishList(productFromApi);
                    }
                  }}
                  isValid={true}
                />
              </div>
              <PrimaryButton
                label={"Share"}
                buttonType={"grey"}
                handleClick={() => null}
                isValid={true}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Details;
