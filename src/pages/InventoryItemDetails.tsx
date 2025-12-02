import React, { useCallback, useEffect, useState } from "react";
import {
  ProductEditView,
  Header,
  ModalView,
  ProductPreview,
} from "../components";
import { useNavigate, useParams } from "react-router-dom";
import { CustomText } from "../elements";

import { DefaultFile, type Product } from "../helpers/types";
import RemoveProductView from "../components/Modals/RemoveProductView";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: Product;
};

const InventoryItemDetails: React.FC = () => {
  const navigate = useNavigate();
  const { prodID } = useParams();
  const [productFromApi, setProductFromApi] = useState<Product | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalViewDelete, setToDelete] = useState<boolean>(false);
  const [readyToDelete, setReadyToDelete] = useState<Product | undefined>();
  const [modalViewEdit, setToEdit] = useState<boolean>(false);

  const handleGetProducts = async () => {
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
    handleGetProducts();
  }, []);

  const handleUpdateItem = useCallback(
    (item: Product) => {
      if (productFromApi) {
        setProductFromApi({
          ...item,
          images: productFromApi?.images,
        });
      }
    },
    [setProductFromApi, productFromApi]
  );

  return (
    <div className="w-full h-auto bg-white flex flex-col items-center p-[48px] gap-y-[32px] tMD:p-[30px] tSM:p-[24px] mLG:p-[16px] relative">
      <ModalView show={modalViewDelete} handleClose={() => setToDelete(false)}>
        <RemoveProductView
          handleCloseButton={() => {
            setToDelete(false);
            navigate(-1);
          }}
          handleDelete={() => null}
          activeProduct={readyToDelete}
        />
      </ModalView>

      <ModalView show={modalViewEdit} handleClose={() => setToEdit(false)}>
        {readyToDelete && readyToDelete?.images && productFromApi ? (
          <ProductEditView
            isUpdate={true}
            handleCloseButton={() => setToEdit(false)}
            handleUpdate={(e) => {
              console.log(`E: `, e, productFromApi);

              handleUpdateItem({
                ...e,
                images: productFromApi?.images,
                imagesPostAdd: productFromApi?.imagesPostAdd,
                inStock: e?.inStock as boolean,
              });
            }}
            activeProduct={readyToDelete}
          />
        ) : (
          <></>
        )}
      </ModalView>
      <Header label="Catalog Explorer" />
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
        <div className="grow flex justify-center flex-col items-center">
          <CustomText
            textLabel={"Oops, something went wrong."}
            fontWeight="font-medium"
            fontSize="text-[20px] tSM2:text-[16px]"
            fontColor={`text-red`}
          />
          <CustomText
            textLabel={"Product not found ..."}
            fontWeight="font-medium"
            fontSize="text-[20px] tSM2:text-[16px]"
            fontColor={`text-red`}
          />
        </div>
      )}
      {!isLoading && productFromApi && (
        <ProductPreview
          product={productFromApi}
          handleEdit={(e) => {
            setToEdit(true);
            setReadyToDelete(e);
          }}
          handleClear={() => navigate(-1)}
          handleDelete={(e) => {
            setToDelete(true);
            setReadyToDelete(e);
          }}
        />
      )}
    </div>
  );
};

export default InventoryItemDetails;
