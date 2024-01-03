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

const ButtonAddMenuType = ({
  forceLoading,
  callForceLoading,
}: {
  forceLoading: boolean;
  callForceLoading: Function;
}) => {
  const [open, setOpen] = useState(false);
  const [newMenuType, setMenuType] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onOpenChange = () => {
    setError(false)
    setErrorMessage("")
    setMenuType("")
    setLoadingState(false);
    setOpen(!open);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuType(e.target.value);
  };

  const createdMenuType = async () => {
    setLoadingState(true);
    const menuTypeInfo = await axios.get("http://localhost:8080/api/menu-types");

    for (let i = 0; i < menuTypeInfo.data.length; i++) {
      if (menuTypeInfo.data[i].name === newMenuType) {
        setLoadingState(false);
        setError(true);
        setErrorMessage("มีชื่อประเภทอาหารนี้อยู่แล้ว");
        return;
      }
    }

    const response = await axios.post("http://localhost:8080/api/menu-types", {
      name: newMenuType,
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
                สร้างประเภทอาหาร
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="ชื่อประเภทอาหาร"
                  type="text"
                  variant="faded"
                  onChange={onInputChange}
                  isInvalid={error}
                  errorMessage={errorMessage}
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
                    await createdMenuType();
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

export default ButtonAddMenuType;
