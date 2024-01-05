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
import { clientWebserverUrl } from "@/app/constant";
import { getToken } from "../home/serverAction";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

const Page = () => {
  const router = useRouter()

  const [forceLoading, callForceLoading] = useState(false);
  const [menuTypes, setMenuTypes] = useState<MenuTypeQuery[]>([]);

  useEffect(() => {
    const loadMenuType = async () => {
      try {
        const jwtToken = await getToken();
        const res = await axios.get(`${clientWebserverUrl}/api/menu-types`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            Preload: "true",
          },
        });
        setMenuTypes(res.data);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาด")
          return router.push("/login")
        }
        console.error(e);
      }
    };
    loadMenuType();
  }, [forceLoading, router]);

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
