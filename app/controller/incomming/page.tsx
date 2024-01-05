"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { getToken } from "../home/serverAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { clientWebserverUrl } from "@/app/constant";

export interface SubOptionsQuery {
  name: string;
  price: number;
  value: string[];
}

export interface OrderQuery {
  uuid: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  created_at: string;
  options: SubOptionsQuery[];
}

export interface MemoOrderQuery {
  id: number;
  order: string;
  table_id: number;
  created_at: Date;
  updated_at: Date;
}

const Page = () => {
  const router = useRouter();

  const [loadingState, setLoadingState] = useState(true);
  const [forceReload, setForceReload] = useState(false);
  const [originMemoOrder, setOriginMemoOrder] = useState<MemoOrderQuery[]>([]);
  const [memoOrders, setMemoOrders] = useState<MemoOrderQuery[]>([]);
  const [orders, setOrders] = useState<OrderQuery[]>([]);

  const [cancleModal, setCancleModal] = useState(false);
  const onCancleModalChange = () => setCancleModal(!cancleModal);

  useEffect(() => {
    const loadOrder = async () => {
      setLoadingState(true);
      try {
        const jwtToken = await getToken();
        const res = await axios.get(`${clientWebserverUrl}/api/memo-orders`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const tempMemo = res.data.filter((m: any) =>
          m.order !== "" ? true : false
        );
        setMemoOrders(tempMemo);
        setOriginMemoOrder(res.data);

        let tempOrders: OrderQuery[] = [];
        tempMemo.map((memo: MemoOrderQuery) => {
          const tempOrder = JSON.parse(memo.order);
          for (let i = 0; i < tempOrder.length; i++) {
            if (tempOrder[i].status === "ON_GOING") {
              tempOrders.push(tempOrder[i]);
            }
          }
        });
        tempOrders.sort((a, b) => {
          return Date.parse(a.created_at) - Date.parse(b.created_at);
        });
        setOrders(tempOrders);
      } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
          toast.error("การยืนยันผู้ใช้งานผิดพลาก");
          return router.push("/login");
        }
        console.error(e);
      }
      setLoadingState(false);
    };
    loadOrder();
  }, [forceReload, router]);

  const findTableId = (target: OrderQuery) => {
    for (let i = 0; i < memoOrders.length; i++) {
      const tempOrders = JSON.parse(memoOrders[i].order);
      const uuids = tempOrders.map((t: OrderQuery) => t.uuid);
      if (uuids.includes(target.uuid)) {
        return memoOrders[i].table_id;
      }
    }
  };

  const submitNewStatusToOrder = async (target: OrderQuery, status: string) => {
    const tableId = findTableId(target);
    const currentMemo = originMemoOrder.filter((o) =>
      o.table_id === tableId ? true : false
    );
    let currentOrder = JSON.parse(currentMemo[0].order);
    currentOrder.map((order: OrderQuery) => {
      if (order.uuid === target.uuid) {
        order.status = status;
        return order;
      }
      return order;
    });
    try {
      const jwtToken = await getToken()
      const res = await axios.put(
        `${clientWebserverUrl}/api/memo-orders/table/${tableId}`,
        {
          order: JSON.stringify(currentOrder),
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`
          }
        }
      );
      if (res.status === 200) {
        setForceReload(!forceReload);
      } else {
        throw new Error(res.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5 flex flex-col space-y-4 w-[512px]">
      <h3 className="font-bold text-2xl mb-5">ออเดอร์ตอนนี้</h3>
      <div className="flex justify-between gap-4">
        <Button
          color="success"
          size="lg"
          className="font-bold text-white"
          isLoading={loadingState}
        >
          คงเหลือ {orders.length} รายการ
        </Button>
        <Button
          onClick={() => setForceReload(!forceReload)}
          color="success"
          variant="light"
          size="lg"
          isLoading={loadingState}
        >
          โหลดข้อมูลใหม่
        </Button>
      </div>
      {orders.length > 0 ? (
        <>
          <ScrollShadow className="w-[512px] h-[512px]" size={0}>
            <div className="flex flex-col gap-4">
              {orders.map((order) => (
                <Card key={order.uuid}>
                  <CardHeader className="font-bold text-xl flex gap-2">
                    <p>โต๊ะ</p>
                    <p className="font-bold text-green-500">
                      {findTableId(order)}
                    </p>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-col gap-2">
                      <div className="font-bold text-lg flex gap-2">
                        <p className="text-neutral-500 font-normal">
                          {order.quantity}x
                        </p>
                        <p className="font-bold">{order.name}</p>
                      </div>
                      {order.options.map((o, key) => (
                        <div key={key} className="flex gap-2 text-neutral-500">
                          <p>{o.name}: </p>
                          <p className="text-green-500">
                            {o.value.join(" + ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                  <CardFooter className="flex flex-col w-full gap-4">
                    <div className="w-full">
                      <Button
                        className="w-full"
                        variant="flat"
                        onClick={onCancleModalChange}
                      >
                        ยกเลิกออเดอร์
                      </Button>
                      <Modal
                        isOpen={cancleModal}
                        onOpenChange={onCancleModalChange}
                      >
                        <ModalContent>
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                แน่ใจนะ !!!
                              </ModalHeader>
                              <ModalBody>
                                <p>
                                  ต้องการยกเลิกออเดอร์{" "}
                                  {"(ย้อนกลับไม่ได้แล้วนะ)"}
                                </p>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  isDisabled={loadingState}
                                  color="danger"
                                  variant="light"
                                  onPress={onClose}
                                >
                                  ยกเลิก
                                </Button>
                                <Button
                                  isLoading={loadingState}
                                  color="primary"
                                  onPress={async () => {
                                    setLoadingState(true);
                                    await submitNewStatusToOrder(
                                      order,
                                      "CANCLE"
                                    );
                                    setLoadingState(false);
                                    onClose();
                                  }}
                                >
                                  ยืนยัน
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                    <Button
                      className="w-full text-white"
                      color="success"
                      isLoading={loadingState}
                      onPress={async () => {
                        setLoadingState(true);
                        await submitNewStatusToOrder(order, "SUCCESS");
                        setLoadingState(false);
                      }}
                    >
                      อาหารพร้อมเสริฟ
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </ScrollShadow>
        </>
      ) : (
        <>
          <p>ไม่มีออเดอร์</p>
        </>
      )}
    </div>
  );
};

export default Page;
