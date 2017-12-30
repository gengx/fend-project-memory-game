/*
 * Create a list that holds all of your cards
 */

const cards = document.querySelectorAll('.card');
const totalCards = cards.length;
let totalMoves = 0;
let stars = 3;
const twoStarThreshold = 20;
const oneStarThreshold = 25;
const noStarThreshold = 30;

const startTime = performance.now();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML and add event listeners
 *   - add each card's HTML to the page
 */

newOrder = shuffle(Object.keys(cards));

const deckElement = document.createElement('ul');
deckElement.className = 'deck';

for(var i=0; i < newOrder.length; i++) {
	deckElement.appendChild(cards[newOrder[i]]);
	cards[i].addEventListener('click', revealAndProcess);
};

document.querySelector('.container').replaceChild(deckElement, document.querySelector('.deck'));

/*
 * Listen on the restart button click
 */
document.querySelector('.restart').addEventListener('click', function(){
	location.reload();
});

var intervalID = window.setInterval(updateTimer, 1000);

function updateTimer() {
	timer = document.querySelector('.timer');
	seconds = Math.floor((performance.now() - startTime) / 1000);
	timeArr = getHourMinuteSecond(seconds);
	timer.innerText = displayTime(timeArr);
}

//adding leading zero function
//from https://stackoverflow.com/questions/12230343/how-can-i-display-time-with-leading-zeros
function displayTime(timeArray) {
	return ('0' + timeArray[0]).slice(-2) + ':' + ('0' + timeArray[1]).slice(-2)
		+ ':' + ('0' + timeArray[2]).slice(-2);
}

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


function revealAndProcess(event) {
	let openCard = document.querySelector('.open');

	if(event.target.nodeName === 'LI') {
		showCard(event.target);

		//if there is already an open card, compare them and either hide them or set them as matching cards
		if(openCard != null ) {
			if(event.target.firstElementChild.className
				!== openCard.firstElementChild.className) {
				setTimeout(hideUnmatchingCards, 500, event.target, openCard);
			} else {
				setTimeout(showMatchingCards, 500, event.target, openCard);
			}
			//update the moves counter
			increaseMoves();
		}
	}
}

function showCard(card) {
	card.classList.add('open');
	card.classList.add('show');
	card.removeEventListener('click', revealAndProcess)

}

function hideUnmatchingCards(card1, card2) {
	card1.classList.remove('open');
	card1.classList.remove('show');

	card2.classList.remove('open');
	card2.classList.remove('show');

	card1.addEventListener('click', revealAndProcess)
	card2.addEventListener('click', revealAndProcess)
}

function showMatchingCards(card1, card2) {
	card1.classList.remove('open');
	card1.classList.remove('show');
	card1.classList.add('match');

	card2.classList.remove('open');
	card2.classList.remove('show');
	card2.classList.add('match');

	card1.removeEventListener('click', revealAndProcess);
	card2.removeEventListener('click', revealAndProcess);

	if(document.querySelectorAll('.match').length === totalCards) {
		showResultPage();
	}
}

function increaseMoves() {
	totalMoves++;
	document.querySelector('.moves').textContent = totalMoves;
	if((totalMoves === twoStarThreshold) || (totalMoves === oneStarThreshold)
		|| (totalMoves === noStarThreshold)) {
		reduceStar();
	}
}

function reduceStar() {
	allStars = document.querySelectorAll('.fa.fa-star');
	lastStar = allStars[allStars.length - 1];
	lastStar.classList.remove('fa');
	lastStar.classList.add('far');
	stars--;
}

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

	const newTextElement1 = document.createElement('p');
	const secondsElapsed = Math.floor((performance.now() - startTime) / 1000 );
	const timeArray = getHourMinuteSecond(secondsElapsed);
	newTextElement1.innerText = 'With ' + totalMoves + ' moves and ' + stars
		+ ' stars in ';
	if(timeArray[0] > 0) {
		newTextElement1.innerText += timeArray[0] + ' hour(s), ';
	}
	if(timeArray[1] > 0) {
		newTextElement1.innerText += timeArray[1] + ' minute(s) and ';
	}
	newTextElement1.innerText += timeArray[2] + ' seconds.';
	fragment.appendChild(newTextElement1);

	const newTextElement2 = document.createElement('small');
	newTextElement2.innerText = '(3 stars: <' + twoStarThreshold +' moves; 2 stars: <'
		+ oneStarThreshold + ' moves; 1 stars: <' + noStarThreshold + ' moves; 0 stars: >='
		+ noStarThreshold + ' moves)';
	fragment.appendChild(newTextElement2);

	const buttonElement = document.createElement('button');
	buttonElement.innerText = 'Play Again!';
	buttonElement.addEventListener('click', function() {
		location.reload();
	});
	fragment.appendChild(buttonElement);

	document.body.replaceChild(fragment, document.querySelector('.container'));
}

