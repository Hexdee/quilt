import BN from "bn.js";
import {
  isOnCurve,
  curveData,
  pointAdd,
  makePublicKeyFromPrivate,
} from "./ECDH";

test("point is on curve", () => {
  const result = isOnCurve(
    {
      x: new BN(
        "114353756191332571938710642464547836816245020710935012195100177808699424987706",
        10
      ),
      y: new BN(
        "112054965494053535815461780656142825983451368520632486304116248716690446335276",
        10
      ),
    },
    curveData
  );

  expect(result).toBe(true);
});

test("double the point", () => {
  const result = pointAdd(
    {
      x: new BN(
        "48439561293906451759052585252797914202762949526041747995844080717082404635286",
        10
      ),
      y: new BN(
        "36134250956749795798585127919587881956611106672985015071877198253568414405109",
        10
      ),
    },
    {
      x: new BN(
        "48439561293906451759052585252797914202762949526041747995844080717082404635286",
        10
      ),
      y: new BN(
        "36134250956749795798585127919587881956611106672985015071877198253568414405109",
        10
      ),
    },
    curveData
  );

  expect(result?.x.toString(10)).toBe(
    "56515219790691171413109057904011688695424810155802929973526481321309856242040"
  );
  expect(result?.y.toString(10)).toBe(
    "3377031843712258259223711451491452598088675519751548567112458094635497583569"
  );
});

test("generate public key from private", () => {
  const result = makePublicKeyFromPrivate(
    new BN(
      "90683066454814006968631478597603926296832491423936555157155566137392880311387",
      10
    ),
    curveData
  );

  expect(result?.x.toString(10)).toBe(
    "73740980883239990966441801640567426528722064465221180560389002270506506757231"
  );
  expect(result?.y.toString(10)).toBe(
    "2462193401255230050046665074142925845262757059550544833920717748070758187225"
  );
});

// Test to be made
// -> pointNegative
// -> pointAdd
// -> scalarMult
// -> makeKeyPair
// -> ranomizePrivateKey
// + some corner cases
