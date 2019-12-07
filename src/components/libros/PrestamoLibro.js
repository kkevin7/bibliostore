import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

//REDUX Actions
import {buscarUsuario} from '../../actions/buscarUsuarioActions';

class PrestamoLibro extends Component {
  state = {
      busqueda: '',
      noResultados: false
  };

    //Buscar alumno por Código
    buscarAlumno = e =>{
        e.preventDefault();
        //obtner el valor a buscar
        const {busqueda} = this.state;
        //extraer firestore
        const {firestore, buscarUsuario} = this.props;
        //hacer la consulta
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where('codigo', "==", busqueda).get();
        //leer los resultados
        consulta.then(resultado => {
            if(resultado.empty){
                //no hay resultados

                //almacenar en tredux un objeto vacio
                buscarUsuario({});
                this.setState({
                    noResultados: true
                })
            }else{
                //si hay resultados

                //colocar el resultado en el state de redux
                const datos = resultado.docs[0];
                buscarUsuario(datos.data());
                // actualizar el state en base a los resultados                
                this.setState({
                    noResultados: false
                })
            }
        })
    }

    //Almacena los datos del alumno para solicitar el libro
    solicitarPrestamo = () => {
      const {usuario} = this.props;

      //fecha de alta
      usuario.fecha_solicitud = new Date().toLocaleDateString();
      //Nose puede mutar los props y crear un nuevo arreglo
      let prestados = [];
      prestados= [...this.props.libro.prestados, usuario];

      //Copiar el objeto y agregar los prestados
      const libro = {...this.props.libro};

      //eliminar los prestados anteriores
      delete libro.prestados;

      //asignarlos prestados
      libro.prestados = prestados;

      const {firestore, history} = this.props;
      //almacenar en la BD
      firestore.update({
        collection: 'libros',
        doc: libro.id
      }, libro).then(history.push('/'))
    }

    //Almacenar el codigo por state
    leerDato = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

  render() {
    //extraer el libro
    const { libro } = this.props;

    //mostrar el spinner
    if (!libro) return <Spinner />;

    //extraer los datos del alumno
    const {usuario} = this.props;

    let fichaAlumno, btnSolicitar;

    if(usuario.nombre){
        fichaAlumno = <FichaSuscriptor
                    alumno={usuario}
        />
        btnSolicitar = <button
                    type="submit"
                    className="btn btn-success"
                    onClick={this.solicitarPrestamo}
        >Solicitar Prestamo</button>
    }else{
        fichaAlumno= null;
        btnSolicitar= null;
    }

    //Mostrar mensaje de error
    const {noResultados} = this.state;
    let mensajeResultado = '';
    if(noResultados){
      mensajeResultado = <div className="alert alert-danger text-center font-weight-bold">No hay resultados</div>
    }else{
      mensajeResultado = null
    }

    return (
      <div className="row">
        <div className="col-12 mb-4">
          <Link to={"/"} className="btn btn-secondary">
            <i className="fas fa-arrow-circle-left"></i> {""}
            Volver al Listado
          </Link>
        </div>
        <div className="col-12">
          <h2>
            <i className="fas fa-user"></i> {""}
            Solicitar Prestamo: {libro.titulo}
          </h2>
          <div className="row justify-content-center">
            <div className="col-md-8 mt-5">
                <form
                    onSubmit={this.buscarAlumno}
                    className="mb-4"
                >
                    <legend>
                        Busca el Suscriptor por Código
                    </legend>
                    <div className="form-group">
                        <input type="text"
                        name="busqueda"
                        className="form-control"
                        onChange={this.leerDato}
                        />
                    </div>
                    <input type="submit" value="Buscar Alumno" className="btn btn-success btn-block"/>
                </form>
                {/* Muestra la ficha del alumno y el boton para solicitar el prestamo */}
                {fichaAlumno}
                {btnSolicitar}
                {/* Muestra de mensaje de resultado */}
                {mensajeResultado}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(
  firestoreConnect(props => [
    {
      collection: "libros",
      storeAs: "libro",
      doc: props.match.params.id
    }
  ]),
  connect(({ firestore: { ordered }, usuario }, props) => ({
    libro: ordered.libro && ordered.libro[0],
    usuario: usuario
  }), {buscarUsuario})
)(PrestamoLibro);
