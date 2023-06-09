"use strict"

const API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-3.5-turbo";
const API_KEY = ""; 
const input = document.querySelector(".input");
let inputValue = input.value;
const messageArea = document.querySelector(`.message-area`);
const btnSend = document.querySelector(`.btn-send`);
const btnNewQuestion = document.querySelector(`.btn-new-question`);
const points = document.querySelector(`.points`);
let counter = 0;

/*-----------
    FUNCTIONS 
------------*/
async function generateResponse(nameCharacter) {
    // 1. Mostrare il loader
    // 2. Chiamare le Api di Open AI
    // const action = "Saluta nel tuo modo più iconico";
    const temperature = 0.7;
    // 3. Recuperare la risposta
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}` 
        },
        body: JSON.stringify({
            model: MODEL,
            messages: [
                {
                    role: "user",
                    content: `Se ti rispondo correttamente, rispondi: CORRETTO, se sbaglio, rispondi: SBAGLIATO. La mia risposta è: ${inputValue}`
                }
            ],
            temperature: temperature
        })
    })
    // 4. Interpretare la risposta in JSON
    const data = await response.json();
    // 5. Compilare la modale con i dati ricevuti
    const message = data.choices[0].message.content;
    messageArea.innerHTML = `

        <p>${message}</p>
    `;

		if (message.includes("CORRETTO")) {
			// Incrementa il contatore
			counter++;
			points.textContent = `PUNTI: ${counter}`
		} else if (message.includes("SBAGLIATO")) {
			// Avvia la funzione reset
			counter = 0;
			points.textContent = `PUNTI: ${counter}`
		}

}

function getRandomAction() {
    const actions = [
        'salutare nel tuo modo più iconico',
        'dare un consiglio di stile in base ai tuoi gusti',
        'raccontare la tua ultima avventura',
        'svelarmi i tuoi sogni',
        'dirmi chi è il tuo migliore amico',
        'scrivere la tua bio di linkedin'
    ];

    const indexRandom = Math.floor(Math.random() * actions.length); // da 0 a 5

    return actions[indexRandom];
}

btnSend.addEventListener("click", function () {
    messageArea.innerHTML = `<img class="loader" src="loader.gif" alt="">`;
	inputValue = input.value;
	generateResponse(inputValue);
	input.value = "";
});

input.addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		inputValue = input.value;
		generateResponse(inputValue);
		input.value = "";
	}
});

btnNewQuestion.addEventListener("click", function () {
	newQuestion();
});

async function newQuestion() {

    messageArea.innerHTML = `<img class="loader" src="loader.gif" alt="">`;

	const temperature = 0.7;

	const response = await fetch(API_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${API_KEY}`,
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{
					role: "user",
					content: `Fammi una domanda di cultura generale. Una domanda che non mi hai gia' fatto.`,
				},
			],
			temperature: temperature,
		}),
	});

	const data = await response.json();

	const message = data.choices[0].message && data.choices[0].message.content;
	messageArea.innerHTML = `<p>${message}</p>`;
}