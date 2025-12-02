import { useFormContext } from "react-hook-form";
import CustomText from "../Text/CustomText";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { SlimImageCard } from "../../components";

type ImageButtonLongProps = {
  handleImageChange: (image: object) => void;
  handleDelete: () => void;
  name: string;
  count: number;
};

export const ImageButtonLong: React.FC<ImageButtonLongProps> = ({
  handleImageChange,
  handleDelete,
  name,
  count,
}) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [selectImage, setSelectedImage] = useState<string | undefined>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const val: FileList | null = event?.target?.files;

    if (val) {
      console.log(`val:here`, val[0]);
      handleImageChange({ value: val[0] });
      setSelectedImage(URL.createObjectURL(val[0]));
      setValue(name, val[0]);
    }
  };

  useEffect(() => {
    if (selectImage) {
      setSelectedImage(selectImage);
    }
  }, [selectImage, handleImageChange]);

  return (
    <div className={`w-auto h-auto flex flex-col`}>
      {!selectImage && (
        <div className="bg-white  flex flex-col rounded-[20px] items-center justify-center border-dashed border-[1.5px] border-spacing-28">
          <div className="w-auto h-auto relative">
            <input
              type="file"
              {...register(name)}
              onChange={handleChange}
              className="w-[200px] h-[60px] active:scale-[1.02] flex flex-col items-center justify-center bg-[#a8a8a825] border-dashed border-[1.5px] border-spacing-[24px] m-[12px] border-black rounded-2xl text-transparent relative z-20"
            ></input>
            <div className="w-auto h-auto flex flex-col items-center justify-center absolute z-10 top-[23%] right-[24.5%] cursor-none">
              <CustomText
                textLabel={`Add image ${count}`}
                fontWeight="font-regular"
                fontSize="text-[18px]"
                fontColor={`text-black`}
              />
              <CustomText
                textLabel={"(Click button)"}
                fontWeight="font-regular"
                fontSize="text-[12px]"
                fontColor={`text-black`}
              />
            </div>
          </div>
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <div className="w-full h-auto flex justify-center pt-4">
                <span className="text-sm font-medium text-[#e22b2b] text-[12px] mMD:text-[10px] font-poppins">
                  {message}
                </span>
              </div>
            )}
          />
        </div>
      )}

      {selectImage && (
        <SlimImageCard
          title={`Image ${count}`}
          image={selectImage}
          handleDelete={() => {
            setSelectedImage(undefined);
            handleDelete();
          }}
        />
      )}
    </div>
  );
};

export default ImageButtonLong;
