
import './style.css';
import p5 from 'p5';
import { Particle } from './particle';

const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const showVectorsCheckbox: HTMLInputElement = document.getElementById('show-vectors') as HTMLInputElement;
const showParticlesCheckbox = document.getElementById('show-particles') as HTMLInputElement;

showVectorsCheckbox.checked = false;
showParticlesCheckbox.checked = true;
showParticlesCheckbox.disabled = true;

let SCALE = 50;
let ZOFF = 0;
let NUM_PARTICLES = 500;
let PARTICLES: Particle[] = [];
let FLOW_FIELD: p5.Vector[][] = [];

new p5((p: p5) => {
  resetBtn?.addEventListener('click', () => p.background(0));
  
  showVectorsCheckbox?.addEventListener('change', (e: any) => {
    if (e.target?.checked) {
      showParticlesCheckbox.disabled = false;
    } else {
      showParticlesCheckbox.disabled = true;
      showParticlesCheckbox.checked = true;
    }

    p.background(0);
  });

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight, true);
  };

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
    p.background(0);

    for (let i = 0; i < NUM_PARTICLES; i++) {
      PARTICLES[i] = new Particle(p);
    }

    let COLS = p.width / SCALE;
    let ROWS = p.height / SCALE;

    let yoff = 0;
    for (let y = 0; y < ROWS; y++) {
      let row = [];
      let xoff = 0;
      for (let x = 0; x < COLS; x++) {
        let angle = p.noise(xoff, yoff, ZOFF) * p.TWO_PI * 4;
        let vec = p5.Vector.fromAngle(angle);
        vec.setMag(0.5);
        row.push(vec);
        xoff += 0.1;
      }
      FLOW_FIELD.push(row);
      yoff += 0.1;
    }
  };

  p.draw = () => {
    if (showVectorsCheckbox.checked) p.background(0);
    let COLS = p.width / SCALE;
    let ROWS = p.height / SCALE;

    p.stroke(255, 40);
    p.strokeWeight(1);
    p.noFill();

    let yoff = 0;
    for (let y = 0; y < ROWS; y++) {
      let xoff = 0;
      for (let x = 0; x < COLS; x++) {
        let angle = p.noise(xoff, yoff, ZOFF) * p.TWO_PI * 4;
        let vec = p5.Vector.fromAngle(angle);
        vec.setMag(0.5);
        FLOW_FIELD[y][x] = vec;
        if (showVectorsCheckbox.checked) {
          p.push();
          p.translate(x*SCALE, y*SCALE);
          p.rotate(vec.heading());
          p.line(0, 0, (2*SCALE)/3, 0);
          p.line((2*SCALE)/3, 0, (1*SCALE)/3, SCALE/5);
          p.line((2*SCALE)/3, 0, (1*SCALE)/3, -SCALE/5);
          p.pop();
        }
        xoff += 0.1;
      }
      yoff += 0.1;
    }

    ZOFF += 0.008;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      let particle = PARTICLES[i];

      let x = p.floor(particle.pos.x / SCALE);
      let y = p.floor(particle.pos.y / SCALE);
      particle.applyAccel(FLOW_FIELD[y][x]);

      particle.update();
      particle.edges(p);

      if (showVectorsCheckbox.checked && !showParticlesCheckbox.checked) continue;

      if (showVectorsCheckbox.checked) {
        p.strokeWeight(4);
        p.stroke(255);
      } else {
        p.strokeWeight(1);
        p.stroke(255, 50);
      };
      particle.display(p);
    }
  };
});