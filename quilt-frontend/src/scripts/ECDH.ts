import { CurveData, Point } from "../types/ECDHTypes";
import randomBytes from "randombytes";
import BN from "bn.js";

const ZERO = new BN("0");
const ONE = new BN("1");
const TWO = new BN("2");
const THREE = new BN("3");

export const curveData: CurveData = {
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
};

export const pointNegative = (point: Point): Point => {
  if (!point) return null;

  return {
    x: point.x,
    y: point.y.neg().umod(curveData.p),
  };
};

export const isOnCurve = (point: Point, curve: CurveData) => {
  if (!point) return true;

  const { x, y } = point;

  return (
    y
      .mul(y)
      .sub(x.mul(x).mul(x))
      .sub(curve.a.mul(x))
      .sub(curve.b)
      .mod(curve.p)
      .cmp(ZERO) === 0
  );
};

export const pointAdd = (
  point1: Point,
  point2: Point,
  curve: CurveData
): Point => {
  if (!(isOnCurve(point1, curve) && isOnCurve(point2, curve))) return null;

  if (!point1) return point2;
  if (!point2) return point1;

  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;

  if (x1.eq(x2) && !y1.eq(y2)) return null;

  let m: BN;
  if (x1.eq(x2)) {
    m = THREE.mul(x1).mul(x1).add(curve.a).mul(TWO.mul(y1).invm(curve.p));
  } else {
    m = y1.sub(y2).mul(x1.sub(x2).invm(curve.p));
  }

  const x3 = m.mul(m).sub(x1).sub(x2);
  const y3 = y1.add(x3.sub(x1).mul(m));

  const result: Point = {
    x: x3.mod(curve.p),
    y: y3.neg().umod(curve.p),
  };

  if (!isOnCurve(result, curve)) return null;

  return result;
};

export const scalarMult: any = (k: BN, point: Point, curve: CurveData) => {
  if (!isOnCurve(point, curve))
    return new Error("given point is not on the curve");

  if (k.mod(curve.n).eq(ZERO) || !point) {
    console.log("returning");
    return null;
  }

  if (k.cmp(ZERO) === -1)
    return scalarMult(k.neg(), pointNegative(point), curve);

  console.log("passed");
  let result: Point = null;
  let addend: Point = point;

  while (k.cmp(ZERO)) {
    if (k.and(ONE).cmp(ZERO)) {
      result = pointAdd(result, addend, curve);
    }

    addend = pointAdd(addend, addend, curve);
    k = k.shrn(1);
  }

  console.log(result);

  if (!isOnCurve(result, curve))
    return new Error("Calulated point is not on the curve");

  return result;
};

export const makeKeyPair = (): [BN, Point] => {
  const privateKey = new BN(randomBytes(curveData.n.byteLength()), 16);
  const publicKey = scalarMult(privateKey, curveData.g, curveData);

  return [privateKey, publicKey];
};

export const makePublicKeyFromPrivate = (
  privateKey: BN,
  curve: CurveData
): Point => {
  return scalarMult(privateKey, curveData.g, curve);
};
