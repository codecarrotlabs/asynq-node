import type { EnqueueOptions } from "./types/types";

type PayloadValue = string | number | boolean | null | undefined;

type Payload =
  | PayloadValue
  | {
      [key: string]: Payload;
    };

export enum TaskState {
  active = 1,
  pending = 2,
  scheduled = 3,
  retry = 4,
  archived = 5,
  completed = 6,
  aggregating = 7,
}

export class Task {
  typeName: string;
  payloadVar: Buffer;
  opts?: Partial<EnqueueOptions>;

  constructor(
    typename: string,
    payload: Payload,
    opts?: Partial<EnqueueOptions>,
  ) {
    this.typeName = typename;
    this.payloadVar = Buffer.from(JSON.stringify(payload));
    this.opts = opts;
  }

  get type(): string {
    return this.typeName;
  }

  get payload(): Buffer {
    return this.payloadVar;
  }
}
