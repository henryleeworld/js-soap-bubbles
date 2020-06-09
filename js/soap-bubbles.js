var n = 200,
    speed = 0.05,
    wind = 15,
    windVariance = 25, // 1 = no variance
    trail = true;

var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    cw = (canvas.width = window.innerWidth),
    ch = (canvas.height = window.innerHeight),
    img = new Image(100, 100),
    img2 = new Image(100, 100),
    img3 = new Image(100, 100),
    mouseProps = {
        x: cw / 2,
        down: 1
    },
    particles = [],
    Particle = function(index) {
        this.img = [img, img2, img3][index % 3];
        this.x = this.y = this.progress = this.alpha = 1;
        this.size = 12 + 75 * ((index + 1) / n); //min size+
        if (index > n * 0.97) this.size *= 3; //make a few big foreground particles

        this.dur = (11 - 10 * ((index + 1) / n)) / speed;

        var rot = -rand(3, 5);
        if (index % 4 == 0) rot = -rot;

        this.draw = function() {
            ctx.translate(this.x + ((mouseProps.x - cw / 2) * (this.size / 1000)), this.y);
            ctx.rotate(rot * this.progress);
            ctx.globalAlpha = this.alpha;
            ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.rotate(-rot * this.progress);
            ctx.translate(-this.x - ((mouseProps.x - cw / 2) * (this.size / 1000)), -this.y);
        }
    };

function setParticle(p, replay) {
    var _tl = gsap.timeline()
        .fromTo(p, p.dur, {
            x: rand(-wind - p.size, cw - p.size),
            y: ch + p.size,
            progress: 0
        }, {
            x: '+=' + String(rand(wind / windVariance, wind * windVariance)),
            y: -p.size,
            progress: 1,
            ease: Power0.easeNone,
            onComplete: function() {
                setParticle(p, true);
            }
        });
    if (!replay) _tl.seek(p.dur * rand()); //fast forward on first run
}


// First run
for (var i = 0; i < n; i++) {
    particles.push(new Particle(i));
    setParticle(particles[i]);
}

gsap.ticker.add(function() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(15,15,15," + mouseProps.down + ")";
    ctx.fillRect(0, 0, cw, ch);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) particles[i].draw();
});


window.addEventListener('resize', function() {
    particleNumber = 0;
    cw = (canvas.width = window.innerWidth);
    ch = (canvas.height = window.innerHeight);
    for (var i = 0; i < n; i++) {
        TweenMax.killTweensOf(particles[i]);
        setParticle(particles[i]);
    }
});

window.addEventListener('mousemove', function(e) {
    gsap.to(mouseProps, {
        duration: 1.5,
        x: e.clientX
    });
});
window.addEventListener('mousedown', function(e) {
    gsap.to(mouseProps, {
        duration: 0.6,
        down: 0.09,
        overwrite: true
    });
});
window.addEventListener('mouseup', function(e) {
    gsap.to(mouseProps, {
        duration: 1,
        down: 1,
        overwrite: true,
        ease: 'none'
    });
});


function rand(min = 0, max = 1) {
    return min + (max - min) * Math.random();
}

img.src = 'images/soap-1.png';
img2.src = 'images/soap-2.png';
img3.src = 'images/soap-3.png';