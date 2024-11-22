import serial
import time

# open serial connection
ssc32 = serial.Serial('COM11', 115200, timeout=1)

# set servo 0 to 600 then 1600 microseconds over 1 second
ssc32.write(b'#3P700T1000\r') # start
time.sleep(1)
# ssc32.write(b'#0P800T1000\r')
# time.sleep(1)


# # set servo 1 to 600 then 1600 microseconds over 1 second
# ssc32.write(b'#1P1800T1000\r') # start
# time.sleep(1)
# # ssc32.write(b'#1P700T1000\r')
# # time.sleep(1)


# # # set servo 2 to 600 then 1600 microseconds over 1 second
# ssc32.write(b'#2P1600T1000\r') # start
# time.sleep(1)
# # ssc32.write(b'#2P700T1000\r')
# # time.sleep(1)


# # # set servo 3 to 600 then 1600 microseconds over 1 second
# ssc32.write(b'#3P700T1000\r') # start
# time.sleep(1)
# # ssc32.write(b'#3P1600T1000\r')
# # time.sleep(1)


# # # set servo 4 to 600 then 1600 microseconds over 1 second
# ssc32.write(b'#4P500T1000\r') # start
# time.sleep(1)
# # ssc32.write(b'#4P700T1000\r')
# # time.sleep(1)

# time.sleep(1)
ssc32.close()
