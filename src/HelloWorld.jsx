import React,{ Component } from 'react';
import {PokemonView} from './PokemonView';
import IngresarNombre from './IngresarNombre.jsx';
import IngresarTipos from './IngresarTipos.jsx';
import PokemonSeleccionadoView from './PokemonSeleccionadoView.jsx';

export class Principal extends Component{
    constructor(props){
        super(props);
        this.state = {
        	"pokemons":[],
          "pokemonDatos": {},
          "cargando": false,
          "mensajeResultado": "",
          "criterioDeBusqueda": "id"
        };
       	// searchPokemonById = searchPokemonById.bind(this);

       	this.drawView = this.drawView.bind(this);
        this.actualizarCriterio = this.actualizarCriterio.bind(this);
        this.drawOpcionesBusqueda = this.drawOpcionesBusqueda.bind(this);
        this.handleStateCargando = this.handleStateCargando.bind(this);
        this.handleStatePokemons = this.handleStatePokemons.bind(this);
        this.getStateCargando = this.getStateCargando.bind(this);
        this.handleStateMensajeResultado = this.handleStateMensajeResultado.bind(this);
        this.drawPokemonSeleccionado = this.drawPokemonSeleccionado.bind(this);
        this.handlePokemonData = this.handlePokemonData.bind(this);
    }

    handleStateCargando(cargando){
      this.setState({
        cargando: cargando
      });
    }

    handleStatePokemons(pokemons){
      this.setState({
        pokemonDatos: pokemons[0],
        pokemons: pokemons
      });
    }

    getStateCargando(){
      return this.state.cargando;
    }

    handleStateMensajeResultado(resultado){
      this.setState({
        mensajeResultado: resultado
      });
    }


    drawView(pokemons){
      let {handlePokemonData} = this;

      if (pokemons.length > 0) {
     		return (
     			pokemons.map( (pokemon,index) => {
  				   			return (
  				   				<div key={index}>
  				   					<PokemonView name={pokemon.name}
  											 base_experience={pokemon.base_experience}
  											 image={pokemon.image}
                         weight={pokemon.weight}
                         height={pokemon.height}
                         types={pokemon.types}
                         handlePokemonData={handlePokemonData}

                         />
  							 	</div>
  							 )
  					   	})
     		)
      }
      return <div/>
    }

    actualizarCriterio(nuevoCriterio){
      console.log("nuevo criterio = "+nuevoCriterio)
      this.setState({
        criterioDeBusqueda: nuevoCriterio
      });
    }

    drawOpcionesBusqueda(){
      let {criterioDeBusqueda, cargando, pokemons} = this.state;
      const{handleStatePokemons, handleStateCargando, getStateCargando,handleStateMensajeResultado}=this;

      if (criterioDeBusqueda=='id'){
        console.log("entro a ID");
        return(
            <IngresarNombre
              handleStateCargando = {handleStateCargando}
              handleStatePokemons = {handleStatePokemons}
              getStateCargando = {getStateCargando}
              handleStateMensajeResultado = {handleStateMensajeResultado}
            />
          );
      }else if(criterioDeBusqueda=='tipo'){
        return (<IngresarTipos
          handleStateCargando = {handleStateCargando}
          handleStatePokemons = {handleStatePokemons}
          getStateCargando = {getStateCargando}
          handleStateMensajeResultado = {handleStateMensajeResultado}
        />);
      }
      console.log('entro a criterio busqueda');
    }

    drawPokemonSeleccionado(){
      let {pokemonDatos,pokemons} = this.state;
      console.log("Es distinto de vacio");
      if (pokemons.length>0){
        return (
          <PokemonSeleccionadoView pokemon={pokemonDatos}/>
        )
      }
    }

    handlePokemonData(newData){
      console.log("Entro a handle Pkmndata");
      this.setState({
        pokemonDatos: newData});
      console.log(newData);
    }

    render(){
        const {name} = this.props;
        const {pokemons, pokemonABuscar,cargando,mensajeResultado} = this.state;
        const {drawPokemonSeleccionado,drawView,handleStateMensajeResultado,drawOpcionesBusqueda,onBuscarAlAzar,actualizarPokemonABuscar,onBuscar,onBuscarPorTipo,elegirBusqueda,actualizarCriterio} = this;
        let style = {};
        if (!cargando) {
          style = {
            visibility: 'hidden',
            width: '22%'
          }
        }else{
          style = {
            visibility: 'visible',
            width: '22%'
          }
        }

      	return(
      		<div>
            <nav className="introduccion">
              <div className="title">
                <a href="">
                  <img
                    className="favicon"
                    src="../assets/images/pok.png"
                    width="25"
                    height="25"
                    title="Home"
                    alt="Home"/>
                Pokedex</a>
              </div>
              <div className="pestañas-busqueda">
                Buscar por:
                <input type="button" name="boton" title="Nombre" value="Nombre" onClick={() => actualizarCriterio('id')}></input>
                <input type="button" name="boton" title="Tipo" value="Tipo" onClick={() => actualizarCriterio('tipo')}></input>
              </div>
              <div className="contacto-social">
                <i className="fa fa-facebook-square" title="Facebook"/>
                <i className="fa fa-twitter-square" title="Twitter"/>
                <i className="fa fa-instagram" title="Instagram"/>
                <i className="fa fa-money" title="Help us!"/>
              </div>
            </nav>

            <div className="contenido-principal">
              {drawOpcionesBusqueda()}
              <div className="resultado-pokedex">
                <div className="resultado-pokedex-izquierda">
                  <div className="pokebolaCarga">
                    <img src="https://66.media.tumblr.com/74da2c5713f820807e9aaceb44923bcb/tumblr_oaocdr1gOk1rymyweo1_500.gif" style={style}/>
                  </div>

                  {drawPokemonSeleccionado()}

                </div>
                <div className="resultado-pokedex-derecha">
                  <div className="pokemonEncontrados">
                    {drawView(pokemons)}
                </div>
              </div>
            </div>
      		</div>
        </div>
      	);
    }
}
