"use server"

import axios from "axios"
import { getToken } from "../../home/serverAction"
import { redirect } from "next/navigation"

const webServerUrl = process.env.WEBSERVER_URL

export const createTable = async (tableName: string) => {
    try {
        const jwtToken = await getToken()
        const tableInfo = await axios.get(`${webServerUrl}/api/tables`, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });
        for (let i = 0; i < tableInfo.data.length; i++) {
            if (tableInfo.data[i].name === tableName) {
                return {
                    status: 401, 
                    message: "มีโต๊ะที่ใช้ชื่อนี้อยู่แล้ว"
                }
            }
        }
        const res = await axios.post(`${webServerUrl}/api/tables`, {
            name: tableName
        }, {
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        })
        if (res.status === 200) {
            return {
                status: 200,
                message: "สร้างเสร็จสิ้น"
            }
        } else {
            throw new Error(res.statusText)
        }
    } catch (e: any) {
        if (e.message === "Request failed with status code 401") {
            return redirect("/login")
        }
        console.error(e)
        return {
            status: 500,
            message: "ล้มเหลว"
        }
    }
}