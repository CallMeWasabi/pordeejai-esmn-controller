"use client";
import React, { useEffect, useState } from "react";
import { MenuQuery } from "../page";
import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Card,
  CardBody,
} from "@nextui-org/react";
import axios from "axios";
import CardMenu from "./CardMenu";
import ButtonAddMenu from "./ButtonAddMenu";
import Link from "next/link";
import { IconContext } from "react-icons";
import { GoPlus } from "react-icons/go";

const Page = ({ params }: { params: { menuTypeId: string } }) => {
  const [menus, setMenus] = useState<MenuQuery[]>([]);
  const [forceLoading, callForceLoading] = useState(false);

  useEffect(() => {
    const loadMenu = async () => {
      const response = await axios.get(
        `http://localhost:8080/api/menus/type/${params.menuTypeId}`
      );
      setMenus(response.data);
    };
    if (params.menuTypeId !== undefined) {
      loadMenu();
    }
  }, [forceLoading, params.menuTypeId]);

  return (
    <div className="p-5 flex flex-col w-[80vw]">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <Link href={"/menu"}>
            <p className="text-2xl font-bold">จัดการประเภทอาหาร</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="text-2xl font-bold">จัดการเมนู</p>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardBody className="grid grid-cols-6 md:grid-cols-4 gap-3">
          {menus.map((menuType, key) => (
            <CardMenu key={key} row={menuType} />
          ))}
          <Link href={{ pathname: `/menu/new-menu`, query: { "id": params.menuTypeId } }}>
            <Button className="h-full w-full">
              <IconContext.Provider value={{ size: "50px" }}>
                <GoPlus />
              </IconContext.Provider>
            </Button>
          </Link>
          {/* <ButtonAddMenu
            forceLoading={forceLoading}
            callForceLoading={callForceLoading}
            menu_type_id={parseInt(params.menuTypeId)}
          /> */}
        </CardBody>
      </Card>
    </div>
  );
};

export default Page;
