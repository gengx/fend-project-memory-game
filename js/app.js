
//Get the list of cards and set up global variables
const cards = document.querySelectorAll('.card');
const totalCards = cards.length;
// const totalCards = 2;
const twoStarThreshold = 20;
const oneStarThreshold = 25;

let totalMoves;
let stars;
let startTime;
let isFirstCard;
let timerIntervalId;

//initialize the game
init();

//Listen on the restart button click
document.querySelector('.restart').addEventListener('click', init);


function shuffleAndCreateCards() {
	newOrder = shuffle(Object.keys(cards));

	const deckElement = document.createElement('ul');
	deckElement.className = 'deck';

	for(let i=0; i < newOrder.length; i++) {
		deckElement.appendChild(cards[newOrder[i]]);
		cards[i].className = 'card';
		cards[i].addEventListener('click', revealAndProcess);
	};

	document.querySelector('.container').replaceChild(deckElement, document.querySelector('.deck'));
}

function init() {
	shuffleAndCreateCards();
	initTimer();
	initMoves();
	isFirstCard = true;
}

function initTimer() {
	if(timerIntervalId) {
		clearInterval(timerIntervalId);
	}
	displayTimer(0);
}

function initMoves() {
	totalMoves = 0;
	document.querySelector('.moves').textContent = totalMoves;
	stars = 3;
}

function updateTimer() {
	const seconds = Math.floor((performance.now() - startTime) / 1000);
	displayTimer(seconds)
}

/**
 * Adding leading zero function
 * from: https://stackoverflow.com/questions/12230343/how-can-i-display-time-with-leading-zeros
 */
function displayTimer(secondsElasped) {
	const timer = document.querySelector('.timer');
	const timeArr = getHourMinuteSecond(secondsElasped);
	timer.innerText = ('0' + timeArr[0]).slice(-2) + ':' + ('0' + timeArr[1]).slice(-2)
		+ ':' + ('0' + timeArr[2]).slice(-2);
}

//get hour, minute and second from the elapsed number of seconds
function getHourMinuteSecond(seconds) {
	const hour = Math.floor(seconds/3600);
  	const minute = Math.floor((seconds - hour * 3600)/60);
  	const second = Math.floor(seconds - hour * 3600 - minute * 60);
  	return [hour, minute, second];
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

//upon clicking, reveal the card and process it accordingly
function revealAndProcess(event) {
	let openCards = document.querySelectorAll('.open');

	if((event.target.nodeName === 'LI') && (openCards.length < 2)) {
		showCard(event.target);

		//if there is already an open card, compare them and either hide them or set them as matching cards
		if(openCards.length === 1 ) {
			if(event.target.firstElementChild.className
				!== openCards[0].firstElementChild.className) {
				setTimeout(hideUnmatchingCards, 500, event.target, openCards[0]);
			} else {
				setTimeout(showMatchingCards, 500, event.target, openCards[0]);
			}
			//update the moves counter
			increaseMoves();
		}
	}
}

//reveal the card and remove the event listener
function showCard(card) {
	card.classList.add('open');
	card.classList.add('show');
	card.removeEventListener('click', revealAndProcess);

	//start the timer on the fist card flip
	if(isFirstCard) {
		startTime = performance.now();
		timerIntervalId = window.setInterval(updateTimer, 1000);
		isFirstCard = false;
	}

}

//turn unmatching cards over and add the event listener back
function hideUnmatchingCards(card1, card2) {
	card1.classList.remove('open');
	card1.classList.remove('show');

	card2.classList.remove('open');
	card2.classList.remove('show');

	card1.addEventListener('click', revealAndProcess)
	card2.addEventListener('click', revealAndProcess)
}

//show matching cards and remove the event listener, and if all are matched, show the result page
function showMatchingCards(card1, card2) {
	card1.classList.remove('open');
	card1.classList.remove('show');
	card1.classList.add('match');

	card2.classList.remove('open');
	card2.classList.remove('show');
	card2.classList.add('match');

	card1.removeEventListener('click', revealAndProcess);
	card2.removeEventListener('click', revealAndProcess);

	//when all the cards match, stop the timer and show the result page
	if(document.querySelectorAll('.match').length === totalCards) {
		clearInterval(timerIntervalId);
		showResultPage();
	}
}

//increment the counter of moves, and update the star rating if needed
function increaseMoves() {
	totalMoves++;
	document.querySelector('.moves').textContent = totalMoves;
	if((totalMoves === twoStarThreshold) || (totalMoves === oneStarThreshold)) {
		reduceStar();
	}
}



//reduce one star
function reduceStar() {
	allStars = document.querySelectorAll('.fa.fa-star');
	lastStar = allStars[allStars.length - 1];
	lastStar.classList.remove('fa');
	lastStar.classList.add('far');
	stars--;
}

//make the result page and replace the current page
function showResultPage() {
	const fragment = document.createElement('div');
	fragment.className = 'container';

	const newImgElement = document.createElement('img');
	newImgElement.src = 'img/checkmark.gif';
	newImgElement.className = 'checkmark-img';
	newImgElement.alt = 'Animated checkmark image';
	fragment.appendChild(newImgElement);

	const newHeadingElement = document.createElement('h1');
	newHeadingElement.innerText = 'Congratulations! You won!';
	fragment.appendChild(newHeadingElement);

	fragment.appendChild(makeScoreElement());

	fragment.appendChild(makeRatingRuleElement());

	const buttonElement = document.createElement('button');
	buttonElement.innerText = 'Play Again!';
	buttonElement.addEventListener('click', function() {
		location.reload();
	});
	fragment.appendChild(buttonElement);

	document.body.replaceChild(fragment, document.querySelector('.container'));
}

function makeScoreElement() {
	const newTextElement = document.createElement('p');
	const secondsElapsed = Math.floor((performance.now() - startTime) / 1000 );
	const timeArray = getHourMinuteSecond(secondsElapsed);
	newTextElement.innerText = 'With ' + totalMoves + ' moves and ' + stars
		+ ' star(s) in ';
	if(timeArray[0] > 0) {
		newTextElement.innerText += timeArray[0] + ' hour(s), ';
	}
	if(timeArray[1] > 0) {
		newTextElement.innerText += timeArray[1] + ' minute(s) and ';
	}
	newTextElement.innerText += timeArray[2] + ' seconds.';

	return newTextElement;
}

function makeRatingRuleElement() {
	const ruleElement = document.createElement('small');
	ruleElement.innerText = '(3 stars: <' + twoStarThreshold +' moves; 2 stars: <'
		+ oneStarThreshold + ' moves; 1 star: >='
		+ oneStarThreshold + ' moves)';
	return ruleElement;
}

