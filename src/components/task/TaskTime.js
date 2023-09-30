import React, { Component } from 'react'

export default class TaskTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDate: '',
      currentTime: '',
      alarmTime: props.time,
    }
    this.setAlarmTime = this.setAlarmTime.bind(this)
  }

  componentDidMount() {
    this.clock = setInterval(() => this.setCurrentTime(), 1000)
    this.interval = setInterval(() => this.checkAlarmClock(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.clock)
    clearInterval(this.interval)
  }

  setCurrentTime() {
    this.setState({
      currentDate: new Date().toLocaleDateString(),
      currentTime: new Date().toLocaleTimeString('en-US', { hour12: false }),
    })
  }

  setAlarmTime(event) {
    event.preventDefault()

    const inputAlarmTimeModified = event.target.value + ':00'

    this.setState({
      alarmTime: inputAlarmTimeModified,
    })
  }

  checkAlarmClock() {
    if (this.state.alarmTime == 'undefined' || !this.state.alarmTime) {
      this.alarmMessage = 'Please set your alarm.'
    } else {
      this.alarmMessage = 'Your alarm is set for ' + this.state.alarmTime + '.'
      if (
        // this.state.currentDate === this.state.alarmTime.toLocaleDateString() &&
        this.state.currentTime ===
          this.state.alarmTime.toLocaleTimeString('en-US', { hour12: false })
      ) {
        alert('its time!')
      }
    }
  }

  render() {
    return <div></div>
  }
}
