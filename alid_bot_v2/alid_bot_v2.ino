#include <Servo.h>
#include <ArduinoJson.h>

Servo arm0, arm1, arm2, base, grip;

const int greenLED = 4;
const int redLED = 5;

int IRSensor = A5;

const int numServos = 3;           // Number of servos

void setup() {
  base.attach(A0); 
  arm0.attach(A1);
  arm1.attach(A2);
  arm2.attach(A3);
  grip.attach(A4);

  
  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);

  pinMode(IRSensor, INPUT); // IR Sensor pin INPUT
  // pinMode(LED_BUILTIN, OUTPUT);

  base.write(135);
  arm0.write(80);
  arm1.write(80);
  arm2.write(80);
  grip.write(0);
  Serial.begin(9600);
  Serial.println("ALID-BOT READY!💫");


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

  // for (int i = 0; i < 3; i++) {
  //   digitalWrite(greenLED, HIGH);
  //   delay(100);
  //   digitalWrite(greenLED, LOW);
  //   delay(100);
  // }

  for (JsonArray step : sequence) {
    // final -> [base, arm0, arm1, arm2, grip]
    // [base, arm0, arm1, grip]
    int basePos = step[0];
    int arm0Pos = step[1];
    int arm1Pos = step[2];
    int arm2Pos = step[3];
    int gripPos = step[4];  // change to 4


    // move servos to their respective positions
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
  // Serial.print("IRStatus: ");
  Serial.println(!IRStatus); // 0 or 1

  // check if a serial message is available
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    const size_t capacity = JSON_OBJECT_SIZE(10) + JSON_ARRAY_SIZE(numServos) * 200;
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
      else if (servoId >= 0 && servoId <= 5) {
        int sliderValue = doc["value"];
        if (sliderValue >= 0 && sliderValue <= 180) {
          int currentPosition;
          switch (servoId) {
            case 0: 
                currentPosition = base.read(); // Read current position
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

// {"servoId": 99, "sequence": [[90, 45], [45, 90], [135, 135]]}
// {"servoId":0,"value":54}
// {"servoId":0,"value":135}



// use this to test
// {"servoId":99,"sequence":[[120,169,144,0],[22,44,103,0],[179,165,0,0], [120,169,144,0],[22,44,103,0],[179,165,0,0]]}