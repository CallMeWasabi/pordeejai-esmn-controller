"use server"

import axios from "axios"



export const createNewOption = async (name: string, choices: string, required: boolean, multi_select: boolean, max_multi: number) => {
    if (!name || !choices) {
        return {
            status: 401,
            message: "Required field name and choices"
        }
    }

    const response = await axios.post(`${process.env.WEBSERVER_URL}/api/options`, {
        name,
        choices,
        required,
        multi_select,
        max_multi,
    })

    if (response.status === 200) {
        return {
            status: 200,
            message: response.data.status
        }
    } else {
        return {
            status: response.status
        }
    }
}