import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Generic single-document JSON store. Each store instance owns one file and
 * serializes writes through its own queue, so concurrent POST/PUT requests
 * can't interleave read-modify-write cycles.
 */
export function createJsonStore<T>(filename: string, defaults: T) {
  const filePath = path.join(process.cwd(), "content", filename);
  let queue: Promise<unknown> = Promise.resolve();

  async function readRaw(): Promise<T> {
    try {
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed } as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return defaults;
      throw err;
    }
  }

  async function writeRaw(next: T): Promise<void> {
    const tmp = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
    await fs.rename(tmp, filePath);
  }

  function enqueue<R>(op: () => Promise<R>): Promise<R> {
    const run = queue.then(op, op);
    queue = run.catch(() => undefined);
    return run;
  }

  return {
    read: (): Promise<T> => readRaw(),
    write: (next: T): Promise<T> =>
      enqueue(async () => {
        await writeRaw(next);
        return next;
      }),
  };
}
