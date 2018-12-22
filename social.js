//Clean up and optimize code
//Comment

function inRange(personA, personB) {
	if (Math.abs(personA.x - personB.x) <= 25 && Math.abs(personA.y - personB.y) <= 25) {
		return true;
	}
	return false;
}

function choicesOf(person, people) {
	var choices = new Array();
	var alone = new choice("alone", 0);
	choices[0] = alone;
	var i = 1;
	for (var j = 1; j < people.length; j++) {
		if (person.id != people[j].id) {
			if (inRange(person, people[j])) {
				var talk = new choice("talk", people[j]);
				choices[i] = talk;
				i = i + 1;
			} else {
				var approach = new choice("approach", people[j]);
				choices[i] = approach;
				i = i + 1;
			}
		}
	}
	return choices;
}

function refine(peoplePicks) {
	for (i = 1; i < peoplePicks.length; i++) {
		var pick = peoplePicks[i];
		if (pick.type == "talk") {
			var ID = pick.reciever.id;
			if (!(peoplePicks[ID].type == "talk" && peoplePicks[ID].reciever.id == i)) {
				peoplePicks[i].type = "approach";
			}
			//else {alert("talk!");}
		}
	}
	return peoplePicks;
}

function moveTo(person, target) {
	var X = target.x - person.x;
	var Y = target.y - person.y;
	
	if (Math.abs(X) > Math.abs(Y)) {
		person.move(Math.sign(X) * 25, 0);
		return person;
	} else {
		person.move(0, Math.sign(Y) * 25);
		return person;
	}
}

function randMove(person) {
	var moves = new Array();
	var i = 0;
	
	if (!(person.x == 0)) {
		moves[i] = [-25, 0];
		i = i + 1;
	}
	if (!(person.x == 775)) {
		moves[i] = [25, 0];
		i = i + 1;
	}
	if (!(person.y == 0)) {
		moves[i] = [0, -25];
		i = i + 1;
	}
	if (!(person.y == 775)) {
		moves[i] = [0, 25];
		i = i + 1;
	}
	moves[i] = [0,0];
	
	var Probs = new Array();
	for (var j = 0; j < moves.length; j++) {
		Probs[j] = 1 / moves.length;
	}
	var decision = moves[draw(Probs)];
	var X = decision[0];
	var Y = decision[1];
	person.move(X,Y);
	return person;
}

function change(person, peoplePicks) {
	var pick = peoplePicks[person.id].type;
	if (pick == "talk") {
		person.last = "talk";
		return person;
	} else if (pick == "approach") {
		person.last = "approach";
		return moveTo(person, peoplePicks[person.id].reciever);
	} else if (pick == "alone") {
		person.last = "alone";
		return randMove(person);
	}
}

function reduceTickers(previousTickers) {
	for (var i = 0; i < previousTickers.length; i++) {
		if (previousTickers[i] != 0) {
			previousTickers[i] = previousTickers[i] - 1;
		}
	}
	return previousTickers;
}

function reduceAlternatives(tickers, alternatives) {
	for (var i = 0; i < alternatives.length; i++) {
		if (tickers[i] == 0) {
			if (alternatives[i] != 0) {
				alternatives[i] = alternatives[i] - 1;
			}
		}
	}
	return alternatives;
}

function convertRewards(rewards) {
	var converted = new Array();
	for (var i = 0; i < rewards.length; i++) {
		converted[i] = 1 / (rewards[i] / 100);
	}
	return converted;
}
	
function normalize(probs) {
	var sum = 0;
	for (var i = 0; i < probs.length; i++) {
		sum = sum + probs[i];
	}
	
	var normalized = new Array();
	for (var i = 0; i < probs.length; i++) {
		normalized[i] = probs[i] / sum;
	}
	
	return normalized;
}

function draw(probs) {
	var accumulated = new Array();
	var accum = 0;
	for (var i = 0; i < probs.length; i++) {
		accum = accum + probs[i];
		accumulated[i] = accum;
	}
	
	var r = Math.random();
	for (var i = 0; i < accumulated.length; i++) {
		if (r <= accumulated[i]) {
			return i;
		}
	}
}

function choice(type, reciever) {
	this.type = type;
	this.reciever = reciever;
}

