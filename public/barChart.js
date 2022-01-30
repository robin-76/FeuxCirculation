let ctx2;
let chart2;
const ws2 = new WebSocket("ws://localhost:3000");

ws2.addEventListener("open", () => {
    console.log("We are connected2!");

    ws2.onmessage = (event) => {
        let msg = JSON.parse(event.data);

        let tabMoyenne = [];
        tabMoyenne.push(msg.tempsArretHorizontal);
        tabMoyenne.push(msg.tempsArretVertical);

        if(ctx2)
            chart2.destroy();

        ctx2 = document.getElementById("barChart").getContext('2d');

        chart2 = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['Route horizontale', 'Route verticale'],
                datasets: [{
                    label: 'Temps d\'arrêt moyen (en seconde)',
                    data: tabMoyenne,
                    backgroundColor: [
                        'blue',
                        'green'
                    ],
                }]
            },
            options: {
                responsive: false,
                    animation: {
                        duration: 0
                    },
                scales: {
                    y: {
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) {if (value % 1 === 0) {return value;}}
                        },
                        title: {
                            display: true,
                            text: 'Temps (en seconde)',
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                    display: true,
                    text: 'Temps d\'arrêt moyen des voitures',
                    font: {
                        size: 20
                      }
                    }
                }
            }
        });        
    }
});