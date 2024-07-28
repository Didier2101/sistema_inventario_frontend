import { Box, Button, IconButton, Modal, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";


import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from '@mui/icons-material/Close';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import DnsIcon from '@mui/icons-material/Dns';
import ApartmentIcon from '@mui/icons-material/Apartment';

import Context from "../contexto/Context";

const Proveedores = () => {
  const { usuario } = useContext(Context);
  const [proveedorID, setProveedorID] = useState(null);
  const [modoEditar, setModoEditar] = useState(false);
  const [detalleProveedor, setDetalleProveedor] = useState(null)
  const [proveedores, setProveedores] = useState([]);
  const [formulario, setFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nit: '',
    empresa: '',
    cedula: '',
    nombres: '',
    telefono: '',
    correo_electronico: '',
    direccion: ''
  });
  const [cedulaError, setCedulaError] = useState(false);
  const [nitError, setNitError] = useState(false);
  const [telefonoError, setTelefonoError] = useState(false);
  const [nombresError, setNombresError] = useState(false);
  const [correoError, setCorreoError] = useState(false);
  const [formularioValido, setFormularioValido] = useState(false);

  const activarModoEdicion = (proveedor) => {
    setModoEditar(true);
    setFormulario(true);
    setFormData(proveedor); // Actualiza el estado del formulario con los datos del proveedor
    setProveedorID(proveedor.id_proveedor); // Guarda el ID del proveedor que se está editando
  };

  const cambiosInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case 'cedula':
        if (/^\d+$/.test(value) || value === '') {
          setCedulaError(false); // No hay error si el valor es válido o está vacío
        } else {
          setCedulaError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'nit':
        if (/^\d+$/.test(value) || value === '') {
          setNitError(false); // No hay error si el valor es válido o está vacío
        } else {
          setNitError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'telefono':
        if (/^\d+$/.test(value) || value === '') {
          setTelefonoError(false); // No hay error si el valor es válido o está vacío
        } else {
          setTelefonoError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'nombres':
        if (/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/.test(value) || value === '') {
          setNombresError(false); // No hay error si el valor es válido o está vacío
        } else {
          setNombresError(true); // Hay error si el valor contiene caracteres no permitidos
        }
        break;
      case 'correo_electronico':
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value === '') {
          setCorreoError(false); // No hay error si el valor es un correo válido o está vacío
        } else {
          setCorreoError(true); // Hay error si el valor no cumple con el formato de correo
        }
        break;


      default:
        break;
    }
    // Verificar si todos los campos obligatorios están llenos y no hay errores
    const camposLlenos = Object.values(formData).every(val => val !== '');
    const noHayErrores = !(cedulaError || nitError || telefonoError || nombresError || correoError);
    setFormularioValido(camposLlenos && noHayErrores);
  };

  const obtenerProveedores = async () => {
    try {
      const response = await fetch("http://localhost:4000/proveedores");
      if (response.ok) {
        const data = await response.json();
        setProveedores(data);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('error al obtener los proveedores', error);
    }
  }
  useEffect(() => {
    obtenerProveedores();
  }, []);



  const enviarForm = async (e) => {
    e.preventDefault();

    if (
      cedulaError ||
      nitError ||
      telefonoError ||
      nombresError ||
      correoError ||
      !formData.nit ||
      !formData.empresa ||
      !formData.cedula ||
      !formData.nombres ||
      !formData.correo_electronico ||
      !formData.telefono ||
      !formData.direccion
    ) {
      return; // No envía el formulario si hay errores o campos vacíos
    }

    try {
      let url = 'http://localhost:4000/proveedores';
      let method = 'POST';
      if (modoEditar) {
        url += `/${proveedorID}`;
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
        const data = await response.json();
        if (data.error && data.error === "REGISTRO_DUPLICADO") {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message,
          });
          return;
        } else {
          console.error('Error al agregar o actualizar el proveedor');
          return;
        }
      }

      if (!response.ok) {
        console.error('Error al agregar o actualizar el proveedor');
        return;
      }

      // const data = await response.json();

      if (modoEditar) {
        Swal.fire({
          title: 'Proveedor Actualizado',
          text: 'El proveedor ha sido actualizado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          title: 'Proveedor Agregado',
          text: 'El proveedor ha sido agregado correctamente.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false
        });
      }
      ocultarFormulario();
      obtenerProveedores();
      setFormularioValido(false)
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }

  }

  const obtenerProveedorPorId = async (idProveedor) => {
    try {
      const response = await fetch(`http://localhost:4000/proveedores/${idProveedor}`);
      if (response.ok) {
        const data = await response.json();
        setDetalleProveedor(data);
      } else {
        console.error("No se pudo obtener los proveedores");
      }
    } catch (error) {
      console.error('error al obtener los proveedores', error);
    }
  }

  const eliminarProveedor = async (proveedorId, proveedorNombre) => {
    if (usuario.cargo !== 'administrador') {
      Swal.fire({
        icon: 'error',
        title: 'Acceso Denegado',
        text: 'No tienes permisos para eliminar proveedores.',
      });
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Eliminar proveedor",
        html: `¿Seguro que quieres eliminar a  <strong>${proveedorNombre}</strong>?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminarlo!",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/proveedores/${proveedorId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message);
        }

        setProveedores(
          proveedores.filter((proveedor) => proveedor.id_proveedor !== proveedorId)
        );

        Swal.fire({
          title: "Eliminado!",
          html: `El proveedor <strong>${proveedorNombre}</strong> ha sido eliminado.`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }
      obtenerProveedores();
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
    setModoEditar(false)
  };
  const ocultarFormulario = () => {
    setDetalleProveedor(null);
    setDetalleProveedor(false);
    setFormulario(false);
    setFormData({
      nit: '',
      empresa: '',
      cedula: '',
      nombres: '',
      telefono: '',
      correo_electronico: '',
      direccion: ''
    });
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



  const [subMenu, setSubMenu] = useState(false)
  const ocultarSubMenu = () => {
    setSubMenu(false)
  };

  const capitalizeWords = (str) => {
    return str.split(' ').map(word => capitalize(word)).join(' ');
  };
  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <section className="section-item">


      <div className="witches">
        <ul className="witches-list">
          <li className="witches-item">
            <span className="cantidad-proveedores">{proveedores.length}</span>
            Lista de proveedores
          </li>
          <li>
            <IconButton
              onClick={mostarFormulario}
              style={{ background: 'var(--tercero)' }}>
              <AddIcon style={{ color: 'var(--primer)' }} />
            </IconButton>
          </li>
        </ul>
      </div>

      <table className="tabla-items">
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr className="fila" key={index}>
              <td className="a1">
                <div className="centered-content">
                  <DnsIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {proveedor.nit}
                </div>
              </td>
              <td className="a2">
                <div className="centered-content">
                  <ApartmentIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {capitalizeWords(proveedor.empresa)}
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {proveedor.cedula}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {capitalizeWords(proveedor.nombres)}
                </div>
              </td>
              <td className="a1">
                <div className="centered-content">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  <div className="contacto">
                    <span>{proveedor.telefono}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#636363' }}> {proveedor.direccion}</span>
                  </div>
                </div>
              </td>

              <td className="a1">
                <div className="centered-content">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '2.5rem' }} />
                  {proveedor.correo_electronico}
                </div>
              </td>
              <td className="a10">

                <IconButton onClick={() => setSubMenu(proveedor.id_proveedor)}>
                  <MoreVertIcon />
                </IconButton>
                {subMenu === proveedor.id_proveedor && (
                  <div className="sub_menu" onMouseLeave={ocultarSubMenu}>
                    <div onClick={() => obtenerProveedorPorId(proveedor.id_proveedor)}>
                      <IconButton size="small" color="success">
                        <InfoIcon />
                      </IconButton>
                      <span>Detalles</span>
                    </div>

                    <div onClick={() => activarModoEdicion(proveedor)}>
                      <IconButton size="small" color="primary">
                        <EditIcon />
                      </IconButton>
                      <span>Editar</span>
                    </div>

                    <div onClick={() => eliminarProveedor(proveedor.id_proveedor, proveedor.nombres)}>
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
            <h2 className="title-form">{modoEditar ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
            <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
            <div className="contain-inputs">
              <TextField
                fullWidth
                label="NIT"
                name="nit"
                onChange={cambiosInputs}
                value={formData.nit}
                error={nitError}
                helperText={nitError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                fullWidth
                label="Empresa"
                name="empresa"
                onChange={cambiosInputs}
                value={formData.empresa}
                error={false}
                required
              />
              <TextField
                fullWidth
                label="Cedula"
                name="cedula"
                onChange={cambiosInputs}
                value={formData.cedula}
                error={cedulaError}
                helperText={cedulaError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                onChange={cambiosInputs}
                value={formData.nombres}
                error={nombresError}
                helperText={nombresError ? 'Solo se permiten letras de la (A) a la (Z)' : ''}
                required
              />
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="correo_electronico"
                onChange={cambiosInputs}
                value={formData.correo_electronico}
                error={correoError}
                helperText={correoError ? 'El correo es invalido!' : ''}
                required
              />
              <TextField
                fullWidth
                label="Teléfono"
                name="telefono"
                onChange={cambiosInputs}
                value={formData.telefono}
                error={telefonoError}
                helperText={telefonoError ? 'Solo números permitidos' : ''}
                required
              />
              <TextField
                fullWidth
                label="Dirección"
                name="direccion"
                onChange={cambiosInputs}
                value={formData.direccion}
                error={false}
                required
              />
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
                disabled={!formularioValido}
              > {modoEditar ? 'Guardar cambios' : 'Agregar Proveedor'}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Modal
        open={Boolean(detalleProveedor)}
        onClose={ocultarFormulario}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style }}>
          {detalleProveedor && (
            <div className="contenedor_detalle">
              <div className="cerrar-boton">
                <h2 className="titulo-detalle">Detalles del proveedor</h2>
                <IconButton onClick={ocultarFormulario}>
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="contenedor-detalles">
                <div className="detalle_item">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">NIT</strong>
                    <span className="detalle_valor">{detalleProveedor.nit}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <ApartmentIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Empresa</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleProveedor.empresa)}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <BadgeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Cédula</strong>
                    <span className="detalle_valor">{detalleProveedor.cedula}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PersonOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Nombres</strong>
                    <span className="detalle_valor">{capitalizeWords(detalleProveedor.nombres)}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <LocalPostOfficeOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Correo Electrónico</strong>
                    <span className="detalle_valor">{detalleProveedor.correo_electronico}</span>
                  </div>
                </div>

                <div className="detalle_item">
                  <PhoneIphoneOutlinedIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Teléfono</strong>
                    <span className="detalle_valor">{detalleProveedor.telefono}</span>
                  </div>
                </div>

                <div className="detalle_item google">
                  <PlaceIcon style={{ color: '#949393', fontSize: '3rem' }} />
                  <div className="centered-content-detalle">
                    <strong className="detalle_titulo">Dirección</strong>
                    <span className="detalle_valor">{detalleProveedor.direccion}</span>
                  </div>
                </div>

              </div>
            </div>
          )}
        </Box>
      </Modal>

    </section >
  );
};

export default Proveedores;
