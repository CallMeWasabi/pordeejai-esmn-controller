"use client";
import { clientWebserverUrl } from "@/app/constant";
import { MemoOrderQuery, OrderQuery } from "@/app/incomming/page";
import {
  Button,
  Chip,
  Code,
  Divider,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TableQuery } from "../page";
import { TbReceiptOff } from "react-icons/tb";
import QrModal from "./QrModal";
import { IconContext } from "react-icons";
import Link from "next/link";
import PaymentModal from "./PaymentModal";

const Page = () => {
  const searchParams = useSearchParams();

  const [memo, setMemo] = useState<MemoOrderQuery>();
  const [orders, setOrders] = useState<OrderQuery[]>([]);
  const [tableInfo, setTableInfo] = useState<TableQuery>();
  const [totalPrice, setTotaoPrice] = useState(0);
  const [trigger, setTrigger] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const refetch = () => setTrigger(!trigger);

  useEffect(() => {
    const loadOrders = async () => {
      setLoadingState(true);
      try {
        const res = await axios.get(
          `${clientWebserverUrl}/api/memo-orders/table/${searchParams.get(
            "id"
          )}`
        );
        setMemo(res.data);
        setOrders(JSON.parse(res.data.order));
      } catch (error) {
        console.log(error);
      }
      setLoadingState(false);
    };
    loadOrders();
  }, [searchParams, trigger]);

  useEffect(() => {
    const loadTable = async () => {
      setLoadingState(true);
      try {
        const res = await axios.get(
          `${clientWebserverUrl}/api/tables/${searchParams.get("id")}`
        );
        setTableInfo(res.data);
      } catch (error) {
        console.log(error);
      }
      setLoadingState(false);
    };
    loadTable();
  }, [searchParams]);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].status === "SUCCESS") {
        total += orders[i].price;
      }
    }
    setTotaoPrice(total);
  }, [orders]);

  return (
    <div className="p-5 flex flex-col gap-4">
      <Breadcrumbs className="w-[512px] mb-5">
        <BreadcrumbItem>
          <Link href={"/table"}>
            <p className="font-bold text-2xl">จัดการโต๊ะ</p>
          </Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <p className="font-bold text-2xl">รายการคำสั่งซื้อ</p>
        </BreadcrumbItem>
      </Breadcrumbs>
      <h3 className="font-bold text-xl">{tableInfo?.name}</h3>
      <div className="flex justify-between">
        {tableInfo && <QrModal tableInfo={tableInfo} />}
        <Button
          color="primary"
          variant="light"
          onClick={refetch}
          isLoading={loadingState}
        >
          โหลดข้อมูลใหม่
        </Button>
      </div>
      <Chip color="success" variant="flat" size="lg">
        สำเร็จ
      </Chip>
      {orders.filter((order) => order.status === "SUCCESS").length > 0 ? (
        <>
          {orders
            .filter((order) => order.status === "SUCCESS")
            .map((order, key) => (
              <div key={key} className="flex justify-between">
                <div className="flex gap-2">
                  <Code>{order.quantity}</Code>
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-bold">{order.name}</h3>
                    <div className="flex space-x-2">
                      {order.options.map((option, key) => (
                        <div key={key} className="text-neutral-500">
                          {option.value.join(" + ")}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-bold">฿{order.price}</p>
              </div>
            ))}
          <Divider />
          <div className="flex justify-between">
            <p className="font-bold text-xl">ทั้งหมด</p>
            <p className="font-bold text-xl">฿{totalPrice}</p>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-between items-center text-neutral-500">
          <IconContext.Provider value={{ size: "56px" }}>
            <TbReceiptOff />
          </IconContext.Provider>
          <p className="font-bold">ไม่มีรายการ</p>
        </div>
      )}
      <div className="flex justify-end">
        {tableInfo && (
          <PaymentModal
            totalPrice={totalPrice}
            orders={orders}
            tableInfo={tableInfo}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
