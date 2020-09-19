/*
    GLOBAL TOOLS
*/

//Global variables and arrays
let ground = document.getElementsByClassName('ground')[0];
let letterCol = document.getElementsByClassName('letters')[0];
let numberRow = document.getElementsByClassName('numbers')[0];
let input = document.getElementById('addCoords');
const xArr = [];
let totalHits = [];
let letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
let eArr = [];
let ships = [];
let sunkenShips = 0;

//Create ground
for (let x = 0; x < 10; x++) {
    xArr.push(new Array)
    for (let y = 1; y < 11; y++) {
        xArr[x].push(letters[x] + y)
    }
}

//Create helper ground
for (let index = 0; index < xArr.length; index++) {
    eArr = eArr.concat(xArr[index])
}

letters.forEach(e => {
    letterCol.innerHTML += '<div class="square">' + e + '</div>'
});

for (let i = 1; i <= 10; i++) {
    numberRow.innerHTML += '<div class="square">' + i + '</div>'
}
// numbers.forEach(e => {
//     letterCol.innerHTML += '<div class="square">' + e + '</div>'
// });

//Print actual ground
xArr.forEach(e => {
    e.forEach(i => {
        ground.innerHTML += '<div class="square" id="' + i + '">.</div>'
    })
})

/*
    HELPER FUNCTIONS
*/

//Random orientation generator fn
function orientation() {
    let roll = Math.floor(Math.random() * 10);
    let orientation;
    roll >= 5 ? orientation = 'horizontal' : orientation = 'vertical'
    return orientation;
}

//Make sure ships don't overlap
function shipCheck(shipLocations, row, col, y, checkOrientation) {
    let res = false;
    let shipPart;
    for (let z = 0; z < y; z++) {
        checkOrientation == 'horizontal' ? shipPart = xArr[row][col + z] : shipPart = xArr[row + z][col]
        shipLocations.includes(shipPart) ? res = true : res
    }
    return res;
}

/*
    BASE
*/

//Create and position ships
function createBattleship() {
    let shipSizes = ['5', '4', '4'];
    let shipLocations = [];
    let count = 1;

    shipSizes.forEach(y => { //Create ships based on predefined sizes
        let ship = { //Create ship objects
            name: "Ship " + count,
            coords: [],
            length: y,
            hits: 0
        };
        let x = orientation(); //Call the function defining the ship orientation
        switch (x) {
            case 'horizontal': //In case of horizontal 

                row = Math.floor(Math.random() * (10 - y))
                col = Math.floor(Math.random() * (10 - y))
                do {

                    row = Math.floor(Math.random() * (10 - y))
                    col = Math.floor(Math.random() * (10 - y))
                }
                while ((shipCheck(shipLocations, row, col, y, 'horizontal'))) //Run the code above untile there are no overlapping ships

                for (let z = 0; z < y; z++) {

                    let shipPart = xArr[row][col + z];
                    shipLocations.push(shipPart) //Add ship coordinates to the shipLocations array
                    ship.coords.push(shipPart) //Add ship coordinates to ship objects
                }

                break;
            case 'vertical': //In case of vertical 

                row = Math.floor(Math.random() * (10 - y))
                col = Math.floor(Math.random() * (10 - y))
                do {

                    row = Math.floor(Math.random() * (10 - y))
                    col = Math.floor(Math.random() * (10 - y))
                }

                while ((shipCheck(shipLocations, row, col, y, 'false'))) //Run the code above untile there are no overlapping ships

                for (let z = 0; z < y; z++) {
                    let shipPart = xArr[row + z][col];
                    shipLocations.push(shipPart) //Add ship coordinates to the shipLocations array
                    ship.coords.push(shipPart) //Add ship coordinates to ship objects
                }
        }

        count++;
        ships.push(ship)
    })

}
createBattleship();

/*
    ACTION FUNCTIONS
*/

//Handle fire by pressing 'Enter'
let fireButton = document.getElementById('fire');
input.addEventListener('keyup', function (e) {
    e.keyCode === 13 ? fireButton.click() : ''
})
//Initiate fire upon enemy ships
function fire() {

    let shot = input.value.toUpperCase(); // Get the input field value when the user click the "Fire" button
    let shotEl = document.getElementById(shot); //Get the square elemenent that is under attack 

    if (shot === 'SHOW') { return hack() } // Initiate the 'show' function

    // Prevent multiple usage of the same coordinates 
    if (totalHits.includes(shot)) {

        alert('You have already shot at these coordinates!');
    } else {

        // Show the attack result
        ships.map(ship => {
            if (ship.coords.includes(shot)) { // Path where user has laid a hit on the enemy

                ship.hits++
                shotEl.classList.add('x')
                shotEl.innerHTML = 'x'

                if (ship.hits == ship.length) {  // The ship gets sunk 

                    document.getElementsByClassName('message')[0].innerHTML += '<p>You have destroyed ' + ship.name + '</p>'
                    sunkenShips++
                }
                // User destroys all of the enemy ships
                sunkenShips === 3 ? document.getElementsByClassName('message')[0].innerHTML = '<p>Well done! You completed the game in ' + totalHits.length + ' shots</p>' : ''
            } else { // It's a miss 


                let existing = false;
                eArr.map(x => x == shot ? existing = true : existing) //Check if shots are aiming at existing ground
                if (existing && !shotEl.classList.contains('x')) {
                    shotEl.innerHTML = '-'
                } else { //Skip entries froum outer space
                    return false;
                }
            }
        });
        totalHits.push(shot);
    }

}

//Show the enemy ships 
function hack() {
    ships.forEach(e => e.coords.forEach(c => {

        let doc = document.getElementById(c);
        doc.classList.add('hackedShip')
        doc.innerHTML = 'x';

    }));
    ground.classList.add('hacked')
}

function handleKeyPress(e) {
    if (e.keyCode === 13) {
        return fire()
    }
}
//return the hacking result(just in case)
// function hackOff() {
//     ships.forEach(e => e.coords.forEach(c => {

//         let doc = document.getElementById(c);
//         doc.classList.remove('hackedShip')
//         doc.classList.contains('x') ? doc.innerHTML = 'x' : doc.innerHTML = '.'
//     }));
//     ground.classList.remove('hacked')
// }


