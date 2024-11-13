#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>

// const char* ssid = "BT-98CJJX";     // wifi SSID
// const char* password = "XGRpnapxnkE6Pk";    // password

// const char* ssid = "haha";     // wifi SSID
// const char* password = "1t55hw1fty";    // password

const char* ssid = "Grandpa Garp";     // wifi SSID
const char* password = "Orange12";    // password


ESP8266WebServer server(80);
SoftwareSerial sscSerial(5, 4);


void handleCors() {   // handle cors error
  Serial.println("handling cors");
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204, "text/plain", "handled cors");
}


void handleServoControl() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  
  if (server.hasArg("plain")) {

    String body = server.arg("plain");

    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, body);

    if (error) {
      Serial.print("JSON Parsing failed!");
      server.send(400, "text/plain", "Invalid JSON");
      return;
    }

    // get servo and position from JSON
    int servo = doc["servo"];
    int position = doc["position"];

    // create SSC-32U command and send
    String command = "#" + String(servo) + " P" + String(position) + " T1000\r";
    // Serial.println("#0 P1600 T500");
    Serial.println(command);
    sscSerial.print(command);

    Serial.println("COMMAND SENT: " + command);
    server.send(200, "text/plain", "Command Sent: " + command);
  } else {
    server.send(400, "text/plain", "Invalid Request: No Body");
  }
}


void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  sscSerial.begin(115200);    // start serial communication

  // routes
  server.on("/control", HTTP_OPTIONS, handleCors);     // cors
  server.on("/control", HTTP_POST, handleServoControl); 

  
  server.begin();
}

void loop() {
  server.handleClient();  // Handle incoming HTTP requests
}