function randCoord() {
	var Coordinates = new Array();
	var index = 0;
	for (var i = 0; i < 32; i++) {
		Coordinates[index] = [25 * i, 0]
		index = index + 1;
	}
	for (var i = 1; i < 31; i++) {
		Coordinates[index] = [0, 25 * i]
		index = index + 1;
		Coordinates[index] = [775, 25 * i]
		index = index + 1;
	}
	for (var i = 0; i < 32; i++) {
		Coordinates[index] = [25 * i, 775]
		index = index + 1;
	}
	var Probs = new Array();
	for (var j = 0; j < Coordinates.length; j++) {
		Probs[j] = 1 / Coordinates.length;
	}
	return Coordinates[draw(Probs)];
}

function person(appWeight, appPref, app, personalityWeight, personalityPref, personality, socialFear, curiosity, id) {
	this.id = id;
	var coord = randCoord();
	this.y = coord[1];
	this.x = coord[0];
	
	this.last = "";
	this.alternatives = new Array();
	this.tickers = new Array();
	for (var i = 0; i <= this.id; i++) {
		this.alternatives[i] = 0;
	}
	for (var i = 0; i <= this.id; i++) {
		this.tickers[i] = 0;
	}
	
	this.appWeight = appWeight;
	this.appPref = appPref;
	this.app = app;
	this.personalityWeight = personalityWeight;
	this.personalityPref = personalityPref;
	this.personality = personality;
	this.socialFear = socialFear;
	this.curiosity = curiosity;
	
	this.move = function(X,Y) {
		this.y = this.y + Y;
		this.x = this.x + X;
	}
	
	this.socialReward = function(anotherPerson) {
		var power = this.alternatives[anotherPerson.id];
		var distance_diff = Math.sqrt(Math.pow((this.y - anotherPerson.y) , 2) + Math.pow((this.x - anotherPerson.x) , 2)) / 0.00000001;
		var appearance_diff = appWeight * Math.pow((10 * this.appPref - 10 * anotherPerson.app), 2);
		return distance_diff + 100000000 * appearance_diff + this.socialFear + Math.pow(this.curiosity, power); 
	}
	
	this.lonerReward = function() {
		return 10000000000000000000000000 * Math.pow(this.curiosity, this.alternatives[0]);
	}
	
	this.talkReward = function(anotherPerson) {
		var power = this.alternatives[anotherPerson.id];
		var personality_diff = personalityWeight * Math.pow((10 * this.personalityPref - 10 * anotherPerson.personality), 2);
		return 10000000 * personality_diff + this.socialFear + Math.pow(this.curiosity, power);
	}
	
	this.chooseAction = function(choices) {
		var rewards = new Array(choices.length);
		for (var i = 0; i < choices.length; i++) {
			var choice = choices[i]
			if (choice.type == "alone") {
				rewards[i] = this.lonerReward();
			} else if (choice.type == "talk") {
				rewards[i] = this.talkReward(choice.reciever);
			} else if (choice.type == "approach") {
				rewards[i] = this.socialReward(choice.reciever);
			}
		}
		
		var Probs = convertRewards(rewards);
		var normalized = normalize(Probs);
		return choices[draw(normalized)];
	}
	
	this.feedback = function(choice) {
		var ID = 0;
		if (choice.type != "alone") {
			ID = choice.reciever.id;
		}
		this.tickers = reduceTickers(this.tickers);
		this.tickers[ID] = this.tickers[ID] + 2;
		this.alternatives = reduceAlternatives(this.tickers, this.alternatives);
		this.alternatives[ID] = this.alternatives[ID] + 1;
	}
}

function init(id) {
	var appWeight = 2 * Math.random();
	var app = Math.random(); 
	var appPref = (Math.random() + 1.3 * app) / 2.3;
	var personalityWeight = 2 * Math.random();
	var personality = (0.5 * app + Math.random()) / 1.5;
	var personalityPref = (Math.random() + 1.3 * personality) / 2.3;
	var socialFear = 16 * Math.random();
	var curiosity = 1 + (Math.random() / 3);
	var Person = new person(appWeight, appPref, app, personalityWeight, personalityPref, personality, socialFear, curiosity, id);
	return Person;
}

