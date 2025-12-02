import * as Yup from "yup";
import _ from "lodash";
import { mixed } from "yup";

export const BUTTON_TYPES = {
  button: "button",
  reset: "reset",
  submit: "submit",
} as const;

export const Primary_Button_Types = {
  hollow: "bg-white",
  secondary: "bg-whzan-secondary",
  accent: "bg-whzan-accent",
  blue: "bg-whzan-blue",
  orange: "bg-whzan-orange",
  clear: "bg-transparent",
  grey: "bg-[#9B9FAA]",
} as const;

export const ProductItemValidation = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description description is required"),
  brand: Yup.string().required("Brand name is required"),
  inStock: Yup.boolean().required("Availability is required"),
  tags: Yup.array()
    .of(Yup.string().required("Tag has to a string"))
    .required("A minimum of 1 tag is required"),
  // customTag: Yup.string().optional(),
  price: Yup.number().required("Price is required"),
  currency: Yup.string().required("Currency is required"),
  rating: Yup.number().required("Rating is required"),
  reviewCount: Yup.number().required("Review count is required"),
  images: Yup.array()
    .of(mixed<File>().required("Tags is required"))
    .test("required", "You need to provide the product image", (files) => {
      const resArray = files?.map((file) => {
        if (file?.name !== "") {
          return true;
        }
        return false;
      });

      if (_.includes(resArray, false)) {
        return true;
      }
      return false;
    })
    .required("A minimum of 1 image is required"),
});

export type SelectChild = {
  id?: string;
  value: string;
  label: string;
};

export type Product = {
  id?: string;
  productId?: string;
  name: string;
  price: number;
  currency: string;
  rating: number;
  customTag?: string;
  customBrand?: string;
  reviewCount: number;
  description: string;
  brand: string;
  tags: { value: string; name?: string }[];
  inStock?: boolean;
  imagesPostAdd: { id: string; imageURL: string }[];
  images: { value: File }[];
  createdAt?: string;
  updatedAt?: string;
  isPredefined?: boolean;
};

export const DefaultFile: File = {
  lastModified: 0,
  name: "",
  webkitRelativePath: "",
  size: 0,
  type: "",
  bytes: function (): Promise<Uint8Array> {
    throw new Error("Function not implemented.");
  },
  arrayBuffer: function (): Promise<ArrayBuffer> {
    throw new Error("Function not implemented.");
  },
  slice: function (start?: number, end?: number, contentType?: string): Blob {
    throw new Error(
      `Function not implemented. ${start},${end}, ${contentType},`
    );
  },
  stream: function (): ReadableStream<Uint8Array> {
    throw new Error("Function not implemented.");
  },
  text: function (): Promise<string> {
    throw new Error("Function not implemented.");
  },
};
