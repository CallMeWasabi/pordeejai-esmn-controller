"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { IconContext } from "react-icons";
import { GoPlus } from "react-icons/go";
import axios from "axios";
import toast from "react-hot-toast";
import { getToken } from "../../home/serverAction";
import { useRouter } from "next/navigation";
import { clientWebserverUrl } from "@/app/constant";

const ButtonAddMenu = ({
  forceLoading,
  callForceLoading,
  menu_type_id,
}: {
  forceLoading: boolean;
  callForceLoading: Function;
  menu_type_id: number;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState(0);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onOpenChange = () => {
    setError(false);
    setErrorMessage("");
    setLoadingState(false);
    setMenuName("");
    setMenuPrice(0);
    setOpen(!open);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuName(e.target.value);
  };

  const onPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setMenuPrice(0);
      return;
    }
    setMenuPrice(parseInt(e.target.value));
  };

  const createMenu = async () => {
    setLoadingState(true);
    try {
      const jwtToken = await getToken();
      const menuInfo = await axios.get(`${clientWebserverUrl}/api/menus`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      for (let i = 0; i < menuInfo.data.length; i++) {
        if (menuInfo.data[i].name === menuName) {
          setLoadingState(false);
          setError(true);
          setErrorMessage("มีชื่อเมนูนี้อยู่แล้ว");
          return;
        }
      }

      const res = await axios.post(
        `${clientWebserverUrl}/api/menus`,
        {
          name: menuName,
          price: menuPrice,
          menu_type_id,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (res.status === 200) {
        onOpenChange();
        toast.success("สร้างเสร็จสิ้น");
        callForceLoading(!forceLoading);
      } else {
        onOpenChange();
        toast.error("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
      }
    } catch (e: any) {
      if (e.message === "Request failed with status code 401") {
        toast.error("การยืนยันผู้ใช้งานผิดพลาด");
        return router.push("/login");
      }
      console.error(e.message);
    }
  };

  return (
    <div className="h-full w-full">
      <Button className="h-full w-full" onClick={onOpenChange}>
        <IconContext.Provider value={{ size: "50px" }}>
          <GoPlus />
        </IconContext.Provider>
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                สร้างเมนู
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="ชื่อเมนู"
                  type="text"
                  variant="faded"
                  onChange={onInputChange}
                  value={menuName}
                  isInvalid={error}
                  errorMessage={errorMessage}
                />
                <Input
                  label="ราคา"
                  type="number"
                  variant="faded"
                  onChange={onPriceChange}
                  value={menuPrice.toString()}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isLoading={loadingState}
                >
                  ยกเลิก
                </Button>
                <Button
                  color="primary"
                  isLoading={loadingState}
                  onPress={async () => {
                    await createMenu();
                  }}
                >
                  สร้าง
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ButtonAddMenu;
