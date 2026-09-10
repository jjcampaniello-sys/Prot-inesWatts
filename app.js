const gCO2ParKwh = 60; // Mix électrique français moyen (~60g/kWh)
let sessionWh = 0, sessionEur = 0;
let endTimestamp = null, audioCtx = null;
let sec = 0, active = false, inter = null, wakeLock = null;

const configOeufs = {
    coque:  { baseMin: 4.5 },
    mollet: { baseMin: 6.5 },
    dur:    { baseMin: 10.0 }
};

const calibresOeufs = { S: 50, M: 60, L: 68, XL: 75 };
const rendementMicroonde = 0.65; // efficacité électrique réelle d'un magnétron domestique (~65%), le reste part en pertes thermiques

function toggleInputs() {
    const cat = document.getElementById('category').value;
    
    document.getElementById('oeufs-options').style.display = (cat === 'oeufs') ? 'block' : 'none';
    document.getElementById('viandes-options').style.display = (cat === 'viandes') ? 'block' : 'none';
    document.getElementById('poissons-options').style.display = (cat === 'poissons') ? 'block' : 'none';

    const labelPoids = document.getElementById('labelPoids');
    const inputPoids = document.getElementById('poids');

    if (cat === 'oeufs') {
        labelPoids.innerText = "Nombre d'œufs :";
        if (inputPoids.value > 12) inputPoids.value = 2;
    } else {
        if (cat === 'poissons') {
            labelPoids.innerText = "Masse du poisson / crustacés (grammes) :";
        } else {
            labelPoids.innerText = "Masse de la viande (grammes) :";
        }
        if (inputPoids.value < 10) inputPoids.value = 200;
    }

    resetTimerState();
    calculer();
}

