import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import weatherData from './weatherStore';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import * as scale from 'd3-scale'
import { G, Line } from 'react-native-svg';
import moment from 'moment';
import Websocket from 'react-native-websocket';

class Home extends Component {
    chartReference = {};
    timeData = [];
    temperatureData = [];
    humidityData = [];
    state = {
        theData: []
    };
    constructor(props) {
        super(props);

        // this.setState({
        //     theData: weatherData
        // });

        weatherData.forEach(element => {
            this.timeData.push(element.Timestamp);
            this.temperatureData.push(element.Temperature);
            this.humidityData.push(element.Humidity);
        });
    }
    JSONStringify(object) {
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
    };

    handleData(event) {
        try {
            console.log(event.data);
            var obj = JSON.parse(event.data);
            if(!obj.timestamp || !obj.Temperature) {
                return;
            }
            var theData = this.state.theData;
            obj.timestamp = new Date(obj.timestamp);
            theData.push(obj);

            const maxLen = 10;

            var len = theData.length;
            if (len > maxLen) {
                theData.shift();
            }
            //console.log(theData);
            this.setState({ theData: theData });
            // this.timeData.push(obj.timestamp);
            // this.temperatureData.push(obj.Temperature);
            // // only keep no more than 50 points in the line chart
            // const maxLen = 50;
            // var len = this.timeData.length;
            // if (len > maxLen) {
            //     this.timeData.shift();
            //     this.temperatureData.shift();
            // }

            // if (obj.Humidity) {
            //     this.humidityData.push(obj.Humidity);
            // }
            // if (this.humidityData.length > maxLen) {
            //     this.humidityData.shift();
            // }

            //this.chartReference.chartInstance.update();
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

    render() {
        const axesSvg = { fontSize: 10, fill: 'grey' };
        const verticalContentInset = { top: 10, bottom: 10 }
        const xAxisHeight = 100

        const CustomGrid = ({ x, y, data, ticks }) => (
            <G>
                {
                    // Horizontal grid
                    ticks.map(tick => (
                        <Line
                            key={ tick }
                            x1={ '0%' }
                            x2={ '100%' }
                            y1={ y(tick) }
                            y2={ y(tick) }
                            stroke={ 'rgba(0,0,0,0.2)' }
                        />
                    ))
                }
                {
                    // Vertical grid
                    data.map((_, index) => (
                        <Line
                            key={ index }
                            y1={ '0%' }
                            y2={ '100%' }
                            x1={ x(index) }
                            x2={ x(index) }
                            stroke={ 'rgba(0,0,0,0.2)' }
                        />
                    ))
                }
            </G>
        )
        return (
            <View style={{ height: 250, padding: 10, flexDirection: 'row' }}>
                <Websocket url='wss://iotmanager.azurewebsites.net'
                    onOpen={this.handleOpen} onClose={this.handleClose}
                    onMessage={this.handleData.bind(this)}
                    reconnect
                    />
                <YAxis
                    data={this.state.theData}
                    style={{marginBottom: xAxisHeight }}
                    yAccessor={({item}) => item.Temperature }
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                /> 
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart 
                        style={{ flex:1 }}
                        data={this.state.theData}
                        yAccessor={({item}) => item.Temperature }
                        xAccessor={({item}) => item.timestamp }
                        xScale={scale.scaleTime}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                        contentInset={verticalContentInset}
                        curve={ shape.curveNatural }
                        animate={ true }
                    >
                        <Grid belowChart={true}/>
                    </LineChart>
                    <XAxis
                        style={{ marginHorizontal: -10, height: xAxisHeight }}
                        data={this.state.theData}
                        xAccessor={({item}) => item.timestamp }
                        xScale={scale.scaleTime}
                        numberOfTicks={ 10 }
                        formatLabel={(value, index) =>  {
                                return moment(value).format('DD MM YY HH:mm:ss');
                            }
                        }
                        contentInset={verticalContentInset}
                        svg={{
                            fill: 'black',
                            fontSize: 10,
                            fontWeight: 'bold',
                            rotation: 45,
                            originY: 30,
                            y: 25,
                       }}
                    />
                </View>
            </View>
        );
    }
}

export default Home;