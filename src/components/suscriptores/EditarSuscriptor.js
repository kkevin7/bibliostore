import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../layout/Spinner';

class EditarSuscriptor extends Component {

    //crear los refs
    nombreInput = React.createRef();
    apellidoInput = React.createRef();
    codigoInput = React.createRef();
    carreraInput = React.createRef();

    //Edita el  suscriptor en la base de datos
    editarSuscriptor = e => {
        e.preventDefault();
        // crear el objeto que se va a actualizar
        const suscriptorActualizado = {
            nombre: this.nombreInput.current.value,
            apellido: this.apellidoInput.current.value,
            codigo: this.codigoInput.current.value,
            carrera: this.carreraInput.current.value
        }
        // extrar firestore y history de props
        const {suscriptor, firestore, history} = this.props;
        //almacenar en la base de datos con firestore
        firestore.update({
            collection: 'suscriptores',
            doc: suscriptor.id
        }, suscriptorActualizado).then(history.push('/suscriptores'));
    }

    render() {
        const {suscriptor} = this.props;
        if(!suscriptor) return <Spinner/>;

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
                    <i className="fas fa-user"></i> {''}
                    Editar Suscriptor
                </h2>
                <div className="row justify-content-center">
                    <div className="col-md-8 mt-5">
                        <form
                            onSubmit={this.editarSuscriptor}
                        >
                            <div className="form-group">
                              <label htmlFor="nombre">Nombre: </label>
                              <input type="text" 
                              name="nombre"  
                              className="form-control" 
                              placeholder="Nombre del suscriptor" 
                              required
                              ref={this.nombreInput}
                              defaultValue={suscriptor.nombre}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="apellido">Apellido: </label>
                              <input type="text" 
                              name="apellido"  
                              className="form-control" 
                              placeholder="Apellido del suscriptor" 
                              required
                              ref={this.apellidoInput}
                              defaultValue={suscriptor.apellido}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="carrera">Carrera: </label>
                              <input type="text" 
                              name="carrera"  
                              className="form-control" 
                              placeholder="Carrera del suscriptor" 
                              required
                              ref={this.carreraInput}
                              defaultValue={suscriptor.carrera}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="codigo">Código: </label>
                              <input type="text" 
                              name="codigo"  
                              className="form-control" 
                              placeholder="Código del suscriptor" 
                              required
                              ref={this.codigoInput}
                              defaultValue={suscriptor.codigo}
                              />
                            </div>
                            <input 
                                type="submit"
                                value="Editar Suscriptor"
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

EditarSuscriptor.propTypes = {
    firestore: PropTypes.object.isRequired
}

export default compose(
    firestoreConnect(props => [{
        collection: 'suscriptores',
        storeAs: 'suscriptor',
        doc: props.match.params.id
    }]),
    connect(({firestore: {ordered}}, props) => ({
        suscriptor: ordered.suscriptor && ordered.suscriptor[0]
    }))
)(EditarSuscriptor);