function calculer() {
    const cat = document.getElementById('category').value;
    const quantite = Math.max(1, parseFloat(document.getElementById('poids').value) || 1);
    const cass = document.getElementById('casserole').value;
    const tarifKwh = parseFloat(document.getElementById('tarifKwh').value) || 0.25;
    const stepList = document.getElementById('prepSteps');

    let volEau = 0, tSeconds = 0, whSaved = 0;
    stepList.innerHTML = "";
    document.getElementById('infoEau').style.display = "block";

    if (cat === 'oeufs') {
        const typeCuisson = document.getElementById('cuissonOeuf').value;
        const calibre = document.getElementById('tailleOeuf').value;
        const nbOeufs = Math.round(quantite);

        volEau = Math.min(1.2, 0.15 + (nbOeufs * 0.04));

        let baseTime = configOeufs[typeCuisson].baseMin * 60;
        let pRef = 60;
        let pReel = calibresOeufs[calibre];
        
        let coefPoids = Math.pow(pReel / pRef, 2/3);

        tSeconds = Math.round(baseTime * coefPoids);
        if (cass === 'legere') tSeconds += 20;

        whSaved = Math.round(180 + (nbOeufs * 5));

        stepList.innerHTML += `<li>Mettre seulement <strong>${volEau.toFixed(2)}L d'eau</strong> au fond du récipient.</li>`;
        stepList.innerHTML += `<li>Porter à ébullition rapide sous couvercle.</li>`;
        stepList.innerHTML += `<li>Plonger les ${nbOeufs} œuf(s) et maintenir le feu <strong>45 secondes</strong>.</li>`;
        stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong>, fermez avec un couvercle hermétique (cuisson étouffée/vapeur).</li>`;
        stepList.innerHTML += `<li>À la fin du temps, plongez les œufs dans l'eau froide pour stopper la cuisson.</li>`;

    } else if (cat === 'viandes') {
        const typeViande = document.getElementById('typeViande').value;
        const cuisson = document.getElementById('cuissonViande').value;
        const methode = document.getElementById('methodeViande').value;

        if (methode === 'poele') {
            document.getElementById('infoEau').style.display = "none";
            
            let tempsSec = (quantite / 100) * (typeViande === 'volaille' || typeViande === 'porc' ? 180 : 130);
            if (cuisson === 'biencuit') tempsSec *= 1.35;
            
            tSeconds = Math.round(tempsSec);
            whSaved = 110;

            stepList.innerHTML += `<li>Chauffer la poêle antiadhésive à sec à feu moyen (sans huile/beurre).</li>`;
            stepList.innerHTML += `<li>Saisir la viande 1 minute de chaque côté pour former la croûte protectrice.</li>`;
            stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong> et couvrez immédiatement avec un couvercle étanche.</li>`;
            stepList.innerHTML += `<li>La cuisson se termine doucement grâce à la vapeur et la chaleur résiduelle.</li>`;

        } else if (methode === 'sauce') {
            volEau = (quantite / 1000) * 0.45;
            
            let tempsSec = (quantite / 1000) * 2400;
            if (typeViande === 'boeuf' || typeViande === 'gibier') tempsSec *= 1.25;
            
            tSeconds = Math.round(tempsSec);
            whSaved = 420;

            stepList.innerHTML += `<li>Colorer brièvement la viande et les aromates dans votre cocotte.</li>`;
            stepList.innerHTML += `<li>Mouiller avec ~${volEau.toFixed(2)}L de liquide (bouillon/vin).</li>`;
            stepList.innerHTML += `<li>Porter à forte ébullition pendant 8 à 10 minutes sous couvercle.</li>`;
            stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong>. La masse thermique de la cocotte assure le mijotage passif.</li>`;

        } else if (methode === 'microonde') {
            document.getElementById('infoEau').style.display = "none";
            
            let tempsSec = (quantite / 100) * 75;
            if (typeViande === 'volaille') tempsSec *= 0.85;
            
            tSeconds = Math.round(tempsSec);
            whSaved = Math.round(150 * rendementMicroonde);

            stepList.innerHTML += `<li>Disposer la viande dans un plat adapté avec 1 cuillère à soupe d'eau au fond.</li>`;
            stepList.innerHTML += `<li>Couvrir avec une cloche ou un film étirable perforé.</li>`;
            stepList.innerHTML += `<li>Cuire à <strong>400W-500W maxi</strong> (température douce préservant les nutriments).</li>`;
            stepList.innerHTML += `<li>Laisser reposer 2 minutes au chaud avant de consommer.</li>`;
        }

    } else if (cat === 'poissons') {
        const typeP = document.getElementById('typePoisson').value;
        const methodeP = document.getElementById('methodePoisson').value;

        if (methodeP === 'poche') {
            volEau = Math.min(2.0, 0.4 + (quantite / 1000) * 0.8);
            document.getElementById('infoEau').style.display = "block";
            
            let tempsSec = 300;
            if (typeP === 'ferme') tempsSec = 480;
            if (typeP === 'gras') tempsSec = 360;
            if (typeP === 'crustaces') tempsSec = 180;
            tSeconds = tempsSec;
            whSaved = 200;

            stepList.innerHTML += `<li>Porter <strong>${volEau.toFixed(2)}L d'eau</strong> (ou court-bouillon) à ébullition sous couvercle.</li>`;
            stepList.innerHTML += `<li>Plonger le poisson/crustacé délicatement dans l'eau bouillante.</li>`;
            stepList.innerHTML += `<li><strong>COUPEZ LE FEU IMMÉDIATEMENT</strong> et mettez un couvercle étanche.</li>`;
            stepList.innerHTML += `<li>Le poisson poche en douceur sans détruire ses chairs ni assécher la protéine.</li>`;

        } else if (methodeP === 'poele') {
            document.getElementById('infoEau').style.display = "none";
            let tempsSec = (quantite / 100) * 60; 
            if (typeP === 'ferme') tempsSec *= 1.4;
            if (typeP === 'gras') tempsSec *= 1.15;
            if (typeP === 'crustaces') tempsSec = 120;
            tSeconds = Math.round(tempsSec);
            whSaved = 90;

            stepList.innerHTML += `<li>Chauffer la poêle à feu moyen (à sec ou très légèrement huilée).</li>`;
            stepList.innerHTML += `<li>Saisir le poisson 45 secondes côté peau/surface.</li>`;
            stepList.innerHTML += `<li><strong>COUPEZ LE FEU</strong>, mettez un couvercle et laissez la chaleur étouffée finir la cuisson.</li>`;

        } else if (methodeP === 'microonde') {
            document.getElementById('infoEau').style.display = "none";
            let tempsSec = (quantite / 100) * 45;
            if (typeP === 'ferme') tempsSec *= 1.2;
            if (typeP === 'gras') tempsSec *= 1.1;
            if (typeP === 'crustaces') tempsSec = (quantite / 100) * 30;
            tSeconds = Math.round(tempsSec);
            whSaved = Math.round(130 * rendementMicroonde);

            stepList.innerHTML += `<li>Placer le poisson dans un plat couvert avec 1 c. à soupe d'eau ou de citron.</li>`;
            stepList.innerHTML += `<li>Cuire à puissance modérée (<strong>350W-450W</strong> maxi) pour ne pas faire exploser les fibres musculaires.</li>`;
            stepList.innerHTML += `<li>Laisser reposer 1 à 2 minutes sous cloche avant d'ouvrir.</li>`;
        }
    }

    document.getElementById('eau').innerText = volEau.toFixed(2);
    document.getElementById('ecoWh').innerText = Math.max(0, whSaved);
    document.getElementById('ecoEur').innerText = (Math.max(0, whSaved) * (tarifKwh / 1000)).toFixed(2);
    document.getElementById('ecoCo2').innerText = Math.round(Math.max(0, whSaved) * gCO2ParKwh / 1000);

    if (!active) {
        sec = tSeconds;
        showTime();
    }
}
