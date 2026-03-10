'use client'
import axios from "axios";
import {  createContext, useEffect, useState } from "react";


export const Context=createContext()


const ContextProvider=({children})=>{
    //bar and box
    const [panelSidebar, setPanelSidebar]= useState(false)
    const [categoryBox, setCategoryBox]= useState(false)
    const [brandBox, setBrandBox]= useState(false)

    //data collections

    const [brands, setBrands]= useState([])
    const [categories, setCategories]= useState([])
    const [branches, setBranches]= useState([])
    const [suppliers, setSuppliers]= useState([])

    const [staff, setStaff]= useState(null)
    const [user, setUser]= useState(null)

    useEffect(()=>{
        const fetchStaff=async()=>{
            try {
                const res= await axios.get('/api/staff/login', {withCredentials:true})
                setStaff(res.data.payload)
            } catch (error) {
                setStaff(null)
                
            }
        }
        fetchStaff()
    },[])

    useEffect(()=>{
        const fetchUser=async()=>{
            try {
                const res= await axios.get('/api/user/login', {withCredentials:true})
                setUser(res.data.payload)
            } catch (error) {
                setUser(null)
                
            }
        }
        fetchUser()
    },[])

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
   
    const fetchBranches=async()=>{
        try {
            const res= await axios.get('/api/branch', {withCredentials:true})
            setBranches(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setBranches([])
            
        }
    }
    const fetchSuppliers=async()=>{
        try {
            const res= await axios.get('/api/supplier', {withCredentials:true})
            setSuppliers(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setSuppliers([])
            
        }
    }

    //call data collections

    useEffect(()=>{
        fetchBrands()
        fetchCategories()
        fetchBranches()
    },[])
    

    const contextValue={
        panelSidebar, setPanelSidebar, categoryBox, setCategoryBox, brandBox, setBrandBox,
        brands,categories,branches,suppliers, staff, user,
        fetchBrands,fetchCategories, fetchBranches, fetchSuppliers

    }

    return <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>

}

export default ContextProvider
