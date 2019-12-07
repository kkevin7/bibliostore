import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './css/bootstrap.min.css';

import store from './store';
import { Provider } from 'react-redux';

import Navbar from './components/layout/Navbar';
import {UserIsAuthenticated, UserIsNotAuthenticated} from './helpers/auth';

import Suscriptores from './components/suscriptores/Suscriptores';
import MostrarSuscriptor from './components/suscriptores/MostrarSuscriptor';
import NuevoSuscriptor from './components/suscriptores/NuevoSuscriptor';
import EditarSuscriptor from './components/suscriptores/EditarSuscriptor';
import Libros from './components/libros/Libros';
import MostrarLibro from './components/libros/MostrarLibro';
import NuevoLibro from './components/libros/NuevoLibro';
import EditarLibro from './components/libros/EditarLibro';
import PrestamoLibro from './components/libros/PrestamoLibro';
import Login from './components/auth/Login';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <div className="container">
          <Switch>
            <Route exact path="/login" component={UserIsNotAuthenticated(Login)}/>

            <Route exact path="/" component={UserIsAuthenticated(Libros)}/>
            <Route exact path="/libros/mostrar/:id" component={UserIsAuthenticated(MostrarLibro)}/>
            <Route exact path="/libros/nuevo" component={UserIsAuthenticated(NuevoLibro)}/>
            <Route exact path="/libros/editar/:id" component={UserIsAuthenticated(EditarLibro)}/>
            <Route exact path="/libros/prestamo/:id" component={UserIsAuthenticated(PrestamoLibro)}/>

            <Route exact path="/suscriptores" component={UserIsAuthenticated(Suscriptores)} />
            <Route exact path="/suscriptores/nuevo" component={UserIsAuthenticated(NuevoSuscriptor)} />
            <Route exact path="/suscriptores/mostrar/:id" component={UserIsAuthenticated(MostrarSuscriptor)} />
            <Route exact path="/suscriptores/editar/:id" component={UserIsAuthenticated(EditarSuscriptor)} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
