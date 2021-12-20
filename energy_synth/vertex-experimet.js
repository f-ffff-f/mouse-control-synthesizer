let osc, mrNoisy, modulator;
let VW, VH;
let playing,
    freqVal,
    ampVal,
    ampValNoise,
    modFreq,
    modDepth,
    panning,
    fft,
    spectrum,
    waveform,
    analyzer,
    h,
    a;

VW = document.documentElement.clientWidth;
VH = document.documentElement.clientHeight;

let modMaxFreq = 5;
let modMinFreq = -5;
let modMaxDepth = 50;
let modMinDepth = -50;

function setup() {
    let canvas = createCanvas(VW, VH);
    colorMode(HSB, 360, 100, 100, 1);

    // fill('black');
    osc = new p5.Oscillator('square');
    mrNoisy = new p5.Noise('brown');
    analyzer = new p5.Amplitude();
    analyzer.setInput(modulator);
    modulator = new p5.Oscillator('sawtooth');
    modulator.start();
    modulator.disconnect();
    osc.freq(modulator);

    fft = new p5.FFT();

    canvas.mousePressed(playOscillator);
}
function draw() {
    background(255);

    let rms = analyzer.getLevel();
    h = map(ceil(Math.pow(rms * 100, 3)), 0, 10000, 0, 360);
    a = Number(map((rms * 10).toFixed(1), 3, 0, 0.6, 0.7).toFixed(1));
    spectrum = fft.analyze();
    waveform = fft.waveform();

    freqVal = constrain(map(mouseX, 0, width, 10, width / 8), 10, width / 8);
    ampVal = constrain(map(mouseY, height, 0, 0, 0.3), 0.15, 0.3);
    ampValNoise = constrain(map(mouseX, width, 0, 0.1, 0.2), 0.1, 0.2);

    if (mouseY <= height / 2) {
        modFreq = map(mouseY, 0, height / 2, modMinFreq, modMaxFreq);
    } else {
        modFreq = map(mouseY, 0, height, modMinFreq, modMaxFreq);
    }
    modulator.freq(modFreq);

    if (mouseX <= width / 2) {
        modDepth = map(mouseX, 0, width / 2, modMinDepth, modMaxDepth);
    } else {
        modDepth = map(mouseX, width, 0, modMaxDepth, modMinDepth);
    }
    modulator.amp(modDepth);

    panning = map(mouseX, 0, width, -0.2, 0.2);
    osc.pan(panning);

    i = 1;

    stroke(map(h, 0, 360, 360, 60), 40, 80, 1);
    for (let y = 0; y < height / 5; y += 100) {
        beginShape();
        spectrum.forEach(function (frequency, j) {
            vertex(
                map(frequency, 255, -50, -height, height) * y,
                map(j, spectrum.length, 0, width, 0)
            );
        });
        endShape();

        beginShape();
        spectrum.forEach(function (frequency, j) {
            vertex(
                map(frequency, -50, 255, height, -height) * y,
                map(j, 0, spectrum.length / 3, width / 2, 0) + y
            );
        });
        endShape();
        beginShape();
        spectrum.forEach(function (frequency, j) {
            vertex(
                map(frequency, 255, -50, height, -height) * y,
                map(j, 0, spectrum.length, 0, width) - y
            );
        });
        endShape();
    }

    for (let y = 0; y < height; y += 200) {
        beginShape();

        spectrum.forEach(function (frequency, j) {
            vertex(
                map(j, 0, spectrum.length, Math.pow(i, 2), width),
                map(frequency, 0, 50, height, i)
            );
        });
        spectrum.forEach(function (frequency, j) {
            vertex(
                map(j, spectrum.length, 0, Math.pow(i, 2), width),
                map(frequency, 50, 0, height, i)
            );
        });
        endShape();
    }

    beginShape();
    spectrum.forEach(function (frequency, j) {
        vertex(
            map(j, -100, spectrum.length, Math.pow(i, 10), width),
            map(frequency, -100, 255, height, Math.pow(i, 10))
        );
    });

    spectrum.forEach(function (frequency, j) {
        vertex(
            map(j, -100, spectrum.length, width, Math.pow(i, 10)),
            map(frequency, 255, -100, height, Math.pow(i, 10))
        );
    });

    spectrum.forEach(function (frequency, j) {
        vertex(
            map(j, -100, spectrum.length, Math.pow(i, 10), width),
            map(frequency, -50, 255, Math.pow(i, 10), height)
        );
    });

    spectrum.forEach(function (frequency, j) {
        vertex(
            map(j, spectrum.length, -100, Math.pow(i, 10), width),
            map(frequency, 255, -50, Math.pow(i, 10), height)
        );
    });

    spectrum.forEach(function (frequency, j) {
        vertex(
            map(j, -100, spectrum.length, Math.pow(i, 10), width),
            map(frequency, -100, 255, height, Math.pow(i, 10))
        );
    });
    endShape();

    noStroke();
    // drawGradient(mouseX, mouseY, a);
    // function drawGradient(x, y, a) {
    //     fill(h, 20, 100, a + 0.6);
    //     ellipse(
    //         x,
    //         y,
    //         100 + Math.pow(rms * 100, 30),
    //         100 + Math.pow(rms * 100, 30)
    //     );
    //     h = (h + 1) % 360;
    // }
    drawGradient(mouseX, mouseY, a);
    function drawGradient(x, y, a) {
        fill(h, 30, 100, a);
        ellipse(
            x,
            y,
            20 + Math.pow(rms * 10, 6) * 400,
            20 + Math.pow(rms * 10, 6) * 400
        );
        h = (h + 1) % 360;
    }
    // stroke(map(h, 0, 360, 360, 0), 100, 50);
    // text('oscFreq' + freqVal, 20, 20);
    // text('oscAmp' + ampVal, 20, 40);
    // text('noiseAmp' + ampValNoise, 20, 60);
    // text('modFreq' + modFreq, 20, 80);
    // text('modDepth' + modDepth, 20, 100);
    // text('X' + mouseX, 20, 120);
    // text('Y' + mouseY, 20, 140);
    // text('pan' + panning, 20, 160);
    // text('rms' + rms, 20, 180);
    // text('h' + h, 20, 200);
    // text('a' + a, 20, 220);
    if (playing) {
        osc.freq(freqVal, 0.3);
        osc.amp(ampVal, 0.1);
        mrNoisy.amp(ampValNoise, 0.1);
    }
}

function playOscillator() {
    osc.start();
    // mrNoisy.start();
    playing = true;
}

function mouseReleased() {
    osc.amp(0, 0.7);
    // mrNoisy.amp(0, 0.5);
    // mrNoisy.stop();
    modulator.amp(0, 1);
    playing = false;
}

function touchStarted() {
    if (getAudioContext.state !== 'running') {
        getAudioContext().resume();
    }
}
