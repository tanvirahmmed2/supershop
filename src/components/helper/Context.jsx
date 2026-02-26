'use client'
import {  createContext, useState } from "react";


export const Context=createContext()


const ContextProvider=({children})=>{

    const [panelSidebar, setPanelSidebar]= useState(false)
    

    const contextValue={
        panelSidebar, setPanelSidebar
    }

    return <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>

}

export default ContextProvider
