"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { clientWebserverUrl } from "../constant";
import toast from "react-hot-toast";
import { setTokenCookie } from "./server";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  const login = async () => {
    setLoadingState(true);

    try {
      const res = await axios.post(`${clientWebserverUrl}/api/login`, {
        username,
        password,
      });
      if (res.status !== 200) {
        throw new Error("unauthorized");
      }

      setTokenCookie(res.data.token);
      toast.success("เข้าสู่ระบบสำเร็จ");
      return router.push("controller/home");
      
    } catch (error) {
      console.log(error);
      setErr(true);
      setErrMessage("ชื่อผู้ใช้งาน หรือ รหัสผ่านไม่ถูกต้อง");
    }

    setLoadingState(false);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card>
        <CardHeader className="font-bold">เข้าสู่ระบบ</CardHeader>
        <CardBody>
          <Input
            label="ชื่อผู้ใช้งาน"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            isInvalid={err}
          />
          <Input
            label="รหัส"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            isInvalid={err}
            errorMessage={errMessage}
          />
        </CardBody>
        <CardFooter>
          <Button
            color="primary"
            className="w-full"
            isLoading={loadingState}
            onClick={login}
          >
            เข้าสู่ระบบ
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
