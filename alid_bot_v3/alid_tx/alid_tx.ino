#include "SPI.h"
#include "NRFLite.h"

NRFLite _radio;
char _data[256]; // buffer of data to send

void setup() {
  Serial.begin(9600);
  if (!_radio.init(5, 9, 10)) { // id of 5
    Serial.println("NRF24L01 initialization failed!");
    while (1);
  }
  Serial.println("Transmitter Ready");
}

void loop() {
  // check if there's data from react
  if (Serial.available() > 0) {
    strncpy(_data, "Hello, World!", sizeof(_data) - 1);
    _data[sizeof(_data) - 1] = '\0'; // null-termination

    _radio.send(6, _data, strlen(_data) + 1);

    Serial.print("Sent: ");
    Serial.println(_data);
  }
  delay(500);
}
