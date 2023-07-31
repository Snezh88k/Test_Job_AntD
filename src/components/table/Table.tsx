import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import React, { useCallback, useRef, useState } from "react";
import Highlighter from "react-highlight-words";

import styles from "./Table.module.scss";
import { DataType, Person, PersonWithoutKey } from "../types";
import ModalWindow from "../modalWindow/ModalWindow";

interface AppTableProps {
  data: DataType;
  deletePerson: (personIndex: number) => void;
  setPerson: (person: Person) => void;
  addPerson: (person: PersonWithoutKey) => void;
}

type DataIndex = keyof Person;

const isPersonWithKey = (
  person: Person | PersonWithoutKey
): person is Person => {
  return !!person.key;
};

const AppTable = ({
  data,
  deletePerson,
  setPerson,
  addPerson,
}: AppTableProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Person> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<Person> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      ...getColumnSearchProps("name"),
      sorter: (a, b) => (a.name > b.name ? -1 : 1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "20%",
      ...getColumnSearchProps("date"),
      sorter: (a, b) => (a.date > b.date ? -1 : 1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "NumberValue",
      dataIndex: "numberValue",
      key: "numberValue",
      ...getColumnSearchProps("numberValue"),
      sorter: (a, b) => a.numberValue - b.numberValue,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => (
        <Space size="middle">
          <button
            onClick={() => deletePerson(index)}
            className={styles.delete_btn}
          >
            Delete
          </button>
          <button
            className={styles.delete_btn}
            onClick={() => setPersonToEdit(record)}
          >
            Edit
          </button>
        </Space>
      ),
    },
  ];

  const [personToEdit, setPersonToEdit] = useState<PersonWithoutKey | null>(
    null
  );

  const onPersonSubmit = useCallback(
    (person: PersonWithoutKey) => {
      if (isPersonWithKey(person)) {
        setPerson(person);
      } else {
        addPerson(person);
      }

      setPersonToEdit(null);
    },
    [addPerson, setPerson]
  );

  const onPersonAdd = useCallback(() => {
    const person: PersonWithoutKey = {
      name: "",
      date: new Date().toISOString().slice(0, 10),
      numberValue: 0,
    };
    setPersonToEdit(person);
  }, []);

  return (
    <div className={styles.wrapper}>
      <button onClick={() => onPersonAdd()} className={styles.addPerson_button}>
        Add Person
      </button>
      <Table columns={columns} dataSource={data} />
      {personToEdit && (
        <ModalWindow onSubmit={onPersonSubmit} person={personToEdit} />
      )}
    </div>
  );
};

export default AppTable;
