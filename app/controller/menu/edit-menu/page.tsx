"use client";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
  Chip,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { MenuQuery, OptionQuery } from "../page";
import axios from "axios";
import ButtonAddOption from "../new-menu/ButtonAddOption";
import toast from "react-hot-toast";
import { updateMenu } from "../serverAction";
import { clientWebserverUrl } from "@/app/constant";
import { getToken } from "../../home/serverAction";

const Page = () => {
  const searchParams = useSearchParams();

  const [menuName, setMenuName] = useState("");
  const [menuPrice, setMenuPrice] = useState(0);
  const [menuOptions, setMenuOptions] = useState<OptionQuery[]>([]);
  const [menuStatus, setMenuStatus] = useState("");
  const [menuTypeId, setMenuTypeId] = useState(0);
  // implement menu type

  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      setLoadingState(true);
      try {
        const jwtToken = await getToken()
        const res = await axios.get(
          `${clientWebserverUrl}/api/menus/${searchParams.get("id")}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`
            }
          }
        );
        const menu: MenuQuery = res.data;
        setMenuName(menu.name);
        setMenuPrice(menu.price);
        setMenuOptions(menu.options);
        setMenuStatus(menu.status);
        setMenuTypeId(menu.menu_type_id);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาด");
        }
        console.error(e.message)
      }
      setLoadingState(false);
    };
    loadMenu();
  }, [searchParams]);

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
          <Link href={`/controller/menu/${menuTypeId}`}>
            <p className="text-2xl font-bold">จัดการเมนู</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="text-2xl font-bold">แก้ไข</p>
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
        <h3 className="font-bold">สถานะ</h3>
        <Select
          label="เลือกสถานะ"
          isLoading={loadingState}
          selectedKeys={[menuStatus]}
          onChange={(e) => {
            console.log(e);
            setMenuStatus(e.target.value);
          }}
        >
          <SelectItem key={"OPEN"}>เปิด</SelectItem>
          <SelectItem key={"CLOSE"}>ปิด</SelectItem>
        </Select>
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
            href={`/controller/menu/property-menu?id=${searchParams.get("id")}`}
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
              if (!id || !menuStatus) {
                setLoadingState(false);
                return toast.error("แก้ไขล้มเหลว id หรือ status ไม่ถูกต้อง");
              }
              const status = await updateMenu(
                parseInt(id),
                menuName,
                menuPrice,
                menuStatus,
                menuOptions
              );
              if (status === 200) {
                toast.success("แก้ไขเมนูสำเร็จ");
              } else {
                toast.error(`แก้ไขเมนูล้มเหลว รหัส ${status}`);
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
