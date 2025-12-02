import { useCallback, useEffect, useState } from "react";

type ImageGridViewerProps = {
  images: string[];
  mainImgHeight: string;
  secondaryImgHeight: string;
  isRow: boolean;
};

export const ImageGridViewer: React.FC<ImageGridViewerProps> = ({
  images,
  mainImgHeight,
  secondaryImgHeight,
  isRow,
}: ImageGridViewerProps) => {
  const [activeImg, setActiveImg] = useState<string>();

  useEffect(() => {
    setActiveImg(images[0]);
  }, [images]);

  const handleClickItem = useCallback(
    (item: string) => {
      if (item !== activeImg) {
        setActiveImg(item);
      }
    },
    [activeImg]
  );

  return (
    <div
      className={`w-full h-auto flex ${
        isRow ? "flex-row justify-center items-center" : "flex-col items-center"
      }`}
    >
      <div className="w-fit h-auto overflow-hidden">
        <img
          src={activeImg}
          alt="whzan-logo"
          className={`w-auto ${mainImgHeight}`}
        />
      </div>
      <div className={`w-auto h-auto flex ${isRow ? "flex-col" : "flex-row"}`}>
        {images?.map((item: string, idx: number) => (
          <img
            key={`image-grid-item-${idx + 1}`}
            src={item}
            alt="whzan-logo"
            className={`w-fit ${secondaryImgHeight} active:scale-[1.02] hover:scale-[1.06] cursor-pointer ${
              item == activeImg
                ? "border-solid border-[1.5px] border-whzan-secondary rounded-[10px]"
                : ""
            }`}
            onClick={() => handleClickItem(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGridViewer;
