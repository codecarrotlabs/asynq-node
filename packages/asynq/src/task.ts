type PayloadValue = string | number | boolean | null | undefined;

type Payload = Record<string, PayloadValue>;

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
  // TODO: opts: Options

  constructor(typename: string, payload: Payload, opts?: unknown) {
    this.typeName = typename;
    this.payloadVar = Buffer.from(JSON.stringify(payload));
  }

  get type(): string {
    return this.typeName;
  }

  get payload(): Buffer {
    return this.payloadVar;
  }
}
