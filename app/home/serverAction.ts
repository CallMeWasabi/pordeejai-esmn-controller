"use server"

import axios from "axios"

const webServerUrl = process.env.WEBSERVER_URL

export const startTableService = async (tableId: number) => {
    const response = await axios.put(`${webServerUrl}/api/tables/${tableId}/status`, {
        status: "IN_SERVICE"
    })
    if (response.status === 200) {
        return {
            status: 200,
            message: "เริ่มต้นการทำงานเสร็จสิ้น"
        }
    } else {
        return {
            status: response.status,
            message: "เริ่มต้นการทำงานล้มเหลว"
        }
    }
}