import { describe, expectTypeOf, it } from "vitest";
import { CR, CRLF, LF } from "./constants.ts";
import { parseStringToArraySyncWASM } from "./parseStringToArraySyncWASM.ts";
import type { CSVRecord, ParseOptions } from "./web-csv-toolbox.ts";

describe("parseStringToArraySyncWASM function", () => {
  it("parseStringToArraySyncWASM should be a function with expected parameter types", () => {
    expectTypeOf(parseStringToArraySyncWASM).toBeFunction();
    expectTypeOf(parseStringToArraySyncWASM)
      .parameter(0)
      .toMatchTypeOf<string>();
    expectTypeOf(parseStringToArraySyncWASM)
      .parameter(1)
      .toMatchTypeOf<ParseOptions<readonly string[]> | undefined>();
  });
});

describe("string parsing", () => {
  it("should CSV header of the parsed result will be string array", () => {
    expectTypeOf(parseStringToArraySyncWASM("" as string)).toEqualTypeOf<
      CSVRecord<readonly string[]>[]
    >();
  });
});

describe("csv literal string parsing", () => {
  const csv1 = `name,age,city,zip
Alice,24,New York,10001
Bob,36,Los Angeles,90001`;

  const csv2 = "name,age,city,zip";

  it("should csv header of the parsed result will be header's tuple", () => {
    expectTypeOf(parseStringToArraySyncWASM(csv1)).toMatchTypeOf<
      CSVRecord<["name", "age", "city", "zip"]>[]
    >();

    expectTypeOf(parseStringToArraySyncWASM(csv2)).toMatchTypeOf<
      CSVRecord<["name", "age", "city", "zip"]>[]
    >();
  });
});

describe("csv literal string parsing with line breaks, quotation, newline", () => {
  const csv1 = `"name","age
","city","zi
p"
Alice,24,New York,10001
Bob,36,Los Angeles,90001`;

  const csv2 = `'name'@'age
'@'city'@'zi
p'
Alice@24@New York@10001
Bob@36@Los Angeles@90001`;

  const csv3 = `'name'@'age

'@'c
ity'@'
zi
p'
Alice@'24'@'Ne
w York'@'10
001'
Bob@36@'Los Ange

les'@'9
0001'`;

  const csv4 = `'name'@'age

'@'c
ity'@'
zi
p'`;

  const csv5 = `'na${CR}me'@'age'@'ci${CR}${CRLF}ty'@'z${LF}ip'${CR}Alice@24@'New${CR}${LF} York'@10001${LF}Bob@'3${CRLF}6'@'Los Angeles'@'90${CRLF}001'`;

  const csv6 = `'@name'@'age

'@'c
@ity@'@'
zi
p'
'Alice@'@'24'@'@Ne
w York'@'10
00@1'
Bob@36@'Lo@s Ange

les'@'@9
0001'`;

  it("should csv header of the parsed result will be header's tuple", () => {
    expectTypeOf(parseStringToArraySyncWASM(csv1)).toMatchTypeOf<
      CSVRecord<["name", "age\n", "city", "zi\np"]>[]
    >();

    expectTypeOf(
      parseStringToArraySyncWASM(csv2, { delimiter: "@", quotation: "'" }),
    ).toMatchTypeOf<CSVRecord<["name", "age\n", "city", "zi\np"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM(csv3, { delimiter: "@", quotation: "'" }),
    ).toMatchTypeOf<CSVRecord<["name", "age\n\n", "c\nity", "\nzi\np"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM(csv4, { delimiter: "@", quotation: "'" }),
    ).toEqualTypeOf<CSVRecord<["name", "age\n\n", "c\nity", "\nzi\np"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM(csv5, { delimiter: "@", quotation: "'" }),
    ).toMatchTypeOf<CSVRecord<["na\rme", "age", "ci\r\r\nty", "z\nip"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM(csv6, { delimiter: "@", quotation: "'" }),
    ).toMatchTypeOf<CSVRecord<["@name", "age\n\n", "c\n@ity@", "\nzi\np"]>[]>();
  });
});

describe("generics", () => {
  it("should CSV header of the parsed result should be the one specified in generics", () => {
    expectTypeOf(
      parseStringToArraySyncWASM<readonly ["name", "age", "city", "zip"]>(""),
    ).toEqualTypeOf<CSVRecord<readonly ["name", "age", "city", "zip"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM<
        string,
        readonly ["name", "age", "city", "zip"]
      >(""),
    ).toEqualTypeOf<CSVRecord<readonly ["name", "age", "city", "zip"]>[]>();

    expectTypeOf(
      parseStringToArraySyncWASM<
        string,
        "#",
        "$",
        readonly ["name", "age", "city", "zip"]
      >("", {
        delimiter: "#",
        quotation: "$",
      }),
    ).toEqualTypeOf<CSVRecord<readonly ["name", "age", "city", "zip"]>[]>();
  });
});