import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import axios from "axios";
import "../../styles/Graficos.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar las escalas y otros componentes necesarios
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Reportes = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [comportamiento, setComportamiento] = useState([]);
  const [producto, setProducto] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [ventasProducto, setVentasProducto] = useState([]);

  useEffect(() => {
    const fetchVentasDiarias = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ventas-diarias`
        );
        const responseProductos = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/productos-mas-vendidos`
        );
        const responseComportamiento = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/comportamiento-mensual`
        );
        const responseProducto = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/productos`
        );
        setProducto(responseProducto.data);
        setVentas(response.data.ventas_diarias);
        setProductos(responseProductos.data.productos_mas_vendidos);
        setComportamiento(responseComportamiento.data.comportamiento_mensual);
      } catch (error) {
        console.error("Error al obtener ventas diarias:", error);
      }
    };

    fetchVentasDiarias();
  }, []);

  useEffect(() => {
    const fetchVentasProducto = async () => {
      if (productoSeleccionado) {
        try {
          const response = await axios.get(
            `${
              import.meta.env.VITE_API_URL
            }/api/ventas-producto/${productoSeleccionado}`
          );
          setVentasProducto(response.data.ventas_producto);
        } catch (error) {
          console.error("Error al obtener ventas del producto:", error);
        }
      }
    };

    fetchVentasProducto();
  }, [productoSeleccionado]);
  // Preparar datos para Chart.js
  const dataVentas = {
    labels: ventas.map((venta) => venta.fecha_venta), // Fechas
    datasets: [
      {
        label: "Ventas Diarias",
        data: ventas.map((venta) => venta.total_ventas), // Totales
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const dataProductos = {
    labels: productos.map((producto) => producto.nombre_producto), // Productos
    datasets: [
      {
        label: "Productos Más Vendidos",
        data: productos.map((producto) => producto.cantidad_vendida), // Cantidades
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const dataComportamiento = {
    labels: comportamiento.map(
      (comportamiento) => `${comportamiento.mes}/${comportamiento.año}`
    ), // Meses y Año
    datasets: [
      {
        label: "Comportamiento Mensual",
        data: comportamiento.map(
          (comportamiento) => comportamiento.ingresos_mensuales
        ), // Totales
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderWidth: 2,
      },
    ],
  };

  const dataVentasProducto = {
    labels: ventasProducto.map((venta) => venta.fecha_venta), // Fechas
    datasets: [
      {
        label: `Ventas de ${productoSeleccionado.nombre}`,
        data: ventasProducto.map((venta) => venta.total_vendido), // Cantidades
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderWidth: 2,
      },
    ],
  };
  const optionsVentasProducto = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} unidades`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "mes/dia",
        },
      },
      y: {
        title: {
          display: true,
          text: "Unidades vendidas",
        },
        beginAtZero: true,
        ticks: {
          // Asegura que las etiquetas del eje Y sean más detalladas
          stepSize: 1, // Número de divisiones en el eje
          precision: 0, // Número de decimales en las etiquetas (ajustar según lo necesario)
          callback: function (value) {
            return value.toLocaleString(); // Formato de número con comas
          },
        },
      },
    },
  };

  const optionsVentas = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Total del dia: $${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dias",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ventas $",
        },
        beginAtZero: true,
      },
    },
  };
  const optionsProductos = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Cantidad vendida: ${tooltipItem.raw} unidades`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Productos",
        },
      },
      y: {
        title: {
          display: true,
          text: "Cantidad Vendida",
        },
        beginAtZero: true,
        min:
          Math.min(...productos.map((producto) => producto.cantidad_vendida)) -
          10, // Ajusta el valor mínimo
      },
    },
  };

  const optionsComportamiento = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Unidades vendidas: $${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Mes/Año",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ingresos Mensuales",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard">
      {/* Gráfico de Ventas Diarias */}
      <div className="card">
        <h3>Ventas Diarias Generales</h3>
        <div>
          <h2>Ultimos 10 días</h2>
          <Line data={dataVentas} options={optionsVentas} />
        </div>
      </div>

      {/* Gráfico de Productos Más Vendidos */}
      <div className="card">
        <h3>Productos mas Demandados</h3>
        <div>
          <h2>Mejores 5 productos</h2>
          <Bar data={dataProductos} options={optionsProductos} />
        </div>
      </div>

      {/* Gráfico de Comportamiento Mensual */}
      <div className="card">
        <h3>Comportamiento Mensual</h3>
        <div>
          <h2>Ventas Mensuales</h2>
          <Line data={dataComportamiento} options={optionsComportamiento} />
        </div>
      </div>

      {/* Gráfico de Ventas por Producto */}
      <div className="card">
        <h3>Ventas Diarias </h3>
        <div>
          <h2>Ventas diarias para cada producto</h2>
          <select
            value={productoSeleccionado}
            onChange={(e) => setProductoSeleccionado(e.target.value)}
          >
            <option value="">Seleccione un producto</option>
            {producto.map((producto) => (
              <option key={producto.ide} value={producto.ide}>
                {producto.nombre}
              </option>
            ))}
          </select>
          {productoSeleccionado && (
            <Line data={dataVentasProducto} options={optionsVentasProducto} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Reportes;
