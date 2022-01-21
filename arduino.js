module.exports = {
    blink: function () {
        const five = require('johnny-five');
        const board = new five.Board();

        board.on('ready', function (duration, callback) {
            const led = new five.Led(13); // pin 13
            led.blink(500, callback); // 500ms interval
        });

        board.on('close', function (duration, callback) {
            const led = new five.Led(13); // pin 13
            led.off(); // shutdown
        });
    }
}
