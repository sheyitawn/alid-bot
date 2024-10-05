import serial
import time

# open serial connection
ssc32 = serial.Serial('COM5', 115200, timeout=1)

ssc32.write(b'#0P1700T1000\r')
time.sleep(1)
ssc32.write(b'#1P1800T1000\r')
time.sleep(1)
ssc32.write(b'#2P1600T1000\r')
time.sleep(1)
ssc32.write(b'#3P700T1000\r')
time.sleep(1)

ssc32.write(b'#4P500T1000\r')

time.sleep(1)
ssc32.close()
