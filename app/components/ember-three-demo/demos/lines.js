import THREE from 'three';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import Stats from 'stats.js';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DemoComponent extends Component {
  @service('ember-three/scene-manager') sceneManager;
  @tracked containerRotation = new THREE.Euler();

  counter = 0;
  cameraPosition = new THREE.Vector3(0, 0, 14.2);
  lightPosition = new THREE.Vector3(-5, 0, 10);
  lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
  sceneId = 'ember-threejs-lines-demo';
  state = undefined;
  rendererParams = {
    clearColor: 0x000000,
  };

  constructor() {
    super(...arguments);
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    let scene = this.sceneManager.get(this.sceneId);
    scene.addRafCallback(this.render, this);
    scene.setStats(this.stats);

    this._lineGeometries = [
      this.createGeometry(),
      this.createGeometry(),
      this.createGeometry(),
      this.createGeometry(),
      this.createGeometry(),
      this.createGeometry(),
    ];
  }

  createGeometry() {
    let geometry = new THREE.BufferGeometry();
    let vertices = [];
    let vertex = new THREE.Vector3();
    for (let i = 0; i < 1500; i++) {
      vertex.x = Math.random() * 2 - 1;
      vertex.y = Math.random() * 2 - 1;
      vertex.z = Math.random() * 2 - 1;
      vertex.normalize();
      vertex.multiplyScalar(10);
      vertices.push(vertex.x, vertex.y, vertex.z);
      vertex.multiplyScalar(Math.random() * 0.09 + 1);
      vertices.push(vertex.x, vertex.y, vertex.z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
  }

  render() {
    this.containerRotation.y += 0.02;
    this.containerRotation = this.containerRotation;
    this.counter += 0.05;
  }

  get lineSegmentsData() {
    let scale = 0;
    return this._lineGeometries.map(geometry => {
      scale += 0.2;
      return {
        geometry,
        scale: new THREE.Vector3(scale, scale, scale),
      };
    });
  }

  @action
  destroyElement() {
    document.body.removeChild(this.stats.dom);
  }

  @tracked _lineGeometries = [];
}
