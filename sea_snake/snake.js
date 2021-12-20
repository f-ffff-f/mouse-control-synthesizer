const startBtn = document.querySelector('.start-btn');
let started = false;

let c1;
let c2 = 255;
let mouseXEase, mouseYEase;
let osc,
    mrNoisy,
    envelope,
    reverb,
    delay,
    oFilter,
    nFilter,
    filterFreq,
    filterWidth,
    dryWet,
    fft,
    analyzer,
    spectrum,
    energy,
    midiVal,
    freqVal,
    randomFreq;
let scaleArray = [
    20, 25, 34, 40, 42, 44, 50, 52, 54, 55, 60, 62, 65, 68, 73, 74, 75,
];
let note = 0;

let t = 0; // 시간 변수

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();
    fill(40, 100, 100);
    outputVolume(0.6);

    osc = new p5.Oscillator('square');
    osc.amp(0);
    mrNoisy = new p5.Noise('brown');
    mrNoisy.amp(0);
    envelope = new p5.Env();
    reverb = new p5.Reverb();
    delay = new p5.Delay();
    oFilter = new p5.LowPass();
    nFilter = new p5.BandPass();
    envelope.setADSR(5, 5, 0.4, 5);
    envelope.setRange(0.5, 0.1);
    osc.start();
    osc.disconnect();
    mrNoisy.start();
    mrNoisy.disconnect();

    oFilter.process(osc);
    oFilter.amp(0.1);
    nFilter.process(mrNoisy);
    nFilter.amp(1);
    reverb.process(oFilter, 6, 0.8);
    reverb.process(nFilter, 4, 0.8);
    delay.process(osc, 0.4, 0.8, 200);
    delay.drywet(1);
    delay.amp(3);
    delay.setType('pingPong'); // 스테레오 효과
    reverb.amp(6);

    analyzer = new p5.Amplitude();
    analyzer.setInput(osc);
    fft = new p5.FFT(0.98);
    fft.smooth(0.98);
    // noLoop();
}

