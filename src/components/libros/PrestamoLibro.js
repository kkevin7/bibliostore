import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import FichaSuscriptor from '../suscriptores/FichaSuscriptor';

class PrestamoLibro extends Component {
  state = {
      busqueda: '',
      resultado: {},
      noResultados: false
  };

    //Buscar alumno por Código
    buscarAlumno = e =>{
        e.preventDefault();
        //obtner el valor a buscar
        const {busqueda} = this.state;
        //extraer firestore
        const {firestore} = this.props;
        //hacer la consulta
        const coleccion = firestore.collection('suscriptores');
        const consulta = coleccion.where('codigo', "==", busqueda).get();
        //leer los resultados
        consulta.then(resultado => {
            if(resultado.empty){
                //no hay resultados
                this.setState({
                    noResultados: true,
                    resultado: {}
                })
            }else{
                //si hay resultados
                const datos = resultado.docs[0];
                this.setState({
                    resultado: datos.data(),
                    noResultados: false
                })
            }
        })
    }

    //Almacena los datos del alumno para solicitar el libro
    solicitarPrestamo = () => {
      const suscriptor = this.state.resultado;
      //fecha de alta
      suscriptor.fecha_solicitud = new Date().toLocaleDateString();
      //obtener referencia del libro
      const libroActualizdo = this.props.libro;
      //agregar el suscriptor al libro
      libroActualizdo.prestados.push(suscriptor);
      //obtner firestore y history de props
      const {firestore, history, libro} = this.props;
      //almacenar en la BD
      firestore.update({
        collection: 'libros',
        doc: libro.id
      }, libroActualizdo).then(history.push('/'))
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
    const {noResultados, resultado} = this.state;
    let fichaAlumno, btnSolicitar;
    if(resultado.nombre){
        fichaAlumno = <FichaSuscriptor
                    alumno={resultado}
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
  connect(({ firestore: { ordered } }, props) => ({
    libro: ordered.libro && ordered.libro[0]
  }))
)(PrestamoLibro);
