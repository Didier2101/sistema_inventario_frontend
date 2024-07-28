import { useState, useEffect } from "react";
import { TextField, Typography, Grid, Card, CardContent, CardActions, Button, } from "@mui/material";

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    obtenerProductos();
  }, []);

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
      console.error("Error al obtener los productos", error);
    }
  };

  const manejarCambioBusqueda = (e) => {
    const { value } = e.target;
    setBusqueda(value);
    filtrarProductos(value);
  };

  const filtrarProductos = (termino) => {
    if (termino.trim() === "") {
      setResultados([]);
      return;
    }

    const resultadosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      producto.referencia.toLowerCase().includes(termino.toLowerCase())
    );
    setResultados(resultadosFiltrados);
  };
  return (
    <section className="section-item">

      <div className="header_inicio">
        <div>
          <TextField
            label="Buscar productos"
            value={busqueda}
            onChange={manejarCambioBusqueda}

          />
        </div>
      </div>
      <div>

        <Grid container spacing={1}>
          {resultados.map((producto) => (

            <Grid item xs={12} sm={2} md={2} key={producto.id_producto}>
              <Card sx={{ minWidth: 200, height: 150 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    {producto.nombre}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    $: {producto.precio_venta}
                  </Typography>
                  <Typography variant="body2">
                    {producto.descripcion}
                    <br />
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Ver mas</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <div>
        Aqui van las ventas
      </div>
    </section>
  );
};

export default Inicio;