function simulation(capacity) {
	this.capacity = capacity;
	this.time = 0;
	this.people = new Array();
	this.people[0] = 0;
	this.lastID = 1;
	
	this.step1 = function() {
		var r = Math.random();
		if (r > (this.lastID - 1) / capacity) {
			for (var i = 0; i < this.lastID - 1; i++) {
				this.people[i + 1].alternatives[this.lastID] = 0;
				this.people[i + 1].tickers[this.lastID] = 0;
			}
			var newPerson = init(this.lastID);
			this.people[this.lastID] = newPerson;
			this.lastID = this.lastID + 1;
		}
	}
	
	this.step2 = function() {
		var peopleChoices = new Array();
		console.log("Population:");
		console.log(JSON.parse(JSON.stringify(this.people)));
		
		peopleChoices[0] = 0;
		for (var i = 1; i < this.people.length; i++) {
			peopleChoices[i] = choicesOf(this.people[i], this.people);
		}
		console.log("Choices:");
		console.log(JSON.parse(JSON.stringify(peopleChoices)));
		
		var peoplePicks = new Array();
		peoplePicks[0] = 0;
		for (var i = 1; i < this.people.length; i++) {
			peoplePicks[i] = this.people[i].chooseAction(peopleChoices[i]);
		}
		console.log("Picks:");
		console.log(JSON.parse(JSON.stringify(peoplePicks)));
		
		peoplePicks = refine(peoplePicks);
		console.log("Refined:");
		console.log(JSON.parse(JSON.stringify(peoplePicks)));
		
		for (var i = 1; i < this.people.length; i++) {
			this.people[i] = change(this.people[i], peoplePicks);
		}
		console.log("Changed:");
		console.log(JSON.parse(JSON.stringify(this.people)));
		
		for (var i = 1; i < this.people.length; i++) {
			this.people[i].feedback(peoplePicks[i]);
		}	
		console.log("Feedback:");
		console.log(JSON.parse(JSON.stringify(this.people)));
		
		this.time = this.time + 1;
		console.log("Time: " + this.time);
		console.log("----------------------------------------------------------------");
	}
}

function Animate(iterations,simul,Time) {
	if (iterations > 0) {
		var id = simul.lastID;
		simul.step1();
		if (!(id == simul.lastID)) {
			var New = $("<div></div>");
			New.attr("id", id.toString());
			New.attr("class", "person");
			$("#time").before(New);
			var value = simul.people[id].app * 300;
			$("#" + id).css({background: "hsl(" + value + ",100%,50%)"});
			var X = simul.people[id].x + "px";
			var Y = simul.people[id].y + "px";
			$("#" + id).css({left: X, top: Y});
			$("#" + id).animate({opacity: "0.4"}, Time, function() {
				simul.step2();
				$("#time").html("Time Elapsed: " + simul.time);
				return animateStep(iterations,simul,simul.lastID - 1,Time);
			});
		} else {
			simul.step2();
			$("#time").html("Time Elapsed: " + simul.time);
			return animateStep(iterations,simul,simul.lastID - 1,Time);
		}
	}
}

function animateStep(iterations,simul,steps,Time) {
	if (steps == 1) {
		var Person = simul.people[steps];
		var lastAction = Person.last;
		
		if (lastAction == "talk") {
			$("#" + steps).fadeToggle(Time / 2);
			$("#" + steps).fadeToggle(Time / 2, function() {
				iterations = iterations - 1;
				return Animate(iterations,simul,Time);
			})
		} else {
			var X = Person.x + "px";
			var Y = Person.y + "px";
			$("#" + steps).animate({left: X, top: Y}, Time, function() {
				iterations = iterations - 1;
				return Animate(iterations,simul,Time);
			})
		}
	} else {
		var Person = simul.people[steps];
		var lastAction = Person.last;
		
		if (lastAction == "talk") {
			$("#" + steps).fadeToggle(Time / 2);
			$("#" + steps).fadeToggle(Time / 2);
			return animateStep(iterations,simul,steps - 1,Time);
		} else {
			var X = Person.x + "px";
			var Y = Person.y + "px";
			$("#" + steps).animate({left: X, top: Y}, Time);
			return animateStep(iterations,simul,steps - 1,Time);
		}
	}
}

$(document).ready(function() {
	var simul = new simulation(50);
	Animate(200,simul,1000);
})