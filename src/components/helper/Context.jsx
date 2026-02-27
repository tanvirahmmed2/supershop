'use client'
import axios from "axios";
import {  createContext, useEffect, useState } from "react";


export const Context=createContext()


const ContextProvider=({children})=>{

    const [panelSidebar, setPanelSidebar]= useState(false)

    //data collections

    const [brands, setBrands]= useState([])
    const [categories, setCategories]= useState([])


    // fetch data collections

    const fetchBrands=async()=>{
        try {
            const res= await axios.get('/api/brand', {withCredentials:true})
            setBrands(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setBrands([])
            
        }
    }
    const fetchCategories=async()=>{
        try {
            const res= await axios.get('/api/category', {withCredentials:true})
            setCategories(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setCategories([])
            
        }
    }

    //call data collections

    useEffect(()=>{
        fetchBrands()
        fetchCategories()
    },[])
    

    const contextValue={
        panelSidebar, setPanelSidebar,
        brands,categories,
        fetchBrands,fetchCategories

    }

    return <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>

}

export default ContextProvider
