import { CustomText } from "..";
import { BUTTON_TYPES, Primary_Button_Types } from "../../helpers/types";

type PrimaryButtonProps = {
  label: string;
  type?: keyof typeof BUTTON_TYPES;
  buttonType: keyof typeof Primary_Button_Types;
  handleClick: () => void;
  isValid: boolean;
};

const handleButtonBackground = (name: keyof typeof Primary_Button_Types) => {
  if (name) {
    switch (name) {
      case "hollow":
        return "bg-white border-solid border-[1.5px] border-whzan-secondary";
      case "secondary":
        return "bg-whzan-secondary";
      case "accent":
        return "bg-whzan-accent";
      case "blue":
        return "bg-whzan-blue";
      case "orange":
        return "bg-whzan-orange";
      case "clear":
        return "bg-transparent";
      case "grey":
        return "bg-[#9B9FAA]";

      default:
        break;
    }
  }
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  type = BUTTON_TYPES.reset,
  buttonType,
  handleClick,
  isValid,
}) => {
  return (
    <button
      type={type}
      onClick={handleClick}
      className={`w-auto h-fit ${buttonType} ${
        !isValid ? "bg-[#a4a4a4]" : `${handleButtonBackground(buttonType)}`
      }   active:scale-[1.02] flex flex-col rounded-full  cursor-pointer px-5 py-1 mLG:px-3 items-center`}
    >
      <CustomText
        textLabel={label}
        fontWeight="font-regular"
        fontSize="text-[16px] mLG:text-[13px]"
        fontColor={
          buttonType === "hollow" || buttonType === "clear"
            ? `text-black`
            : `text-white`
        }
      />
    </button>
  );
};

export default PrimaryButton;
