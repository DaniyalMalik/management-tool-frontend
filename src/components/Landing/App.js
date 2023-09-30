import React from 'react'
import './assets/css/bootstrap.min.css'
import './assets/css/style.css'
import './assets/css/color.css'

function Landing() {
  return (
    <div className="App">
      <iframe
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
        title="BIZSTRUC Landing Page"
        src="https://bizstruc.com/home"
        frameBorder="0"
      />
    </div>
  )
}

export default Landing
