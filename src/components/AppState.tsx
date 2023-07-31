import React, { useCallback, useState } from "react";
import { DataType, Person, PersonWithoutKey } from "./types";
import AppTable from "./table/Table";

export default function AppState() {
  const [data, setData] = useState<DataType>([
    {
      key: "1",
      name: "John Brown",
      date: "2023-07-14",
      numberValue: 123,
    },
    {
      key: "2",
      name: "Joe Black",
      date: "2023-07-14",
      numberValue: 321,
    },
    {
      key: "3",
      name: "Jim Green",
      date: "2023-07-14",
      numberValue: 456,
    },
    {
      key: "4",
      name: "Jim Red",
      date: "2023-07-14",
      numberValue: 789,
    },
  ]);

  const deletePerson = useCallback(
    (personIndex: number) => {
      setData((data: DataType) => {
        return [...data.slice(0, personIndex), ...data.slice(personIndex + 1)];
      });
    },
    [setData]
  );

  const setPerson = useCallback(
    (person: Person) => {
      setData((data: DataType) => {
        return data.map((item) => {
          if (person.key && item.key === person.key) {
            return person;
          }
          return item;
        });
      });
    },
    [setData]
  );

  const addPerson = useCallback(
    (person: PersonWithoutKey) => {
      setData((data: DataType) => {
        const lastKey = Math.max(...data.map((item) => parseInt(item.key)));
        return [...data, { ...person, key: (lastKey + 1).toString() }];
      });
    },
    [setData]
  );

  return (
    <AppTable
      data={data}
      deletePerson={deletePerson}
      setPerson={setPerson}
      addPerson={addPerson}
    />
  );
}
