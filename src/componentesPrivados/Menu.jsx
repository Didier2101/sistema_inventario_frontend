import { NavLink } from "react-router-dom"

import PropTypes from 'prop-types';


import HomeIcon from "@mui/icons-material/Home";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';






const Menu = ({ userRole }) => {

    return (
        <section className='section-menu'>
            <ul>
                <NavLink to="/administrativo/inicio" className="navlink-menu">
                    <HomeIcon className="icon-menu" />
                    <p className="text">Inicio</p>
                </NavLink>
                <NavLink to="/administrativo/productos" className="navlink-menu">
                    <Inventory2Icon className="icon-menu" />
                    <p className="text">Productos</p>
                </NavLink>

                {(userRole !== 'bodeguero' && userRole !== 'vendedor') && (
                    <NavLink to="/administrativo/empleados" className="navlink-menu">
                        <GroupAddIcon className="icon-menu" />
                        <p className="text">Empleados</p>
                    </NavLink>
                )}

                {(userRole !== 'bodeguero') && (
                    <NavLink to="/administrativo/clientes" className="navlink-menu">
                        <GroupAddIcon className="icon-menu" />
                        <p className="text">Clientes</p>
                    </NavLink>
                )}
                {(userRole !== 'vendedor') && (
                    <NavLink to="/administrativo/proveedores" className="navlink-menu">
                        <BusinessCenterIcon className="icon-menu" />
                        <p className="text">Proveedores</p>
                    </NavLink>
                )}




                {(userRole !== 'bodeguero' && userRole !== 'vendedor') && (
                    <>
                        <NavLink to="/administrativo/bodegas" className="navlink-menu">
                            <MapsHomeWorkIcon className="icon-menu" />
                            <p className="text">Bodegas</p>
                        </NavLink>

                        <NavLink to="/administrativo/puntos" className="navlink-menu">
                            <AddBusinessIcon className="icon-menu" />
                            <p className="text">Puntos de venta</p>
                        </NavLink>

                    </>
                )}
                <NavLink to="/administrativo/ventas" className="navlink-menu">
                    <ShoppingCartIcon className="icon-menu" />
                    <p className="text">Ventas</p>
                </NavLink>

            </ul>
        </section>
    )
}
Menu.propTypes = {
    userRole: PropTypes.string.isRequired,
};
export default Menu