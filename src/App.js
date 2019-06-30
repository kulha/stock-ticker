import React, {Component} from 'react';
import StockLoggerApp from './StockLoggerApp';
export default class App extends Component {
    render(){
        return (
            <div className="App">
                <StockLoggerApp stockUrl="https://join.reckon.com/stock-pricing" />
            </div>
        );
    }
}
