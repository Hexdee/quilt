import BN from "bn.js";
import { createEllipticCurveForTesting } from "./curveFactory";

const testedCurve = createEllipticCurveForTesting("secp256r1");

describe("Elliptic Curve Diffie Hellman", () => {
  test("point is on curve", () => {
    const result = testedCurve.isOnCurve({
      x: new BN(
        "114353756191332571938710642464547836816245020710935012195100177808699424987706",
        10
      ),
      y: new BN(
        "112054965494053535815461780656142825983451368520632486304116248716690446335276",
        10
      ),
    });

    expect(result).toBe(true);
  });

  test("double the point", () => {
    const result = testedCurve.pointAdd(
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
      }
    );

    expect(result?.x.toString(10)).toBe(
      "56515219790691171413109057904011688695424810155802929973526481321309856242040"
    );
    expect(result?.y.toString(10)).toBe(
      "3377031843712258259223711451491452598088675519751548567112458094635497583569"
    );
  });

  test("generate public key from private", () => {
    const result = testedCurve.makePublicKeyFromPrivate(
      new BN(
        "90683066454814006968631478597603926296832491423936555157155566137392880311387",
        10
      )
    );

    expect(result?.x.toString(10)).toBe(
      "73740980883239990966441801640567426528722064465221180560389002270506506757231"
    );
    expect(result?.y.toString(10)).toBe(
      "2462193401255230050046665074142925845262757059550544833920717748070758187225"
    );
  });

  test("negative a point", () => {
    const result = testedCurve.pointNegative({
      x: new BN(
        "96959093947183333600024485268847266259770806592635085255950456006086429191400",
        10
      ),
      y: new BN(
        "86127755204806045597727817869737008137503555134454949714736481368819249096272",
        10
      ),
    });

    if (!result) throw new Error("negatived point is null");

    expect(result.x.toString(10)).toBe(
      "96959093947183333600024485268847266259770806592635085255950456006086429191400"
    );
    expect(result.y.toString(10)).toBe(
      "29664334005550203164969629079670565392582588280835364480797149940047848757679"
    );
  });

  test("add points", () => {
    const result = testedCurve.pointAdd(
      {
        x: new BN(
          "96959093947183333600024485268847266259770806592635085255950456006086429191400",
          10
        ),
        y: new BN(
          "86127755204806045597727817869737008137503555134454949714736481368819249096272",
          10
        ),
      },
      {
        x: new BN(
          "85568834136629184664659932816200353717017580142463839361424800301329207636534",
          10
        ),
        y: new BN(
          "97080753038166088726980055914376183130148018967996350664649099107291353105792",
          10
        ),
      }
    );

    if (!result) throw new Error("Added point is null");

    expect(result.x.toString(10)).toBe(
      "75746562334538064741349349916403709388125451505252418128252456941238258292511"
    );
    expect(result.y.toString(10)).toBe(
      "25221649333900213724729905724602038700573840724896812878296047397631188431898"
    );
  });

  test("scalar mulitplication", () => {
    const result = testedCurve.scalarMult(new BN("10", 10), {
      x: new BN(
        "96959093947183333600024485268847266259770806592635085255950456006086429191400",
        10
      ),
      y: new BN(
        "86127755204806045597727817869737008137503555134454949714736481368819249096272",
        10
      ),
    });

    if (!result) throw new Error("Result point is null");

    expect(result.x.toString(10)).toBe(
      "80278373250921924982210133626698264006006597828816955074341713367357920710291"
    );
    expect(result.y.toString(10)).toBe(
      "801095971771796167959887249464484262474056563688393255705967425589623831759"
    );
  });

  test("randomize private key", () => {
    const result = testedCurve.generateRandomSecret();
    const result2 = testedCurve.generateRandomSecret();

    expect(result.byteLength()).toBe(testedCurve.parameters.n.byteLength());
    expect(result.toString()).not.toBe(result2.toString());
  });
});

// Test to be made
// + corner cases
