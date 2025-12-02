import { useCallback, type ReactNode } from "react";
import { CustomText } from "../../elements";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

type PaginationViewProps = {
  isPaginationLocation: number;
  limit: number;
  handleClick: (e: number) => void;
};

export const PaginationView: React.FC<PaginationViewProps> = ({
  isPaginationLocation,
  limit,
  handleClick,
}: PaginationViewProps) => {
  const renderItems = useCallback(() => {
    const listItems: ReactNode[] = [];

    for (let i: number = 0; i < limit; i++) {
      listItems.push(
        <div
          className={`w-auto h-auto rounded-[4px] active:scale-[1.02] flex flex-col cursor-pointer items-center justify-center border-solid border-[1px] border-[#F1F1F1] ${
            isPaginationLocation === i + 1 ? "border-whzan-orange" : ""
          } px-[8px] tSM2:px-[6px] mMD:px-[4px]`}
          key={`paginate-item-${i + 1}`}
          onClick={() => handleClick(i + 1)}
        >
          <CustomText
            textLabel={`${i + 1}`}
            fontWeight="font-regular"
            fontSize="text-[22px]"
            fontColor={`text-[#101042]`}
          />
        </div>
      );
    }

    return listItems;
  }, [limit]);

  const handleIconClick = (currentState: number, direction: boolean) => {
    if (direction) {
      handleClick(currentState + 1);
    } else {
      handleClick(currentState - 1);
    }
  };

  return (
    <div className={`w-full h-auto flex flex-row gap-x-[8px] justify-center`}>
      {isPaginationLocation !== 1 && (
        <div className="w-auto h-auto rounded-l-[4px] active:scale-[1.02] flex flex-col cursor-pointer items-center justify-center border-solid border-[1px] border-[#F1F1F1]">
          <MdChevronLeft
            className="w-[28px] h-[28px] tSM2:w-[24px] tSM2:h-[24px] mMD:w-[20px] mMD:h-[20px]"
            onClick={() => handleIconClick(isPaginationLocation, false)}
            fill="#000000"
          />
        </div>
      )}
      {renderItems()}

      {/* {[1, 2, 3, 4, 5, 5]?.map((item: number, idx: number) => {
        return (
          <div
            className="w-auto h-auto rounded-[4px] active:scale-[1.02] flex flex-col cursor-pointer items-center justify-center border-solid border-[1px] border-[#F1F1F1] px-[8px] tSM2:px-[6px]"
            key={`paginate-item-${idx + 1}`}
          >
            <CustomText
              textLabel={`${item}`}
              fontWeight="font-regular"
              fontSize="text-[22px]"
              fontColor={`text-[#101042]`}
            />
          </div>
        );
      })} */}

      {isPaginationLocation < limit && (
        <div className="w-auto h-auto rounded-r-[4px] active:scale-[1.02] flex flex-col cursor-pointer items-center justify-center border-solid border-[1px] border-[#F1F1F1]">
          <MdChevronRight
            className="w-[28px] h-[28px] tSM2:w-[24px] tSM2:h-[24px] mMD:w-[20px] mMD:h-[20px]"
            onClick={() => handleIconClick(isPaginationLocation, true)}
            fill="#000000"
          />
        </div>
      )}
    </div>
  );
};

export default PaginationView;
