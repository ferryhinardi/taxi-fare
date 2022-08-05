# Taxi Fare

## Specification

### Overview
1. The base fare is 400 yen for up to 1 km.
2. Up to 10 km, 40 yen is added every 400 meters.
3. Over 10km, 40 yen is added every 350 meters.

This taxi is equipped with the following two meters. Only one of the most recent real values
is recorded on these meters.
- Distance Meter
- Fare Meter

### Input Format
Distance meter records are sent line by line for standard input in the following format.
00:00:00.000 0.0 00:01:00.123 480.9 00:02:00.125 1141.2 00:03:00.100 1800.8
The specifications of the distance meter are as follows.
- Space-separated first half is elapsed time (Max 99:99:99.999), second half is mileage.(the unit is meters, Max: 99999999.9)
- It keeps only the latest values.
- It calculates and creates output of the mileage per minute, but an error of less than 1 second occurs.

### Error Definition
Error occurs under the following conditions.
- Not under the format of, hh:mm:ss.fff<SPACE>xxxxxxxx.f<LF>, but under an improper format.
- Blank Line
- When the past time has been sent.
- The interval between records is more than 5 minutes apart.
- When there are less than two lines of data.
- When the total mileage is 0.0m.

### Output
Display the current fare as an integer on the fare meter (standard output). 12345
Standard output displays nothing for incorrect inputs that do not meet specifications, the exit
code ends with a value other than 0.

## Step installation
1. npm install
2. npm run build
3. npm start
