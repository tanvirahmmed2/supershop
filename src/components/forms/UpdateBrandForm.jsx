'use client'
import axios from 'axios';
import Image from 'next/image';
import React, { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify';
import { Context } from '../helper/Context';

const UpdateBrandForm = ({ brand }) => {
    const { fetchBrands } = useContext(Context)
    const [formData, setFormData] = useState({
        brand_id: brand?.brand_id,
        name: brand?.name || '',
        description: brand?.description || '',
        image: null
    })

    const [preview, setPreview] = useState('')

    useEffect(() => {
        if (brand?.logo) {
            setPreview(brand.logo)
        }
    }, [brand])

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (type === "file") {
            const file = files[0];
            if (!file) return;

            // Revoke old blob URL to prevent memory leaks
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }

            const newPreview = URL.createObjectURL(file);

            setFormData((prev) => ({
                ...prev,
                image: file,
            }));

            setPreview(newPreview);
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const data = new FormData()
            data.append('brand_id', formData.brand_id)
            data.append('name', formData.name)
            data.append('description', formData.description)
            
            // Only append image if the user actually picked a new file
            if (formData.image) {
                data.append('image', formData.image)
            }

            const res = await axios.patch('/api/brand', data, { withCredentials: true })
            
            if (res.data.success) {
                toast.success(res.data.message)
                if (fetchBrands) {
                    await fetchBrands()
                }
                // Using reload to ensure all components sync with the new DB state
                window.location.reload()
            }

        } catch (error) {
            toast.error(error?.response?.data?.message || "failed to update brand")
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='w-full max-w-3xl flex flex-col items-center gap-2'>
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="name">Name</label>
                <input 
                    type="text" 
                    name='name' 
                    id='name' 
                    required 
                    onChange={handleChange} 
                    value={formData.name} 
                    className='w-full px-3 p-1 border border-black/20 outline-none' 
                />
            </div>
            
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="description">Description</label>
                <textarea 
                    name="description" 
                    id="description" 
                    onChange={handleChange} 
                    required 
                    value={formData.description} 
                    className='w-full px-3 p-1 border border-black/20 outline-none'
                ></textarea>
            </div>
            
            <div className='w-full flex flex-col gap-1'>
                <label htmlFor="image">Logo (Leave empty to keep current)</label>
                <input 
                    type="file" 
                    name='image' 
                    id='image' 
                    onChange={handleChange} 
                    accept='image/*' 
                    className='w-full px-3 p-1 border border-black/20 outline-none' 
                />
            </div>

            {preview && (
                <div className="mt-2 border border-black/10 p-1">
                    <Image 
                        src={preview} 
                        alt='brand logo' 
                        width={100} 
                        height={100} 
                        className="object-contain h-25 w-25"
                    />
                </div>
            )}

            <button 
                type='submit' 
                className='w-full text-center bg-black p-1 mt-2 cursor-pointer hover:bg-gray-700 text-white'
            >
                Update Brand
            </button>
        </form>
    )
}

export default UpdateBrandForm