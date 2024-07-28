import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Box, Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel, Switch, InputBase } from "@mui/material";

// import CheckIcon from '@mui/icons-material/Check';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DescriptionIcon from '@mui/icons-material/Description';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import Context from "../contexto/Context";

const Productos = () => {

  const { usuario } = useContext(Context);

  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [formStock, setFormStock] = useState(false)
  const [subMenu, setSubMenu] = useState(false)
  const [busqueda, setBusqueda] = useState('');
  const [productoID, setProductoID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const [bodegas, setBodegas] = useState([]);
  const [formData, setFormData] = useState({
    proveedor: '',
    bodega: '',
    nombre: '',
    referencia: '',
    descripcion: '',
    precio_compra: '',
    precio_venta: '',
    cantidad: '',
    estado: 1, // Opcionalmente puedes establecer el valor inicial como `true` o `false`
  });

  // Activar el modo de edición y configurar el formulario con datos del producto seleccionado
  const activarModoEdicion = (producto) => {
    const bodega = bodegas.find(b => b.id_bodega === producto.bodega);
    const proveedor = proveedores.find(p => p.id_proveedor === producto.proveedor);
    setModoEditar(true);
    setFormulario(true);
    setFormData({
      proveedor: proveedor ? proveedor.id_proveedor : '',
      bodega: bodega ? bodega.id_bodega : '',
      nombre: producto.nombre,
      referencia: producto.referencia,
      descripcion: producto.descripcion,
      precio_compra: producto.precio_compra,
      precio_venta: producto.precio_venta,
      cantidad: producto.cantidad,
      estado: producto.estado
    });
    setProductoID(producto.id_producto);  // Guardar ID del producto seleccionado
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const obtenerProductos = async () => {
    try {
      const response = await fetch("http://localhost:4000/productos");
      if (response.ok) {
        const data_productos = await response.json();
        setProductos(data_productos);
      } else {
        console.error("No se pudo obtener los productos");
      }
    } catch (error) {
      console.error('Error al obtener los productos', error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch("http://localhost:4000/proveedores");
      if (response.ok) {
        const data_proveedores = await response.json();
        setProveedores(data_proveedores);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('Error al obtener los proveedores', error);
    }
  };

  const obtenerBodegas = async () => {
    try {
      const response = await fetch("http://localhost:4000/bodegas");
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);
      } else {
        console.error("No se pudo obtener las bodegaes");
      }
    } catch (error) {
      console.error('Error al obtener las bodegaes', error);
    }
  };

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
    obtenerBodegas();
  }, []);



  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:4000/productos';
      let method = 'POST';



      if (modoEditar) {
        url += `/${productoID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData }),
      });

      if (response.status === 400) {
        const data = await response.json();
        if (data.error && data.error === "REGISTRO_DUPLICADO") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          console.error('Error al agregar o actualizar el cliente');
          return;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al agregar o actualizar el producto:', errorData.message);
        return;
      }

      if (modoEditar) {
        Swal.fire({
          title: 'Producto Actualizado',
          text: 'El producto ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Producto Agregado',
          text: 'El producto ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerProductos();
      setFormData({
        activo: true,
      });
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };

  const obtenerProductoPorId = async (idProducto) => {
    try {
      const response = await fetch(`http://localhost:4000/productos/${idProducto}`);
      if (response.ok) {
        const data = await response.json();

        const bodega = bodegas.find(b => b.id_bodega === data.bodega);
        const proveedor = proveedores.find(p => p.id_proveedor === data.proveedor);

        setDetalleProducto({
          ...data,
          bodega: bodega ? bodega.nombres : 'Desconocida',
          proveedor: proveedor ? proveedor.empresa : 'Desconocido'
        });
      } else {
        console.error("No se pudo obtener el producto");
      }
    } catch (error) {
      console.error('Error al obtener el producto', error);
    }
  };




  const eliminarProducto = async (productoId, productoNombre) => {
    if (usuario.cargo !== 'administrador') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para eliminar productos.',
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Eliminar producto",
        html: `¿Seguro que quieres eliminar a <strong>${productoNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/productos/${productoId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setProductos(
          productos.filter((producto) => producto.id_producto !== productoId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El producto <strong>${productoNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerProductos();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setDetalleProducto(null);
    setFormulario(false);
    setFormData({
      proveedor: '',
      bodega: '',
      nombre: '',
      referencia: '',
      descripcion: '',
      precio_compra: '',
      precio_venta: '',
      cantidad: '',
      estado: true,
    });
  };



  const toggleEstado = async (id_producto, nuevoEstado) => {
    try {
      const response = await fetch(`http://localhost:4000/productos/${id_producto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      if (response.ok) {
        // Actualizar el estado local de productos
        setProductos(productos.map((producto) =>
          producto.id_producto === id_producto ? { ...producto, estado: nuevoEstado } : producto
        ));
      } else {
        console.error('No se pudo actualizar el estado del producto');
      }
    } catch (error) {
      console.error('Error al actualizar el estado del producto', error);
    }
  };

  // codigo para añadir cantidad al un producto

  const mostrarEstadoTexto = (estado) => {
    return estado ? 'Activo' : 'Inactivo';
  };

  const style_form = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    height: 'auto', // Establece una altura específica para permitir el desplazamiento
    bgcolor: 'background.paper',
    pt: 2,
    px: 4,
    pb: 3,
    overflowY: 'auto', // Desplazamiento solo vertical
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative',
      top: 'auto',
      left: 'auto',
      transform: 'none',
      pt: 0,
      px: 0,
      pb: 0,
      minHeight: '100vh',
    },
  };

  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '400px',
    height: '100vh',
    bgcolor: 'background.paper',
    overflow: 'auto',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative', // Corrige 'relativa' a 'relative'
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };


  const ocultarSubMenu = () => {
    setSubMenu(false)
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Codigo para actualizar o sumar stock a un producto



  const handleNuevoStock = (e) => {
    setNuevaCantidad(e.target.value);
  };
  const mostrarFormularioStock = (productoId) => {
    setFormStock(productoId);
  };
  const ocultarFormularioStock = () => {
    setFormStock(false);
    setNuevaCantidad('');
  };

  const actualizarCantidad = async (id_producto, nuevaCantidad) => {
    try {
      // Llama a la API del backend para actualizar el stock
      const response = await fetch(`http://localhost:4000/productos/${id_producto}/cantidad`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevaCantidad: parseInt(nuevaCantidad) }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar la cantidad');
      }

      // Muestra el mensaje de éxito en la consola
      Swal.fire({
        title: 'Stock Actualizado',
        text: 'La cantidad de stock ha sido actualizada correctamente.',
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });

      setNuevaCantidad('');
      setFormStock(false);
      obtenerProductos();

    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el stock.',
      });
    }
    ocultarFormularioStock()
  };


  return (
    <>


      <section className="section-item">
        <section className="contenedor_buscar">
          <InputBase
            style={{ fontSize: '1.6rem' }}
            placeholder="Buscar productos"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </section >

        <div className="witches">
          <ul className="witches-list">
            <li className="witches-item">
              <span className="cantidad-empleados">{productos.length}</span>
              Listado de los productos
            </li>
            <li>
              <IconButton
                color="primary" sx={{ p: '8px' }}
                onClick={mostarFormulario}
                style={{ background: 'var(--tercero)' }}>
                <AddIcon style={{ color: 'var(--primer)' }} />
              </IconButton>
            </li>
          </ul>
        </div>

        <table className="tabla-items">
          <tbody>
            {productos
              .filter((producto) =>
                producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.proveedor.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.bodega.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
              )
              .map((producto, index) => (
                <tr className="fila" key={index}>
                  <td className="a1">
                    <div className="centered-content">
                      <LocationOnIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      {producto.bodega}
                    </div>
                  </td>


                  <td className="a2">
                    <div className="centered-content">
                      <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      {capitalizeWords(producto.nombre)}
                    </div>
                  </td>

                  <td className="a1">
                    <div className="centered-content">
                      <QrCodeIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      {capitalizeWords(producto.referencia)}
                    </div>
                  </td>

                  <td className="a1">
                    <div className="centered-content">
                      <DescriptionIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      {capitalizeWords(producto.descripcion)}
                    </div>
                  </td>


                  <td className="a1">
                    <div className="centered-content">
                      <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      {producto.precio_venta}
                    </div>
                  </td>

                  <td
                    className={producto.cantidad === 0 ? 'agotado' : 'a1 actualizarStock'}
                  >
                    <div
                      onClick={() => mostrarFormularioStock(producto.id_producto)}
                      className="centered-content">
                      <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                      <strong>   {producto.cantidad === 0 ? 'Agotado' : producto.cantidad} Uds</strong>
                    </div>
                    {formStock === producto.id_producto && (
                      <div className="formStock">
                        <label>Insertar Cantidad</label>
                        <TextField
                          type="number"
                          value={nuevaCantidad}
                          onChange={handleNuevoStock}
                        />
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => actualizarCantidad(producto.id_producto, nuevaCantidad)}
                        >
                          Listo
                        </Button>

                      </div>
                    )}
                  </td>

                  <td className="estado a1">
                    <Switch
                      size="small"
                      checked={!!producto.estado}
                      color="success"
                      onChange={() => toggleEstado(producto.id_producto, !producto.estado)}
                    />
                  </td>
                  <td className="a10">
                    <div className="centered-content">
                      <IconButton onClick={() => setSubMenu(producto.id_producto)}>
                        <MoreVertIcon />
                      </IconButton>
                      {subMenu === producto.id_producto && (
                        <div className="sub_menu" onMouseLeave={ocultarSubMenu}>
                          <div onClick={() => obtenerProductoPorId(producto.id_producto)}>
                            <IconButton size="small" color="success">
                              <InfoIcon />
                            </IconButton>
                            <span>Detalles</span>
                          </div>

                          <div onClick={() => activarModoEdicion(producto)}>
                            <IconButton size="small" color="primary">
                              <EditIcon />
                            </IconButton>
                            <span>Editar</span>
                          </div>

                          <div onClick={() => eliminarProducto(producto.id_producto, producto.nombre)}>
                            <IconButton size="small" color="error">
                              <DeleteIcon />
                            </IconButton>
                            <span>Eliminar</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
          </tbody>
        </table>


        <Modal
          open={formulario}
          onClose={ocultarFormulario}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          closeAfterTransition
        >
          <Box sx={{ ...style_form }}>
            <form className="grid-form" onSubmit={enviarForm}>
              <h2 className="title-form">{modoEditar ? 'Editar Producto' : 'Agregar Producto'}</h2>
              <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
              <div className="contain-inputs">
                <TextField
                  fullWidth
                  label="Referencia"
                  name="referencia"
                  onChange={cambiosInputs}
                  value={formData.referencia}
                  required
                />
                <TextField
                  fullWidth
                  label="Nombre del producto"
                  name="nombre"
                  onChange={cambiosInputs}
                  value={formData.nombre}
                  required
                />
                <TextField
                  type="number"
                  fullWidth
                  label="Cantidad"
                  name="cantidad"
                  onChange={cambiosInputs}
                  value={formData.cantidad}
                  required
                />
                <TextField
                  fullWidth
                  label="Descripción"
                  name="descripcion"
                  onChange={cambiosInputs}
                  value={formData.descripcion}
                  required
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Precio de Compra"
                  name="precio_compra"
                  onChange={cambiosInputs}
                  value={formData.precio_compra}
                  required
                />
                <TextField
                  type="number"
                  fullWidth
                  label="Precio de Venta"
                  name="precio_venta"
                  onChange={cambiosInputs}
                  value={formData.precio_venta}
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="bodega-label">Ubicación</InputLabel>
                  <Select
                    labelId="bodega-label"
                    name="bodega"
                    value={formData.bodega}
                    onChange={cambiosInputs}
                    required
                  >
                    {bodegas.map((bodega) => (
                      <MenuItem key={bodega.id_bodega} value={bodega.id_bodega}>
                        {bodega.nombres}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="proveedor-label">Proveedor</InputLabel>
                  <Select
                    labelId="proveedor-label"
                    name="proveedor"
                    value={formData.proveedor}
                    onChange={cambiosInputs}
                    required
                  >
                    {proveedores.map((proveedor) => (
                      <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                        {proveedor.empresa}
                      </MenuItem>

                    ))}

                  </Select>

                </FormControl>
                <FormControl fullWidth>
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    name="estado"
                    value={formData.estado}
                    onChange={cambiosInputs}
                    required
                  >
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={0}>Inactivo</MenuItem>
                  </Select>
                </FormControl>







              </div>

              <div className="contain-btns">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={ocultarFormulario}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  type="submit"
                > {modoEditar ? 'Guardar cambios' : 'Agregar producto'}
                </Button>
              </div>
            </form>
          </Box>
        </Modal>

        <Modal
          open={Boolean(detalleProducto)}
          onClose={ocultarFormulario}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style }}>
            {detalleProducto && (
              <div className="contenedor_detalle">
                <div className="cerrar-boton">
                  <h2 className="titulo-detalle">Detalles del Producto</h2>
                  <IconButton onClick={ocultarFormulario}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <div className="contenedor-detalles">

                  <div className="detalle_item">
                    <DescriptionIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Proveedor</strong>
                      <span className="detalle_valor">{detalleProducto.proveedor}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <LocationOnIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Ubicación</strong>
                      <span className="detalle_valor">{detalleProducto.bodega}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Nombre</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.nombre)}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <QrCodeIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Referencia</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.referencia)}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <DescriptionIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Descripción</strong>
                      <span className="detalle_valor">{capitalizeWords(detalleProducto.descripcion)}</span>
                    </div>
                  </div>

                  {usuario.cargo === "administrador" && (
                    <div className="detalle_item">
                      <AttachMoneyIcon style={{ color: '#949393', fontSize: '3rem' }} />
                      <div className="centered-content-detalle">
                        <strong className="detalle_titulo">Precio de Compra</strong>
                        <span className="detalle_valor">{detalleProducto.precio_compra}</span>
                      </div>
                    </div>
                  )}

                  <div className="detalle_item">
                    <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Precio de Venta</strong>
                      <span className="detalle_valor">{detalleProducto.precio_venta}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Cantidad</strong>
                      <span className="detalle_valor">{detalleProducto.cantidad}</span>
                    </div>
                  </div>
                  <div className="detalle_item">
                    <LocationOnIcon style={{ color: '#949393', fontSize: '3rem' }} />
                    <div className="centered-content-detalle">
                      <strong className="detalle_titulo">Estado</strong>
                      <span className="detalle_valor">{mostrarEstadoTexto(detalleProducto.estado)}</span>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </Box>
        </Modal>
      </section>
    </>
  );
};

export default Productos;