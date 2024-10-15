
import './style.css';
import p5 from 'p5';

new p5((p: p5) => {
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.windowResized = () => windowResized(p);
});

function windowResized(p: p5) {
  p.resizeCanvas(window.innerWidth, window.innerHeight, true);
}

function setup(p: p5) {
  p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
}

function draw(p: p5) {
  p.background(0);
}