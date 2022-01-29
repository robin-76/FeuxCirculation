window.addEventListener("load", function(event) {
    const ws = new WebSocket("ws://localhost:3000");
    let i;
    let msg;
    let nbFeux = 0;
    let nbVoituresHorizontales = 0;
    let nbVoituresVerticales = 0;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const nbVoitures = 6;
    let interval;
    let orangeFiniHorizontal = false, orangeFiniVertical = false;
    let bVertHorizontal = true, bRougeHorizontal = false;
    let bVertVertical = false, bRougeVertical = true;
    const distanceArret = 120, distanceMin = 125, distanceMax = 500;
    const vitesseMin = 0.2, vitesseMax = 1.5;

    const debutHorizontal = -134, finHorizontal = 800;
    const debutVertical = 788, finVertical = -140;

    // positions initiales des voitures selon l'axe
    const yGauche = 382, yDroite = 336;
    const xBas = 390, xHaut = 344;

    const feuGauche = 220, feuDroite = 440;
    const feuBas = 440, feuHaut = 220;

    const tabVoitureStopGauche = [], tabVoitureStopDroite = [];
    const tabVoitureStopBas = [], tabVoitureStopHaut = [];

    // anciennes positions des voitures
    const tabOldXGauche = [], tabOldXDroite = [];
    const tabOldYBas = [], tabOldYHaut = [];

    // positions initiales des voitures
    const tabXGauche = [], tabXDroite = [];
    const tabYBas = [], tabYHaut = [];

    // position des voitures
    let g = debutHorizontal, d = finHorizontal;
    let b = debutVertical, h = finVertical;
    for(i = 0; i<nbVoitures; i++) {
        tabXGauche[i] = g;
        g = g - Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
        tabXDroite[i] = d;
        d = d + Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
        tabYBas[i] = b;
        b = b + Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
        tabYHaut[i] = h;
        h = h - Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
    }

    const tabImgGauche = [], tabImgDroite = [];
    const tabImgBas = [], tabImgHaut = [];
    for(i = 0; i<nbVoitures; i++) {
        tabImgGauche[i] = new Image();
        tabImgGauche[i].src = "img/gaucheVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
        tabImgDroite[i] = new Image();
        tabImgDroite[i].src = "img/droiteVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
        tabImgBas[i] = new Image();
        tabImgBas[i].src = "img/basVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
        tabImgHaut[i] = new Image();
        tabImgHaut[i].src = "img/hautVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
    }

    interval = setInterval(deplacementVoitures, 6);

    function deplacementVoitures() {
        let i;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for(i = 0; i<nbVoitures; i++) {
            ctx.drawImage(tabImgGauche[i], tabXGauche[i], yGauche);
            ctx.drawImage(tabImgDroite[i], tabXDroite[i], yDroite);
            ctx.drawImage(tabImgBas[i], xBas, tabYBas[i]);
            ctx.drawImage(tabImgHaut[i], xHaut, tabYHaut[i]);

            tabVoitureStopGauche[i] = tabXGauche[i] === tabOldXGauche[i];
            tabVoitureStopDroite[i] = tabXDroite[i] === tabOldXDroite[i];
            tabVoitureStopBas[i] = tabYBas[i] === tabOldYBas[i];
            tabVoitureStopHaut[i] = tabYHaut[i] === tabOldYHaut[i];

            tabOldXGauche[i] = tabXGauche[i];
            tabOldXDroite[i] = tabXDroite[i];
            tabOldYBas[i] = tabYBas[i];
            tabOldYHaut[i] = tabYHaut[i];
        }

        if(bVertHorizontal) {
            vertHorizontal();
            tabXGauche[0] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
            tabXDroite[0] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
            for(i = 0; i<nbVoitures; i++) {
                if(tabXGauche[i+1]<tabXGauche[i]-distanceMin)
                    tabXGauche[i+1] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
                if(tabXDroite[i+1]>tabXDroite[i]+distanceMin)
                    tabXDroite[i+1] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;

                if((parseInt(tabXGauche[i])===feuGauche))
                    nbVoituresHorizontales++;

                if((parseInt(tabXDroite[i])===feuDroite))
                    nbVoituresHorizontales++;
            }
        }

        else if(bRougeHorizontal) {
            for(i = 0; i<nbVoitures-1; i++) {
                tabVoitureStopGauche[i + 1] = tabXGauche[i] - tabXGauche[i + 1] < distanceArret;
                tabVoitureStopDroite[i + 1] = tabXDroite[i + 1] - tabXDroite[i] < distanceArret;
            }

            for(i = 0; i<nbVoitures; i++) {
                if((parseInt(tabXGauche[i])!==feuGauche && parseInt(tabXGauche[i])!==feuGauche-1 && parseInt(tabXGauche[i])!==feuGauche+1) && !tabVoitureStopGauche[i])
                    tabXGauche[i] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;

                if((parseInt(tabXDroite[i])!==feuDroite && parseInt(tabXDroite[i])!==feuDroite-1 && parseInt(tabXDroite[i])!==feuDroite+1) && !tabVoitureStopDroite[i])
                    tabXDroite[i] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
            }

            if(!orangeFiniHorizontal) {
                orangeHorizontal();
                setTimeout(rougeHorizontal, 600);
            }
            else
                rougeHorizontal();
        }

        if(bVertVertical) {
            vertVertical();
            tabYBas[0] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
            tabYHaut[0] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
            for(i = 0; i<nbVoitures; i++) {
                if(tabYBas[i+1]>tabYBas[i]+distanceMin)
                    tabYBas[i+1] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;
                if(tabYHaut[i+1]<tabYHaut[i]-distanceMin)
                    tabYHaut[i+1] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;

                if((parseInt(tabYBas[i])===feuBas))
                    nbVoituresVerticales++;

                if((parseInt(tabYHaut[i])===feuHaut))
                    nbVoituresVerticales++;      
            }
        }

        else if(bRougeVertical) {
            for(i = 0; i<nbVoitures-1; i++) {
                tabVoitureStopBas[i + 1] = tabYBas[i + 1] - tabYBas[i] < distanceArret;
                tabVoitureStopHaut[i + 1] = tabYHaut[i] - tabYHaut[i + 1] < distanceArret;
            }

            for(i = 0; i<nbVoitures; i++) {
                if((parseInt(tabYBas[i])!==feuBas && parseInt(tabYBas[i])!==feuBas-1 && parseInt(tabYBas[i])!==feuBas+1) && !tabVoitureStopBas[i])
                    tabYBas[i] -= Math.random() * (vitesseMax - vitesseMin) + vitesseMin;

                if((parseInt(tabYHaut[i])!==feuHaut && parseInt(tabYHaut[i])!==feuHaut-1 && parseInt(tabYHaut[i])!==feuHaut+1) && !tabVoitureStopHaut[i])
                    tabYHaut[i] += Math.random() * (vitesseMax - vitesseMin) + vitesseMin;  
            }

            if(!orangeFiniVertical) {
                orangeVertical();
                setTimeout(rougeVertical, 600);
            }
            else
                rougeVertical();
        }

        // On recommence lorsque la dernière voiture a finit
        if(parseInt(tabXGauche[nbVoitures-1])>finHorizontal) {
            let g = debutHorizontal;
            for(i = 0; i<nbVoitures; i++) {
                tabXGauche[i] = g;
                g = g - Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
                tabImgGauche[i] = new Image();
                tabImgGauche[i].src = "img/gaucheVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
            }
        }

        if(parseInt(tabXDroite[nbVoitures-1])<debutHorizontal) {
            let d = finHorizontal;
            for(i = 0; i<nbVoitures; i++) {
                tabXDroite[i] = d;
                d = d + Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
                tabImgDroite[i] = new Image();
                tabImgDroite[i].src = "img/droiteVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
            }
        }

        if(parseInt(tabYBas[nbVoitures-1])<finVertical) {
            let b = debutVertical;
            for(i = 0; i<nbVoitures; i++) {
                tabYBas[i] = b;
                b = b + Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
                tabImgBas[i] = new Image();
                tabImgBas[i].src = "img/basVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
            }
        }

        if(parseInt(tabYHaut[nbVoitures-1])>debutVertical) {
            let h = finVertical;
            for(i = 0; i<nbVoitures; i++) {
                tabYHaut[i] = h;
                h = h - Math.floor(Math.random() * (distanceMax+1 - distanceMin) + distanceMin);
                tabImgHaut[i] = new Image();
                tabImgHaut[i].src = "img/hautVoiture" + Math.floor((Math.random() * nbVoitures)) + ".png";
            }
        }
    }

    function vertHorizontal() {
        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(305.5, 495.2, 9, 0, 2 * Math.PI);
        ctx.arc(324.5, 495.2, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(495, 307.3, 9, 0, 2 * Math.PI);
        ctx.arc(514, 307.3, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function orangeHorizontal() {
        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(286, 495.2, 9, 0, 2 * Math.PI);
        ctx.arc(324.5, 495.2, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(495, 307.3, 9, 0, 2 * Math.PI);
        ctx.arc(533, 307.3, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function rougeHorizontal() {
        orangeFiniHorizontal = true;

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(286, 495.2, 9, 0, 2 * Math.PI);
        ctx.arc(305.5, 495.2, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(514, 307.3, 9, 0, 2 * Math.PI);
        ctx.arc(533, 307.3, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function vertVertical() {
        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(505.3, 484, 9, 0, 2 * Math.PI);
        ctx.arc(505.3, 504, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(314, 299, 9, 0, 2 * Math.PI);
        ctx.arc(314, 319, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function orangeVertical() {
        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(505.3, 484, 9, 0, 2 * Math.PI);
        ctx.arc(505.3, 524, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(314, 279, 9, 0, 2 * Math.PI);
        ctx.arc(314, 319, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function rougeVertical() {
        orangeFiniVertical = true;

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(505.3, 504, 9, 0, 2 * Math.PI);
        ctx.arc(505.3, 524, 9, 0, 2 * Math.PI);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle="#000000"
        ctx.arc(314, 279, 9, 0, 2 * Math.PI);
        ctx.arc(314, 299, 9, 0, 2 * Math.PI);
        ctx.fill();
    }

    function boutonAlterner() {
        nbFeux++;

        clearInterval(interval);
        interval = setInterval(deplacementVoitures, 6);

        if(bVertHorizontal) {
            orangeFiniHorizontal = false;
            bVertHorizontal = false;
            bRougeHorizontal = true;
            setTimeout(function(){
                bRougeVertical = false;
                bVertVertical = true;
                msg = {
                    feuVertHorizontal: bVertHorizontal,
                    feuVertVertical: bVertVertical,
                    nbFeux: nbFeux,
                    nbVoituresHorizontales: nbVoituresHorizontales,
                    nbVoituresVerticales: nbVoituresVerticales,
                };
                ws.send(JSON.stringify(msg));
            }, 1000);
        }

        else if(bRougeHorizontal) {
            orangeFiniVertical = false;
            bRougeVertical = true;
            bVertVertical = false;
            setTimeout(function(){
                bRougeHorizontal = false;
                bVertHorizontal = true;
                msg = {
                    feuVertHorizontal: bVertHorizontal,
                    feuVertVertical: bVertVertical,
                    nbFeux: nbFeux,
                    nbVoituresHorizontales: nbVoituresHorizontales,
                    nbVoituresVerticales: nbVoituresVerticales,
                };
                ws.send(JSON.stringify(msg));
            }, 1000);
        }

        document.getElementById("boutonAlterner").disabled = true;

        setTimeout(function(){
            document.getElementById("boutonAlterner").disabled = false;
        }, 1000);
    }
    document.getElementById('boutonAlterner').onclick = function() { boutonAlterner(); }

        ws.addEventListener("open", () => {
            console.log("We are connected!");
            msg = {
                feuVertHorizontal: bVertHorizontal,
                feuVertVertical: bVertVertical,
                nbFeux: nbFeux,
                nbVoituresHorizontales: nbVoituresHorizontales,
                nbVoituresVerticales: nbVoituresVerticales,
            };
                
            ws.send(JSON.stringify(msg));
        });
});