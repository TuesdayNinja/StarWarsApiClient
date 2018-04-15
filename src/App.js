import React, { Component } from 'react';
import Card from '../src/Card'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      planets: [],
      species: [],
      selectedSpecies: null,
      ascending: false
    }
  }

  componentDidMount() {
    this.getPlanets();
    this.getSpecies();
  }

  getPlanets(url = 'https://swapi.co/api/planets/') {
    console.log('getPlanets')
    fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        this.setState({planets: this.state.planets.concat(data.results)})
        if(data.next) {
          this.getPlanets(data.next);
        }
      })
      .catch(err => {
        return null;
      })
  }

   getSpecies(url = 'https://swapi.co/api/species/') {
    console.log('getSpecies')
    fetch(url, {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        this.setState({species: this.state.species.concat(data.results)})
        if(data.next) {
          this.getSpecies(data.next);
        }
      })
      .catch(err => {
        return null;
      })
  }

  getDiameter(planet){
    if(planet.diameter=='unknown'){
      return -1
    }
    return parseInt(planet.diameter)
  }

  sort(ascending) {
    this.setState({ascending})
  }

  sortedPlanets() {
    const planets = this.state.planets.slice();
    planets.sort((a, b) => {
      if(this.state.ascending) {
        return this.getDiameter(a)-this.getDiameter(b);
      }
      return this.getDiameter(b)-this.getDiameter(a);
    })
    console.log(planets)
    return planets;
  }

  getSpeciesForPlanet(planet) {
    return this.state.species.filter((s) => {
      return s.homeworld == planet.url
    });
  }

  getPlanetForSpecies(species) {
    const planet = this.state.planets.find((p) => {
      return species.homeworld == p.url
    });
    if(planet) {
      return planet.name
    }
    return ""
  }

  showSpecies = (species) => {
    this.setState({selectedSpecies: species});
  };

  hideSpecies = () => {
    this.setState({selectedSpecies: null});
  };


  render() {
    const planets = this.sortedPlanets();
    const {selectedSpecies} = this.state;

    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.hideSpecies}
      />,
    ];


    return (
      <MuiThemeProvider>
        <div className="App">

          <Dialog
            title={selectedSpecies && selectedSpecies.name}
            actions={actions}
            modal={false}
            open={selectedSpecies != null}
            onRequestClose={this.hideSpecies}
            actionsContainerStyle={{backgroundColor: "black"}}
            bodyStyle={{backgroundColor: "black", color: "white"}}
            titleStyle={{backgroundColor: "black", color: "white"}}
          >
            Classification: {selectedSpecies && selectedSpecies.classification} <br/>
            Language: {selectedSpecies && selectedSpecies.language} <br/>
            Homeworld: {selectedSpecies && this.getPlanetForSpecies(selectedSpecies)}
          </Dialog>

          <AppBar title="Star Wars planets and their species"
            showMenuIconButton={false}
            titleStyle={{textAlign: "center"}}
            style={{backgroundColor: "rgba(0, 0, 0, 0.90)"}}

            iconElementRight={
              <IconMenu
                iconButtonElement={<FlatButton label="Sort" labelStyle={{color: "white"}}/>}
                anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                targetOrigin={{horizontal: 'left', vertical: 'top'}}
              >
                <MenuItem onClick={() => this.sort(false)} primaryText="Descending"/>
                <MenuItem onClick={() => this.sort(true)} primaryText="Ascending"/>

              </IconMenu>
            }
          />


          {!planets && <span>Loading...</span>}
          <div className="Planets">{ planets && planets.map((planet) => {
            const species = this.getSpeciesForPlanet(planet);
            return (<Card planet={planet} species={species} showSpecies={this.showSpecies} key={planet.url}/>); }) }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
