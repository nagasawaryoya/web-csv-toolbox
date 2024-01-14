import { CSVRecord, ParseBinaryOptions } from "./common/types.ts";
import { parseUint8ArrayStreamToStream } from "./internal/parseUint8ArrayStreamToStream.ts";
import { streamToAsyncIterableIterator } from "./internal/utils/streamToAsyncIterableIterator.ts";
import * as internal from "./internal/utils/toArray.ts";
import { parseStringStream } from "./parseStringStream.ts";

/**
 * Parse CSV to records.
 * This function is for parsing a binary stream.
 *
 * @category Middle-level API
 * @remarks
 * If you want to parse a string, use {@link parseStringStream}.
 * @param stream CSV string to parse
 * @param options Parsing options.
 * @returns Async iterable iterator of records.
 *
 * If you want array of records, use {@link parseUint8ArrayStream.toArray} function.
 *
 * @example Parsing CSV binary
 *
 * ```ts
 * import { parseUint8ArrayStream } from 'web-csv-toolbox';
 *
 * const csv = Uint8Array.from([
 *  // ...
 * ]);
 *
 * const stream = new ReadableStream({
 *   start(controller) {
 *     controller.enqueue(csv);
 *     controller.close();
 *   },
 * });
 *
 * for await (const record of parseUint8ArrayStream(csv)) {
 *   console.log(record);
 * }
 * ```
 */
export function parseUint8ArrayStream<Header extends ReadonlyArray<string>>(
  stream: ReadableStream<Uint8Array>,
  options?: ParseBinaryOptions<Header>,
): AsyncIterableIterator<CSVRecord<Header>> {
  const recordStream = parseUint8ArrayStreamToStream(stream, options);
  return streamToAsyncIterableIterator(recordStream);
}

export namespace parseUint8ArrayStream {
  /**
   * Parse CSV binary to array of records,
   * ideal for smaller data sets.
   *
   * @returns Array of records
   *
   * @example Parsing CSV binary
   * ```ts
   * import { parseUint8ArrayStream } from 'web-csv-toolbox';
   *
   * const csv = Uint8Array.from([
   *   // ...
   * ]);
   *
   * const stream = new ReadableStream({
   *   start(controller) {
   *     controller.enqueue(csv);
   *     controller.close();
   *   },
   * });
   *
   * const records = await parseUint8ArrayStream.toArray(stream);
   * console.log(records);
   * ```
   */
  export declare function toArray<Header extends ReadonlyArray<string>>(
    stream: ReadableStream<Uint8Array>,
    options?: ParseBinaryOptions<Header>,
  ): Promise<CSVRecord<Header>[]>;
  Object.defineProperty(parseUint8ArrayStream, "toArray", {
    enumerable: true,
    writable: false,
    value: internal.toArray,
  });

  /**
   * Parse CSV binary to array of records.
   *
   * @returns Stream of records
   *
   * @example Parsing CSV binary
   * ```ts
   * import { parseUint8ArrayStream } from 'web-csv-toolbox';
   *
   * const csv = Uint8Array.from([
   *  // ...
   * ]);
   *
   * const stream = new ReadableStream({
   *  start(controller) {
   *   controller.enqueue(csv);
   *  controller.close();
   * },
   * });
   *
   * await parseUint8ArrayStream.toStream(stream)
   *   .pipeTo(new WritableStream({
   *     write(record) {
   *       console.log(record);
   *     },
   *   }),
   * );
   * ```
   */
  export declare function toStream<Header extends ReadonlyArray<string>>(
    stream: ReadableStream<Uint8Array>,
    options?: ParseBinaryOptions<Header>,
  ): ReadableStream<CSVRecord<Header>[]>;
  Object.defineProperty(parseUint8ArrayStream, "toStream", {
    enumerable: true,
    writable: false,
    value: parseUint8ArrayStreamToStream,
  });
}