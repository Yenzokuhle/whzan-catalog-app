import React, { useState } from "react";
import { useFormContext } from "react-hook-form";

import type { SelectChild } from "../../helpers/types";
import { ErrorMessage } from "@hookform/error-message";

import Select, { type SingleValue } from "react-select";

const DEFAUL_VALUES: SelectChild[] = [
  { id: "0", value: "genre one", label: "Genre one" },
  { id: "1", value: "genre two", label: "Genre two" },
  { id: "2", value: "genre three", label: "Genre three" },
  { id: "3", value: "genre four", label: "Genre four" },
  { id: "4", value: "genre five", label: "Genre five" },
  { id: "5", value: "genre six", label: "Genre six" },
];

interface Props {
  name: string;
  label: string;
  hideLabel?: boolean;
  listItem?: SelectChild[];
  handleValueChange: (e: string) => void;
  value?: string;
}

const ListSelectField: React.FC<Props> = ({
  name,
  listItem = DEFAUL_VALUES,
  handleValueChange,
  value,
}: Props) => {
  const [selectedOption, setSelectedOption] = useState<SelectChild | undefined>(
    {
      id: "0",
      value: value || "",
      label: value || "",
    }
  );

  const {
    formState: { errors },
  } = useFormContext();

  const handleChange = (newValue: SingleValue<SelectChild>): void => {
    setSelectedOption(newValue || undefined);
    handleValueChange(newValue?.value || "");
  };

  return (
    <div className="w-full h-auto flex flex-col gap-y-2 bg-amber-300">
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={listItem}
        className="text-black"
      />
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

export default ListSelectField;
