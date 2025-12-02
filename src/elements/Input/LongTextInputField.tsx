import React, { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

interface Props {
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  hideLabel: boolean;
  type: string;
  className?: string;
  charCount?: number;
  disable?: boolean;
}

const LongTextInputField: React.FC<Props> = ({
  name,
  label,
  value,
  placeholder,
  hideLabel = false,
  type,
  charCount,
  disable = false,
  ...props
}: Props) => {
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [inputValue, setInputValue] = useState(value);
  const [inFocus, setInFocus] = useState(false);
  const [characterCount, setCharacterCount] = useState<number>(0);

  useEffect(() => {
    if (!inFocus && inputValue) {
      setInFocus(true);
    }

    if (parseInt(inputValue || "") === 0) {
      setInFocus(false);
    }

    if (value !== "" && inputValue === "") {
      setInputValue(value);
    }
  }, [inputValue, inFocus, value]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    const { target } = event;
    const val = target?.value;

    if (type === "text" && charCount) {
      const onlyText = val.replace(/\s/g, "");
      setCharacterCount(onlyText.length);
      if (characterCount < charCount) {
        setInputValue(val);
        setValue(name, val); //updates the value on the Mother Context
      }
    } else {
      setInputValue(val);
      setValue(name, val); //updates the value on the Mother Context
    }
  };

  const handleBlur = (): void => {
    if (inputValue?.length === 0) {
      setInFocus(false);
    }
  };

  const handleFocus = (): void => {
    setInFocus(true);
  };

  const handleCharacterLimit = useCallback(
    (e: React.KeyboardEvent<object>) => {
      if (charCount) {
        if (characterCount == charCount && e.key !== "Backspace") {
          e.preventDefault();
        }
        if (characterCount != 0 && e.key == "Backspace")
          setCharacterCount(characterCount - 1);
      }
    },
    [characterCount, charCount]
  );

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
      <textarea
        id={`input-${name}`}
        disabled={disable}
        name={name}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        value={inputValue}
        onKeyDown={handleCharacterLimit}
        placeholder={placeholder ? placeholder : label}
        {...props}
        className={`w-full h-auto border-solid border-[1.25px] ${
          errors[name]
            ? "border-[#e22b2b]"
            : inFocus
            ? "border-gosolr_primary"
            : "border-black"
        } rounded-xl p-2 px-6 outline-none placeholder:text-[#585858]`}
      />

      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => (
          <div className="w-full h-auto flex justify-end">
            <span className="text-sm font-medium text-[#e22b2b] text-[12px] font-poppins">
              {message}
            </span>
          </div>
        )}
      />
    </div>
  );
};

export default LongTextInputField;
