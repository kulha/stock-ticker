import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import axios from 'axios';
import './LogSummary.css';
export default class LogSummary extends Component {
    static defaultProps = {
        stockData: [],
        fetchInterval:2000
    };
    constructor(props) {
        super(props);
        this.state = {
            intervalRef: undefined,
            logData: [],
            summaryData: new Map(),
        };
        this.tableRows = this.tableRows.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.paddedValues=this.paddedValues.bind(this);
    }
    paddedValues(stockData){
        return {
            stockName:stockData.stockName,
            starting:stockData.starting.toFixed(2),
            lowest:stockData.lowest.toFixed(2),
            highest:stockData.highest.toFixed(2),
            current:stockData.current.toFixed(2)
        };

    }
    fetchData() {
        axios.get(this.props.stockUrl)
            .then((res) => {
                // console.log(res.data);
                let stockData = res.data;
                //push into state
                this.summarize(stockData);
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
    summarize(stockData) {
        let allHistoryData;
        // console.log("stockData: ", stockData);
        if (this.state.logData === void 0) {
            allHistoryData = [stockData];
        }
        else {
            allHistoryData = [...this.state.logData, stockData];
        }
        // console.log("1", allHistoryData);
        let summaryTableData = new Map();
        allHistoryData.forEach(stockData => {
            stockData.forEach((singleStock, idx) => {
                let existingSummaryOfStock = summaryTableData.get(singleStock.code);
                let rowData;
                if (existingSummaryOfStock === void 0) {
                    rowData = {
                        stockName: singleStock.code,
                        starting: singleStock.price,
                        lowest: singleStock.price,
                        highest: singleStock.price,
                        current: singleStock.price
                    };
                } else {
                    rowData = {
                        stockName: singleStock.code,
                        starting: existingSummaryOfStock.starting,
                        lowest: Math.min(existingSummaryOfStock.lowest, singleStock.price),
                        highest: Math.max(existingSummaryOfStock.highest, singleStock.price),
                        current: singleStock.price
                    };
                }
                summaryTableData.set(rowData.stockName, rowData);
            });
        });
        // console.log(summaryTableData);
        this.setState({
            logData: allHistoryData,
            summaryData: summaryTableData
        });
    }
    tableRows() {
        let summaryData = this.state.summaryData;
        if (summaryData === void 0) {
            return;
        }
        summaryData = Array.from(this.state.summaryData, ([key, value]) => value);
        return summaryData.map(stockData => {
            stockData = this.paddedValues(stockData);
            return (<tr key={stockData.stockName}>
                        <td className='pl-5 text-left'>
                            {stockData.stockName}
                        </td>
                        <td className='pr-5'>
                            {stockData.starting}
                        </td>
                        <td className='pr-5'>
                            {stockData.lowest}
                        </td>
                        <td className='pr-5'>
                            {stockData.highest}
                        </td>
                        <td className='pr-5'>
                            {stockData.current}
                        </td>
                    </tr>);
        });
    }
    render() {
        return (
            <Table borderless  className='text-right pr-5'>
                <thead>
                    <tr>
                        <th className='px-5 text-left'>Stock</th>
                        <th className='px-5'>Starting</th>
                        <th className='px-5'>Lowest</th>
                        <th className='px-5'>Highest</th>
                        <th className='px-5'>Current</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.summaryData.length===0 && <tr><td>Loading...</td></tr>}
                    {this.tableRows()}
                </tbody>
            </Table>
        )
    }
}