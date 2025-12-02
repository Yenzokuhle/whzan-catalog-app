import { useCallback, useEffect, useState } from "react";
import {
  CustomText,
  FilterItemButton,
  IconButton,
  PrimaryButton,
  SelectInputField,
  TextInputFieldFilter,
} from "../../elements";
import { IoMdClose } from "react-icons/io";
import {
  Controller,
  FormProvider,
  useForm,
  type FieldErrors,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { BUTTON_TYPES } from "../../helpers/types";

export const FilterFormValidation = Yup.object().shape({});

type DataResponse = {
  isSuccess: boolean;
  data: string[];
  message: string;
};

export type SelectItem = {
  name: string;
  label: string;
};

export type FilterForm = {
  searchString?: string;
  availability?: string;
  brands?: string[];
  currency?: string;
  priceMin?: number;
  priceMax?: number;
};

const FilterFormDefaultValues: FilterForm = {
  searchString: "",
  availability: "",
  brands: [],
  currency: "",
  priceMin: 0,
  priceMax: 0,
};

type FilterViewProps = {
  customStyle: string;
  handleClose: () => void;
  handleFilter: (e: FilterForm) => void;
  defaultState?: FilterForm;
};

export const FilterView: React.FC<FilterViewProps> = ({
  customStyle,
  handleClose,
  handleFilter,
  defaultState,
}: FilterViewProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [brandsFromAPI, setBrandsFromAPI] = useState<SelectItem[] | undefined>(
    undefined
  );

  const { control, handleSubmit, reset, ...rest } = useForm<FilterForm>({
    resolver: yupResolver(FilterFormValidation),
    defaultValues: FilterFormDefaultValues,
  });

  const customHandleSubmit = async (
    dataResults: FilterForm,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    handleFilter(dataResults);
    handleClose();
  };

  const onError = (errors: FieldErrors<FilterForm>) => {
    console.warn(errors);
  };

  const handleDeleteItem = useCallback(
    (item: string, setFn: (e?: string[]) => void, values?: string[]) => {
      const newArray = values?.filter(
        (product) => product?.toLocaleLowerCase() !== item?.toLocaleLowerCase()
      );
      setFn(newArray);
    },
    []
  );

  const handleAddItem = useCallback(
    (
      item: string,
      values: string[] | undefined,
      setFn: (e?: string[]) => void
    ) => {
      const newArray = values ? [...values] : [];
      newArray?.push(item);
      setFn(newArray);
    },
    []
  );

  const handleGetAllBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/GetAllBrands`,
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
          if (data?.isSuccess && data?.data) {
            const arraryBrands: SelectItem[] = data?.data?.map((item) => {
              return {
                name: `${item}`,
                label: `${item}`,
              };
            });
            setBrandsFromAPI(arraryBrands);
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
    if (!brandsFromAPI) {
      handleGetAllBrands();
    }
  }, [brandsFromAPI]);

  useEffect(() => {
    reset({
      searchString: defaultState?.searchString,
      availability: defaultState?.availability,
      brands: defaultState?.brands,
      currency: defaultState?.currency,
      priceMin: defaultState?.priceMin,
      priceMax: defaultState?.priceMax,
    });
  }, [defaultState, reset]);

  return (
    <div
      className={`w-[28%] h-full bg-[#F8FCFF] tLG:w-[35%] flex flex-col gap-y-[20px] p-[20px] pt-[12px] ${customStyle} ${
        location?.pathname?.includes("/admin/inventory")
          ? "absolute top-0 left-0 tSM2:w-[80%] mLG:w-full"
          : ""
      }`}
    >
      <div
        className={`w-full h-auto flex-row items-center justify-between tMD:flex ${
          location?.pathname?.includes("/admin/inventory") ? "flex" : "hidden"
        }`}
      >
        <CustomText
          textLabel={"Filter results"}
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

      <FormProvider
        control={control}
        reset={reset}
        handleSubmit={handleSubmit}
        {...rest}
      >
        <form
          onSubmit={handleSubmit(customHandleSubmit, onError)}
          className="w-full h-auto flex flex-col gap-y-[20px]"
        >
          <div className="w-full h-auto flex flex-col gap-y-4">
            <CustomText
              textLabel={"Filter results"}
              fontWeight="font-regular"
              fontSize="text-[18px]"
              fontColor={`text-black`}
              customClass={`tSM2:hidden ${
                location?.pathname?.includes("/admin/inventory") ? "hidden" : ""
              }`}
            />

            <div className="w-full h-auto self-start">
              <TextInputFieldFilter
                name={"searchString"}
                label={"Search products"}
                type={"string"}
                handleIconClick={() => null}
              />
            </div>
          </div>

          <div className="w-full h-auto border-solid border-b-[1.5px] border-[#E2E2E2] pb-[16px] flex flex-col gap-y-[14px]">
            <CustomText
              textLabel={"Availability"}
              fontWeight="font-regular"
              fontSize="text-[18px]"
              fontColor={`text-[#101042]`}
            />

            <div className="w-full h-auto flex flex-row gap-x-[10px]">
              {["In stock", "Out of stock", "All"]?.map(
                (item: string, idx: number) => (
                  <Controller
                    key={`availability-form-item-${idx + 1}`}
                    control={control}
                    name={"availability"}
                    render={({ field: { onChange, value } }) => (
                      <FilterItemButton
                        width={"w-auto"}
                        key={`filter-button-item-${idx + 1}`}
                        isActive={
                          item?.toLocaleLowerCase() ===
                          value?.toLocaleLowerCase()
                        }
                        countLabel={"1"}
                        label={item}
                        handleClick={() => {
                          if (value === item) {
                            onChange(undefined);
                          } else {
                            onChange(item);
                          }
                        }}
                      />
                    )}
                  />
                )
              )}
            </div>
          </div>
          <div className="w-full h-auto border-solid border-b-[1.5px] border-[#E2E2E2] pb-[16px] flex flex-col gap-y-[14px]">
            <CustomText
              textLabel={"Brands"}
              fontWeight="font-regular"
              fontSize="text-[18px]"
              fontColor={`text-[#101042]`}
            />

            {!isLoading && brandsFromAPI && (
              <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
                {brandsFromAPI?.map((item: SelectItem, idx: number) => (
                  <Controller
                    key={`brands-form-item-${idx + 1}`}
                    control={control}
                    name={"brands"}
                    render={({ field: { onChange, value } }) => (
                      <div
                        className="w-auto h-auto"
                        key={`brand-item-${idx + 1}`}
                      >
                        <FilterItemButton
                          width={"w-auto"}
                          isActive={_.includes(
                            value?.toLocaleString(),
                            item?.name?.toLocaleString()
                          )}
                          countLabel={"2"}
                          label={item?.name}
                          handleClick={() => {
                            if (_.includes(value, item?.name)) {
                              console.log(`Got here: 1`);

                              handleDeleteItem(item?.name, onChange, value);
                            } else {
                              console.log(`Got here: 2`);
                              handleAddItem(item?.name, value, onChange);
                            }
                          }}
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            )}
            {isLoading && (
              <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
                <CustomText
                  textLabel={"Loading brands ..."}
                  fontWeight="font-regular"
                  fontSize="text-[16px] mMD:text-[14px]"
                  fontColor={`text-[#616161]`}
                />
              </div>
            )}
            {!isLoading && !brandsFromAPI && (
              <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
                <CustomText
                  textLabel={"No brands exist yet"}
                  fontWeight="font-regular"
                  fontSize="text-[16px] mMD:text-[14px]"
                  fontColor={`text-[#101042]`}
                />
              </div>
            )}
          </div>

          <div className="w-full h-auto border-solid border-b-[1.5px] border-[#E2E2E2] pb-[16px] flex flex-col gap-y-[14px]">
            <CustomText
              textLabel={"Currency"}
              fontWeight="font-regular"
              fontSize="text-[18px]"
              fontColor={`text-[#101042]`}
            />

            <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
              {[
                { name: "Rands", label: "Rand(R)" },
                { name: "USD", label: "USDollar ($)" },
                { name: "Pound", label: "Pound (£)" },
                { name: "Euro", label: "Euro (¢)" },
              ]?.map((item: { name: string; label: string }, idx: number) => (
                <Controller
                  key={`currency-form-item-${idx + 1}`}
                  control={control}
                  name={"currency"}
                  render={({ field: { onChange, value } }) => (
                    <div
                      className="w-[120px] h-auto"
                      key={`filter-currency-item-${idx + 1}`}
                    >
                      <FilterItemButton
                        width={"w-auto"}
                        isActive={item?.name == value}
                        countLabel={"3"}
                        label={item?.label}
                        handleClick={() => {
                          if (value === item?.name) {
                            onChange(undefined);
                          } else {
                            onChange(item?.name);
                          }
                        }}
                      />
                    </div>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="w-full h-auto pb-[16px] flex flex-col gap-y-[14px]">
            <CustomText
              textLabel={"Price"}
              fontWeight="font-regular"
              fontSize="text-[20px]"
              fontColor={`text-[#101042]`}
            />

            <div className="w-full h-[24px] flex flex-row gap-x-[10px] justify-between">
              <div className="min-w-[100px] h-auto">
                <SelectInputField
                  name={"priceMin"}
                  label={"Min price"}
                  listItem={[
                    { value: "", label: "Min" },
                    { value: "400", label: "400" },
                    { value: "600", label: "400" },
                    { value: "800", label: "800" },
                    { value: "1000", label: "1000" },
                    { value: "1200", label: "1200" },
                    { value: "1400", label: "1400" },
                  ]}
                  handleValueChange={(e: string) => {
                    rest?.setValue("priceMin", parseInt(e));
                  }}
                  value={rest?.formState?.defaultValues?.priceMin?.toString()}
                />
              </div>

              <div className="min-w-[100px] h-auto">
                <SelectInputField
                  name={"priceMax"}
                  label={"priceMax"}
                  listItem={[
                    { value: "", label: "Max" },
                    { value: "2500", label: "2500" },
                    { value: "3000", label: "3000" },
                    { value: "4000", label: "4000" },
                    { value: "5000", label: "5000" },
                    { value: "6000", label: "6000" },
                    { value: "7000", label: "7000" },
                  ]}
                  handleValueChange={(e: string) => {
                    rest?.setValue("priceMax", parseInt(e));
                  }}
                  value={rest?.formState?.defaultValues?.priceMax?.toString()}
                />
              </div>
            </div>
          </div>

          <div className="w-full h-auto flex flex-row justify-between pt-[16px] tSM2:pt-[12px]">
            <PrimaryButton
              label={"Continue"}
              type={BUTTON_TYPES.submit}
              buttonType={"secondary"}
              handleClick={() => null}
              isValid={true}
            />

            <PrimaryButton
              label={"Clear all"}
              buttonType={"clear"}
              handleClick={() =>
                reset({
                  searchString: undefined,
                  availability: undefined,
                  brands: [],
                  currency: undefined,
                  priceMin: undefined,
                  priceMax: undefined,
                })
              }
              isValid={true}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default FilterView;
