const maxVolume = 0.3

let song
let fft

let line_width
let line_gap
let column_space

let playable = false

let calculated_width

function preload() {
    song = loadSound('../Shelter.mp3', loaded)
}

function loaded() {
    document.getElementById('play-button').classList.remove('disabled')
    playable = true
}

function setup() {
    // hsb
    colorMode(HSB)
    strokeCap(ROUND)
    textAlign(CENTER, CENTER)
    rectMode(CENTER)

    let lines = pow(2, 6)
    line_width = 3

    line_gap = windowWidth / (lines - 16)
    column_space = line_width + line_gap

    calculated_width = (lines - 16) * column_space

    createCanvas(windowWidth, windowHeight)

    fft = new p5.FFT(0.8, lines)

    song.setVolume(maxVolume)

    background(10)
}

function playsong() {
    if (playable) {
        song.play()
        document.getElementById('warning').style.display = 'none'
    }
}

function draw() {
    background('rgba(0%,0%,0%,0.05)')

    spectrum = fft.analyze()

    offset = (width - calculated_width) / 2

    // sum of spectrum from -16 to -1
    let sum = 0
    for (let i = spectrum.length - 15; i < spectrum.length; i++) {
        sum += spectrum[i]
    }

    if (sum > 0) {
        push()
        stroke(map(sum, 0, 255 * 15, 160, 360), 50, 100)
        noFill()
        circle(width / 2, height / 2, sum)
        pop()
    }

    push()
    rect_count = 0
    // loop through spectrum array
    for (let i = 0; i < spectrum.length - 16; i++) {
        let amp = spectrum[i] * 0.9
        // let y = map(amp, 0, 255, 0, height / 2)
        let y = map(amp, 0, 255, 0, height)

        stroke(map(i, 0, spectrum.length, 160, 360), 50, 100)

        strokeWeight(line_width)
        // point(offset + line_gap + column_space * i, height / 2 - y)
        // point(offset + line_gap + column_space * i, height / 2 + y)

        // point(offset + line_gap + column_space * i, height - y)
        push()
        noStroke()
        fill(map(i, 0, spectrum.length, 160, 360), 50, 100)
        text(
            '' + int(random(0, 9)),
            offset + line_gap + column_space * i,
            height - y
        )
        pop()
        noFill()

        if (sum > 0) {
            if (
                height - y <
                map(i, 0, spectrum.length, height / 2, height - height / 4)
            ) {
                strokeWeight(1)
                line(
                    offset + line_gap + column_space * i,
                    height,
                    offset + line_gap + column_space * i,
                    height - y
                )
            }

            if (
                y > map(i, 0, spectrum.length, height - height / 10, height / 2)
            ) {
                push()
                // random rotation
                translate(random(width), random(height))

                strokeWeight(1)
                rect(0, 0, amp / 2, amp / 2)
                pop()
            }
        }
    }
    pop()

    fill(255)
}
