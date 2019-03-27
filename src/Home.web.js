import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import weatherData from './weatherStore';
import { Line } from 'react-chartjs-2';
import Websocket from 'react-websocket';

class Home extends Component {
    chartReference = {};
    timeData = [];
    temperatureData = [];
    humidityData = [];
    moistureData = [];


    constructor(props) {
        super(props);

        weatherData.forEach(element => {
            this.timeData.push(element.Timestamp);
            this.temperatureData.push(element.Temperature);
            this.humidityData.push(element.Humidity);
            this.moistureData.push(element.Moisture);
        });
    }

    data = {
        labels: this.timeData,
        datasets: [
        {
            fill: false,
            label: 'Temperature',
            yAxisID: 'Temperature',
            borderColor: "rgba(255, 204, 0, 1)",
            pointBoarderColor: "rgba(255, 204, 0, 1)",
            backgroundColor: "rgba(255, 204, 0, 0.4)",
            pointHoverBackgroundColor: "rgba(255, 204, 0, 1)",
            pointHoverBorderColor: "rgba(255, 204, 0, 1)",
            data: this.temperatureData
        },
        {
            fill: false,
            label: 'Humidity',
            yAxisID: 'Humidity',
            borderColor: "rgba(24, 120, 240, 1)",
            pointBoarderColor: "rgba(24, 120, 240, 1)",
            backgroundColor: "rgba(24, 120, 240, 0.4)",
            pointHoverBackgroundColor: "rgba(24, 120, 240, 1)",
            pointHoverBorderColor: "rgba(24, 120, 240, 1)",
            data: this.humidityData
        },
        {
            fill: false,
            label: 'Moisture',
            yAxisID: 'Moisture',
            borderColor: "rgba(122, 207, 240, 1)",
            pointBoarderColor: "rgba(122, 207, 240, 1)",
            backgroundColor: "rgba(122, 207, 240, 0.4)",
            pointHoverBackgroundColor: "rgba(122, 207, 240, 1)",
            pointHoverBorderColor: "rgba(122, 207, 240, 1)",
            data: this.moistureData
        }
        ]
    };

    basicOptions = {
        title: {
            display: true,
            text: 'Temperature, Humidity & Moisture Real-time Data',
            fontSize: 36
        },
        scales: {
            yAxes: [{
            id: 'Temperature',
            type: 'linear',
            scaleLabel: {
                labelString: 'Temperature(C)',
                display: true
            },
            position: 'left',
            }, {
                id: 'Humidity',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Humidity(%)',
                    display: true
                },
                position: 'right'
            }, {
                id: 'Moisture',
                type: 'linear',
                scaleLabel: {
                    labelString: 'Moisture(%)',
                    display: true
                },
                position: 'right'
            }]
        }
    };

    handleData(data) {
        console.log('receive message' + data);
        try {
            var obj = JSON.parse(data);
            if(!obj.timestamp || !obj.Temperature) {
                return;
            }
            this.timeData.push(obj.timestamp);
            this.temperatureData.push(obj.Temperature);
            // only keep no more than 50 points in the line chart
            const maxLen = 10;
            var len = this.timeData.length;
            if (len > maxLen) {
                this.timeData.shift();
                this.temperatureData.shift();
            }

            if (obj.Humidity) {
                this.humidityData.push(obj.Humidity);
            }
            if (this.humidityData.length > maxLen) {
                this.humidityData.shift();
            }

            if (obj.Moisture >= 0) {
                this.moistureData.push(obj.Moisture);
            }
            if (this.moistureData.length > maxLen) {
                this.moistureData.shift();
            }

            this.chartReference.chartInstance.update();
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
        return (
            <View>
                <Websocket url='wss://iotmanager.azurewebsites.net'
                    onOpen={this.handleOpen} onClose={this.handleClose}
                    reconnect={true} debug={true}
                    onMessage={this.handleData.bind(this)}/>
                <Line 
                    ref={(reference) => this.chartReference = reference }
                    data={this.data}
                    width={1200}
                    height={600}
                    options={this.basicOptions}
                />
            </View>
        );
    }
}

export default Home;