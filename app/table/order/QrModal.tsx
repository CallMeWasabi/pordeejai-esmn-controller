"use client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { TableQuery } from "../page";
import QRCode from "react-qr-code";


const QrModal = ({ tableInfo }: { tableInfo: TableQuery }) => {
  const shopUrl = "https://pordeejai-esmn.vercel.app"
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");

  const onOpenChange = () => setOpen(!open);

  const initQr = () => {
    setSrc(`${shopUrl}/auth?uuid=${tableInfo.uuid}`);
    onOpenChange();
  };

  return (
    <div>
      <Button onClick={initQr} color="primary">
        เปิด QRCode
      </Button>
      <Modal isOpen={open} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                QRCode {tableInfo.name}
              </ModalHeader>
              <ModalBody>
                <div
                  style={{
                    height: "auto",
                    margin: "0 auto",
                    maxWidth: 256,
                    width: "100%",
                  }}
                >
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={src}
                    viewBox={`0 0 256 256`}
                  />
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default QrModal;
