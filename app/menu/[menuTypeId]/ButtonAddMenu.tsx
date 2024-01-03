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

const ButtonAddMenu = ({
  forceLoading,
  callForceLoading,
  menu_type_id,
}: {
  forceLoading: boolean;
  callForceLoading: Function;
  menu_type_id: number;
}) => {
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
    const menuInfo = await axios.get("http://localhost:8080/api/menus");

    for (let i = 0; i < menuInfo.data.length; i++) {
      if (menuInfo.data[i].name === menuName) {
        setLoadingState(false);
        setError(true);
        setErrorMessage("มีชื่อเมนูนี้อยู่แล้ว");
        return;
      }
    }

    const response = await axios.post("http://localhost:8080/api/menus", {
      name: menuName,
      price: menuPrice,
      menu_type_id,
    });

    if (response.status === 200) {
      onOpenChange();
      toast.success("สร้างเสร็จสิ้น");
      callForceLoading(!forceLoading)
    } else {
      onOpenChange();
      toast.error("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
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
