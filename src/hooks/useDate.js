//hooks
import { useEffect, useState } from "react"

export const useDate = () => {

    const [date, setDate] = useState('')

    useEffect(() => {

        let day = new Date().getDate().toString();
        let month = (new Date().getMonth() + 1).toString();
        let year = new Date().getFullYear().toString();

        day = day < 10 ? '0' + day : day;
        month = month < 10 ? '0' + month : month;

        setDate(`${ year }-${ month }-${ day }`)

    }, [])

    return date
}