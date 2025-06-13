import { useState } from "react";

export default function useToggle(defaultValue = false){
    const [value , setValue] = useState(defaultValue)

    const toggle = ()=>{
        setValue((prev)=> !prev)
    }

    return [value, toggle]
}



// // 1. Yeh false se start karega
// const [value1, toggle1] = useToggle();

// // 2. Yeh true se start karega
// const [value2, toggle2] = useToggle(true);
