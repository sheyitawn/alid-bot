clone repo / pull repo

### to run in VSCode/ Terminal

In the VSCode terminal, run:
# cd alid-bot
# npm start

# cd alid-server
# nodemon server.js

This should open the app in your browser


### note
The data buffer of Arduino's serial is by default only 64 bytes in size. This value is hard coded in the Arduino core source code.

Changed buffer size from 64 to 256 here:

packages\arduino\hardware\avr\1.8.6\cores\arduino
in HardwareSerial.h

You have to do this to run longer commands.


### note 2
if you get a 'Error: Opening COMx: File not found' error,
change the com in server.js