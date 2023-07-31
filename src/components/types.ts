export type DataType = Person[];

export interface Person {
  key: string;
  name: string;
  date: string;
  numberValue: number;
}
export type PersonWithoutKey = Omit<Person, "key"> & {
  key?: string;
};
