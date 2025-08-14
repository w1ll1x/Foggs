let table = document.querySelector('table');
let btnAdd = document.querySelector('#addButton');
let btnClear = document.querySelector('#clearButton');
let timeInput = document.querySelector('#time');
let fromInput = document.querySelector('#from');
let toInput = document.querySelector('#to');
let pobInput = document.querySelector('#pob');
let paymentInput = document.querySelector('#payment');
let tipInput = document.querySelector('#tip');
let rsInput = document.querySelector('#rs');
let number = 0;
table.innerHTML = localStorage.getItem("table");
number = +localStorage.getItem("#number");

selectable();

const fareDict = {
    "Portland": {
        baseFare: 0, falmouthFare:0, fee: 0
    }, "Diamond Cove": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Long": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Chebeague (Chandler Cove)": {
        baseFare: 90, falmouthFare:0, fee: 0
    }, "Chebeague (Stone Pier)": {
        baseFare: 140, falmouthFare:0, fee: 0
    }, "Chebeague (Boat Yard)": {
        baseFare: 140, falmouthFare:0, fee: 0
    }, "Clapboard": {
        baseFare: 85, falmouthFare:0, fee: 0
    }, "Cliff": {
        baseFare: 100, falmouthFare:0, fee: 0
    }, "Cow": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Coleman Cove": {
        baseFare: 100, falmouthFare:0, fee: 0
    }, "Cushing": {
        baseFare: 65, falmouthFare:0, fee: 0
    }, "Eagle": {
        baseFare: 210, falmouthFare:0, fee: 0
    }, "Fort Gorges": {
        baseFare: 65, falmouthFare:0, fee: 0
    }, "Great Diamond": {
        baseFare: 65, falmouthFare:0, fee: 0
    }, "House": {
        baseFare: 60, falmouthFare:0, fee: 0
    }, "Jewell": {
        baseFare: 170, falmouthFare:0, fee: 0
    }, "Little Chebeague": {
        baseFare: 95, falmouthFare:0, fee: 0
    }, "Little Diamond": {
        baseFare: 60, falmouthFare:0, fee: 0
    }, "Olefield": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Peaks": {
        baseFare: 65, falmouthFare:0, fee: 0
    }, "Peaks (TEIA)": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Pumpkin Knob": {
        baseFare: 75, falmouthFare:0, fee: 0
    }, "Sand": {
        baseFare: 105, falmouthFare:0, fee: 0
    }, "Sailmaine": {
        baseFare: 0, falmouthFare:0, fee: 10
    }, "Bug Light": {
        baseFare: 40, falmouthFare:0, fee: 5
    }, "Cousins Island": {
        baseFare: 125, falmouthFare:0, fee: 0
    }, "Centerboard": {
        baseFare: 40, falmouthFare:0, fee: 10
    }, "Dolphin Marina": {
        baseFare: 205, falmouthFare:0, fee: 0
    }, "East End Beach": {
        baseFare: 60, falmouthFare:0, fee: 10
    }, "Falmouth": {
        baseFare: 100, falmouthFare:0, fee: 25
    }, "Fore Points": {
        baseFare: 50, falmouthFare:0, fee: 10
    }, "Maine Yacht Center": {
        baseFare: 60, falmouthFare:0, fee: 25
    }, "Saltwater Grille": {
        baseFare: 40, falmouthFare:0, fee: 10
    }, "Southport": {
        baseFare: 60, falmouthFare:0, fee: 30
    }, "Spring Point": {
        baseFare: 60, falmouthFare:0, fee: 10
    }, "Sturdevent": {
        baseFare: 95, falmouthFare:0, fee: 0
    }
};

const placeList = document.getElementById('places');

for (let place in fareDict) {
    const option = document.createElement('option');
    option.value = place;
    placeList.appendChild(option);
}

class trip {

    constructor(time, from, to, pob, payment, tip, rs) {
        this.time = time;
        this.from = from;
        this.to = to;
        this.pob = pob;
        this.fare = 0;
        this.payment = payment;
        this.tip = tip;
        this.rs = rs;
    }

