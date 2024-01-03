"use server"

import axios from "axios"

const webServerUrl = process.env.WEBSERVER_URL

export const createTable = async (tableName: string) => {


    const tableInfo = await axios.get(`${webServerUrl}/api/tables`);
    for (let i = 0; i < tableInfo.data.length; i++) {
        if (tableInfo.data[i].name === tableName) {
            return {
                status: 401, 
                message: "มีโต๊ะที่ใช้ชื่อนี้อยู่แล้ว"
            }
        }
    }
    const response = await axios.post(`${webServerUrl}/api/tables`, {
        name: tableName
    })
    if (response.status === 200) {
        return {
            status: 200,
            message: "สร้างเสร็จสิ้น"
        }
    } else {
        return {
            status: response.status,
            message: "ล้มเหลว"
        }
    }
}