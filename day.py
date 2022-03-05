import sys
import json

input = sys.argv
input.remove(input[0])
input = " ".join(input)
#print('input 1: ' + str(input))
input = input.replace("'", '"')
#print('input 2: ' + str(input))
input = json.loads(input)
type = input["type"]
input = input["data"]
#print('input 3: ' + str(input))

def activityTimes():
	schedule = input["schedule"]
	events = input["events"]
	for i in range(len(events)):
		if i == 0:
			schedule["daytime" + str(i + 1)] = int(schedule["daytime" + str(i)]) - int(int(events[i]["start"]) - int(schedule["wakeup"])) - int(int(events[i]["end"]) - int(events[i]["start"]))
			schedule["daytime" + str(i)] = int(events[i]["start"]) - int(schedule["wakeup"])
		else:
			schedule["daytime" + str(i + 1)] = int(schedule["daytime" + str(i)]) - int(int(events[i]["start"]) - int(events[i - 1]["end"])) - int(int(events[i]["end"]) - int(events[i]["start"]))
			schedule["daytime" + str(i)] = int(events[i]["start"]) - int(events[i - 1]["end"])
		schedule[events[i]["name"]] = int(events[i]["end"]) - int(events[i]["start"])
		schedule["order"].append("daytime" + str(i))
		schedule["order"].append(events[i]["name"])
	schedule["order"].append("bedtime")
	print(schedule)

def sleepTimes():
	if input["bedtime"] - input["wakeup"] < 0:
		return {"type": "error", "message": "How are you going to sleep before waking up?"}
	else:
		dayLength = input["bedtime"] - input["wakeup"]
		return {"type": "success", "data": dayLength}

if type == "activityTimes":
	activityTimes()

if type == "sleepTimes":
	dayLength = sleepTimes()
	if dayLength["type"] == "error":
		print(dayLength)
	else:
		#schedule = ["wake up", dayLength["data"], "bedtime"]	
		schedule = '{"wakeup": "' + str(input["wakeup"]) + '", "daytime0": ' + str(dayLength["data"]) + ', "bedtime": "' + str(input["bedtime"]) + '", "order": ["wakeup"]}'
		print(schedule)