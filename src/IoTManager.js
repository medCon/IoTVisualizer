import React, { Component } from 'react';
import { View, Button, StyleSheet } from 'react-native';
//import $ from 'jquery';


class IoTManager extends Component {
    // constructor(props) {
    //     super(props);
    // }

    handleDisplayOn () {
        fetch('https://iotmanager.azurewebsites.net/display-on', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    };

    handleDisplayOff () {
        fetch('https://iotmanager.azurewebsites.net/display-off', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    };

    handleStart () {
        fetch('https://iotmanager.azurewebsites.net/start', {
            method: 'POST',
            body: JSON.stringify({}),
        });
    };

    handleStop () {
        fetch('https://iotmanager.azurewebsites.net/stop', {
            method: 'POST',
            body: JSON.stringify({}),
        });
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        height: 50,
    },
    buttonContainer: {
        flex: 1,
        padding: 5,
        width:150,
        alignItems: 'stretch'
    }
 });

export default IoTManager;