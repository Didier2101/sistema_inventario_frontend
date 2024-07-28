
import { Navigate, Route, Routes } from "react-router-dom";


import Menu from "../componentesPrivados/Menu"
import Header from "../componentesPrivados/Header"
import Inicio from "../componentes/Inicio"
import Productos from '../componentes/Productos';
import Empleados from '../componentes/Empleados';
import Clientes from '../componentes/Clientes';
import Proveedores from '../componentes/Proveedores';
import PuntosVenta from '../componentes/PuntosVenta';
import Bodegas from '../componentes/Bodegas';
import { useState, useContext } from "react";
import Context from "../contexto/Context";
import Ventas from "../componentes/Ventas";


const Administrativo = () => {

    const [menuVisible, setMenuVisible] = useState(true);
    const { usuario, logueado } = useContext(Context);

    if (!logueado) {
        return <Navigate to="/" />;
    }


    const toggleMenu = () => {
        setMenuVisible(menuVisible);
    };

    return (
        <div className="flex-1">
            {menuVisible && <Menu userRole={usuario.cargo} />}
            <div className="flex-2">
                <Header onMenuToggle={toggleMenu} />
                <Routes>
                    <Route path="inicio" element={<Inicio />} />
                    <Route path="productos" element={<Productos />} />
                    <Route path="empleados" element={<Empleados />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="puntos" element={<PuntosVenta />} />
                    <Route path="bodegas" element={<Bodegas />} />
                    <Route path="ventas" element={<Ventas />} />
                    <Route path="*" element={<Navigate to="inicio" />} />
                </Routes>


            </div>
        </div>
    )
}

export default Administrativo