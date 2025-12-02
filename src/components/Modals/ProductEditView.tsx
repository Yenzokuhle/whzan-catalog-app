import { useCallback, useEffect, useState, type FC } from "react";
import * as Yup from "yup";
import _, { values } from "lodash";
import { mixed } from "yup";
import {
  CustomText,
  IconButton,
  PrimaryButton,
  TextInputField,
  LongTextInputField,
  SelectInputField,
  ImageButtonLong,
} from "../../elements";
import { IoMdClose } from "react-icons/io";
import { GoTrash } from "react-icons/go";

import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  BUTTON_TYPES,
  DefaultFile,
  type Product,
  type SelectChild,
} from "../../helpers/types";
import { IoAdd } from "react-icons/io5";
import NewProductPreview from "../Views/NewProductPreview";
import SlimImageCard from "../SlimImageCard";

const tagsSchema = Yup.object().shape({
  value: Yup.string().required("Tag name is required"),
});

const postAddImagesSchema = Yup.object().shape({
  id: Yup.string().required("Id name is required"),
  imageURL: Yup.string().required("ImageURL name is required"),
});

const itemImageSchema = Yup.object().shape({
  value: mixed<File>().required("Image is required"),
});

const ProductItemValidation = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description description is required"),
  brand: Yup.string().required("Brand name is required"),
  tags: Yup.array().of(tagsSchema).required("Tags list is required"),
  imagesPostAdd: Yup.array()
    .of(postAddImagesSchema)
    .required("Images post add list is required"),
  price: Yup.number()
    .positive("Price must be greater than 0")
    .required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  rating: Yup.number().required("Rating is required"),
  reviewCount: Yup.number().required("Review count is required"),
  images: Yup.array()
    .of(itemImageSchema)
    .test("required", "You need to provide the product image", (files) => {
      const resArray = files?.map((file) => {
        if (file?.value?.name !== "") {
          return true;
        }
        return false;
      });

      if (!_.includes(resArray, false)) {
        return true;
      }
      return false;
    })
    .required("A minimum of 1 image is required"),
});

// type Product = {
//   id?: string;
//   productId?: string;
//   name: string;
//   price: number;
//   currency: string;
//   rating: number;
//   reviewCount: number;
//   description: string;
//   brand: string;
//   tags: Array<{ value: string; name?: string }>;
//   customTag?: string;
//   inStock?: boolean;
//   images: Value[];
//   imagePreAdd?: Value[];
//   customBrand?: string;
// };

const WelcomePageDefaultValues: Product = {
  name: "",
  description: "",
  price: 0,
  currency: "",
  rating: 0,
  reviewCount: 0,
  brand: "",
  tags: [],
  customTag: "",
  inStock: false,
  customBrand: "",
  imagesPostAdd: [{ id: "", imageURL: "" }],
  images: [
    { value: DefaultFile },
    { value: DefaultFile },
    { value: DefaultFile },
    { value: DefaultFile },
  ],
};

type ProductEditViewProps = {
  isUpdate: boolean;
  handleCloseButton: () => void;
  activeProduct?: Product;
  handleUpdate?: (e: Product) => void;
};
type DataResponse = {
  message: string;
  isSuccess: boolean;
  data: Product;
};

type DataBrandsResponse = {
  isSuccess: boolean;
  data: string[];
  message: string;
};

