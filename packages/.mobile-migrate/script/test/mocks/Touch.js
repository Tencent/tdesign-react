class Touch {
  constructor(init) {
    this.identifier = init.identifier;
    this.target = init.target;
    this.clientX = init.clientX;
    this.clientY = init.clientY;
    this.pageX = init.pageX;
    this.pageY = init.pageY;
    this.screenX = init.screenX;
    this.screenY = init.screenY;
    this.radiusX = init.radiusX;
    this.radiusY = init.radiusY;
    this.rotationAngle = init.rotationAngle;
    this.force = init.force;
  }
}

export default Touch;
