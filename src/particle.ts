
import p5 from 'p5';

export class Particle {
  pos: p5.Vector;
  vel: p5.Vector;
  accel: p5.Vector;
  maxSpeed: number = 5;

  constructor(p: p5) {
    this.pos = p.createVector(p.random(p.width), p.random(p.height));
    this.vel = p.createVector(0, 0);
    this.accel = p.createVector(0, 0);
  }

  update() {
    this.vel.add(this.accel);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.accel.mult(0);
  }

  applyAccel(accel: p5.Vector) {
    this.accel.add(accel);
  }

  edges(p: p5) {
    if (this.pos.x > p.width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = p.width;
    if (this.pos.y > p.height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = p.height;
  }

  display(p: p5) {
    p.point(this.pos);
  }
}