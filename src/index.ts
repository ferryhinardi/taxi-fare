const baseFare = 400;
const limitMaxDistances = [1000, 10000];
const incrementCostDistanceLimit = [1000, 400, 350];
const additionalFare = 40;
const maxDistance = 99999999.9;
const log = console.log;

type Trip = {
  elapsedTimes: string[];
  mileages: string[];
};

function calculateFare(totalCost: number, pushDistances: number[], mileage: number, levelLimit: number) {
  const limitMaxDistance = limitMaxDistances[levelLimit] ?? maxDistance;
  const incrementCostDistance = incrementCostDistanceLimit[levelLimit];

  if (mileage > 0 && mileage > incrementCostDistance) {
    const additionalMileage = mileage - incrementCostDistance;
    totalCost += additionalFare;

    pushDistances.push(additionalMileage > 0 ? incrementCostDistance : Math.abs(additionalMileage));

    const totalDistance = pushDistances.reduce((acc, curr) => acc + curr, 0);

    if (totalDistance >= limitMaxDistance) {
      totalCost = calculateFare(totalCost, pushDistances, additionalMileage, levelLimit + 1);
    } else {
      totalCost = calculateFare(totalCost, pushDistances, additionalMileage, levelLimit);
    }
  }

  return totalCost;
}

function calculateFares(mileages: string[]): number {
  let totalCost = baseFare;
  let index = 0;

  while (index < mileages.length) {
    const pushDistances = [1000];
    const mileage = parseFloat(mileages[index]);
    totalCost = calculateFare(totalCost, pushDistances, mileage, 0);
    index++;
  }

  return totalCost;
}

// ${elapsed time} ${mileage}
// hh:mm:ss.fff xxxxxxxx.f (unit mater)
// 99:99:99.999 99999999.9 (Max Value)
function parseInputFormat(input: string): Trip {
  const elapsedTimes: string[] = [];
  const mileages: string[] = [];
  const inputLine = /[^\s]+ [^\s]+/g;
  const elapsedRegExp = /([0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3})/;
  const mileageRegExp = /([0-9]{1,}.[0-9]{1})/;
  // Get all lines
  // const regex = /\d{2}:\d{2}:\d{2}\.\d{3} \d{1,}\.\d{1,}/g;

  const trips = input.match(inputLine);

  trips?.forEach((trip) => {
    const [elapsedTime, mileage] = trip.split(' ');

    if (new RegExp(elapsedRegExp).exec(elapsedTime)) {
      elapsedTimes.push(elapsedTime);
    } else {
      throw new Error('Invalid elapsed time');
    }

    if (new RegExp(mileageRegExp).exec(mileage)) {
      if (parseInt(mileage) === 0) {
        throw new Error('Invalid mileage');
      }

      mileages.push(mileage);
    } else {
      throw new Error('Invalid mileage');
    }
  });
  return { elapsedTimes, mileages };
}

function convertElapsedTime(elapsedTime: string): number {
  const [hours, minutes, seconds, milliseconds] = elapsedTime.split(':');
  return (
    parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseInt(seconds, 10) + parseInt(milliseconds, 10) / 1000
  );
}

function getTimes(elapsedTimes: string[]) {
  return elapsedTimes.map((elapsedTime) => {
    const timeFormat = elapsedTime.replace('.', ':');
    return convertElapsedTime(timeFormat);
  });
}

const calculateMileagePerMinute = (mileage: number, time: number) => {
  return mileage / time;
};

const question = `Input? (hh:mm:ss.fff xxxxxxxx.f) (e.g. 00:01:00.000 444.4) | (exit) \n`;
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
function start() {
  readline.question(question, (input: string) => {
    // const input =
    //   '00:01:00.123 480.9 00:02:00.125 1141.2 00:03:00.100 1800.8 00:04:00.110 2488.8 00:05:00.140 3138.0 00:06:00.210 3818.2 00:07:00.510 4529.4 00:08:00.520 5259.6 00:09:00.530 5900.7 00:10:00.540 6600.9 00:11:00.550 7300.1 00:12:00.560 8000.3 00:13:00.570 8600.5 00:14:00.580 9300.7 00:15:00.590 10000.9 00:16:00.600 10700.1 00:17:00.610 11400.3 00:18:00.620 12100.5 00:19:00.630 12800.7 00:20:00.640 13500.9 00:21:00.650 14200.1 00:22:00.660 14900.3 00:23:00.670 15600.5 00:24:00.680 16300.7 00:25:00.690 17000.9 00:26:00.700 17700.1 00:27:00.710 18400.3 00:28:00.720 19100.5 00:29:00.730 19800.7 00:30:00.740 20500.9 00:31:00.750 21201.1 00:32:00.760 21901.3 00:33:00.770 22601.5 00:34:00.780 23301.7 00:35:00.790 24001.9 00:36:00.800 24702.1 00:37:00.810 25402.3 00:38:00.820 26102.5 00:39:00.830 26802.7 00:40:00.840 27500.9 00:41:00.850 28200.1 00:42:00.860 28900.3 00:43:00.870 29600.5 00:44:00.880 30300.7 00:45:00.890 31001.9 00:46:00.900 31702.1 00:47:00.910 32402.3 00:48:00.920 33102.5 00:49:00.930 33900.7 00:50:00.940 34600.9 00:51:00.950 35301.1 00:52:00.960 36001.3 00:53:00';
    // const input = '00:50:00.940 34600.9 00:51:00.950 35301.1 00:52:00.960 36001.3 00:53:00';
    try {
      if (input.trim() === '') throw new Error('Invalid empty input');

      if (input.trim() === 'exit') {
        readline.close();
        process.exit();
      }

      const { elapsedTimes, mileages } = parseInputFormat(input);
      const times = getTimes(elapsedTimes);
      let i = 0;
      let interval: ReturnType<typeof setInterval>;

      interval = setInterval(() => {
        if (times.filter((_, idx) => idx < i).some((time, idx) => times[i] < time)) {
          throw new Error('The time has been past');
        }

        if (times[i]) {
          const val = calculateFares(mileages.filter((_, idx) => idx === i));
          log(val);
        } else {
          clearInterval(interval);
        }
        i++;
      }, times[i]);
    } catch (e) {
      console.error(e);
    } finally {
      start();
    }
  });
}

start();
