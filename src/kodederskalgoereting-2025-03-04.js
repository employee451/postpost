function tilfaeldigtTalMellemEtOgTusind() {
    return Math.floor(Math.random() * 1000) + 1;
}

function opdaterOnline() {
	console.log("hmm hvor mange er online??")

    const randomNumber = tilfaeldigtTalMellemEtOgTusind();
    const visitorCountElement = document.getElementById("hvor-mange-er-online");
    
    if (visitorCountElement) {
        visitorCountElement.textContent = randomNumber;
    } else {
        console.error("Element med id 'hvor-mange-er-online' blev ikke fundet:(");
    }
}

function visKlokkenTakSoedeComputerIkkeDraebMigNaarDuTagerOver() {
    const nu = new Date();
    
    const tidsformattering = new Intl.DateTimeFormat('da-DK', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const datoformattering = new Intl.DateTimeFormat('da-DK', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
		year: 'numeric'
    });
    
	const klokkenElement = document.getElementById("klok1");
	if (klokkenElement) {
		klokkenElement.textContent = tidsformattering.format(nu);
	} else {
		console.error("Element med id 'klok1' blev ikke fundet:(");
	}

	const datoElement = document.getElementById("dato1");
	if (datoElement) {
		datoElement.textContent = datoformattering.format(nu);
	} else {
		console.error("Element med id 'dato1' blev ikke fundet:(");
	}
}

const vejret = [
    "maane",
    "regnsky",
    "regnskyogsol",
    "sky",
    "skyogmaane",
    "skyogsol",
    "sneogsol",
    "sol",
]

function tilfaeldigVejr() {
    const vejretNu = vejret[Math.floor(Math.random() * vejret.length)];
    const vejrElement = document.getElementById(vejretNu);
    console.log(vejretNu);
    if (vejrElement) {
        vejrElement.classList.remove("hidden");
        vejrElement.classList.add("flex");
    } else {
        console.error("Element med id '" + vejretNu + "' blev ikke fundet:(");
    }
}


function goerTingNaarViErKlar(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        fn();
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

goerTingNaarViErKlar(() => {
    opdaterOnline();

    visKlokkenTakSoedeComputerIkkeDraebMigNaarDuTagerOver();

    // Opdater hvert 10. sekund
    setInterval(() => {
        visKlokkenTakSoedeComputerIkkeDraebMigNaarDuTagerOver();
    }, 10_000);

    tilfaeldigVejr();
});
