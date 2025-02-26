function tilfaeldigtTalMellemEtOgTusind() {
    return Math.floor(Math.random() * 1000) + 1;
}

function opdaterOnline() {
    const randomNumber = tilfaeldigtTalMellemEtOgTusind();
    const visitorCountElement = document.getElementById("visitor-count");
    
    if (visitorCountElement) {
        visitorCountElement.textContent = randomNumber;
    } else {
        console.error("Element med id 'visitor-count' blev ikke fundet:(");
    }
}

document.addEventListener("DOMContentLoaded", opdaterOnline);
