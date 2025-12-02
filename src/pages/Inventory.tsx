import React, { useCallback, useEffect, useState } from "react";
import {
  ProductEditView,
  FilterView,
  Header,
  ModalView,
  PaginationView,
  ProductPreview,
  SlimProductCard,
} from "../components";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { MdChevronLeft } from "react-icons/md";
import { DefaultFile, type Product } from "../helpers/types";
import { CustomText, SelectSmallField } from "../elements";
import { MdEdit } from "react-icons/md";
import { useLocation } from "react-router-dom";
import RemoveProductView from "../components/Modals/RemoveProductView";
import { getInStockOutput } from "./Home";
import type { FilterForm } from "../components/Views/FilterView";
import { FormProvider, useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: {
    totalProduct: number;
    products: Product[] | undefined;
  };
};

export const MainFormValidation = Yup.object().shape({});

type MainForm = {
  sortBy?: string;
};

const MainFormDefaultValues: MainForm = {
  sortBy: "",
};

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const [activeProduct, setActiveProduct] = useState<Product>();
  const width = window.innerWidth;

  const [errorMessage, setErrorMessage] = useState<string>();
  const [modalViewFilter, setModalViewFilter] = useState<boolean>(false);
  const [modalViewDelete, setToDelete] = useState<boolean>(false);
  const [modalViewEdit, setToEdit] = useState<boolean>(false);
  const [readyToDelete, setReadyToDelete] = useState<Product | undefined>();
  const location = useLocation();
  const [filterCount, setFilterCount] = useState<number>(0);
  const [filterObject, setFilterObject] = useState<FilterForm>({
    searchString: undefined,
    availability: undefined,
    brands: undefined,
    currency: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [productsFromAPI, setProductsFromAPI] = useState<Product[] | undefined>(
    undefined
  );
  const [isPaginationLocation, setIsPaginationLocation] = useState<number>(1);
  const paginationTotalItems = 3;

  const [totalProductsInDBFromFIlter, setTotalProductsInDBFromFIlter] =
    useState<number | undefined>(undefined);

  const { control, handleSubmit, ...rest } = useForm<MainForm>({
    resolver: yupResolver(MainFormValidation),
    defaultValues: MainFormDefaultValues,
  });

  const customHandleSubmit = async (
    _dataResults: MainForm,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
  };

  const onError = (errors: FieldErrors<MainForm>) => {
    console.warn(errors);
  };

  const handleGetProducts = useCallback(
    async (filterObject?: FilterForm) => {
      try {
        setIsLoading(true);
        await fetch(
          `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/GetAll`,
          {
            method: "POST",
            mode: "cors",
            body: JSON.stringify({
              name: filterObject?.searchString || null,
              inStock: getInStockOutput(filterObject?.availability || "All"),
              brands: filterObject?.brands || null,
              currency: filterObject?.currency || null,
              minPrice: filterObject?.priceMin || null,
              maxPrice: filterObject?.priceMax || null,
              pageNumber: isPaginationLocation,
              pageSize: paginationTotalItems,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => {
          res.json().then(async (data: DataResponse) => {
            setIsLoading(false);
            if (data?.isSuccess && data?.data) {
              const arrayTouched = data?.data?.products?.map((item) => {
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

              setProductsFromAPI(arrayTouched);
              setTotalProductsInDBFromFIlter(data?.data?.totalProduct);
            } else {
              setErrorMessage("Oops, something went wrong");
            }
          });
        });
      } catch (error) {
        console.log(`Error: `, error);
        setIsLoading(false);
      }
    },
    [isPaginationLocation]
  );

  useEffect(() => {
    if (filterObject) {
      handleGetProducts(filterObject);
      let count = 0;

      Object.values(filterObject).forEach((value) => {
        if (value !== undefined && !Array.isArray(value)) {
          count++;
        } else if (Array.isArray(value) && value?.length > 0) {
          count++;
        }
      });
      setFilterCount(count);
    }
  }, [filterObject, handleGetProducts]);

  const handleCardClick = useCallback(
    (item: Product) => {
      if (width && width < 612) {
        navigate(`/admin/inventory/product/${item?.id}`);
      } else {
        setActiveProduct(item);
      }
    },
    [width, navigate]
  );

  const handleDeleteItem = useCallback(
    (item: Product) => {
      const newArray = productsFromAPI?.filter(
        (product) => product?.id !== item?.id
      );
      setProductsFromAPI(newArray);
      setReadyToDelete(undefined);
      setToDelete(false);
      setActiveProduct(undefined);
    },
    [setProductsFromAPI, productsFromAPI]
  );

  const handleUpdateItem = useCallback(
    (item: Product) => {
      if (activeProduct) {
        setActiveProduct({
          ...item,
          images: activeProduct?.images,
        });
      }
    },
    [setProductsFromAPI, activeProduct]
  );

  return (
    <div className="w-full h-auto bg-white flex flex-col items-center p-[48px] gap-y-[32px] tMD:p-[30px] tSM:p-[24px] mLG:p-[16px] mMD:px-0">
      <ModalView show={modalViewDelete} handleClose={() => setToDelete(false)}>
        <RemoveProductView
          handleCloseButton={() => {
            setToDelete(false);
          }}
          handleDelete={handleDeleteItem}
          activeProduct={readyToDelete}
        />
      </ModalView>

      <ModalView show={modalViewEdit} handleClose={() => setToEdit(false)}>
        {readyToDelete && readyToDelete?.images && activeProduct ? (
          <ProductEditView
            isUpdate={true}
            handleCloseButton={() => setToEdit(false)}
            handleUpdate={(e) => {
              console.log(`E: `, e);
              console.log(`HERRRRRR: `, {
                ...e,
                images: activeProduct?.images,
                imagesPostAdd: e?.imagesPostAdd,
              });
              handleUpdateItem({
                ...e,
                images: activeProduct?.images,
                imagesPostAdd: activeProduct?.imagesPostAdd,
                inStock: e?.inStock as boolean,
              });
            }}
            activeProduct={readyToDelete}
          />
        ) : (
          <></>
        )}
      </ModalView>

      <ModalView
        show={modalViewFilter}
        handleClose={() => setModalViewFilter(false)}
      >
        <FilterView
          handleFilter={(e) => {
            setFilterObject(e);
          }}
          customStyle="tSM2:w-dvw tSM2:h-dvh"
          handleClose={() => {
            setModalViewFilter(false);
            setIsPaginationLocation(1);
          }}
          defaultState={filterObject}
        />
      </ModalView>

      <div className="w-full h-auto mMD:p-[16px] mMD:py-[12px]">
        <Header label="Catalog Explorer" />
      </div>

      <div className="w-full h-full flex flex-row">
        <FormProvider control={control} handleSubmit={handleSubmit} {...rest}>
          <form
            onSubmit={handleSubmit(customHandleSubmit, onError)}
            className="grow flex flex-col w-[50%] tSM:w-full h-[600px] tSM:h-fit"
          >
            <div className="w-full h-full bg-[#F8FCFF]">
              <div className="w-full h-auto bg-[#F8FCFF] flex flex-row justify-between p-[16px]">
                <div className="w-full h-auto flex flex-row items-center justify-between gap-x-[20px]">
                  <div
                    className="w-auto h-auto flex flex-row items-center active:scale-[1.02] hover:scale-[1.06] cursor-pointer rounded-full gap-x-[12px] py-[4px] px-[10px]"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    <div className="w-auto h-auto rounded-full border-solid border-[1.5px] border-[#E2E2E2]">
                      <MdChevronLeft
                        className="w-[22px] h-[22px]"
                        fill="#000000"
                      />
                    </div>
                    <CustomText
                      textLabel={"Exit"}
                      fontWeight="font-regular"
                      fontSize="text-[16px]"
                      fontColor={`text-black`}
                    />
                  </div>
                  <div className="w-[50%] h-auto flex flex-col gap-y-4">
                    <CustomText
                      textLabel={"Filter results"}
                      fontWeight="font-regular"
                      fontSize="text-[18px]"
                      fontColor={`text-black`}
                      customClass={`tSM2:hidden ${
                        location?.pathname?.includes("/admin/inventory")
                          ? "hidden"
                          : ""
                      }`}
                    />
                  </div>
                  <div
                    className="w-auto h-auto flex flex-row items-center active:scale-[1.02] hover:scale-[1.06] cursor-pointer rounded-full gap-x-[24px] py-[4px] px-[10px] border-[1.5px] border-[#D3D3D3] bg-white"
                    onClick={() => setModalViewFilter(true)}
                  >
                    <CustomText
                      textLabel={"Filter"}
                      fontWeight="font-regular"
                      fontSize="text-[16px]"
                      fontColor={`text-black`}
                    />
                    <div
                      className={`w-[20px] h-[20px] flex flex-row items-center justify-center ${
                        filterCount > 0 ? "bg-whzan-blue" : "bg-[#e0e0e0]"
                      } rounded-full`}
                    >
                      <CustomText
                        textLabel={filterCount.toString()}
                        fontWeight="font-regular"
                        fontSize="text-[16px]"
                        fontColor={`text-white`}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {isLoading && (
                <div className="grow flex justify-center items-center pt-[80px]">
                  <CustomText
                    textLabel={"Loading products ..."}
                    fontWeight="font-regular"
                    fontSize="text-[18px] tSM2:text-[16px]"
                    fontColor={`text-black`}
                  />
                </div>
              )}
              {!isLoading &&
                productsFromAPI?.length !== 0 &&
                productsFromAPI && (
                  <div className="w-full h-auto flex flex-col">
                    <div className="w-full h-auto bg-[#F8FCFF] flex flex-row justify-between p-[16px]">
                      <CustomText
                        textLabel={`Page ${isPaginationLocation} / ${
                          totalProductsInDBFromFIlter
                            ? Math.ceil(
                                totalProductsInDBFromFIlter /
                                  paginationTotalItems
                              )
                            : ""
                        } -- total of ${totalProductsInDBFromFIlter} items`}
                        fontWeight="font-regular"
                        fontSize="text-[18px]"
                        fontColor={`text-black`}
                      />

                      <div className="w-auto h-auto flex flex-row items-center gap-x-[20px]">
                        <div className="w-fit h-auto flex flex-row items-center gap-x-[20px] tSM2:gap-x-[4px]">
                          <SelectSmallField
                            name={"sortBy"}
                            label={"Sort by"}
                            listItem={[
                              {
                                value: "sort by",
                                label: "Sort by",
                              },
                              { value: "created-asc", label: "Newest" },
                              { value: "created-desc", label: "Latest" },
                              {
                                value: "price-asc",
                                label: "Price (low to high)",
                              },
                              {
                                value: "price-desc",
                                label: "Price (high to low)",
                              },
                            ]}
                            handleValueChange={(e: string) => {
                              rest?.setValue("sortBy", e);
                            }}
                            hideLabel={true}
                            value={rest?.formState?.defaultValues?.sortBy?.toString()}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-auto grid grid-cols-2 tMD:grid-cols-1 tSM:grid-cols-1 tSM:justify-center gap-[16px] p-[16px] overflow-scroll">
                      {productsFromAPI?.map((item: Product, idx: number) => (
                        <SlimProductCard
                          key={`product-slim-item-${idx + 1}`}
                          title={item?.name}
                          price={`R${item?.price}`}
                          isActive={activeProduct?.id === item?.id}
                          image={
                            (item?.imagesPostAdd &&
                              item?.imagesPostAdd[0]?.imageURL) ||
                            ""
                          }
                        >
                          <div
                            className="w-full h-full flex flex-row items-center"
                            onClick={() => handleCardClick(item)}
                          >
                            <MdEdit
                              className="w-[24px] h-[24px]"
                              fill={`#B4B4B4`}
                            />
                          </div>
                        </SlimProductCard>
                      ))}
                    </div>

                    {totalProductsInDBFromFIlter && (
                      <PaginationView
                        handleClick={(e: number) => {
                          setIsPaginationLocation(e);
                        }}
                        isPaginationLocation={isPaginationLocation}
                        limit={
                          totalProductsInDBFromFIlter / paginationTotalItems
                        }
                      />
                    )}
                  </div>
                )}

              {!isLoading && productsFromAPI?.length === 0 && (
                <div className="grow flex justify-center items-center pt-[80px]">
                  <CustomText
                    textLabel={
                      errorMessage ? errorMessage : "No products found"
                    }
                    fontWeight="font-regular"
                    fontSize="text-[20px] tSM2:text-[16px]"
                    fontColor={`text-black`}
                  />
                </div>
              )}
            </div>
          </form>
        </FormProvider>
        <div className="w-[50%] h-full block tSM:hidden">
          {!activeProduct && (
            <div className="grow pt-[40px] flex flex-col justify-center items-center">
              <CustomText
                textLabel={"No selected product to edit."}
                fontWeight="font-light"
                fontSize="text-[14px]"
                fontColor={`text-black`}
              />
              <CustomText
                textLabel={
                  "Choose product from the left side or add new product."
                }
                fontWeight="font-light"
                fontSize="text-[14px]"
                fontColor={`text-black`}
              />
            </div>
          )}
          {activeProduct && (
            <ProductPreview
              product={activeProduct}
              handleClear={() => setActiveProduct(undefined)}
              handleEdit={(e) => {
                setToEdit(true);
                setReadyToDelete(e);
              }}
              handleDelete={(e) => {
                setToDelete(true);
                setReadyToDelete(e);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
