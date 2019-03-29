import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Router, Switch, Route } from './routing';
import Home from './Home';
import Pokemon from './Pokemon';
import Dashboard from './Dashboard';

export default class App extends React.Component {
  state = {
    selectedPokemon: null
  };
  selectPokemon = (selectedPokemon) => {
    this.setState({
      selectedPokemon
    });
  };


  render() {
    return (
      <View style={styles.container}>
        <Router>
          <Switch>
            <Route 
              exact 
              path="/" 
              render={props => (
                <Dashboard {...props} selectPokemon={this.selectPokemon}/>
              )} 
            />
            <Route 
              exact 
              path="/pokemon" 
              render={props => (
                <Pokemon 
                  selectedPokemon = {this.state.selectedPokemon} 
                  {...props} 
                />
              )} 
            />
          </Switch>
        </Router>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    //marginTop: 50,
    //padding: 50
  },
});