const ProductEditView: FC<ProductEditViewProps> = ({
  isUpdate,
  handleCloseButton,
  activeProduct,
  handleUpdate,
}: ProductEditViewProps) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  if (isUpdate) {
    console.log(`Active one: `, activeProduct);
  }
  // const [errorMessages, setErrorMessages] = useState<object | undefined>(
  //   undefined
  // );
  //const [productFromApi, ] = useState<Product | undefined>();
  const [isToggleState, setIsToggle] = useState<boolean | undefined>(true);

  //const [isLoadingBrands, setIsLoadingBrands] = useState<boolean>(false);
  const [brandsFromAPI, setBrandsFromAPI] = useState<SelectChild[] | undefined>(
    undefined
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState,
    formState: { defaultValues, isValid },
    trigger,
    ...rest
  } = useForm<Product>({
    resolver: yupResolver(ProductItemValidation),
    defaultValues: WelcomePageDefaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "tags", // unique name for your Field Array
    control, // control props comes from useForm (optional: if you are using FormProvider)
  });

  const {
    fields: imagesFields,
    update: updateImages,
    // remove: removeImages,
  } = useFieldArray({
    control,
    name: "images",
  });

  // console.log(`WATCH.  imagesFields: `, watch("images"));

  const [, setSelectedImage] = useState<string | undefined>();
  const [newProductID, setNewProductID] = useState<number | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        res.json().then(async (data: DataBrandsResponse) => {
          setIsLoading(false);
          if (data?.isSuccess && data?.data) {
            const arraryBrands = data?.data?.map((item) => {
              return {
                value: `${item}`,
                label: `${item}`,
              };
            });
            arraryBrands.unshift({
              value: `select brand`,
              label: `Select brand`,
            });
            arraryBrands.push({
              value: `other`,
              label: `Other`,
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

  const handleCreateItem = useCallback(async (dataResults: Product) => {
    const payloadInput = {
      // id: parseInt(activeProduct?.id || "0"),
      name: dataResults?.name,
      description: dataResults?.description,
      brand:
        dataResults?.brand?.toLowerCase() === "other"
          ? dataResults?.customBrand
          : dataResults?.brand,
      inStock: dataResults?.inStock,
      // images: activeProduct?.images,
      price: dataResults?.price,
      currency: dataResults?.currency,
      rating: dataResults?.rating,
      reviewCount: dataResults?.reviewCount,
      tags: dataResults?.tags?.map((item) => {
        return {
          ...item,
          name: item?.value,
        };
      }),
    };

    try {
      setIsLoading(true);
      await fetch(`${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/Add`, {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(payloadInput),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        res.json().then(async (data: DataResponse) => {
          if (data?.isSuccess) {
            await Promise.all(
              dataResults?.images &&
                dataResults?.images.map(async (item) => {
                  await handleCreateImage(
                    data?.data?.productId || "",
                    item?.value
                  );
                })
            );

            console.log(
              `Object.keys(formState?.errors).length: `,
              Object.keys(formState?.errors).length
            );

            if (Object.keys(formState?.errors).length === 0) {
              setNewProductID(parseInt(data?.data?.productId || "0"));
              console.log(`ALL GOOD`, formState?.errors, 1);

              setIsToggle(undefined);
            } else {
              console.log(`ALL BAD`, formState?.errors, 2);
              setErrorMessage(data?.message || "Error uploading images");
            }
            console.log(`ALL BAD`, formState?.errors, 3);

            setIsLoading(false);
          } else {
            setErrorMessage("Oops, something went wrong");
            setIsLoading(false);
          }
        });
      });
    } catch (error) {
      console.warn(`Error: `, error);
      setIsLoading(false);
      setErrorMessage(error as unknown as string);
    }
  }, []);

  const handleCreateImage = useCallback(
    async (productId: string, selectImage: File) => {
      const form = new FormData();
      form.append("ProductId", productId);
      form.append("BookImage", selectImage);

      try {
        setIsLoading(true);
        await fetch(
          `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/UploadImage`,
          {
            method: "POST",
            mode: "cors",
            body: form,
          }
        ).then((res) => {
          res.json().then(async (data: DataResponse) => {
            // console.log(`DATA: `, data);

            if (data?.isSuccess && data?.data) {
              // setProductFromApi(data?.data);
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
    []
  );

  const handleUpdateItem = useCallback(async (dataResults: Product) => {
    const payloadInput = {
      id: dataResults?.id,
      name: dataResults?.name,
      description: dataResults?.description,
      brand: dataResults?.brand,
      inStock: dataResults?.inStock,
      price: dataResults?.price,
      currency: dataResults?.currency,
      rating: dataResults?.rating,
      reviewCount: dataResults?.reviewCount,
      tags: dataResults?.tags?.map((item) => {
        return {
          ...item,
          name: item?.value || item?.name,
        };
      }),
    };

    console.log(`Here: `, payloadInput);

    try {
      setIsLoading(true);
      await fetch(
        `${import.meta.env.VITE_PUBLIC_API_HOST}/api/Product/Update`,
        {
          method: "PATCH",
          body: JSON.stringify(payloadInput),
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => {
        res.json().then(async (data: DataResponse) => {
          if (data?.isSuccess) {
            if (handleUpdate) {
              handleUpdate(dataResults);
              handleCloseButton();
            }
          } else {
            setErrorMessage("Oops, something went wrong");
            setIsLoading(false);
          }
        });
      });
    } catch (error) {
      console.log(`Error: `, error);
      setIsLoading(false);
    }
  }, []);

  const customHandleSubmit = async (
    dataResults: Product,
    e?: React.BaseSyntheticEvent
  ) => {
    e?.preventDefault();
    setIsLoading(true);

    if (!isUpdate) {
      handleCreateItem(dataResults);
    } else {
      handleUpdateItem(dataResults);
    }
  };

  // eslint-disable-next-line
  const onError = (errors: any) => {
    //setErrorMessages(errors);
    console.warn("Submitting onError: ", errors);
  };

  useEffect(() => {
    if (!brandsFromAPI) {
      handleGetAllBrands();
    }
  }, [brandsFromAPI]);

  useEffect(() => {
    reset({
      name: activeProduct?.name,
      description: activeProduct?.description,
      brand: activeProduct?.brand,
      inStock: activeProduct?.inStock,
      images: activeProduct?.images,
      price: activeProduct?.price,
      currency: activeProduct?.currency,
      rating: activeProduct?.rating,
      reviewCount: activeProduct?.reviewCount,
      tags: activeProduct?.tags,
    });

    if (activeProduct) {
      setNewProductID(parseInt(activeProduct?.id || ""));
      //setSelectedImage(activeProduct?.image);
      setValue("brand", activeProduct?.brand);
    } else {
      console.log(`Got in here`);

      setValue("imagesPostAdd", [
        { id: "0", imageURL: "" },
        { id: "1", imageURL: "" },
        { id: "2", imageURL: "" },
        { id: "3", imageURL: "" },
      ]);
    }
  }, [activeProduct, reset, setSelectedImage, setValue]);
  console.log(`imagesFields: `, imagesFields);
  console.log(`imagesSimplified: `, activeProduct?.imagesPostAdd);

  return (
    <div className="w-[500px] tSM2:w-[400px] mLG:w-dvw h-screen flex flex-col justify-between gap-y-4 bg-white overflow-hidden pt-[24px] mLG:py-[16px] relative tSM2:pt-[20px] mMD:pt-[18px]">
      <div className="grow h-auto bg-whzan-primary flex flex-row justify-between px-[20px] py-[16px] rounded-r-full mr-[20px] mLG:mr-[16px]">
        <CustomText
          textLabel={isUpdate ? "Update product" : "Create new product"}
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
      <div className="h-full flex flex-col gap-y-[10px] overflow-scroll px-[24px] pb-[24px] tSM2:px-[20px] tSM2:pb-[20px] mMD:px-[16px] mMD:pb-[16px]">
        <div className="tSM2:h-fit flex h-auto w-fit flex-row items-center justify-center rounded-full bg-[#f0f0f0] self-center">
          <div
            onClick={() => {
              setIsToggle(true);
            }}
            className={`tSM:text-[12px] h-auto w-[100px] text-[16px] text-black ${
              isToggleState ? "bg-[#FFBE00]" : ""
            } font-regular font-poppins tSM:px-3 mMD:px-2 cursor-pointer rounded-full px-4 py-1 text-center hover:bg-[#FFBE00] active:scale-[1.02]`}
          >{`Details`}</div>

          <div
            onClick={() => {
              setIsToggle(false);
            }}
            className={`tSM:text-[12px] h-auto w-[100px] text-[16px] text-black ${
              isToggleState === false ? "bg-[#FFBE00]" : ""
            } font-regular font-poppins tSM:px-3 mMD:px-2 cursor-pointer rounded-full px-4 py-1 text-center hover:bg-[#FFBE00] active:scale-[1.02]`}
          >{`Images`}</div>

          <div
            onClick={() => {
              if (newProductID) {
                setIsToggle(undefined);
              } else {
                trigger();
              }
            }}
            className={`tSM:text-[12px] h-auto w-[100px] text-[16px] text-black ${
              isToggleState == undefined ? "bg-[#FFBE00]" : ""
            } font-regular font-poppins tSM:px-3 mMD:px-2 cursor-pointer rounded-full px-4 py-1 text-center hover:bg-[#FFBE00] active:scale-[1.02]`}
          >{`Preview`}</div>
        </div>
        <div className="w-full h-auto flex flex-row pt-[16px]">
          {
            <FormProvider
              control={control}
              handleSubmit={handleSubmit}
              reset={reset}
              watch={watch}
              setValue={setValue}
              trigger={trigger}
              formState={formState}
              {...rest}
            >
              <form
                onSubmit={handleSubmit(customHandleSubmit, onError)}
                className="w-full h-full flex flex-row justify-center"
              >
                {isToggleState === false && (
                  <div className="w-full h-auto  flex flex-col gap-y-[16px]">
                    <div className="w-full h-auto flex flex-col gap-y-[10px]">
                      {!isUpdate &&
                        imagesFields?.map((_item: object, idx: number) => {
                          return (
                            <Controller
                              key={`images-fields-${idx + 1}`}
                              control={control}
                              name={`images.${idx}`}
                              render={({ field: { onChange } }) => {
                                if ("imageURL" in _item) {
                                  return (
                                    <SlimImageCard
                                      title={`Image ${idx + 1}`}
                                      image={_item?.imageURL as string}
                                      handleDelete={() => {
                                        console.log(`CLICKED`);
                                      }}
                                    />
                                  );
                                }

                                return (
                                  <ImageButtonLong
                                    key={`choose-image-${idx + 1}`}
                                    handleImageChange={onChange}
                                    name={"image"}
                                    count={idx + 1}
                                    handleDelete={() =>
                                      updateImages(idx, { value: DefaultFile })
                                    }
                                  />
                                );
                              }}
                            />
                          );
                        })}

                      {isUpdate &&
                        activeProduct?.imagesPostAdd?.map(
                          (_item: object, idx: number) => {
                            return (
                              <Controller
                                key={`images-fields-${idx + 1}`}
                                control={control}
                                name={`images.${idx}`}
                                render={({ field: { onChange } }) => {
                                  if ("imageURL" in _item) {
                                    return (
                                      <SlimImageCard
                                        title={`Image ${idx + 1}`}
                                        image={_item?.imageURL as string}
                                        handleDelete={() => {
                                          console.log(`CLICKED`);
                                        }}
                                      />
                                    );
                                  }

                                  return (
                                    <ImageButtonLong
                                      key={`choose-image-${idx + 1}`}
                                      handleImageChange={onChange}
                                      name={"image"}
                                      count={idx + 1}
                                      handleDelete={() =>
                                        updateImages(idx, {
                                          value: DefaultFile,
                                        })
                                      }
                                    />
                                  );
                                }}
                              />
                            );
                          }
                        )}

                      <div className="w-full h-auto pt-[24px] flex flex-row justify-center">
                        {isLoading ? (
                          <CustomText
                            textLabel={"Loading ..."}
                            fontWeight="font-medium"
                            fontSize="text-[20px] tSM2:text-[16px]"
                            fontColor={`text-black`}
                          />
                        ) : (
                          <PrimaryButton
                            label={"Continue"}
                            type={BUTTON_TYPES.submit}
                            buttonType={"secondary"}
                            handleClick={() => null}
                            isValid={isValid}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {isToggleState === undefined && (
                  <NewProductPreview
                    handleCloseButton={handleCloseButton}
                    productId={newProductID || 0}
                    isUpdate={isUpdate}
                  />
                )}
                <div
                  className={`w-full h-full ${
                    isToggleState ? "flex" : "hidden"
                  } flex-col gap-y-8 justify-center`}
                >
                  <div className="w-full h-full flex flex-col justify-between">
                    <div className="w-full h-auto flex flex-col gap-y-6">
                      <div className="w-full h-auto self-start">
                        <TextInputField
                          name={"name"}
                          label={"Product title"}
                          placeholder="Product title"
                          type={"string"}
                          hideLabel={false}
                          value={defaultValues?.name}
                        />
                      </div>
                      <div className="w-full h-auto self-start">
                        <LongTextInputField
                          name={"description"}
                          label={"Description"}
                          placeholder={"Enter product description here"}
                          type={"text"}
                          hideLabel={false}
                          value={defaultValues?.description}
                        />
                      </div>
                      <div className="w-full h-auto flex flex-row gap-x-[20px] tSM2:gap-x-[10px]">
                        <TextInputField
                          name={"price"}
                          label={"Price"}
                          type={"text"}
                          hideLabel={false}
                          value={defaultValues?.price?.toLocaleString()}
                        />

                        <SelectInputField
                          name={"currency"}
                          label={"Currency"}
                          listItem={[
                            {
                              value: "select currency",
                              label: "Select currency",
                            },
                            { value: "usd", label: "USDollar ($)" },
                            { value: "rand", label: "Rand(R)" },
                            {
                              value: "pound sterling",
                              label: "Pound (£)",
                            },
                            { value: "euro", label: "Euro (¢)" },
                            { value: "other", label: "Other" },
                          ]}
                          handleValueChange={(e: string) => {
                            setValue("currency", e);
                          }}
                          hideLabel={false}
                          value={defaultValues?.currency}
                        />
                      </div>
                      <div className="w-full h-auto flex flex-row gap-x-[20px] tSM2:gap-x-[10px]">
                        <TextInputField
                          name={"rating"}
                          label={"Rating"}
                          placeholder="Rating"
                          type={"text"}
                          hideLabel={false}
                          value={defaultValues?.rating?.toLocaleString()}
                        />

                        <TextInputField
                          name={"reviewCount"}
                          label={"Review count"}
                          placeholder={"Review count"}
                          type={"text"}
                          hideLabel={false}
                          value={defaultValues?.reviewCount?.toLocaleString()}
                        />
                      </div>
                      <div className="w-full h-auto flex flex-row justify-between items-center">
                        <div className="w-auto h-auto flex flex-row items-center gap-x-[8px] tSM2:gap-x-[4px]">
                          <CustomText
                            textLabel={"Brands"}
                            fontWeight="font-regular"
                            fontSize="text-[20px] tSM2:text-[18px] mMD:text-[14px]"
                            fontColor={`text-black`}
                          />
                        </div>
                        <div className="min-w-[180px] h-auto">
                          {isLoading && (
                            <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
                              <CustomText
                                textLabel={"Loading brands ..."}
                                fontWeight="font-regular"
                                fontSize="text-[16px]"
                                fontColor={`text-[#616161]`}
                              />
                            </div>
                          )}

                          {!isLoading && !brandsFromAPI && (
                            <div className="w-full h-auto flex flex-row gap-x-[10px] overflow-x-scroll">
                              <CustomText
                                textLabel={"No brands exist yet"}
                                fontWeight="font-regular"
                                fontSize="text-[20px]"
                                fontColor={`text-[#101042]`}
                              />
                            </div>
                          )}

                          {!isLoading && brandsFromAPI?.length && (
                            <SelectInputField
                              name={"brand"}
                              label={"Brand"}
                              listItem={brandsFromAPI}
                              handleValueChange={(e: string) => {
                                setValue("brand", e);
                              }}
                              value={defaultValues?.brand}
                            />
                          )}
                        </div>
                      </div>
                      <Controller
                        control={control}
                        name={"brand"}
                        render={({ field: { value } }) => {
                          return value == "other" ? (
                            <div className="w-full h-[40px] flex flex-row justify-between items-center bg-[#F8FCFF]">
                              <CustomText
                                textLabel={"Type in custom brand"}
                                fontWeight="font-regular"
                                fontSize="text-[18px] tSM2:text-[16px] mMD:text-[14px]"
                                fontColor={`text-[#7e7e7e]`}
                              />
                              <div className="w-[50%]">
                                <TextInputField
                                  name={"customBrand"}
                                  label={"Custom brand"}
                                  type={"string"}
                                  hideLabel={true}
                                  value={activeProduct?.customTag?.toString()}
                                />
                              </div>
                            </div>
                          ) : (
                            <></>
                          );
                        }}
                      />

                      <div className="w-full h-auto flex flex-row justify-between items-center">
                        <CustomText
                          textLabel={"Tags"}
                          fontWeight="font-regular"
                          fontSize="text-[20px] tSM2:text-[18px] mMD:text-[14px]"
                          fontColor={`text-black`}
                        />
                        <div className="w-[70%] h-auto flex flex-row gap-x-[8px] tSM2:gap-x-[4px] justify-end items-center">
                          <div className="w-[70%]">
                            <TextInputField
                              name={"customTag"}
                              label={"Custom tag"}
                              type={"string"}
                              hideLabel={true}
                              value={activeProduct?.customTag?.toString()}
                            />
                          </div>

                          <IconButton
                            isNegative={false}
                            handleClick={() => {
                              if (watch("customTag")) {
                                append({
                                  value: rest?.getValues("customTag") || "",
                                });
                                setValue("customTag", "");
                              } else {
                                console.log(`Theres none`);
                              }
                            }}
                          >
                            <IoAdd
                              className="w-[24px] h-[24px] mMD:w-[22px] mMD:h-[22px]"
                              onClick={() => {}}
                              fill="#black"
                            />
                          </IconButton>
                        </div>
                      </div>
                      <div className="w-full h-auto flex flex-row gap-x-[8px] p-[12px] overflow-scroll bg-[#F8FCFF]">
                        {fields?.map((item, idx: number) => (
                          <div
                            key={`tag-item-${idx + 1}`}
                            className="w-fit h-auto px-[12px] pr-[4px] tSM2:px-[8px] flex flex-row items-center border-solid border-[1.5px] border-[#DDDDDD] rounded-2xl bg-white gap-x-[12px] active:scale-[1.06] hover:scale-[1.02]"
                          >
                            <CustomText
                              textLabel={item?.name || item?.value}
                              fontWeight="font-regular"
                              fontSize="text-[16px] mMD:text-[14px] mSM:text-[12px]"
                              fontColor={`text-black`}
                            />

                            <div className="w-fit h-full p-[2px] flex flex-row justify-center items-center border-solid border-l-[1.5px] px-[4px] border-[#E2E2E2] active:scale-[1.06] hover:scale-[1.02]">
                              <GoTrash
                                className="w-[24px] h-[24px]"
                                onClick={() => remove(idx)}
                                fill="#B4B4B4"
                              />
                            </div>
                          </div>
                        ))}
                        {fields?.length === 0 && (
                          <div className="w-full h-auto flex justify-center">
                            <CustomText
                              textLabel={"No tags created yet"}
                              fontWeight="font-regular"
                              fontSize="text-[16px] mMD:text-[14px] mSM:text-[12px]"
                              fontColor={`text-[#e22b2b]`}
                            />
                          </div>
                        )}
                      </div>
                      <div className="w-full h-auto flex flex-row justify-between items-center">
                        <CustomText
                          textLabel={"Availability"}
                          fontWeight="font-regular"
                          fontSize="text-[20px] tSM2:text-[18px] mMD:text-[14px]"
                          fontColor={`text-black`}
                        />
                        <div className="w-fit tSM2:h-fit flex h-auto flex-row items-center justify-center rounded-full bg-[#f0f0f0] self-center">
                          <div
                            onClick={() => {
                              setValue("inStock", true);
                            }}
                            className={`tSM:text-[12px] h-auto w-[100px] text-[16px] ${
                              watch("inStock")
                                ? "bg-whzan-blue text-white"
                                : "text-black"
                            } font-regular font-poppins tSM:px-3 mMD:px-2 cursor-pointer rounded-full px-4 py-1 text-center hover:bg-whzan-blue active:scale-[1.02]`}
                          >{`In stock`}</div>

                          <div
                            onClick={() => {
                              setValue("inStock", false);
                            }}
                            className={`tSM:text-[12px] h-auto w-auto text-[16px] ${
                              !watch("inStock")
                                ? "bg-whzan-blue text-white"
                                : "text-black"
                            } font-regular font-poppins tSM:px-3 mMD:px-2 cursor-pointer rounded-full px-4 py-1 text-center hover:bg-whzan-blue active:scale-[1.02]`}
                          >{`Out of stock`}</div>
                        </div>
                      </div>
                      {errorMessage && (
                        <div className="w-full h-auto flex justify-center">
                          <CustomText
                            textLabel={errorMessage}
                            fontWeight="font-regular"
                            fontSize="text-[16px] mMD:text-[14px] mSM:text-[12px]"
                            fontColor={`text-[#e22b2b]`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-auto pt-[24px]">
                    {isLoading ? (
                      <CustomText
                        textLabel={"Loading ..."}
                        fontWeight="font-medium"
                        fontSize="text-[24px]"
                        fontColor={`text-black`}
                      />
                    ) : isUpdate ? (
                      <PrimaryButton
                        label={"Update info"}
                        type={BUTTON_TYPES.button}
                        buttonType={"secondary"}
                        handleClick={() => {
                          console.log(`Syabangena 2.0`);
                          if (Object.keys(formState?.errors).length <= 1) {
                            console.log(`Syabangena 2.1`, rest?.getValues());
                            handleUpdateItem({
                              ...rest?.getValues(),
                              imagesPostAdd: rest?.getValues("imagesPostAdd"),
                              id: activeProduct?.id,
                            });
                          } else {
                            console.log(`Syabangena 3`);
                            trigger();
                          }
                        }}
                        isValid={isValid}
                      />
                    ) : (
                      <PrimaryButton
                        label={"Next step"}
                        type={BUTTON_TYPES.button}
                        buttonType={"secondary"}
                        handleClick={() => {
                          if (Object.keys(formState?.errors).length <= 2) {
                            console.log(`NUMBER --- 1`, formState?.errors);

                            if (
                              "images" in formState.errors ||
                              "imagesPostAdd" in formState.errors
                            ) {
                              console.log(`NUMBER --- 2`, formState?.errors);
                              setValue("imagesPostAdd", [
                                { id: "0", imageURL: "dummy_image_one" },
                                { id: "1", imageURL: "dummy_image_two" },
                                { id: "2", imageURL: "dummy_image_three" },
                                { id: "3", imageURL: "dummy_image_four" },
                              ]);
                              setIsToggle(false);
                            } else {
                              console.log(
                                `NUMBER --- 3`,
                                formState?.errors,
                                values
                              );
                              trigger();
                            }
                          } else {
                            console.log(`NUMBER --- 4`, formState?.errors);
                            trigger();
                          }
                        }}
                        isValid={isValid}
                      />
                    )}
                  </div>
                </div>
              </form>
            </FormProvider>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductEditView;
