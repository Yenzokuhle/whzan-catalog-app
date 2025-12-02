import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { IoCloseOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";

interface Props {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  type: string;
  disable?: boolean;
  handleIconClick: () => void;
}

const TextInputFieldFilter: React.FC<Props> = ({
  name,
  label,
  value,
  placeholder,
  type,
  disable = false,
  handleIconClick,
  ...props
}: Props) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [inputValue, setInputValue] = useState(value);
  const [inFocus, setInFocus] = useState(false);

  useEffect(() => {
    if (!inFocus && inputValue) {
      setInFocus(true);
    }

    if (parseInt(inputValue || "") === 0) {
      setInFocus(false);
    }
  }, [inputValue, inFocus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const val = event.target.value;

    setInputValue(val);
    setValue(name, val, { shouldValidate: true }); //updates the value on the Mother Context
  };

  const handleBlur = (): void => {
    if (inputValue?.length === 0) {
      setInFocus(false);
    }
  };

  const handleFocus = (): void => {
    setInFocus(true);
  };

  return (
    <div className="w-full h-fit flex flex-col gap-y-2 relative">
      <div className="w-auto h-auto absolute top-[10px] left-3 cursor-pointer active:scale-[1.02] hover:scale-[1.06]">
        <IoIosSearch
          className="w-[22px] h-[22px] tMD:w-[18px] tMD:h-[18px]"
          onClick={() => {
            setInputValue(undefined);
            setValue(name, "");
            handleIconClick();
          }}
        />
      </div>

      <input
        {...register(name)}
        id={`input-${name}`}
        disabled={disable}
        name={name}
        type={type}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder ? placeholder : label}
        {...props}
        className={`w-full h-auto border-solid border-[1.25px] ${
          errors[name]
            ? "border-[#e22b2b]"
            : inFocus
            ? "border-[#DDDDDD]"
            : "border-[#DDDDDD]"
        } rounded-[17px] p-[7.5px] px-6 pl-[40px] outline-none tMD:p-2 tMD:px-3 tMD:pl-[36px] text-[16px] tMD:text-[14px] placeholder:text-[#8D8D8D] tMD:placeholder:text-[14px]  mSM:placeholder:text-[12px]`}
      />

      <div className="w-auto h-auto absolute top-2 right-3 tMD:top-[10px] cursor-pointer active:scale-[1.02] hover:scale-[1.06]">
        {inputValue && (
          <IoCloseOutline
            className="w-[24px] h-[24px] tMD:w-[18px] tMD:h-[18px]"
            onClick={() => {
              setInputValue(undefined);
              setValue(name, "");
              handleIconClick();
            }}
          />
        )}
      </div>

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <div className="w-full h-auto flex justify-end pl-4 mMD:pl-2">
            <span className="text-sm font-medium text-[#e22b2b] text-[12px] mMD:text-[10px] font-poppins">
              {message}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default TextInputFieldFilter;