    fareSet() {

        if (this.from in fareDict && this.to in fareDict) {
            let fromFare = fareDict[this.from].fare;
            let fromFee = fareDict[this.from].fee;
            let toFare = fareDict[this.to].fare;
            let toFee = fareDict[this.to].fee;

            if (fromFare + toFee > toFare + fromFee) {
                this.fare = fromFare + toFee;
            } else {
                this.fare = toFare + fromFee;
            }

            if (!(["Cash", "Card", "Check", ""].includes(this.payment))) {
                this.fare -= 10;
            }

            if ((this.time >= "22:00" && this.time < "24:00") || (this.time >= "05:30" && this.time < "06:30")) {
                this.fare += 20;
                if (this.rs === "Yes") {
                    this.fare -= 10;
                }
            } else if ((this.time >= "00:00" && this.time < "02:00") || (this.time >= "04:30" && this.time < "05:30")) {
                this.fare += 55;
            } else if (this.time >= "02:00" && this.time < "04:30") {
                this.fare += 55;
                this.fare *= 2;
            } else {
                if (this.rs === "Yes") {
                    this.fare -= 10;
                }
            }
        } else {
            this.fare = 0
        }
    }
}

function ClearFields() {
    document.getElementById("from").value = "";
    document.getElementById("to").value = "";
    document.getElementById("tip").value = "";
    document.getElementById("payment").value = "";
    document.getElementById("pob").value = "1";
    document.getElementById("rs").value = "No";
}

function selectable() {
    const cells = table.getElementsByTagName('td');

    for (let i = 0; i < cells.length; i++) {
        if (i % 9 !== 0) {
            cells[i].onclick = function () {

                if (this.hasAttribute('data-clicked')) {
                    return;
                }
                this.setAttribute('data-clicked', 'yes');
                this.setAttribute('data-text', this.innerHTML);
                const newInput = document.createElement('input');

                if ((i - 1) % 9 === 0) {
                    newInput.setAttribute('type', 'time');
                } else if ((i - 4) % 9 === 0 || (i - 5) % 9 === 0 || (i - 7) % 9 === 0) {
                    newInput.setAttribute('type', 'number');
                    newInput.setAttribute('pattern', "\d*");
                    newInput.style.width = this.offsetWidth - (this.clientLeft * 2) + "px"
                    newInput.style.height = this.offsetHeight - (this.clientTop * 2) + "px"
                } else {
                    newInput.setAttribute('type', 'string');
                    newInput.style.width = this.offsetWidth - (this.clientLeft * 2) + "px"
                    newInput.style.height = this.offsetHeight - (this.clientTop * 2) + "px"
                }

                newInput.value = this.innerHTML;
                newInput.style.border = "0px";
                newInput.style.fontFamily = 'inherit';
                newInput.style.fontSize = 'inherit';
                newInput.style.textAlign = 'inherit';

                newInput.onblur = function () {
                    const td = newInput.parentElement;
                    const oldTd = newInput.parentElement.getAttribute('data-text');
                    const newTd = this.value;

                    if (oldTd !== newTd) {
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        td.innerHTML = newTd;
                        td.style.cssText = 'padding: 10px'
                        localStorage.setItem("table", table.innerHTML);
                    } else {
                        td.removeAttribute('data-clicked');
                        td.removeAttribute('data-text');
                        td.innerHTML = oldTd;
                        td.style.cssText = 'padding: 10px';
                    }
                }
                this.innerHTML = '';
                this.style.cssText = 'padding: 0px 0px';
                this.append(newInput);
                this.firstElementChild.select();
            }
        }
    }
}

btnAdd.addEventListener('click', () => {

    number += 1;
    const newTrip = new trip(timeInput.value, fromInput.value, toInput.value, pobInput.value, paymentInput.value, +tipInput.value, rsInput.value);

    newTrip.fareSet()

    let template = `
                <tr>
                    <td>${number}</td>
                    <td>${newTrip.time}</td>
                    <td>${newTrip.from}</td>
                    <td>${newTrip.to}</td>
                    <td>${newTrip.pob}</td>
                    <td>${newTrip.fare}</td>
                    <td>${newTrip.payment}</td>
                    <td>${newTrip.tip}</td>
                    <td>${newTrip.rs}</td>
                </tr>`;

    table.innerHTML += template;

    localStorage.setItem("table", table.innerHTML);
    localStorage.setItem("#number", number);

    ClearFields();
    selectable();
});


btnClear.addEventListener('click', () => {
    localStorage.setItem("table", `
    <tr>
      <th></th>
      <th>Time</th>
      <th>From</th>
      <th>To</th>
      <th>POB</th>
      <th>Fare</th>
      <th>Payment</th>
      <th>Tip</th>
      <th>RS</th>
    </tr>`);

    localStorage.setItem("#number", 0);
    table.innerHTML = localStorage.getItem("table");
    number = 0;

});
