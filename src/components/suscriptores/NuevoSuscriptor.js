import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {firestoreConnect} from 'react-redux-firebase';
import PropTypes from 'prop-types';

class  NuevoSubscriptor extends Component{
    state ={
        nombre: '',
        apellido: '',
        carrera: '',
        codigo: ''
    }

    //Agrega un nuevo suscriptor a la base de datos
    agregarSuscriptor = e => {
        e.preventDefault();
        //extraer los valores del state
        const nuevoSsuscriptor = {...this.state};
        //extrear firestore de props
        const {firestore, history} = this.props;
        //Guardarlo en la base de datos
        firestore.add({
            collection: 'suscriptores'
        }, nuevoSsuscriptor).then(() => {
            history.push('/suscriptores')
        })
        
    }

    // extrae  los valores del input y los coloca en el state
    leerDato = (e) => {
        this.setState({
           [e.target.name] : e.target.value
        })
    }

    render(){
        return ( 
            <div className="row">
                <div className="col-12 mb-4">
                    <Link to={'/suscriptores'}
                        className="btn btn-secondary"
                    >
                        <i className="fas fa-arrow-circle-left"></i> {''}
                        Volver al Listado
                    </Link>
                </div>
                <div className="col-12">
                    <h2>
                        <i className="fas fa-user-plus"></i> {''}
                        Nuevo Suscriptor
                    </h2>
                    <div className="row justify-content-center">
                        <div className="col-md-8 mt-5">
                            <form
                                onSubmit={this.agregarSuscriptor}
                            >
                                <div className="form-group">
                                  <label htmlFor="nombre">Nombre: </label>
                                  <input type="text" 
                                  name="nombre"  
                                  className="form-control" 
                                  placeholder="Nombre del suscriptor" 
                                  required
                                  onChange={this.leerDato}
                                  value={this.state.nombre}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="apellido">Apellido: </label>
                                  <input type="text" 
                                  name="apellido"  
                                  className="form-control" 
                                  placeholder="Apellido del suscriptor" 
                                  required
                                  onChange={this.leerDato}
                                  value={this.state.apellido}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="carrera">Carrera: </label>
                                  <input type="text" 
                                  name="carrera"  
                                  className="form-control" 
                                  placeholder="Carrera del suscriptor" 
                                  required
                                  onChange={this.leerDato}
                                  value={this.state.carrera}
                                  />
                                </div>
                                <div className="form-group">
                                  <label htmlFor="codigo">Código: </label>
                                  <input type="text" 
                                  name="codigo"  
                                  className="form-control" 
                                  placeholder="Código del suscriptor" 
                                  required
                                  onChange={this.leerDato}
                                  value={this.state.codigo}
                                  />
                                </div>
                                <input 
                                    type="submit"
                                    value="Agregar Suscriptor"
                                    className="btn btn-success"
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            ); 
    }
}

NuevoSubscriptor.propTypes = {
    firestore: PropTypes.object.isRequired
}
 
export default firestoreConnect()(NuevoSubscriptor);