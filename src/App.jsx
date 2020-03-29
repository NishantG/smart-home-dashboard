import React, { useState } from 'react';
import { SketchPicker as Color } from 'react-color';
import convert from 'color-convert';
import Bulb from './bulb.svg';

const App = () => {
  const [display, setDisplay] = useState(false);
  const [color, setColor] = useState('#f2f2f2');

  const handleClick = () => {
    setDisplay(!display);
  };

  const handleClose = () => {
    setDisplay(false);
    const [hue, saturation] = convert.hex.hsv(color);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/light/hsb');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ hue: hue, saturation: saturation }));
  };

  const bulbOff = () => {
    setColor('#f2f2f2');
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/light/off');
    xhr.send();
  };

  const plugOn = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/plug/on');
    xhr.send();
  };

  const plugOff = () => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/plug/off');
    xhr.send();
  };

  const popover = {
    position: 'absolute',
    zIndex: '2',
    margin: '20px 200px'
  };

  const onButton = {
    padding: '10px 20px'
  };

  const offButton = {
    padding: '10px 20px'
  };

  return (
    <div>
      <Bulb width={'100vw'} height={600} fill={color} onClick={handleClick} />
      {display ? (
        <div style={popover}>
          <Color
            width={500}
            disableAlpha={true}
            presetColors={[]}
            color={color}
            onChange={color => setColor(color.hex)}
          />
          <button style={onButton} onClick={handleClose}>
            Set Color
          </button>
        </div>
      ) : null}
      <button style={offButton} onClick={bulbOff}>
        Bulb Off
      </button>
      <button style={offButton} onClick={plugOn}>
        Wax Warmer On
      </button>
      <button style={offButton} onClick={plugOff}>
        Wax Warmer Off
      </button>
    </div>
  );
};

export default App;
