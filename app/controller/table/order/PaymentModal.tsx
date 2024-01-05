"use client"
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import QRCode from "react-qr-code";
import generatePayload from "promptpay-qr";
import Image from "next/image";
import { TableQuery } from "../page";
import axios from "axios";
import { clientWebserverUrl } from "@/app/constant";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { OrderQuery } from "../../incomming/page";

const PaymentModal = ({
  totalPrice,
  orders,
  tableInfo,
}: {
  totalPrice: number;
  orders: OrderQuery[];
  tableInfo: TableQuery;
}) => {
  const mobileNumber = "063-068-7232";

  const router = useRouter()

  const [open, setOpen] = useState(false);
  const [paymentSrc, setPaymentSrc] = useState("");
  const [loadingState, setLoadingState] = useState(false);


  const onOpenChange = () => setOpen(!open);

  const initQr = () => {
    const payload = generatePayload(mobileNumber, { amount: totalPrice });
    setPaymentSrc(payload);
    onOpenChange();
  };

  const confirmPayment = async () => {
    setLoadingState(true);
    try {
      let res = await axios.put(`${clientWebserverUrl}/api/tables/${tableInfo.id}`, {
        name: tableInfo.name,
        status: "OPEN",
        uuid: crypto.randomUUID()
      })
      if (res.status !== 200) {
        throw new Error()
      }
      res = await axios.put(`${clientWebserverUrl}/api/memo-orders/table/${tableInfo.id}`, {
        order: ""
      })
      if (res.status === 200) {
        toast.success("ชำระเงินสำเร็จ")
        router.push("/table")
      } else {
        toast.error("ชำระเงินล้มเหลว")
      }
      
    } catch (error) {
      console.log(error)
    }
    setLoadingState(false);
  };

  return (
    <div>
      <Button
        color="primary"
        size="lg"
        onClick={initQr}
        isDisabled={
          orders.filter((order) => order.status === "SUCCESS").length === 0
        }
      >
        ชำระเงิน
      </Button>
      <Modal
        isOpen={open}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                ชำระเงิน
                <p className="text-sm text-neutral-500">
                  ตรวจสอบรายการทั้งหมดก่อนชำระเงิน!!!
                </p>
              </ModalHeader>
              <ModalBody>
                <div
                  className="flex flex-col w-full items-center"
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 256,
                    width: "100%",
                  }}
                >
                  <Image
                    src={"/promptpay_logo.jpg"}
                    alt="#"
                    width={200}
                    height={50}
                  />
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={paymentSrc}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                <h3 className="text-3xl w-full text-center">
                  {totalPrice.toFixed(2)} ฿
                </h3>
                <h3 className="text-base w-full text-center text-neutral-500">
                  ชำระเสร็จแล้วกดยืนยันการชำระ
                </h3>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={loadingState}
                >
                  ปิด
                </Button>
                <Button
                  color="primary"
                  onPress={async () => {
                    await confirmPayment();
                    onClose();
                  }}
                  isLoading={loadingState}
                >
                  ยืนยันการชำระเงิน
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PaymentModal;
