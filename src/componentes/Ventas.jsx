import { useState } from "react";

import { Box, Button, Card, CardContent, FormControl, IconButton, InputBase, MenuItem, Modal, OutlinedInput, Select, TextField, Typography } from "@mui/material"

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import QrCodeIcon from '@mui/icons-material/QrCode';
import DescriptionIcon from '@mui/icons-material/Description';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import SearchIcon from '@mui/icons-material/Search';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';







const Ventas = () => {
    const [selectedClients, setSelectedClients] = useState([]);
    const [formulario, setFormulario] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    // const [productosCount, setProductosCount] = useState({});
    const [modalProductos, setModalProductos] = useState(false)
    const [listaProductos, setListaProductos] = useState([]);
    // const [empleados, setEmpleados] = useState([]);
    // const [formData, setFormData] = useState({
    //   nombres: '',
    //   telefono: '',
    //   direccion: '',
    //   encargado: ''
    // });

    const handleChange = (event) => {
        setSelectedClients(event.target.value);
    };
    const subtotal = 100.00;
    const discount = 10.00;
    const tax = 18.00;
    const total = subtotal - discount + tax;



    const ocultarFormulario = () => {
        setModalProductos(false);
        setFormulario(false);
        setListaProductos([]);
        setBusqueda('');
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

    return (
        <section className="section-item">
            <Box component="section" sx={{
                backgroundColor: '#fff',
                boxShadow: ' 0px 0px 15px -3px rgba(0,0,0,0.1);',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                borderRadius: '10px',
            }}>
                <div>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{ mb: 1, fontWeight: 'bold' }}
                    >Cliente</Typography>
                    <FormControl size="small" sx={{ width: 300, mr: 4 }}>
                        <Select
                            multiple
                            displayEmpty
                            value={selectedClients}
                            onChange={handleChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => {
                                if (selected.length === 0) {
                                    return <em>Agregar Cliente</em>;
                                }
                                return selected.join(', ');
                            }}
                        >
                            <MenuItem disabled value="">
                                <em>Agregar Cliente</em>
                            </MenuItem>
                            <MenuItem value="Cliente 1">Cliente 1</MenuItem>
                            <MenuItem value="Cliente 2">Cliente 2</MenuItem>
                            <MenuItem value="Cliente 3">Cliente 3</MenuItem>
                            <MenuItem value="Cliente 4">Cliente 4</MenuItem>
                            <MenuItem value="Cliente 5">Cliente 5</MenuItem>
                        </Select>
                    </FormControl>

                    <Button size="medium" startIcon={<AddIcon />} variant="outlined"
                        onClick={() => setFormulario(true)}
                    >Nuevo cliente</Button>
                </div>
                <div>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{ mb: 1 }}
                    >Fecha</Typography>
                    <TextField
                        type="date"
                        size="small"
                        variant="outlined" />

                </div>
                <div>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{ mb: 1 }}
                    >N. Venta
                    </Typography>

                    <TextField
                        size="small"
                        variant="outlined"
                    />
                </div>
                <div>
                    <Typography
                        variant="h5"
                        component="h3"
                        sx={{ mb: 1 }}
                    >Agregar Productos
                    </Typography>
                    <Button
                        size="medium"
                        startIcon={<SearchIcon />}
                        variant="outlined"
                        onClick={() => setModalProductos(true)}
                    >buscar productos
                    </Button>

                </div>
            </Box>

            <table className="tabla-items">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Referencia</th>
                        <th>Descripcion</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Precio Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="fila">
                        <td className="a2">
                            <div className="centered-content">
                                <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                Control Samsung
                            </div>
                        </td>

                        <td className="a1">
                            <div className="centered-content">
                                <QrCodeIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                RG123fd
                            </div>
                        </td>

                        <td className="a1">
                            <div className="centered-content">
                                <DescriptionIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                Samsung negro con netflix
                            </div>
                        </td>


                        <td className="a1">
                            <div className="centered-content">
                                <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                13.000
                            </div>
                        </td>
                        <td className="a1">
                            <div className="centered-content">
                                <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                10
                            </div>
                        </td>
                        <td className="a1">
                            <div className="centered-content">
                                <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                130.000

                            </div>
                        </td>


                        <td className="a10">
                            <div className="centered-content">
                                <IconButton>
                                    <DeleteIcon
                                        color="error" />
                                </IconButton>

                            </div>
                        </td>

                    </tr>
                    <tr className="fila">
                        <td className="a2">
                            <div className="centered-content">
                                <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                Control Samsung
                            </div>
                        </td>

                        <td className="a1">
                            <div className="centered-content">
                                <QrCodeIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                RG123fd
                            </div>
                        </td>

                        <td className="a1">
                            <div className="centered-content">
                                <DescriptionIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                Samsung negro con netflix
                            </div>
                        </td>


                        <td className="a1">
                            <div className="centered-content">
                                <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                13.000
                            </div>
                        </td>
                        <td className="a1">
                            <div className="centered-content">
                                <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                10
                            </div>
                        </td>
                        <td className="a1">
                            <div className="centered-content">
                                <PriceCheckOutlinedIcon style={{ color: '#949393', fontSize: '2rem' }} />
                                130.000

                            </div>
                        </td>


                        <td className="a10">
                            <div className="centered-content">
                                <IconButton>
                                    <DeleteIcon
                                        color="error" />
                                </IconButton>

                            </div>
                        </td>

                    </tr>

                </tbody>
            </table>


            <Card sx={{ maxWidth: 345, margin: '20px auto' }}>
                <CardContent>
                    <Typography variant="h5" component="h4" sx={{ fontWeight: 'bold' }}>
                        Resumen de la Orden
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                            Subtotal:
                        </Typography>
                        <Typography variant="body2">
                            ${subtotal.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Descuento:
                        </Typography>
                        <Typography variant="body2">
                            -${discount.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            IVA:
                        </Typography>
                        <Typography variant="body2">
                            ${tax.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Typography variant="h6" component="div">
                            Total:
                        </Typography>
                        <Typography variant="h6" component="div">
                            ${total.toFixed(2)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <Modal
                open={formulario}
                // onClose={ocultarFormulario}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style_form }}>
                    <form className="grid-form" >
                        <h2 className="title-form">Agregar Cliente</h2>
                        <p className="sub-title">Todos los campos con un <span>(*)</span> son obligatorios.</p>
                        <div className="contain-inputs">
                            <TextField
                                fullWidth
                                label="Cedula"
                                name="cedula"

                                required
                            />
                            <TextField
                                fullWidth
                                label="Nombres"
                                name="nombres"

                                required
                            />
                            <TextField
                                fullWidth
                                label="Correo Electronico"
                                name="correo_electronico"

                                required

                            />
                            <TextField
                                fullWidth
                                label="Telefono"
                                name="telefono"


                                required
                            />
                            <TextField
                                fullWidth
                                label="Direccion"
                                name="direccion"

                                error={false}
                                required
                            />
                        </div>

                        <div className="contain-btns">
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => setFormulario(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                type="submit"

                            >Agregar Cliente
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>

            <Modal
                open={modalProductos}
                onClose={ocultarFormulario}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style_list }}>
                    <div className="cerrar-boton" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h6 style={{ fontSize: '1.4rem' }}>Cantidad de productos: {listaProductos.length}</h6>
                        <IconButton onClick={() => setModalProductos(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <section className="contenedor_buscar" style={{ marginBottom: '10px' }}>
                        <InputBase
                            style={{ fontSize: '1.2rem' }}
                            placeholder="Buscar productos"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </section>

                    <table className="tabla-items">
                        <tbody>

                            <tr className="fila">
                                <td className="a4">
                                    <div className="centered-content">
                                        <Inventory2OutlinedIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        nombre
                                    </div>
                                </td>
                                <td className="a4">
                                    <div className="centered-content">
                                        <QrCodeIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        referencia
                                    </div>
                                </td>
                                <td className="a4">
                                    <div className="centered-content">
                                        <DescriptionIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        descripcion
                                    </div>
                                </td>
                                <td className="a4">
                                    <div className="centered-content">
                                        <DescriptionIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        stock
                                    </div>
                                </td>
                                <td className='a9'>
                                    <div className="centered-content">
                                        <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        precio
                                    </div>
                                </td>
                                <td className='a9'>
                                    <div className="centered-content">
                                        <InventoryOutlinedIcon style={{ color: '#949393', fontSize: '1.5rem' }} />
                                        cantidad
                                    </div>
                                </td>
                                <td className='a9'>
                                    <div className="centered-content">
                                        <IconButton>
                                            <AddShoppingCartIcon
                                                color="success" />
                                        </IconButton>

                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </Box>
            </Modal>

        </section>
    )
}

export default Ventas