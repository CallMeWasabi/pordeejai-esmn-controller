"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import axios from "axios";
import CardMenuType from "./CardMenuType";
import ButtonAddMenuType from "./ButtonAddMenuType";

export interface MenuTypeQuery {
  id: number;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  menus: MenuQuery[];
}

export interface OptionQuery {
  id: number;
  name: string;
  choices: string;
  required: boolean;
  multi_select: boolean;
  max_multi: number;
  created_at: Date;
  updated_at: Date;
}

export interface MenuQuery {
  id: number;
  name: string;
  price: number;
  options: OptionQuery[];
  status: string;
  created_at: Date;
  updated_at: Date;
  menu_type_id: number;
}

const convertThaiDate = (date: Date) => {
  const result = new Date(date);
  return result.toLocaleString("th-TH", {
    dateStyle: "long",
    timeStyle: "medium",
  });
};

const Page = () => {
  const [forceLoading, callForceLoading] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuTypeQuery[]>([]);

  useEffect(() => {
    const loadMenuType = async () => {
      const resposne = await axios.get("http://localhost:8080/api/menu-types", {
        headers: {
          Preload: "true",
        },
      });
      setMenuTypes(resposne.data);
    };
    loadMenuType();
  }, [forceLoading]);

  return (
    <div className="p-5 flex flex-col w-[80vw]">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem>
          <p className="text-2xl font-bold">จัดการประเภทอาหาร</p>
        </BreadcrumbItem>
      </Breadcrumbs>
      <Card>
        <CardBody className="grid grid-cols-6 md:grid-cols-4 gap-3">
          {menuTypes.map((menuType, key) => (
            <CardMenuType key={key} row={menuType} />
          ))}
          <ButtonAddMenuType
            forceLoading={forceLoading}
            callForceLoading={callForceLoading}
          />
        </CardBody>
      </Card>
    </div>
  );
};

export default Page;
