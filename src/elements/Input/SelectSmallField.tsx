import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Select } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa6";

import clsx from "clsx";
import type { SelectChild } from "../../helpers/types";
import { ErrorMessage } from "@hookform/error-message";

const DEFAUL_VALUES: SelectChild[] = [
  { value: "genre one", label: "Genre one" },
  { value: "genre two", label: "Genre two" },
  { value: "genre three", label: "Genre three" },
  { value: "genre four", label: "Genre four" },
  { value: "genre five", label: "Genre five" },
  { value: "genre six", label: "Genre six" },
];

interface Props {
  name: string;
  label: string;
  hideLabel?: boolean;
  listItem?: SelectChild[];
  handleValueChange: (e: string) => void;
  value?: string;
  customClass?: string;
}

const SelectSmallField: React.FC<Props> = ({
  label,
  hideLabel = true,
  name,
  listItem = DEFAUL_VALUES,
  handleValueChange,
  customClass,
  value,
}: Props) => {
  const [activeVal, setActiveVal] = useState<string | undefined>();
  const {
    formState: { errors },
  } = useFormContext();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { target } = event;
    const val = target?.value;

    handleValueChange(val);
    setActiveVal(val);
  };

  useEffect(() => {
    if (value) {
      setActiveVal(value);
    }
  }, [value, setActiveVal]);

  return (
    <div className="w-full h-auto flex flex-col gap-y-2">
      {!hideLabel && (
        <label
          htmlFor={`input-${name}`}
          className="text-sm font-medium text-black text-[16px] font-poppins leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ps-6"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <Select
          className={
            clsx(
              "block w-full appearance-none rounded-full border-solid border-[1px] border-[#D3D3D3]  bg-white px-3 py-[4px] text-sm/6 text-black",
              "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
              // Make the text of each option black on Windows
              "*:text-black"
            ) + `${customClass}`
          }
          value={activeVal}
          defaultValue={activeVal}
          onChange={handleChange}
        >
          {listItem.map((myItem, idx) => (
            <option
              key={`select-item-${idx} + 1`}
              value={myItem.value}
            >{`${myItem.label}`}</option>
          ))}
        </Select>
        <FaChevronDown
          className="group pointer-events-none absolute top-[10px] right-[10px] size-4 fill-black/60"
          aria-hidden="true"
        />
      </div>
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <div className="w-full h-auto flex justify-end">
            <span className="text-sm font-medium text-[#e22b2b] text-[12px] tMD:text-[16px] mMD:text-[14px] mSM:text-[12px] font-poppins">
              {message}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default SelectSmallField;
