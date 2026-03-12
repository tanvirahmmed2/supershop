'use client'
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const Context = createContext()


const ContextProvider = ({ children }) => {
    //bar and box
    const [panelSidebar, setPanelSidebar] = useState(false)
    const [categoryBox, setCategoryBox] = useState(false)
    const [brandBox, setBrandBox] = useState(false)
    const [supplierBox, setSupplierBox] = useState(false)

    //data collections

    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
    const [branches, setBranches] = useState([])
    const [suppliers, setSuppliers] = useState([])

    const [staff, setStaff] = useState(null)
    const [user, setUser] = useState(null)

    // fetch login info
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const res = await axios.get('/api/staff/login', { withCredentials: true })
                setStaff(res.data.payload)
            } catch (error) {
                setStaff(null)

            }
        }
        fetchStaff()
    }, [])

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('/api/user/login', { withCredentials: true })
                setUser(res.data.payload)
            } catch (error) {
                setUser(null)

            }
        }
        fetchUser()
    }, [])


    const fetchBrands = async () => {
        try {
            const res = await axios.get('/api/brand', { withCredentials: true })
            setBrands(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setBrands([])

        }
    }
    const fetchCategories = async () => {
        try {
            const res = await axios.get('/api/category', { withCredentials: true })
            setCategories(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setCategories([])

        }
    }

    const fetchBranches = async () => {
        try {
            const res = await axios.get('/api/branch', { withCredentials: true })
            setBranches(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setBranches([])

        }
    }
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get('/api/supplier', { withCredentials: true })
            setSuppliers(res.data.payload || [])
        } catch (error) {
            console.log(error)
            setSuppliers([])

        }
    }

    // cart, sales, purchase
    const [cart, setCart] = useState({ items: [] })
    const [purchase, setPurchase] = useState({ items: [] })
    const [sales, setSales] = useState({ items: [] })
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const storedCart = localStorage.getItem('cart');
        const storedPurchase = localStorage.getItem('purchase');
        const storedSales = localStorage.getItem('sales');

        try {
            if (storedCart) setCart(JSON.parse(storedCart));
            if (storedPurchase) setPurchase(JSON.parse(storedPurchase));
            if (storedSales) setSales(JSON.parse(storedSales));
        } catch (e) {
            console.error("Failed to load local storage", e);
        }
        setHydrated(true)
    }, [])

    useEffect(() => {
        if (hydrated) {
            localStorage.setItem('cart', JSON.stringify(cart))
            localStorage.setItem('purchase', JSON.stringify(purchase))
            localStorage.setItem('sales', JSON.stringify(sales))
        }
    }, [cart, purchase, sales, hydrated])


    const addToCart = (product) => {
        if (!product?.product_id) return;

        if (Number(product.stock) <= 0) {
            toast.error("Item is out of stock!");
            return;
        }

        const existingInCart = cart.items.find(item => item.product_id === product.product_id);

        if (existingInCart) {
            if (existingInCart.quantity >= Number(product.stock)) {
                toast.warning(`Only ${product.stock} items available in stock`);
                return;
            }

            setCart((prev) => ({
                ...prev,
                items: prev.items.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }));
            toast.info("Quantity increased");
        } else {
            const salePrice = parseFloat(product?.sale_price) || 0;
            const wholeSalePrice = parseFloat(product?.wholesale_price) || 0;
            const discountAmount = parseFloat(product?.discount_price) || 0;

            setCart((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        product_id: product.product_id,
                        image:product.image,
                        name: product.name,
                        quantity: 1,
                        sale_price: salePrice,
                        stock:product.stock,
                        discount_price: discountAmount,
                        price: salePrice
                    }
                ]
            }));
            toast.success("Added to cart");
        }
    };

    const removeFromCart = (id) => {
        setCart(prev => ({ ...prev, items: prev.items.filter(item => item.product_id !== id) }))
    }

    const decreaseCartQuantity = (id) => {
        setCart((prev) => {
            const existing = prev.items.find(item => item.product_id === id)
            if (!existing) return prev
            if (existing.quantity > 1) {
                return {
                    ...prev,
                    items: prev.items.map(item =>
                        item.product_id === id ? { ...item, quantity: item.quantity - 1 } : item
                    )
                }
            }
            return { ...prev, items: prev.items.filter(item => item.product_id !== id) }
        })
    }

    const clearCart = () => {
        setCart({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('cart');
        toast.success("Cart cleared");
    };

    const addToPurchase = (product) => {
        if (!product?.product_id) return;

        const existingInPurchase = purchase.items.find(item => item.product_id === product.product_id);

        if (existingInPurchase) {
            setPurchase((prev) => ({
                ...prev,
                items: prev.items.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }));
            toast.info("Purchase quantity increased");
        } else {
            setPurchase((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        product_id: product.product_id,
                        name: product.name,
                        quantity: 1,
                        purchase_price: parseFloat(product?.purchase_price) || 0, 
                    }
                ]
            }));
            toast.success("Added to purchase list");
        }
    };

    const removeFromPurchase = (id) => {
        setPurchase(prev => ({ ...prev, items: prev.items.filter(item => item.product_id !== id) }));
    };

    const decreasePurchaseQuantity = (id) => {
        setPurchase((prev) => {
            const existing = prev.items.find(item => item.product_id === id);
            if (!existing) return prev;
            if (existing.quantity > 1) {
                return {
                    ...prev,
                    items: prev.items.map(item =>
                        item.product_id === id ? { ...item, quantity: item.quantity - 1 } : item
                    )
                };
            }
            return { ...prev, items: prev.items.filter(item => item.product_id !== id) };
        });
    };

    const clearPurchase = () => {
        setPurchase({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('purchase');
        toast.success("Purchase list cleared");
    };


    const addToSales = (product) => {
        if (!product?.product_id) return;

        // Optional: Stock check for sales
        if (Number(product.stock) <= 0) {
            toast.error("Item is out of stock!");
            return;
        }

        const existingInSales = sales.items.find(item => item.product_id === product.product_id);

        if (existingInSales) {
            if (existingInSales.quantity >= Number(product.stock)) {
                toast.warning("Stock limit reached");
                return;
            }

            setSales((prev) => ({
                ...prev,
                items: prev.items.map(item =>
                    item.product_id === product.product_id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }));
        } else {
            setSales((prev) => ({
                ...prev,
                items: [
                    ...prev.items,
                    {
                        product_id: product.product_id,
                        name: product.name,
                        quantity: 1,
                        price: parseFloat(product?.sale_price) || 0,
                    }
                ]
            }));
            toast.success("Added to sales");
        }
    };

    const removeFromSales = (id) => {
        setSales(prev => ({ ...prev, items: prev.items.filter(item => item.product_id !== id) }));
    };

    const decreaseSalesQuantity = (id) => {
        setSales((prev) => {
            const existing = prev.items.find(item => item.product_id === id);
            if (!existing) return prev;
            if (existing.quantity > 1) {
                return {
                    ...prev,
                    items: prev.items.map(item =>
                        item.product_id === id ? { ...item, quantity: item.quantity - 1 } : item
                    )
                };
            }
            return { ...prev, items: prev.items.filter(item => item.product_id !== id) };
        });
    };

    const clearSales = () => {
        setSales({ items: [] });
        if (typeof window !== 'undefined') localStorage.removeItem('sales');
        toast.success("Sales cleared");
    };




    useEffect(() => {
        fetchBrands()
        fetchCategories()
        fetchBranches()
    }, [])


    const contextValue = {
        panelSidebar, setPanelSidebar, categoryBox, setCategoryBox, brandBox, setBrandBox,supplierBox, setSupplierBox,
        brands, categories, branches, suppliers, staff, user,
        fetchBrands, fetchCategories, fetchBranches, fetchSuppliers,
        cart, addToCart, removeFromCart, clearCart, decreaseCartQuantity, sales, addToSales, removeFromSales, decreaseSalesQuantity, removeFromSales,clearSales, purchase,setPurchase, addToPurchase, removeFromPurchase, decreasePurchaseQuantity, clearPurchase
    }

    return <Context.Provider value={contextValue}>
        {children}
    </Context.Provider>

}

export default ContextProvider
