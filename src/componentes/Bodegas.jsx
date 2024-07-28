import DescriptionIcon from '@mui/icons-material/Description';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PlaceIcon from '@mui/icons-material/Place';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import QrCodeIcon from '@mui/icons-material/QrCode';




import { Box, Button, IconButton, Modal, TextField, Select, MenuItem, FormControl, InputLabel, InputBase } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Bodegas = () => {
  const [busqueda, setBusqueda] = useState('');
  const [productosCount, setProductosCount] = useState({});
  const [modalProductos, setModalProductos] = useState(false)
  const [listaProductos, setListaProductos] = useState([]);
  const [bodegaID, setBodegaID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleBodega, setDetalleBodega] = useState(null)
  const [bodegas, setBodegas] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [formData, setFormData] = useState({
    nombres: '',
    telefono: '',
    direccion: '',
    encargado: ''
  });


  useEffect(() => {
    obtenerBodegas();
    obtenerEmpleados();
  }, []);



  const activarModoEdicion = (bodega) => {
    setModoEditar(true);
    setFormulario(true);

    // Buscamos el empleado que corresponde al encargado actual de la bodega
    const encargadoSeleccionado = empleados.find(emp => emp.id_empleado === bodega.encargado);

    // Actualizamos formData con los datos de la bodega seleccionada y el encargado encontrado
    setFormData({
      ...bodega,
      encargado: encargadoSeleccionado ? encargadoSeleccionado.nombres : '', // Utilizamos el nombre del encargado
    });

    setBodegaID(bodega.id_bodega);
  };



  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const obtenerBodegas = async () => {
    try {
      const response = await fetch("http://localhost:4000/bodegas");
      if (response.ok) {
        const data_bodegas = await response.json();
        setBodegas(data_bodegas);
        // Obtener productos para cada bodega
        const counts = {};
        for (const bodega of data_bodegas) {
          const responseProductos = await fetch(`http://localhost:4000/bodegas/${bodega.id_bodega}/productos`);
          if (responseProductos.ok) {
            const data_productos = await responseProductos.json();
            counts[bodega.id_bodega] = data_productos.length;
          } else {
            console.error(`No se pudo obtener los productos para la bodega ${bodega.id_bodega}`);
          }
        }
        setProductosCount(counts);
      } else {
        console.error("No se pudo obtener las bodegas");
      }
    } catch (error) {
      console.error('error al obtener las bodegas', error);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const response = await fetch("http://localhost:4000/empleados");
      if (response.ok) {
        const data_empleados = await response.json();
        setEmpleados(data_empleados);
      } else {
        console.error("No se pudo obtener los empleados");
      }
    } catch (error) {
      console.error('error al obtener los empleados', error);
    }
  };


  const eliminarBodega = async (bodegaId, bodegaNombre) => {
    try {
      const result = await Swal.fire({
        title: "Eliminar bodega",
        html: `¿Seguro que quieres eliminar a  <strong>${bodegaNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarla!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/bodegas/${bodegaId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setBodegas(
          bodegas.filter((bodega) => bodega.id_bodega !== bodegaId)
        );

        Swal.fire({
          title: "Eliminada!",
          html: `La bodega <strong>${bodegaNombre}</strong> ha sido eliminada.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    }
  };

  const enviarForm = async (e) => {
    e.preventDefault();
    try {
      let url = 'http://localhost:4000/bodegas';
      let method = 'POST';
      if (modoEditar) {
        url += `/${bodegaID}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 400) {
        // const data = await response.json();
        console.error('Error al agregar o actualizar la bodega');
        return;
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar la bodega');
        return;
      }

      // const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Bodega Actualizada',
          text: 'La bodega ha sido actualizada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Bodega Agregada',
          text: 'La bodega ha sido agregada correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerBodegas();
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  };


  const obtenerBodegaPorId = async (idBodega) => {
    try {
      const response = await fetch(`http://localhost:4000/bodegas/${idBodega}`);
      if (response.ok) {
        const data = await response.json();
        const encargado = empleados.find(emp => emp.id_empleado === data.encargado);
        setDetalleBodega({ ...data, encargado: encargado ? encargado.nombres : 'Desconocido' });
      } else {
        console.error("No se pudo obtener la bodega");
      }
    } catch (error) {
      console.error('error al obtener la bodega', error);
    }
  };

  const obtenerProductosPorBodega = async (idBodega) => {
    try {
      const response = await fetch(`http://localhost:4000/bodegas/${idBodega}/productos`);
      if (response.ok) {
        const data_productos = await response.json();
        setListaProductos(data_productos);
      } else {
        console.error("No se pudo obtener los productos de la bodega");
      }
    } catch (error) {
      console.error('error al obtener los productos de la bodega', error);
    }
    setModalProductos(true);
    setDetalleBodega(false);
  };


  const mostarFormulario = () => {
    setFormulario(true);
    setModoEditar(false);
  };

  const ocultarFormulario = () => {
    setModalProductos(false);
    setDetalleBodega(null);
    setFormulario(false);
    setFormData({
      nombres: '',
      telefono: '',
      direccion: '',
      encargado: ''
    });
    setListaProductos([]);
    setBusqueda('');
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
      height: '100vh',
    },
  };


  const style = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '400px',
    height: '100vh',
    bgcolor: 'background.paper',
    overflowY: 'auto',
    '@media (max-width: 600px)': {
      width: '100%',
      position: 'relative', // Corrige 'relativa' a 'relative'
      top: 'auto',
      left: 'auto',
      transform: 'none',
    },
  };



  const [subMenu, setSubMenu] = useState(false)
  const ocultarSubMenu = () => {
    setSubMenu(false)
  };

  const style_list = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80vh', // Establece una altura específica para permitir el desplazamiento
    bgcolor: '#fff',
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
      minHeight: '100vh', // Ajusta la altura para pantallas pequeñas
    },
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const filteredProductos = listaProductos.filter(producto =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.referencia.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="section-item">

      <section className="witches">
        <ul className="witches-list">
          <li className="witches-item">
            <span className="cantidad-empleados">{bodegas.length}</span>
            Lista de los puntos de almacenamiento
          </li>
          <li>
            <IconButton
              onClick={mostarFormulario}
              style={{ background: 'var(--tercero)' }}>
              <AddIcon style={{ color: 'var(--primer)' }} />
            </IconButton>
          </li>
        </ul>
      </section>

      <table className="tabla-items">
        <tbody>
          {bodegas.map((bodega, index) => (
            <tr className="fila" key={index}>

              <td className="a2">
                <div className="centered-content">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {bodega.nombres}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <ContactsOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{bodega.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {bodega.direccion}</span>
                  </div>
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">

                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {bodega.encargado}
                </div>
              </td>

              <td className="a1">
                <div className="centered-content" onClick={() => obtenerProductosPorBodega(bodega.id_bodega)}>
                  <div className="contacto">
                    <span>Cantidad de productos</span>
                    <Button
                      style={{ width: 'auto', margin: '0 auto', fontSize: '1.1rem' }}
                      variant="outlined"
                      color="primary"
                      size="small"
                    >{productosCount[bodega.id_bodega] || 0}</Button>
                  </div>
                </div>
              </td>
              <td>
                <Button
                  style={{ width: 'auto', margin: '0 auto', fontSize: '1.1rem' }}
                  variant="out"
                  color="inherit"
                  size="small"

                >
                </Button>

              </td>

              <td className="a10">
                <IconButton onClick={() => setSubMenu(bodega.id_bodega)}>
                  <MoreVertIcon

                  />
                </IconButton >
                {subMenu === bodega.id_bodega && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>

                    <div onClick={() => obtenerBodegaPorId(bodega.id_bodega)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(bodega)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarBodega(bodega.id_bodega, bodega.nombres)}>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                      <span>Eliminar</span>
                    </div>
                  </div>
                )}

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
      >
        <Box sx={{ ...style_form }}>
          <form className="grid-form" onSubmit={enviarForm}>
            <h2 className="title-form">{modoEditar ? 'Editar Bodega' : 'Agregar Bodega'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="Nombre de la bodega"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                required
              />
              <FormControl fullWidth>
                <InputLabel id="encargado-label">Encargado</InputLabel>
                <Select
                  labelId="encargado-label"
                  name="encargado"
                  value={formData.encargado}
                  onChange={cambiosInputs}
                  required
                >
                  {empleados.map((empleado) => (
                    <MenuItem key={empleado.id_empleado} value={empleado.id_empleado}>
                      {empleado.nombres}
                    </MenuItem>
                  ))}
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
              > {modoEditar ? 'Guardar cambios' : 'Agregar bodega'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleBodega)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleBodega && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles de la bodega</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>


              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Cantidad de productos en bodega {listaProductos[detalleBodega.nombres]}</strong>
                    <span className="detalle_valor"> {productosCount[detalleBodega.id_bodega] || 0}</span>
                  </div>
                </div>


                <div className="detalle_item">
                  <WarehouseIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres del punto de almacenamiento</strong>
                    <span className="detalle_valor">{detalleBodega.nombres}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detalleBodega.telefono}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{detalleBodega.direccion}</span>
                  </div>
                </div>
                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Ecargado del punto</strong>
                    <span className="detalle_valor">{detalleBodega.encargado}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Box>
      </Modal >
      <Modal
        open={modalProductos}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style_list }}>
          <div className="cerrar-boton" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h6 style={{ fontSize: '1.4rem' }}>Cantidad de productos en bodega: {listaProductos.length}</h6>
            <IconButton onClick={() => setModalProductos(false)}>
              <CloseIcon />
            </IconButton>
          </div>
          <section className="contenedor_buscar" style={{ marginBottom: '20px' }}>
            <InputBase
              style={{ fontSize: '1.6rem' }}
              placeholder="Buscar productos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </section>
          {listaProductos.length === 0 ? (
            <p style={{ textAlign: 'center', fontSize: '3rem', marginTop: '120px' }}>No hay productos almacenados en esta bodega</p>
          ) : (
            filteredProductos.length === 0 ? (
              <p style={{ textAlign: 'center', fontSize: '3rem', marginTop: '120px' }}>No se encontró el producto</p>
            ) : (
              <table className="tabla-items">
                <tbody>
                  {filteredProductos.map((producto) => (
                    <tr className="fila" key={producto.id_producto}>
                      <td className="a4">
                        <div className="centered-content">
                          <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.nombre)}
                        </div>
                      </td>
                      <td className="a4">
                        <div className="centered-content">
                          <QrCodeIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.referencia)}
                        </div>
                      </td>
                      <td className="a4">
                        <div className="centered-content">
                          <DescriptionIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          {capitalizeWords(producto.descripcion)}
                        </div>
                      </td>
                      <td className={producto.cantidad === 0 ? 'agotado' : 'a9'}>
                        <div className="centered-content">
                          <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                          <strong>{producto.cantidad === 0 ? 'Agotado' : `${producto.cantidad} Unidades`}</strong>
                        </div>
                      </td>
                      <td className={producto.cantidad === 0 ? 'agotado' : 'a9'}>
                        <div className="centered-content">
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                          >Mover producto</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </Box>
      </Modal>


    </section >
  );

};

export default Bodegas;
