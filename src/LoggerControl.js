import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';

export default class LoggerControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPaused: false,
            color:'success'
        };
        this.clickHandler = this.clickHandler.bind(this);
    }
    clickHandler(evt) {
        let isPaused = !this.state.isPaused;
        if(isPaused){
            this.props.onPaused();
        }
        else{
            this.props.onResumed();
        }
        this.setState({ isPaused, color:isPaused?'warning':'success'});
    }
    render() {
        return (
            <Button type="button" variant={this.state.color} 
                onClick={this.clickHandler}
            >
                {this.state.isPaused ? 'Resume' : 'Pause'}
            </Button>
        )
    }
}