import { NavLink } from "react-router-dom"

import { Button, TextField } from "@mui/material"




const ForgotPassword = () => {
    return (
        <div className='container-all'>
            <section className="img">

            </section>
            <div className="container-login">

                <section className='contain-form-login'>

                    <h2>¿Olvidaste tu contraseña?</h2>
                    <p>No te preocupes, ¡aquí estamos para ayudarte!</p>
                    <form className='form-login'>
                        <TextField fullWidth label="Correo Electronico" required InputLabelProps={{ className: 'custom-label' }} />
                        <Button
                            type='submit'
                            variant="contained"
                            fullWidth
                            style={{
                                height: '40px',
                                fontSize: '1.2rem',
                                backgroundColor: 'var(--segundo)'
                            }}

                        >
                            Enviar
                        </Button>
                    </form>
                    <NavLink
                        style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--tercero)' }}
                        to="/"
                    >¿Quieres volver al inicio?</NavLink>
                </section>
            </div>
        </div>
    )
}

export default ForgotPassword