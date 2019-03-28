import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
//import $ from 'jquery';


class IoTManager extends Component {
    constructor(props) {
        super(props);
    }

    handleDisplayOn () {
        fetch('https://iotmanager.azurewebsites.net/display-on', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        // $.ajax
        // ({ 
        //     url: 'https://iotmanager.azurewebsites.net/display-on',
        //     data: {},
        //     type: 'post',
        //     success: function(result)
        //     {
        //         console.log(result);
        //     }
        // });
    };

    handleDisplayOff () {
        fetch('https://iotmanager.azurewebsites.net/display-off', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        // $.ajax
        // ({ 
        //     url: 'https://iotmanager.azurewebsites.net/display-off',
        //     data: {},
        //     type: 'post',
        //     success: function(result)
        //     {
        //         console.log(result);
        //     }
        // });
    };

    handleStart () {
        fetch('https://iotmanager.azurewebsites.net/start', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        // $.ajax
        // ({ 
        //     url: 'https://iotmanager.azurewebsites.net/start',
        //     data: {},
        //     type: 'post',
        //     success: function(result)
        //     {
        //         console.log(result);
        //     }
        // });
    };

    handleStop () {
        fetch('https://iotmanager.azurewebsites.net/stop', {
            method: 'POST',
            body: JSON.stringify({}),
        });
        // $.ajax
        // ({ 
        //     url: 'https://iotmanager.azurewebsites.net/stop',
        //     data: {},
        //     type: 'post',
        //     success: function(result)
        //     {
        //         console.log(result);
        //     }
        // });
    };

    render() {
        return (
            <View style={styles.colContainer}>
                <View style={styles.rowContainer}>
                    <View style={styles.buttonContainer}>
                        <Button title="Display On" onPress={this.handleDisplayOn} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Display Off" onPress={this.handleDisplayOff} />
                    </View>
                </View>
                <View style={styles.rowContainer}>
                    <View style={styles.buttonContainer}>
                        <Button title="Start" onPress={this.handleStart} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Stop" onPress={this.handleStop} />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    colContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonContainer: {
      flex: 1,
      padding: 5
    }
  });

export default IoTManager;