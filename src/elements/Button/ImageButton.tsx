import { useFormContext } from "react-hook-form";
import CustomText from "../Text/CustomText";
import { useEffect, useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

type ImageButtonProps = {
  handleImageChange: (image: string) => void;
  name: string;
};

export const ImageButton: React.FC<ImageButtonProps> = ({
  handleImageChange,
  name,
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
      console.log(`val: `, val[0]);
      setSelectedImage(URL.createObjectURL(val[0]));
      setValue(name, val[0]);
    }
  };

  useEffect(() => {
    if (selectImage) {
      handleImageChange(selectImage);
    }
  }, [selectImage, handleImageChange]);

  return (
    <div
      className={`w-full h-full  bg-white  flex flex-col rounded-[20px] items-center justify-center border-dashed border-[1.5px] border-spacing-28`}
    >
      <div className="w-auto h-auto relative">
        <input
          type="file"
          {...register(name)}
          onChange={handleChange}
          className="w-[160px] h-[160px] active:scale-[1.02] flex flex-col items-center justify-center bg-[#a8a8a825] border-dashed border-[1.5px] border-spacing-[24px] border-black rounded-full text-transparent relative z-20"
        ></input>
        <div className="w-auto h-auto flex flex-col items-center justify-center absolute z-10 top-[37.5%] right-[22.5%] cursor-none">
          <CustomText
            textLabel={"Add image"}
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
  );
};

export default ImageButton;
