let ctx;
let chart;
let tabAlternanceFeu = [];
let tabHorizontal = [];
let tabVertical = [];
let tabSeconde = [];
let i = 0;
const ws = new WebSocket("ws://localhost:3000");

ws.addEventListener("open", () => {
    console.log("We are connected2!");

    ws.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        
        if(msg.alternanceFeu)
            tabAlternanceFeu.push(i);

        tabSeconde.push(i++);
        tabHorizontal.push(msg.nbVoituresHorizontales);
        tabVertical.push(msg.nbVoituresVerticales);

        if(ctx)
            chart.destroy();

        ctx =  document.getElementById("lineChart").getContext('2d');

        const arbitraryLine = {
            id: 'arbitraryLine',
            beforeDraw(chart) {
            const { ctx, chartArea: { top, height}, scales:
                {x} } = chart;

            ctx.save();  

            ctx.fillStyle = 'red';
            
            for(let i=0; i<tabAlternanceFeu.length; i++)
                ctx.fillRect(x.getPixelForValue(tabAlternanceFeu[i]), top, 5, height);

            ctx.restore();
            }
        }
          
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tabSeconde,
                datasets: [{ 
                    data: tabHorizontal,
                    label: "Voitures horizontales",
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                }, { 
                    data: tabVertical,
                    label: "Voitures verticales",
                    backgroundColor: 'green',
                    borderColor: "green",
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0
                }, {
                    label: "Alternance des feux",
                    backgroundColor: 'red',
                    borderColor: "red",
                    }
                ]
            },
            options: {
                responsive: false,
                animation: {
                    duration: 0
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Temps (en seconde)',
                        }
                    },
                    y: {
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) {if (value % 1 === 0) {return value;}}
                        },
                        title: {
                            display: true,
                            text: 'Nombre de voitures',
                        },    
                        beginAtZero: true
                    }
                },
                plugins: {
                    title: {
                    display: true,
                    text: 'Nombre de voitures en temps réel',
                    font: {
                        size: 20
                      }
                    }
                }
            },
            plugins: [arbitraryLine]
        });
    }
    this.close = function () {
        ws.close();
    }
});