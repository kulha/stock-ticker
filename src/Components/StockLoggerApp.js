import React, { Component } from 'react';
import LoggerControl from './LoggerControl';
import LoggerDisplay from './LoggerDisplay';
import LogSummary from './LogSummary';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './StockLoggerApp.css';
export default class StockLoggerApp extends Component {
    static defaultProps = {
        fetchInterval:2000
    }
    constructor(props) {
        super(props);
        this.state = {
            intervalRef: undefined,
            logData: []
        };
        this.pauseHandler = this.pauseHandler.bind(this);
        this.resumeHandler = this.resumeHandler.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }
    fetchData() {
        axios.get(this.props.stockUrl)
            .then((res) => {
                // console.log(res.data);
                let stockData = res.data;
                let nowDateTime = new Date();
                stockData.datetime = nowDateTime.toUTCString();
                stockData.millitime = nowDateTime.getTime(); // for unique key
                //push into state
                this.setState(state => ({
                    logData: [stockData, ...state.logData],
                }));
            });
    }
    componentDidMount() {
        this.initFetchData();
    }
    initFetchData() { // reusable at resume
        // initialize setInteval
        let intervalRef = setInterval(this.fetchData, this.props.fetchInterval);
        // store the ref to Interval Object
        this.setState({ intervalRef });
    }

    pauseHandler() {
        // clear the Interval Object
        clearTimeout(this.state.intervalRef);
        // remove interval ref from state
        this.setState({ intervalRef: undefined });
    }
    resumeHandler() {
        this.initFetchData();
    }
    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col md={4}>
                        <Row>
                            <Col md={8}>
                                <h1>Log</h1>
                            </Col>
                            <Col md={4} className='pt-2 pb-1 pr-3 d-flex justify-content-end '>
                                <LoggerControl onPaused={this.pauseHandler} onResumed={this.resumeHandler} />
                            </Col>
                            <Col md={12} className='d-inline-flex justify-content-around'>
                                <div className='log table'>
                                    {this.state.logData.length===0 && 'Loading...'}
                                    {this.state.logData.length>0 && <LoggerDisplay logData={this.state.logData} />}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={8}>
                        <Row>
                            <Col md={12}>
                                <h1>Summary</h1>
                            </Col>
                            <Col md={12}>
                                <LogSummary stockUrl={this.props.stockUrl} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}