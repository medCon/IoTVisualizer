import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RadialGauge } from 'react-canvas-gauges';
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
            console.log(event);
            var obj = JSON.parse(event);
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
                        <RadialGauge
                            units='°C'
                            title='Temperature'
                            value={this.state.theData.Temperature}
                            minValue={-30}
                            maxValue={50}
                            majorTicks={['-30','-20','-10','0','10','20','30','40','50']}
                            minorTicks={2}
                            width={200}
                            height={200}
                            strokeTicks='true'
                            highlights={[ {"from": -30, "to": 0, "color": "rgba(0,0, 255, .3)"},
                                {"from": 0, "to": 50, "color": "rgba(255, 0, 0, .3)"} ]}
                        ></RadialGauge>
                    </View>
                    <View style={ styles.boxContainer }>
                        <RadialGauge
                            units='°C'
                            title='Temperature'
                            value={this.state.theData.Temperature}
                            minValue={-30}
                            maxValue={50}
                            majorTicks={['-30','-20','-10','0','10','20','30','40','50']}
                            minorTicks={2}
                            width={200}
                            height={200}
                            strokeTicks='true'
                            highlights={[ {"from": -30, "to": 0, "color": "rgba(0,0, 255, .3)"},
                                {"from": 0, "to": 50, "color": "rgba(255, 0, 0, .3)"} ]}
                        ></RadialGauge>
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