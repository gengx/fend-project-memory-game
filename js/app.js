/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

let cards = document.querySelectorAll('.card');
const totalCards = cards.length;
let totalMoves = 0;

newOrder = shuffle(Object.keys(cards));

const deckElement = document.createElement('ul');
deckElement.className = 'deck';

for(var i=0; i < newOrder.length; i++) {
	deckElement.appendChild(cards[newOrder[i]]);
	cards[i].addEventListener('click', revealAndProcess);
};

document.querySelector('.container').replaceChild(deckElement, document.querySelector('.deck'));

document.querySelector('.restart').addEventListener('click', function(){
	location.reload();
});


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
		if(openCard != null ) {
			if(event.target.firstElementChild.className
				!== openCard.firstElementChild.className) {
				setTimeout(hideUnmatchingCards, 500, event.target, openCard);
				increaseMoves();
			} else {
				setTimeout(showMatchingCards, 500, event.target, openCard);
				increaseMoves();
			}
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
	newTextElement1.innerText = 'With ' + totalMoves + ' moves and 3 stars.';
	fragment.appendChild(newTextElement1);

	const newTextElement2 = document.createElement('p');
	newTextElement2.innerText = 'Wooooo!';
	fragment.appendChild(newTextElement2);

	const buttonElement = document.createElement('button');
	buttonElement.innerText = 'Play Again!';
	buttonElement.addEventListener('click', function() {
		location.reload();
	});
	fragment.appendChild(buttonElement);

	document.body.replaceChild(fragment, document.querySelector('.container'));
}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
