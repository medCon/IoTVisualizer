import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { canvas } from 'canvas-gauges';
import Websocket from 'react-websocket';
import numeral from 'numeral';
import moment from 'moment';
import IoTManager from './IoTManager';

class Dashboard extends Component {
    chartReference = {};
    state = {
        theData: {
            Temperature: 0,
            Humidity: 0, 
            Pressure: 0,
            Moisture: 0
        }
    };

    constructor(props) {
        super(props);

    };

    handleData(event) {
        try {
            console.log(event.data);
            var obj = JSON.parse(event.data);
            if(!obj.timestamp || !obj.Temperature) {
                return;
            }
            var theData = this.state.theData;
            obj.timestamp = moment(obj.timestamp);
            theData = obj;

            this.setState({ theData: theData });
        } catch (err) {
            console.error(err);
        }
    }

    handleOpen()  {
        console.log("connected:)");
    }
    handleClose() {
        console.log("disconnected:(");
    }

    JSONStringify (object) {
        var cache = [];        
        var str = JSON.stringify(object,
            // custom replacer fxn - gets around "TypeError: Converting circular structure to JSON" 
            function(key, value) {
                if (typeof value === 'object' && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            }, 4);
        cache = null; // enable garbage collection
        return str;
    }

    handleError(error) {
        console.log("error:(");

        console.log(error.message);
    }

    render() {
        return (
            <View style={ styles.colContainer }>
                <Websocket url='wss://iotmanager.azurewebsites.net'
                    onOpen={this.handleOpen} onClose={this.handleClose}
                    onMessage={this.handleData.bind(this)} onError={this.handleError}
                    reconnect
                    />

                <View style={ styles.firstRowContainer }>
                    <View style={ styles.boxContainer }>
                        <canvas data-type="radial-gauge"
                            data-width="200"
                            data-height="200"
                            data-units="°C"
                            data-title="Temperature"
                            data-min-value="-30"
                            data-max-value="50"
                            data-major-ticks="[-30,-20,-10,0,10,20,30,40,50]"
                            data-minor-ticks="2"
                            data-stroke-ticks="true"
                            data-highlights='[ {"from": -50, "to": 0, "color": "rgba(0,0, 255, .3)"},
                                {"from": 0, "to": 50, "color": "rgba(255, 0, 0, .3)"} ]'
                            data-ticks-angle="225"
                            data-start-angle="67.5"
                            data-color-major-ticks="#ddd"
                            data-color-minor-ticks="#ddd"
                            data-color-title="#eee"
                            data-color-units="#ccc"
                            data-color-numbers="#eee"
                            data-color-plate="#222"
                            data-border-shadow-width="0"
                            data-borders="true"
                            data-needle-type="arrow"
                            data-needle-width="2"
                            data-needle-circle-size="7"
                            data-needle-circle-outer="true"
                            data-needle-circle-inner="false"
                            data-animation-duration="1500"
                            data-animation-rule="linear"
                            data-color-border-outer="#333"
                            data-color-border-outer-end="#111"
                            data-color-border-middle="#222"
                            data-color-border-middle-end="#111"
                            data-color-border-inner="#111"
                            data-color-border-inner-end="#333"
                            data-color-needle-shadow-down="#333"
                            data-color-needle-circle-outer="#333"
                            data-color-needle-circle-outer-end="#111"
                            data-color-needle-circle-inner="#111"
                            data-color-needle-circle-inner-end="#222"
                            data-value-box-border-radius="0"
                            data-color-value-box-rect="#222"
                            data-color-value-box-rect-end="#333"
                            value={this.state.theData.Temperature}
                        ></canvas>
                    </View>
                    <View style={ styles.boxContainer }>
                    </View>
                </View>

                <View style={ styles.secondRowContainer }>
                    <View style={ styles.boxContainer }>
                    </View>
                    <View style={ styles.boxContainer }>
                    </View>
                </View>
                
                <View style={ styles.spareRowContainer }>
                </View>
                
                <IoTManager style={styles.rowContainer}/>
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
        backgroundColor: '#152d44',
    },
    firstRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height:200
    },
    secondRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height:210
    },
    spareRowContainer: {
        flex:1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#152d44',
        padding: 10,
    },
    values: {
        textAlign: 'center',
        color: '#7591af',
        fontSize: 30,
        fontWeight: '100',
    }
});

export default Dashboard;