function draw() {
    if (started) {
        canvas.classList.add('animation');
        const parWidSt = windowWidth / 3;
        const parHeiSt = windowHeight / 3;
        spectrum = fft.analyze();
        energy = Math.ceil(fft.getEnergy('highMid', 'treble'));

        colorMode(HSB);
        // canvas.classList.add('animation');
        c1 = color(
            map(energy, 0, 150, 180, 250),
            map(energy, 150, 0, 80, 20),
            100
        );
        c2 = color(
            map(energy, 150, 0, 150, 250),
            map(energy, 0, 150, 50, 10),
            100
        );
        for (let y = 0; y < height; y++) {
            n = map(y, 0, height, 0, 1);
            let newc = lerpColor(c1, c2, n);
            stroke(newc);
            line(0, y, width, y);
            // bezier(x1, y1, x2, y2, x3, y3, x4, y4)
        }

        mouseXEase = map(mouseX, 0, width, parWidSt * 2, width - parWidSt * 2);
        mouseYEase = map(
            mouseY,
            0,
            height,
            parHeiSt * 2,
            height - parHeiSt * 2
        );

        // 타원형으로 구성된 x와 y 그리드 만들기
        for (let x = parWidSt / 2; x <= width - parWidSt / 2; x += 5) {
            for (let y = parHeiSt; y <= height; y *= 2) {
                // for (let x = parWidSt; x <= width - parWidSt; x += 10) {
                //     for (let y = parHeiSt; y <= height - parHeiSt; y += 10) {
                // 각 타원의 시작 점은 마우스 위치에 따라 달라집니다.
                const xAngle = map(
                    mouseXEase,
                    0,
                    width,
                    -10 * PI,
                    10 * PI,
                    true
                );
                const yAngle = map(
                    mouseYEase,
                    0,
                    height,
                    10 * PI,
                    -10 * PI,
                    true
                );
                // 또, 파티클의 위치에 따라 달라집니다.
                const angle = xAngle * (x / width) + yAngle * (y / height);

                // 각 파티클은 동그라미를 그리며 움직입니다.
                const myX =
                    x + map(energy, 0, 200, 0, 300) * cos(3 * PI * t + angle);
                const myY =
                    y + map(energy, 0, 200, 100, 400) * sin(2 * PI * t + angle);

                stroke(
                    map(energy, 0, 100, 150, 300),
                    map(energy, 0, 150, 10, 30),
                    100
                );

                fill(map(energy, 50, 100, 360, 80), 18, 100);
                ellipse(myX, myY, map(energy, 0, 150, 1, 170)); // 파티클로 그리기
            }
        }

        for (let x = parWidSt / 2; x <= width - parWidSt / 2; x += 5) {
            for (let y = parHeiSt; y <= height; y *= 2) {
                // for (let x = parWidSt; x <= width - parWidSt; x += 10) {
                //     for (let y = parHeiSt; y <= height - parHeiSt; y += 10) {
                // 각 타원의 시작 점은 마우스 위치에 따라 달라집니다.

                const xAngle = map(
                    mouseXEase,
                    0,
                    width,
                    10 * PI,
                    -10 * PI,
                    true
                );
                const yAngle = map(
                    mouseYEase,
                    0,
                    height,
                    -10 * PI,
                    10 * PI,
                    true
                );
                // 또, 파티클의 위치에 따라 달라집니다.
                const angle = xAngle * (x / width) + yAngle * (y / height);

                // 각 파티클은 동그라미를 그리며 움직입니다.
                const myX =
                    x + map(energy, 0, 200, 0, 300) * cos(3 * PI * t + angle);
                const myY =
                    y + map(energy, 0, 200, 100, 400) * sin(2 * PI * t + angle);
                stroke(
                    map(energy, 0, 100, 150, 300),
                    map(energy, 0, 150, 10, 30),
                    100
                );
                fill(map(energy, 50, 100, 360, 80), 18, 100);
                ellipse(myX, myY, map(energy, 0, 150, 1, 170)); // 파티클로 그리기
            }
        }
        t = t + map(mouseX, 0, width, 0.0003, 0.003);
        // t = t + 0.003; // 시간 업데이트
        dTime = constrain(map(mouseX, 0, width, 0, 1), 0.2, 5);
        dryWet = constrain(map(mouseX, 0, width, 0, 1), 0.5, 1);
        // 1 = all reverb, 0 = no reverb
        delay.delayTime(dTime);
        reverb.drywet(dryWet);

        filterFreq = map(mouseX, 0, width, 400, 2000);
        if (mouseY > height / 2) {
            filterWidth = map(mouseY, 0, height / 2, -30, -10);
        } else {
            filterWidth = map(mouseY, height / 2, height, -10, -30);
        }
        nFilter.set(filterFreq, filterWidth);
        oFilter.set(filterFreq, 15);

        if (frameCount % int(random(10, 200)) === 0 || frameCount === 1) {
            midiVal = random(scaleArray);
            freqVal = midiToFreq(midiVal);
            randomFreq = Math.floor(random(20, freqVal));
            osc.freq(randomFreq);

            envelope.play(osc, 5, 2);
            envelope.play(mrNoisy, 5, 2);
            // note = (note + 1) % scaleArray.length;
        }
        // stroke(0);
        // text('scaleArray[note] : ' + scaleArray[note], 20, 20);
        // text('filterFreq : ' + filterFreq, 20, 40);
        // text('filterWidth  : ' + filterWidth, 20, 60);
        // text('dryWet  : ' + dryWet, 20, 80);
        // text('randomFreq  : ' + randomFreq, 20, 100);
        // text('energy  : ' + energy, 20, 120);
        // text('mouseXEase  : ' + mouseXEase, 20, 140);
        // text('mouseX  : ' + mouseX, 20, 160);
        // text('mouseYEase  : ' + mouseYEase, 20, 180);
        // text('mouseY  : ' + mouseY, 20, 200);
    }
}

function start() {
    startBtn.classList.add('clicked');
    startTx.style.opacity = 0;
    started = true;
    // loop();
}

function touchStarted() {
    if (getAudioContext.state !== 'running') {
        getAudioContext().resume();
    }
}
// start();
