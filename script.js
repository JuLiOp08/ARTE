const feed = document.getElementById("feed");

const colors = [
    "#ff0050", "#ff1744", "#ff6b6b", "#ff8a80",
    "#f50057", "#ff80ab", "#ff9ecf",
    "#2979ff", "#00e5ff", "#82b1ff", "#80d8ff", "#64b5f6", "#90caf9",
    "#00f2ea", "#00bfa5", "#80cbc4", "#b2dfdb",
    "#00c853", "#76ff03", "#69f0ae", "#a5d6a7", "#c8e6c9",
    "#6a00ff", "#651fff", "#d500f9", "#b388ff", "#ce93d8", "#e1bee7",
    "#ff6b00", "#ff9100", "#ffb74d", "#ffcc80",
    "#ffea00", "#fff176", "#fff59d", "#fff9c4",
    "#f5f5f5", "#eeeeee", "#e3f2fd", "#f3e5f5", "#fff3e0", "#e8f5e9",
    "#ffd1dc", "#c1f0f6", "#dcedc8", "#ffe0b2", "#d1c4e9", "#f8bbd0"
];

// Variables de estado global
let counter = 500;

const counterElement = document.getElementById("counterValue");
const counterContainer = document.getElementById("counter");

function formatNumber(num){
    if(num >= 1000000){
        return (num / 1000000).toFixed(1) + "M";
    }
    if(num >= 1000){
        return (num / 1000).toFixed(1) + "K";
    }
    return num;
}

/* CREAR TARJETAS */
function generateCards(amount){
    for(let i = 0; i < amount; i++){
        const card = document.createElement("section");
        card.classList.add("card");
        
        const bgColor = colors[Math.floor(Math.random() * colors.length)];
        card.style.background = bgColor;

        const likes = Math.floor(Math.random() * 900000 + 1000);
        const comments = Math.floor(Math.random() * 50000 + 100);
        const shares = Math.floor(Math.random() * 20000 + 50);

        // Contenido mejorado con elementos dinámicos
        card.innerHTML = `
            <div class="card-background" style="background: ${bgColor}"></div>
            <div class="right-actions">
                <div class="action">
                    <i class="fas fa-heart action-icon"></i>
                    <span class="like-count">${formatNumber(likes)}</span>
                </div>
                <div class="action">
                    <i class="fas fa-comment action-icon"></i>
                    <span>${formatNumber(comments)}</span>
                </div>
                <div class="action">
                    <i class="fas fa-share action-icon"></i>
                    <span>${formatNumber(shares)}</span>
                </div>
                <div class="action">
                    <i class="fas fa-user-circle action-icon"></i>
                    <span>@user${Math.floor(Math.random() * 10000)}</span>
                </div>
            </div>
            <div class="card-overlay"></div>
        `;

        feed.appendChild(card);
    }
}

// ACTUALIZAR CONTADOR CON FEEDBACK VISUAL
function updateCounter(delta) {
    counter += delta;
    
    if(counter < 0) counter = 0;
    if(counter > 9999) counter = 9999; // Límite superior
    
    counterElement.textContent = counter;
    
    // Feedback visual
    if(delta > 0) {
        pulseCounter("up");
        showCounterNotification(`+${delta} contenido disponible`);
    } else if(delta < 0) {
        pulseCounter("down");
    }
    
    // Efectos especiales por valor
    if(counter === 0) {
        triggerZeroCounter();
    } else if(counter === 1) {
        counterContainer.classList.add("counter-critical");
    } else if(counter > 5) {
        counterContainer.classList.remove("counter-critical");
    }
}

function pulseCounter(direction) {
    counterContainer.classList.remove("pulse-up", "pulse-down");
    void counterContainer.offsetWidth; // Trigger reflow
    counterContainer.classList.add(`pulse-${direction}`);
    
    // Vibración táctil
    if(navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
    }
}

