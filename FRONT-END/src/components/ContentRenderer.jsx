import React from "react";
//inventory
import Categoria from "./Inventory/Categoria";
import Insumo from "./Inventory/Insumo";
import Producto from "./Inventory/Producto";
//production
import ListaReceta from "./Production/ListaReceta";
import Produccion from "./Production/Produccion";
//purchase
import VerCompra from "./Purchase/VerCompra";
import Compra from "./Purchase/Compra";
import Supplier from "./Purchase/Supplier";
//sale
import Reportes from "./Sale/Reportes";
import FacturaReporte from "./Sale/FacturaReporte";
import Factura from "./Sale/Factura";
import Pedido from "./Sale/Pedido";
//user
import User from "./User/User";
import Role from "./User/Role";

// Declara un componente funcional llamado ContentRenderer que acepta una prop llamada activeComponent.
const ContentRenderer = ({ activeComponent }) => {
  // Utiliza una declaración switch para determinar qué componente debe renderizarse en función del valor de activeComponent.
  switch (activeComponent) {
    //inventory
    case "Categorías":
      return <Categoria />;
    case "Insumos":
      return <Insumo />;
    case "Producto":
      return <Producto />;
    //production
    case "Recetas":
      return <ListaReceta />;
    case "Producir":
      return <Produccion />;
    //Purchase compra
    case "Ver compras":
      return <VerCompra />;
    case "Añadir compras":
      return <Compra />;
    case "Proveedores":
      return <Supplier />;
    //Sale venta
    case "Reportes Graficos":
      return <Reportes />;
    case "Facturas Reporte":
      return <FacturaReporte />;
    case "Facturas":
      return <Factura />;
    case "Pedidos":
      return <Pedido />;
    //User
    case "Empleados":
      return <User />;
    case "Roles":
      return <Role />;

    default:
      return <h2>Ruta no encontrada</h2>;
  }
};

export default ContentRenderer;
