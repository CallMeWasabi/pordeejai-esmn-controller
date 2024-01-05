"use client";
import { useSearchParams } from "next/navigation";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Input,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import React, { useState } from "react";
import Link from "next/link";
import { OptionQuery } from "../page";
import ButtonAddOption from "./ButtonAddOption";
import toast from "react-hot-toast";
import { createMenu } from "../serverAction";

const Page = () => {
  const searchParams = useSearchParams();

  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState(0);
  const [menuOptions, setMenuOptions] = useState<OptionQuery[]>([]);

  const [loadingState, setLoadingState] = useState(false);

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

  return (
    <div className="p-5">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/controller/menu"}>
            <p className="text-2xl font-bold">จัดการประเภทอาหาร</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link href={`/controller/menu/${searchParams.get("id")}`}>
            <p className="text-2xl font-bold">จัดการเมนู</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="text-2xl font-bold">สร้าง</p>
        </BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex flex-col gap-2">
        <h3 className="font-bold">ชื่อเมนู</h3>
        <Input
          placeholder="ชื่อเมนู"
          variant="faded"
          type="text"
          value={menuName}
          onChange={(e) => setMenuName(e.target.value)}
          isDisabled={loadingState}
        />
        <h3 className="font-bold">ราคาเริ่มต้น</h3>
        <Input
          variant="faded"
          type="number"
          placeholder="ราคาเมนู"
          value={menuPrice.toString()}
          onChange={(e) => setMenuPrice(parseInt(e.target.value))}
          isDisabled={loadingState}
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="font-bold">฿</span>
            </div>
          }
        />
        <h3 className="font-bold">ตัวเลือก</h3>
        <div className="flex flex-col gap-2"></div>
        <ButtonAddOption
          loadingState={loadingState}
          menuOptions={menuOptions}
          setMenuOptions={setMenuOptions}
        />
        <div className="flex flex-col gap-2">
          {menuOptions.map((option, key) => (
            <Card key={key}>
              <CardBody className="flex flex-row justify-between gap-2 items-center">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold">{option.name}</h3>
                  <p className="opacity-70">{readChoice(option)}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        <div className="flex gap-2 mt-5">
          <Button
            className="w-full"
            variant="flat"
            color="primary"
            as={Link}
            href={`/controller/menu/${searchParams.get("id")}`}
            isDisabled={loadingState}
          >
            กลับ
          </Button>
          <Button
            className="text-white w-full"
            color="primary"
            variant="shadow"
            isLoading={loadingState}
            onClick={async () => {
              setLoadingState(true);
              const id = searchParams.get("id");
              if (!id) {
                toast.error("ไม่พบ ประเภท เมนู");
                setLoadingState(false);
                return;
              }
              const status = await createMenu(
                menuName,
                menuPrice,
                menuOptions,
                parseInt(id)
              );
              if (status === 200) {
                toast.success("สร้างเมนู สำเร็จ");
                setMenuName("");
                setMenuPrice(0);
                setMenuOptions([]);
              } else {
                toast.error(`สร้างเมนู ล้มเหลว รหัส ${status}`);
              }
              setLoadingState(false);
            }}
          >
            บันทึก
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
