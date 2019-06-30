import React, { Component } from 'react';

export default class LoggerDisplay extends Component {
    renderSymbols(stockData) {
        if(typeof stockData.map !== 'function'){
            return;
        }
        return stockData.map((item,idx) => {
            return (<div key={stockData.millitime+"-"+idx}>
                {item.code} : ${item.price}
            </div>)
        });
    }
    render() {
        let logData = this.props.logData;
        if(typeof logData.map !== 'function'){
            return;
        }
        return (
            <>
            {logData.map((item) => {
            return (
            <div key={item.millitime}>Updates for {item.datetime}
                {this.renderSymbols(item)}
                <div>&nbsp;</div>
            </div>
            )
        })}
        </>
        );
    }
}