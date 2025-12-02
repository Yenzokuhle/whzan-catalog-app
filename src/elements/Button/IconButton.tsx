import type { ReactElement } from "react";

type IconButtonProps = {
  children: ReactElement;
  handleClick: () => void;
  isNegative?: boolean;
};

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  handleClick,
  isNegative,
}) => {
  return (
    <div
      onClick={handleClick}
      className={`w-[32px] h-[32px] ${
        isNegative ? "bg-[#FFEAEC]" : "bg-white"
      } active:scale-[1.02] flex flex-col rounded-full cursor-pointer items-center justify-center border-solid border-[1.5px] ${
        isNegative ? "border-[#EB5362]" : "border-black"
      }`}
    >
      {children}
    </div>
  );
};

export default IconButton;
