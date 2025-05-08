
/// <reference types="three" />

declare namespace THREE {
  interface Group extends THREE.Object3D {
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  }

  interface Mesh extends THREE.Object3D {
    rotation: {
      x: number;
      y: number;
      z: number;
    };
    position: THREE.Vector3;
    lookAt(v: THREE.Vector3): void;
    rotateX(angle: number): void;
    rotateY(angle: number): void;
    rotateZ(angle: number): void;
  }
  
  class Euler {
    constructor(x?: number, y?: number, z?: number, order?: string);
    x: number;
    y: number;
    z: number;
  }

  class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
    length(): number;
    normalize(): Vector3;
  }

  class MeshStandardMaterial {
    constructor(parameters?: any);
    color: any;
    roughness: number;
    metalness: number;
    transparent: boolean;
    opacity: number;
    side: any;
  }

  const DoubleSide: any;
}
