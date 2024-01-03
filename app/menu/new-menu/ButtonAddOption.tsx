"use client";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CheckboxGroup,
  Checkbox,
  Card,
  CardBody,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { OptionQuery } from "../page";
import axios from "axios";

const ButtonAddOption = ({
  loadingState,
  menuOptions,
  setMenuOptions,
}: {
  loadingState: boolean;
  menuOptions: OptionQuery[];
  setMenuOptions: Function;
}) => {
  const [open, setOpen] = useState(false);
  const onOpenChange = () => {
    setOpen(!open);
  };

  const [options, setOptions] = useState<OptionQuery[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const readChoice = (option: OptionQuery) => {
    let label = "";
    const choices = JSON.parse(option.choices);
    for (let i = 0; i < choices.length; i++) {
      label += choices[i].name;
      if (i + 1 !== choices.length) {
        label += ", ";
      }
    }
    return label;
  };

  useEffect(() => {
    const loadOption = async () => {
      const response = await axios.get("http://localhost:8080/api/options");
      if (response.status === 200) {
        setOptions(response.data);
      }
    };
    loadOption();
  }, []);

  const buildSelect = () => {
    setSelected([...menuOptions.map((option) => JSON.stringify(option))]);
  };

  const saveOption = () => {
    let temp = [];
    for (let i = 0; i < selected.length; i++) {
      temp.push(JSON.parse(selected[i]));
    }
    setMenuOptions(temp);
  };

  return (
    <div className="w-full">
      <Button
        variant="flat"
        color="primary"
        className="w-full"
        onClick={() => {
          buildSelect();
          onOpenChange();
        }}
        isDisabled={loadingState}
      >
        + ตัวเลือก
      </Button>
      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                เพิ่มตัวเลือก
              </ModalHeader>
              <ModalBody>
                <CheckboxGroup
                  label="เลือกตัวเลือกสำหรับเมนู"
                  value={selected}
                  onValueChange={setSelected}
                >
                  <div className="flex flex-col gap-4">
                    {options.map((option, key) => (
                      <Card key={key}>
                        <CardBody className="flex flex-row gap-2">
                          <Checkbox value={JSON.stringify(option)}></Checkbox>
                          <div className="flex flex-col gap-2">
                            <h3 className="font-bold">{option.name}</h3>
                            <p className="opacity-70">{readChoice(option)}</p>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </CheckboxGroup>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setSelected([]);
                    onClose();
                  }}
                >
                  กลับ
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    saveOption();
                    onClose();
                  }}
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

export default ButtonAddOption;
