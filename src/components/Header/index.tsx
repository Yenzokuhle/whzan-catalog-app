import { useState } from "react";
import { ProductEditView, ModalView, WishlistModal } from "..";
import { CustomText, PrimaryButton } from "../../elements";
import LogoIcon from "/whzan-logo.png";
import LogoIconSmall from "/small-logo.jpeg";
import { useLocation } from "react-router-dom";

type HeaderProps = {
  label: string;
  handleToast?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
  label,
  handleToast,
}: HeaderProps) => {
  const [modalViewWishlist, setModalNewWishlist] = useState<boolean>(false);
  const [modalViewNewProduct, setModalNewProduct] = useState<boolean>(false);
  const location = useLocation();

  return (
    <div
      className={`w-full h-auto px-[24px] py-[8px] bg-whzan-primary rounded-full flex flex-row justify-between items-center`}
    >
      <ModalView
        show={modalViewWishlist}
        handleClose={() => setModalNewWishlist(false)}
      >
        <WishlistModal
          handleShowToast={() => (handleToast ? handleToast() : () => null)}
          handleClose={() => setModalNewWishlist(false)}
        />
      </ModalView>

      <ModalView
        show={modalViewNewProduct}
        handleClose={() => setModalNewProduct(false)}
      >
        <ProductEditView
          isUpdate={false}
          handleCloseButton={() => setModalNewProduct(false)}
          handleUpdate={() => null}
        />
      </ModalView>

      <div className="w-auto h-auto">
        <img
          src={LogoIcon}
          alt="whzan-logo"
          className="w-auto h-[68px]  tMD:h-[56px] tSM2:hidden"
        />
        <img
          src={LogoIconSmall}
          alt="whzan-logo-small"
          className="hidden w-auto h-[40px] tSM2:block rounded-full"
        />
      </div>
      <CustomText
        textLabel={label}
        fontWeight="font-regular"
        fontSize="text-[24px] tMD:text-[20px] tSM2:text-[19px]  mLG:text-[18px]"
        fontColor={`text-white`}
      />

      <div className="w-auto h-auto">
        <PrimaryButton
          label={
            location?.pathname === "/admin/inventory"
              ? "Add product"
              : "My watchlist"
          }
          buttonType={
            location?.pathname === "/admin/inventory" ? "secondary" : "blue"
          }
          handleClick={() => {
            if (location?.pathname === "/admin/inventory") {
              setModalNewProduct(true);
            } else {
              setModalNewWishlist(true);
            }
          }}
          isValid={true}
        />
      </div>
    </div>
  );
};

export default Header;
