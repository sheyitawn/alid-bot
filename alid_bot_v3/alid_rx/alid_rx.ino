#include <Servo.h>
#include <ArduinoJson.h>
#include "NRFLite.h"

Servo arm0, arm1, arm2, base, grip;
NRFLite _radio;

const int greenLED = 4;
const int redLED = 5;

int IRSensor = A1;

const int numServos = 3;
char _receivedData[256]

void setup() {
  base.attach(A5);
  arm0.attach(A0);
  arm1.attach(A2);
  arm2.attach(A3);
  grip.attach(A4);

  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);
  pinMode(IRSensor, INPUT);

  base.write(135);
  arm0.write(80);
  arm1.write(80);
  arm2.write(80);
  grip.write(0);

  Serial.begin(9600);
  Serial.println("ALID-BOT READY!💫");

  if (!_radio.init(0, 9, 10)) { // id of 0
    Serial.println("NRF24L01 initialization failed!");
    while (1);
  }
}

void moveServo(Servo &servo, int currentPosition, int targetPosition) {
  int step = (currentPosition < targetPosition) ? 1 : -1;
  for (int pos = currentPosition; pos != targetPosition; pos += step) {
    servo.write(pos);
    digitalWrite(greenLED, HIGH);
    delay(50);
    digitalWrite(greenLED, LOW);
  }
  servo.write(targetPosition);
}

void playSequence(JsonArray sequence) {
  for (JsonArray step : sequence) {
    int basePos = step[0];
    int arm0Pos = step[1];
    int arm1Pos = step[2];
    int arm2Pos = step[3];
    int gripPos = step[4];

    moveServo(base, base.read(), basePos);
    moveServo(arm0, arm0.read(), arm0Pos);
    moveServo(arm1, arm1.read(), arm1Pos);
    moveServo(arm2, arm2.read(), arm2Pos);
    moveServo(grip, grip.read(), gripPos);

    delay(1000);
  }
}

void loop() {
  // use IR to detect ball
  int IRStatus = digitalRead(IRSensor);
  Serial.println(!IRStatus); // 0 or 1

  // check for data from the transmitter
  while (_radio.hasData()) {
    memset(_receivedData, 0, sizeof(_receivedData)); // clear  buffer
    _radio.readData(&_receivedData);
    Serial.println(_receivedData);

    // process the received data as JSON
    const size_t capacity = JSON_OBJECT_SIZE(10) + JSON_ARRAY_SIZE(numServos) * 200;
    StaticJsonDocument<capacity> doc;
    DeserializationError error = deserializeJson(doc, _receivedData);

    if (!error) {
      int servoId = doc["servoId"]; // get the servo ID

      // play the sequence
      if (servoId == 99) {
        JsonArray receivedSequence = doc["sequence"];
        playSequence(receivedSequence);
      }
      // individual servo movements
      else if (servoId >= 0 && servoId <= 5) {
        int sliderValue = doc["value"];
        if (sliderValue >= 0 && sliderValue <= 180) {
          int currentPosition;
          switch (servoId) {
            case 0:
              currentPosition = base.read();
              moveServo(base, currentPosition, sliderValue);
              break;
            case 1:
              currentPosition = arm0.read();
              moveServo(arm0, currentPosition, sliderValue);
              break;
            case 2:
              currentPosition = arm1.read();
              moveServo(arm1, currentPosition, sliderValue);
              break;
            case 3:
              currentPosition = arm2.read();
              moveServo(arm2, currentPosition, sliderValue);
              break;
            case 4:
              currentPosition = grip.read();
              moveServo(grip, currentPosition, sliderValue);
              break;
          }
        }
      }
    } else {
      Serial.println("JSON parsing failed");
    }
  }

  // idle state
  digitalWrite(redLED, HIGH);
  delay(500);
  digitalWrite(redLED, LOW);
  delay(500);
}
