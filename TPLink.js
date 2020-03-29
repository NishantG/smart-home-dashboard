'use strict';

var net = require('net');

const PLUG_IP = '192.168.1.77';
const BULB_IP = '192.168.1.124';
const PORT = 9999;

function encrypt(command) {
  let key = 0xab;
  for (let i = 0; i < command.length; i++) {
    const x = key ^ command[i];
    command[i] = x;
    key = x;
  }
  let header = Buffer.alloc(4);
  header.writeInt32BE(command.length);
  return Buffer.concat([header, command]);
}

function decrypt(response) {
  let key = 0xab;
  for (let i = 0; i < response.length; i++) {
    const x = key ^ response[i];
    key = response[i];
    response[i] = x;
  }
  return response;
}

function sendBulbCommand(command) {
  const connection = new net.Socket();

  connection.connect(PORT, BULB_IP, function() {
    console.log('Connected to bulb');
    connection.write(encrypt(Buffer.from(command)));
  });

  connection.on('data', function(data) {
    console.log('Received from bulb: ' + decrypt(data.slice(4)));
    connection.destroy();
  });

  connection.on('close', function() {
    console.log('Closed bulb connection');
  });
}

function sendPlugCommand(command) {
  const connection = new net.Socket();

  connection.connect(PORT, PLUG_IP, function() {
    console.log('Connected to plug');
    connection.write(encrypt(Buffer.from(command)));
  });

  connection.on('data', function(data) {
    console.log('Received from plug: ' + decrypt(data.slice(4)));
    connection.destroy();
  });

  connection.on('close', function() {
    console.log('Closed plug connection');
  });
}

function plugOn() {
  sendPlugCommand('{"system":{"set_relay_state":{"state":1}}}');
}

function plugOff() {
  sendPlugCommand('{"system":{"set_relay_state":{"state":0}}}');
}

function bulbOn() {
  sendBulbCommand(
    '{"smartlife.iot.smartbulb.lightingservice":{"transition_light_state":{"on_off":1}}}'
  );
}

function bulbOff() {
  sendBulbCommand(
    '{"smartlife.iot.smartbulb.lightingservice":{"transition_light_state":{"on_off":0}}}'
  );
}

function getLightState() {
  sendBulbCommand(
    '{"smartlife.iot.smartbulb.lightingservice":{"get_light_state":null}}'
  );
}

function setBulbHSB(hue, saturation, brightness) {
  sendBulbCommand(
    `{"smartlife.iot.smartbulb.lightingservice":{"transition_light_state":{"hue":${hue},"saturation":${saturation},"brightness":${brightness},"color_temp":0}}}`
  );
}

function bulbOnHSB(hue, saturation, brightness) {
  sendBulbCommand(
    `{"smartlife.iot.smartbulb.lightingservice":{"transition_light_state":{"hue":${hue},"saturation":${saturation},"brightness":${brightness},"color_temp":0,"on_off":1}}}`
  );
}

module.exports = { bulbOff, bulbOnHSB, plugOn, plugOff };
