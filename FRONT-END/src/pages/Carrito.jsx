import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from '../components/search'; // Componente de búsqueda
import '../styles/carrito.css';

const CarritoPage = () => {
    const [productos, setProductos] = useState([]); // Lista de productos desde la API
    const [filteredProducts, setFilteredProducts] = useState([]); // Productos filtrados
    const [carrito, setCarrito] = useState([]); // Productos en el carrito
    const [search, setSearch] = useState(''); // Valor del buscador
    const [isCarritoOpen, setIsCarritoOpen] = useState(false); // Estado del menú desplegable del carrito
    const Navigate = useNavigate();
    // Llama a la API para obtener productos
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/producto`);
                let data = await response.json();
                // Normalizar: asegurarnos de que data sea un array
                if (!Array.isArray(data)) {
                    console.warn('Se esperaba un array de productos, se recibió:', data);
                    data = Array.isArray(data?.data) ? data.data : [];
                }
                // Asegurar que cada producto tenga `id` (algunos lugares usan `ide`)
                const normalized = data.map((p) => ({ ...p, id: p.id ?? p.ide }));
                setProductos(normalized);
                setFilteredProducts(normalized);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
                setProductos([]);
                setFilteredProducts([]);
            }
        };
        fetchProductos();
    }, []);

    // Maneja el filtro de búsqueda
    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filtered = productos.filter((producto) =>
            producto.nombre.toLowerCase().includes(lowerSearch)
        );
        setFilteredProducts(filtered);
    }, [search, productos]);

    // Agregar un producto al carrito
    const handleAddToCart = (producto) => {
        const cantidadDeseada = producto.cantidadDeseada || 1; // Asegurarse de que la cantidad no sea undefined
        
        setCarrito((prevCarrito) => {
            const existingItem = prevCarrito.find((item) => item.ide === producto.ide);
            
            if (existingItem) {
                // Si el producto ya está en el carrito, calculamos la diferencia
                const diferencia = cantidadDeseada - existingItem.cantidad;
                if (producto.stock >= diferencia) {
                    // Si hay suficiente stock, actualizamos el carrito y el stock
                    return prevCarrito.map((item) =>
                        item.ide === producto.ide
                            ? { ...item, cantidad: cantidadDeseada }
                            : item
                    );
                } else {
                    alert('No hay suficiente stock para agregar al carrito.');
                    return prevCarrito; // No cambiamos el carrito si no hay suficiente stock
                }
            } else {
                // Si no está en el carrito, agregar el producto con la cantidad deseada
                if (producto.stock >= cantidadDeseada) {
                    return [...prevCarrito, { ...producto, cantidad: cantidadDeseada }];
                } else {
                    alert('No hay suficiente stock para agregar al carrito.');
                    return prevCarrito;
                }
            }
        });
    
        // Actualizar el inventario (restar la cantidad de productos que se agregan al carrito)
        setProductos((prevProductos) =>
            prevProductos.map((item) => {
                if (item.ide === producto.ide) {
                    const existingItem = carrito.find((cartItem) => cartItem.ide === producto.ide);
                    const diferencia = existingItem ? cantidadDeseada - existingItem.cantidad : cantidadDeseada;
    
                    return {
                        ...item,
                        stock: item.stock - diferencia, // Restamos la diferencia al stock
                    };
                }
                return item;
            })
        );
    };
    

    // Calcular el total del carrito
    const totalCarrito = carrito.reduce((total, item) => total + item.cantidad * item.precio, 0);

    return (
        <div className="carrito-page">
             <header className="header">
                <h1 className="panaderia-title">Panadería La Espiga</h1>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                <button className="login-btn" onClick={()=>Navigate('auth/login')}>Iniciar sesión</button>
            </header>
            {/* Buscador */}


            {/* Lista de productos */}
            <div className="productos-list">
                {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                    filteredProducts.map((producto) => (
                        <div key={producto.id} className="producto-card">
                        <h3>{producto.nombre}</h3>
                        <p>Precio: ${producto.precio}</p>
                        <p>Cantidad disponible: {producto.stock}</p>
                        <input
                            type="number"
                            min="0"
                            max={producto.stock}
                            defaultValue="0"
                            className="cantidad-input"
                            onChange={(e) => (producto.cantidadDeseada = Number(e.target.value))}
                        />
                        <button onClick={() => handleAddToCart(producto)} className="add-cart-btn">
                            🛒 Agregar
                        </button>
                        </div>
                    ))
                ) : (
                    <p>No hay productos disponibles.</p>
                )}
            </div>

            {/* Icono del carrito fijo */}
            <div className="floating-cart" onClick={() => setIsCarritoOpen(!isCarritoOpen)}>
                🛒 Ver carrito
            </div>

            {/* Menú desplegable del carrito */}
            {isCarritoOpen && (
                <div className="carrito-sidebar">
                    <h2>Carrito</h2>
                    <ul>
                        {carrito.map((item) => (
                            <li key={item.ide}>
                                {item.nombre} x{item.cantidad} - ${item.cantidad * item.precio}
                            </li>
                        ))}
                    </ul>
                    <p>Total: ${totalCarrito.toFixed(2)}</p>
                    <button className="checkout-btn">Proceder al pago</button>
                    <button className='dlt-btn' onClick={() => setIsCarritoOpen(!isCarritoOpen)}>Cerrar</button>
                </div>
            )}
        </div>
    );
};

export default CarritoPage;
