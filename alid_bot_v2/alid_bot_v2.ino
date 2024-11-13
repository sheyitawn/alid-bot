#include <Servo.h>
#include <ArduinoJson.h>

Servo arm0, base;

const int greenLED = 6;
const int redLED = 5;

const int numServos = 2;           // Number of servos

void setup() {
  arm0.attach(A3);
  base.attach(A5);
  
  pinMode(greenLED, OUTPUT);
  pinMode(redLED, OUTPUT);
  Serial.begin(9600);

  Serial.println("ALID-BOT READY!💫");
  arm0.write(0);
  base.write(0);
}

// Function to play the received sequence
void playSequence(JsonArray sequence) {

  for (int i = 0; i < 3; i++) {
    digitalWrite(greenLED, HIGH);
    delay(100);
    digitalWrite(greenLED, LOW);
    delay(100);
  }

  for (JsonArray step : sequence) {
    // Assuming the sequence array includes positions for arm0 and base
    int arm0Pos = step[0];
    int basePos = step[1];

    // Move servos to their respective positions for this step
    arm0.write(arm0Pos);
    base.write(basePos);

    delay(1000);  // Adjust delay as needed for smooth movement
  }
}

void loop() {
  // Check if a new serial message is available
  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');
    const size_t capacity = JSON_OBJECT_SIZE(2) + JSON_ARRAY_SIZE(numServos) * 5;
    StaticJsonDocument<capacity> doc;

    // Parse the JSON data
    DeserializationError error = deserializeJson(doc, data);

    if (!error) {
      int servoId = doc["servoId"];
      
      // If the command is to play the sequence
      if (servoId == 99) {
        JsonArray receivedSequence = doc["sequence"];

        // Play the sequence directly
        playSequence(receivedSequence);
      }
      // Handle individual servo movements
      else if (servoId >= 0 && servoId <= 3) {
        int sliderValue = doc["value"];
        if (sliderValue >= 0 && sliderValue <= 180) {
          switch (servoId) {
            case 0: arm0.write(sliderValue); break;
            case 3: base.write(sliderValue); break;
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
