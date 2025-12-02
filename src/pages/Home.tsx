import React, { useCallback, useEffect, useState } from "react";
import "../App.css";
import { MdChevronRight } from "react-icons/md";
import { FilterView, Header, ModalView, PaginationView } from "../components";
import { useNavigate } from "react-router-dom";
import { CustomText, SelectSmallField } from "../elements";
import { DefaultFile, type Product } from "../helpers/types";
import ProductCard from "../components/ProductCard";
import { FormProvider, useForm, type FieldErrors } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import type { FilterForm } from "../components/Views/FilterView";

export const getInStockOutput = (value: string) => {
  switch (value) {
    case "In stock":
      return true;
    case "Out of stock":
      return false;
    case "All":
      return null;
    default:
      return null;
  }
};

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

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [modalViewFilter, setModalViewFilter] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState<number>(0);
  const [productsFromAPI, setProductsFromAPI] = useState<Product[] | undefined>(
    undefined
  );
  const [isPaginationLocation, setIsPaginationLocation] = useState<number>(1);
  const paginationTotalItems = 4;
  const [totalProductsInDBFromFIlter, setTotalProductsInDBFromFIlter] =
    useState<number | undefined>(undefined);

  const [filterObject, setFilterObject] = useState<FilterForm>({
    searchString: undefined,
    availability: undefined,
    brands: undefined,
    currency: undefined,
    priceMin: undefined,
    priceMax: undefined,
  });

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
              brands:
                (filterObject?.brands && filterObject?.brands?.length > 0
                  ? filterObject?.brands
                  : null) || null,
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
              //setErrorMessage("Oops, something went wrong");
            }
          });
        });
      } catch (error) {
        console.log(`Error: `, error);
        setIsLoading(false);
      }
    },
    [isPaginationLocation, paginationTotalItems]
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

  return (
    <div className="w-full h-auto bg-white flex flex-col items-center p-[48px] gap-y-[32px] tSM:gap-y-[20px] tSM:p-[24px] mLG:p-[16px] mMD:p-0">
      <ModalView
        show={modalViewFilter}
        handleClose={() => setModalViewFilter(false)}
      >
        <FilterView
          customStyle="tSM2:w-dvw tSM2:h-dvh"
          handleClose={() => setModalViewFilter(false)}
          handleFilter={(e) => {
            setFilterObject(e);
            setIsPaginationLocation(1);
          }}
          defaultState={filterObject}
        />
      </ModalView>

      <div className="w-full h-auto mMD:p-[16px]">
        <Header label={"Catalog Explorer"} />
      </div>

      <div className="w-full h-auto flex flex-row">
        <FilterView
          handleClose={() => null}
          customStyle="tMD:hidden"
          handleFilter={(e) => {
            setFilterObject(e);
            setIsPaginationLocation(1);
          }}
          defaultState={filterObject}
        />

        <div className="grow h-auto">
          <FormProvider control={control} handleSubmit={handleSubmit} {...rest}>
            <form
              onSubmit={handleSubmit(customHandleSubmit, onError)}
              className="w-full h-auto flex flex-col"
            >
              <div className="w-full h-auto hidden flex-row gap-x-4 tMD:flex tMD:justify-between p-[16px] mMD:py-[10px] bg-[#F8FCFF] items-cente mMD:p-[16px]">
                <div
                  className="w-auto h-auto flex-row items-center active:scale-[1.02] hover:scale-[1.06] cursor-pointer rounded-full gap-x-[24px] py-[4px] px-[10px] border-solid border-[1px] border-[#D3D3D3] flex bg-white"
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
                <div className="w-auto h-auto flex flex-row items-center gap-x-[20px] tSM2:gap-x-[4px]">
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
                      { value: "price-desc", label: "Price (high to low)" },
                    ]}
                    handleValueChange={(e: string) => {
                      rest?.setValue("sortBy", e);
                    }}
                    hideLabel={true}
                    value={rest?.formState?.defaultValues?.sortBy?.toString()}
                  />
                </div>
              </div>

              {isLoading && (
                <div className="grow flex justify-center items-center pt-[80px]">
                  <CustomText
                    textLabel={"Loading products ..."}
                    fontWeight="font-medium"
                    fontSize="text-[20px] tSM2:text-[16px]"
                    fontColor={`text-black`}
                  />
                </div>
              )}

              {!isLoading &&
                productsFromAPI?.length !== 0 &&
                productsFromAPI && (
                  <div className="w-full h-auto flex flex-col">
                    <div className="w-full h-auto bg-[#F8FCFF] flex flex-row justify-between p-[16px] tMD:justify-center tSM2:px-[12px] mMD:py-[10px] mMD:pt-[2px]">
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
                        fontSize="text-[18px] tSM2:text-[16px] mMD:p-[14px]"
                        fontColor={`text-black`}
                      />

                      <div className="w-auto h-auto flex flex-row items-center gap-x-[20px] tSM2:gap-x-[4px]  tMD:hidden">
                        <div className="w-auto h-auto flex flex-row items-center gap-x-[20px] tSM2:gap-x-[4px]">
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

                    <div className="w-full h-auto flex flex-wrap justify-center mLG:grid mLG:grid-cols-2 gap-6 p-[16px] mLG:p-[8px] tMD:gap-[16px]  mMD:p-[16px]">
                      {productsFromAPI?.map((item: Product, idx: number) => (
                        <ProductCard
                          key={`product-item-${idx + 1}`}
                          title={item?.name}
                          price={`R${item?.price}`}
                          inStock={item?.inStock as boolean}
                          year={`${
                            item?.rating
                          }(${item?.reviewCount?.toString()})`}
                          image={
                            item?.imagesPostAdd
                              ? item?.imagesPostAdd[0]?.imageURL
                              : ""
                          }
                          handleIconClick={() => {
                            console.log(`FilterView`);
                          }}
                          handleButtonClick={() =>
                            navigate(`/product/${item?.id}`)
                          }
                        />
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
                    textLabel={"No products found"}
                    fontWeight="font-medium"
                    fontSize="text-[20px] tSM2:text-[16px]"
                    fontColor={`text-black`}
                  />
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
      <div className="w-full h-auto flex flex-row justify-center gap-x-[48px] mMD:gap-x-0 mMD:justify-between items-center bg-[#F8FCFF] p-[16px]">
        <CustomText
          textLabel={"Admin operations only!"}
          fontWeight="font-regular"
          fontSize="text-[16px] mMD:text-[14px]"
          fontColor={`text-black`}
        />
        <div
          className="w-auto h-auto flex flex-row items-center active:scale-[1.02] hover:scale-[1.06] cursor-pointer rounded-full gap-x-[24px] py-[6px] px-[12px] border-[1.5px] border-[#D3D3D3] bg-white"
          onClick={() => {
            navigate("/admin/inventory");
          }}
        >
          <CustomText
            textLabel={"Manage site"}
            fontWeight="font-regular"
            fontSize="text-[16px] mMD:text-[14px]"
            fontColor={`text-black`}
          />
          <MdChevronRight
            className="w-[24px] h-[24px]"
            onClick={() => null}
            fill="#000000"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