function showCounterNotification(message) {
    const notif = document.createElement("div");
    notif.classList.add("counter-notification");
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => notif.remove(), 2000);
}

function triggerZeroCounter() {
    const intro = document.getElementById("intro");
    if(!intro.classList.contains("hidden")) return;
    
    // Efecto especial cuando llega a 0
    counterContainer.classList.add("counter-zero");
    
    setTimeout(() => {
        counterContainer.classList.remove("counter-zero");
    }, 3000);
}

// ===== INICIALIZACIÓN =====

generateCards(200);

// Mostrar contador y header al salir de intro
function handleIntroExit() {
    if(window.scrollY > window.innerHeight / 2) {
        document.getElementById("intro").classList.add("hidden");
        counterContainer.style.display = "block";
        
        const header = document.querySelector(".header");
        if(header) header.style.display = "block";
    }
}

// ===== EVENT LISTENERS CONSOLIDADOS =====

let lastScrollSection = 0;

window.addEventListener("scroll", () => {
    // Mostrar contador al salir de intro
    handleIntroExit();
    
    // Disminuir contador cada pantalla completa scrolleada
    const newSection = Math.floor(window.scrollY / window.innerHeight);
    if(newSection > lastScrollSection) {
        updateCounter(-1);
        lastScrollSection = newSection;
    }
    
    // Feed infinito - generar más tarjetas al acercarse al final
    const nearBottom = 
        window.innerHeight + window.scrollY >= 
        document.body.offsetHeight - 3000;
    
    if(nearBottom) {
        generateCards(100);
    }
}, { passive: true });

// ===== AUMENTO AUTOMÁTICO DE CONTENIDO =====

setInterval(() => {
    const random = Math.random();
    let increase = 5;
    
    if(random < 0.50) {
        increase = 7;
    } else if(random < 0.80) {
        increase = 10;
    } else if(random < 0.90) {
        increase = 15;
    } else if(random < 0.95) {
        increase = 20;
    } else {
        increase =30;
    }
    
    if(increase > 0) {
        updateCounter(increase);
    }
}, 5000);

// ===== CONTADOR DE TIEMPO TRANSCURRIDO =====

let elapsedSeconds = 0;
let lastTimeNotification = 0;

setInterval(() => {
    elapsedSeconds++;
    const minutes = Math.floor(elapsedSeconds / 60);
    
    // Mostrar notificación cada 5 minutos
    if(counter > 0 && minutes > 0 && minutes % 5 === 0 && minutes > lastTimeNotification) {
        showCounterNotification(`⏱️ Llevas ${minutes} minutos aquí`);
        lastTimeNotification = minutes;
    }
}, 1000);

// ===== EFECTOS PSICOLÓGICOS ADICIONALES =====

// Cambiar likes dinámicamente para simular actividad social real
setInterval(() => {
    const likeSpans = document.querySelectorAll(".like-count");
    likeSpans.forEach(span => {
        const currentText = span.textContent;
        const isFormatted = currentText.includes("K") || currentText.includes("M");
        
        let current;
        if(isFormatted) {
            // Convertir de vuelta a número (aproximado)
            const num = parseFloat(currentText);
            const multiplier = currentText.includes("M") ? 1000000 : 1000;
            current = Math.floor(num * multiplier);
        } else {
            current = parseInt(currentText);
        }
        
        const increase = Math.floor(Math.random() * 50 + 5);
        const newValue = current + increase;
        span.textContent = formatNumber(newValue);
    });
}, 4000);

// Hacer clickeable las acciones para feedback psicológico
document.addEventListener("click", (e) => {
    const action = e.target.closest(".action");
    if(!action) return;
    
    const icon = action.querySelector("i");
    icon.classList.add("action-clicked");
    
    setTimeout(() => {
        icon.classList.remove("action-clicked");
    }, 300);
});



observer.observe(counterElement, { 
    characterData: true, 
    subtree: true,
    childList: true
});
