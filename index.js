const {execSync: run} = require('child_process');

const inquirer = require('inquirer');

var events = [];

async function start(){
  const name = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'What\'s your name?',
    default(){
      return "User"
    }
  });
  const schedule = await inquirer.prompt({
    name: 'type',
    type: 'list',
    message: `Hello ${name.name}! What type of schedule would you like?`,
    choices: [
      "Day",
      "Week",
      "Month"
    ]
  });
  const sleepTimes = await inquirer.prompt([
    {
      name: 'wake',
      type: 'input',
      message: 'When do you wake up? (Format as HH:MM AM/PM)'
    },
    {
      name: 'sleep',
      type: 'input',
      message: 'When do you go to bed? (Format as HH:MM AM/PM)'
    }
  ]);
	//parse(parseTime(sleepTimes.wake), parseTime(sleepTimes.sleep));
  addEvent(parseTime(sleepTimes.wake), parseTime(sleepTimes.sleep), true);
}

async function addEvent(wakeup, bedtime, first){
  let message = first ? 'What is the name of your first event?' : 'What is the name of your next event?';
  const event = await inquirer.prompt([
    {
      name: 'name',
      message
    },
    {
      name: 'start',
      message: 'When does your event start?'
    },
    {
      name: 'end',
      message: 'When does your event end?'
    }
  ]);
  //console.log(`${event.name} starts at ${parseTime(event.start)} and ends at ${parseTime(event.end)}`);
	events.push({
		name: event.name,
		start: parseTime(event.start),
		end: parseTime(event.end)
	});
  const again = await inquirer.prompt({
    name: 'again',
    message: 'Would you like to add another event?',
    type: 'list',
    choices: [
      'Yes',
      'No'
    ]
  });
  if(again.again == 'Yes') addEvent(wakeup, bedtime, false);
  else parse(wakeup, bedtime, events);
}

function parseTime(time){
  if(!/^\d\d?:\d\d ?[AP]M$/i.test(time)) return;
  let hour = parseInt(time.match(/^\d\d?/i));
  if(/P/i.test(time)) hour += 12;
  let minute = parseInt(time.match(/(?<=:)\d\d/i));
  return hour * 60 + minute;
}

function parse(wakeup, bedtime, events){
	const firstInput = JSON.stringify({
		type: "sleepTimes",
		data: {
			wakeup,
			bedtime
		}
	});

	var schedule = JSON.parse(run(`python3 day.py '${firstInput}'`).toString());

	const secondInput = JSON.stringify({
		type: "activityTimes",
		data: {
			schedule,
			events/*: [
				{
					name: "breakfast",
					start: 430,
					end: 450
				},
				{
					name: 'school',
					start: 460,
					end: 900
				},
				{
					name: 'dinner',
					start: 1050,
					end: 1080
				},
				{
					name: 'rehearsal',
					start: 1110,
					end: 1260
				}
			]*/
		}
	});

	console.log(run(`python3 day.py '${secondInput}'`).toString());
}

start();