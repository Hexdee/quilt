import BN from "bn.js";
import { CurveData, Point } from "../../types/ECDHTypes";
import randomBytes from "randombytes";

type CurvesData = {
  secp256r1: CurveData;
  curve25519: CurveData;
};
type CurveTypes = keyof CurvesData;

const curvesData: CurvesData = {
  secp256r1: {
    type: "secp256r1",
    p: new BN(
      "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
      16
    ),
    a: new BN(
      "ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
      16
    ),
    b: new BN(
      "5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
      16
    ),
    g: {
      x: new BN(
        "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
        16
      ),
      y: new BN(
        "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5",
        16
      ),
    },
    n: new BN(
      "ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
      16
    ),
    h: new BN(1),
  },
  curve25519: {
    type: "curve25519",
    p: new BN(
      "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed",
      16
    ),
    a: new BN("76d06", 16),
    b: new BN("01", 16),
    g: {
      x: new BN("09", 16),
      y: new BN(
        "20ae19a1b8a086b4e01edd2c7748d14c923d4d7e6d7c61b229e9c5a27eced3d9",
        16
      ),
    },
    n: new BN(
      "1000000000000000000000000000000014def9dea2f79cd65812631a5cf5d3ed",
      16
    ),
    h: new BN("08", 16),
  },
};

const ZERO = new BN("0");
const ONE = new BN("1");
const TWO = new BN("2");
const THREE = new BN("3");

class EllipticCurve {
  parameters: CurveData;

  constructor(type: CurveTypes) {
    this.parameters = curvesData[type];
  }

  pointNegative(point: Point): Point {
    if (!point) return null;

    return {
      x: point.x,
      y: point.y.neg().umod(this.parameters.p),
    };
  }

  isOnCurve(point: Point): Boolean {
    if (!point) return true;

    const { x, y } = point;

    return (
      y
        .mul(y)
        .sub(x.mul(x).mul(x))
        .sub(this.parameters.a.mul(x))
        .sub(this.parameters.b)
        .mod(this.parameters.p)
        .cmp(ZERO) === 0
    );
  }

  pointAdd(point1: Point, point2: Point): Point {
    if (!(this.isOnCurve(point1) && this.isOnCurve(point2))) return null;

    if (!point1) return point2;
    if (!point2) return point1;

    const { x: x1, y: y1 } = point1;
    const { x: x2, y: y2 } = point2;

    if (x1.eq(x2) && !y1.eq(y2)) return null;

    let m: BN;
    if (x1.eq(x2)) {
      m = THREE.mul(x1)
        .mul(x1)
        .add(this.parameters.a)
        .mul(TWO.mul(y1).invm(this.parameters.p));
    } else {
      m = y1.sub(y2).mul(x1.sub(x2).invm(this.parameters.p));
    }

    const x3 = m.mul(m).sub(x1).sub(x2);
    const y3 = y1.add(x3.sub(x1).mul(m));

    const result: Point = {
      x: x3.mod(this.parameters.p),
      y: y3.neg().umod(this.parameters.p),
    };

    if (!this.isOnCurve(result)) return null;

    return result;
  }

  scalarMult(k: BN, point: Point): any {
    if (!this.isOnCurve(point))
      return new Error("given point is not on the curve");

    if (k.mod(this.parameters.n).eq(ZERO) || !point) {
      console.log("returning");
      return null;
    }

    if (k.cmp(ZERO) === -1)
      return this.scalarMult(k.neg(), this.pointNegative(point));

    console.log("passed");
    let result: Point = null;
    let addend: Point = point;

    while (k.cmp(ZERO)) {
      if (k.and(ONE).cmp(ZERO)) {
        result = this.pointAdd(result, addend);
      }

      addend = this.pointAdd(addend, addend);
      k = k.shrn(1);
    }

    console.log(result);

    if (!this.isOnCurve(result))
      return new Error("Calulated point is not on the curve");

    return result;
  }

  generateRandomSecret(): BN {
    return new BN(randomBytes(this.parameters.n.byteLength()), 16);
  }

  makeKeyPair(): [BN, Point] {
    const privateKey = this.generateRandomSecret();
    const publicKey = this.scalarMult(privateKey, this.parameters.g);

    return [privateKey, publicKey];
  }

  makePublicKeyFromPrivate(privateKey: BN): Point {
    return this.scalarMult(privateKey, this.parameters.g);
  }
}

export const createEllipticCurve = (type: CurveTypes) => {
  const curve = new EllipticCurve(type);

  return {
    makePublicKeyFromPrivate: curve.makePublicKeyFromPrivate,
    makeKeyPair: curve.makeKeyPair,
    generateRandomSecret: curve.generateRandomSecret,
  };
};

export const createEllipticCurveForTesting = (type: CurveTypes) => {
  return new EllipticCurve(type);
};
