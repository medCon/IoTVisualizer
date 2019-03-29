import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Websocket from 'react-native-websocket';
import numeral from 'numeral';
import moment from 'moment';
import IoTManager from './IoTManager';

class Dashboard extends Component {
    chartReference = {};
    state = {
        theData: {
            Temperature: 0,
            Humidity: 0, 
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
                        <Text style={styles.values}>
                            {numeral(this.state.theData.Temperature).format("00.00")}&deg;C
                        </Text>
                    </View>
                    <View style={ styles.boxContainer }>
                        <Text style={styles.values}>
                            {numeral(this.state.theData.Pressure/100).format("00.00")}hPa
                        </Text>
                    </View>
                </View>

                <View style={ styles.secondRowContainer }>
                    <View style={ styles.boxContainer }>
                        <AnimatedCircularProgress
                            size={150}
                            width={15}
                            fill={this.state.theData.Humidity}
                            tintColor="#00e0ff"
                            arcSweepAngle={270}
                            rotation={225}
                            lineCap="round"
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="#3d5875">
                            {
                                (fill) => (
                                <Text style={styles.values}>
                                    {numeral(this.state.theData.Humidity).format("00.00")}%
                                </Text>
                                )
                            }
                        </AnimatedCircularProgress>
                        <Text style={styles.values}>
                            Air humidity
                        </Text>
                    </View>
                    <View style={ styles.boxContainer }>
                        <AnimatedCircularProgress
                            size={150}
                            width={15}
                            fill={this.state.theData.Moisture}
                            tintColor="#00e0ff"
                            arcSweepAngle={270}
                            rotation={225}
                            lineCap="round"
                            onAnimationComplete={() => console.log('onAnimationComplete')}
                            backgroundColor="#3d5875">
                            {
                                (fill) => (
                                  <Text style={styles.values}>
                                    {numeral(this.state.theData.Moisture).format("00.00")}%
                                  </Text>
                                )
                            }
                        </AnimatedCircularProgress>
                        <Text style={styles.values}>
                            Soil moisture
                        </Text>
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
        height:120
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