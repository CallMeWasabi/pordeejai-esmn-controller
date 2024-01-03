"use client";
import React, { useEffect, useState } from "react";
import { TableQuery } from "../table/page";
import toast from "react-hot-toast";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import axios from "axios";

const ConfigTableModal = () => {
  const [openModalConfig, setOpenModalConfig] = useState(false);
  const [possibleTable, setPossibleTable] = useState<TableQuery[]>([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const [newTableName, setNewTableName] = useState("");
  const [errorConfigModal, setErrorConfigModal] = useState(false);
  const [errorMessageConfigModal, setErrorMessageConfig] = useState("");
  const [loadingStateModalConfig, setLoadingStateModalConfig] = useState(false);

  const onModalConfigChange = () => {
    setErrorConfigModal(false);
    setErrorMessageConfig("");
    setLoadingStateModalConfig(false);
    setNewTableName("");
    setOpenModalConfig(!openModalConfig);
  };

  const onSelectItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    for (let i = 0; i < possibleTable.length; i++) {
      if (e.target.value === possibleTable[i].name) {
        setNewTableName(e.target.value);
        setSelectedItem(possibleTable[i].id);
        break;
      }
    }
  };

  const saveData = async () => {
    setLoadingStateModalConfig(true);
    try {
      for (let i = 0; i < possibleTable.length; i++) {
        if (possibleTable[i].name === newTableName) {
          setLoadingStateModalConfig(false);
          setErrorConfigModal(true);
          setErrorMessageConfig("มีชื่อนี้อยู่แล้ว");
          return
        }
      }
      const response = await axios.put(`http://localhost:8080/api/tables/${selectedItem}`, {
        name: newTableName
      })
      if (response.status === 200) {
        onModalConfigChange();
        toast.success("บันทึกข้อมูลเสร็จสิ้น");
      } else {
        throw new Error()
      }
    } catch (error) {
      console.log(error);
      onModalConfigChange();
      toast.error("มีบางอย่างผิดปกติ โปรดลองอีกครั้ง");
    }
  };

  useEffect(() => {
    const loadingItem = async () => {
      const response = await axios.get("http://localhost:8080/api/tables");
      const filteredItems = response.data.filter((item: TableQuery) => {
        if (item.status !== "IN_SERVICE" && item.status !== "ERROR") {
          return true;
        }
        return false;
      });
      setPossibleTable(filteredItems);
    };
    if (openModalConfig) {
      loadingItem();
    }
  }, [openModalConfig]);

  return (
    <div>
      <Button color="warning" onClick={onModalConfigChange}>
        แก้ไข
      </Button>
      <Modal
        isOpen={openModalConfig}
        onOpenChange={onModalConfigChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                แก้ไขโต๊ะ <br /> (แก้ไขได้เฉพาะโต๊ะที่สถานะ OPEN หรือ CLOSE
                เท่านั้น)
              </ModalHeader>
              <ModalBody className="space-y-2">
                <Select
                  label="เลือกโต๊ะที่ต้องการแก้ไข"
                  onChange={onSelectItemChange}
                >
                  {possibleTable.map((item: any) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </Select>
                <Input
                  label="ชื่อใหม่ที่ต้องการ"
                  value={newTableName}
                  isInvalid={errorConfigModal}
                  errorMessage={errorMessageConfigModal}
                  isDisabled={selectedItem < 0 ? true : false}
                  onChange={(e) => {
                    setNewTableName(e.target.value);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                  isDisabled={loadingStateModalConfig}
                >
                  ยกเลิก
                </Button>
                <Button
                  color="primary"
                  isLoading={loadingStateModalConfig}
                  onPress={async () => {
                    await saveData();
                  }}
                  isDisabled={selectedItem < 0 ? true : false}
                >
                  บันทึก
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfigTableModal;
