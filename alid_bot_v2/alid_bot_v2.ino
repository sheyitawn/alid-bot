#include <Servo.h>
#include <ArduinoJson.h>

Servo arm0, arm1, base;

const int greenLED = 6;
const int redLED = 5;

int IRSensor = A5;

const int numServos = 3;           // Number of servos

void setup() {
  base.attach(A0); // change to A5 for bot
  arm0.attach(A1); // change to A3 for bot
  arm1.attach(A2);

  
  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  pinMode(IRSensor, INPUT); // IR Sensor pin INPUT
  // pinMode(LED_BUILTIN, OUTPUT);

  base.write(0);
  arm0.write(0);
  arm1.write(0);
  Serial.begin(9600);
  Serial.println("ALID-BOT READY!💫");


}

void playSequence(JsonArray sequence) {

  for (int i = 0; i < 3; i++) {
    digitalWrite(greenLED, HIGH);
    delay(100);
    digitalWrite(greenLED, LOW);
    delay(100);
  }

  for (JsonArray step : sequence) {
    // final -> [base, arm0, arm1, arm2, arm3, grip]
    // [base, arm0, arm1]
    int basePos = step[0];
    int arm0Pos = step[1];
    int arm1Pos = step[2];


    // move servos to their respective positions
    base.write(basePos);
    arm0.write(arm0Pos);
    arm1.write(arm1Pos);

    delay(1000);
  }
}

void loop() {
  // use IR to detect ball
  int IRStatus = digitalRead(IRSensor);
  // Serial.print("IRStatus: ");
  Serial.println(IRStatus); // 0 or 1

  // check if a serial message is available
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_ARRAY_SIZE(numServos) * 5;
    StaticJsonDocument<capacity> doc;

    // parse the JSON data
    DeserializationError error = deserializeJson(doc, data);

    if (!error) {
      int servoId = doc["servoId"];   // get the servo id
      
      // if the command is to play the sequence
      if (servoId == 99) {
        JsonArray receivedSequence = doc["sequence"];

        // play the sequence
        playSequence(receivedSequence);
      }
      // individual servo movements
      else if (servoId >= 0 && servoId <= 3) {
        int sliderValue = doc["value"];
        if (sliderValue >= 0 && sliderValue <= 180) {
          switch (servoId) {
            case 0: base.write(sliderValue); break;
            case 1: arm0.write(sliderValue); break;
            case 2: arm1.write(sliderValue); break;
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

// Example JSON to send from React:
// {"servoId": 99, "sequence": [[90, 45], [45, 90], [135, 135]]}
// {"servoId":0,"value":54}
