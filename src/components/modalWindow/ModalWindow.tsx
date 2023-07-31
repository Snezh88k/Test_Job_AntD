import { PersonWithoutKey } from "../types";
import styles from "./ModalWindow.module.scss";

export default function ModalWindow({
  person,
  onSubmit,
}: {
  person: PersonWithoutKey;
  onSubmit: (person: PersonWithoutKey) => void;
}) {
  const editPerson = (e: any) => {
    return onSubmit({
      ...person,
      name: e.target.name.value,
      date: e.target.date.value,
      numberValue: e.target.numberValue.value,
    });
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={editPerson} className={styles.from_wrapper}>
        <input
          type="text"
          defaultValue={person.name}
          name="name"
          placeholder="Name"
          required
        />
        <input type="date" defaultValue={person.date} name="date" required />
        <input
          type="number"
          defaultValue={person.numberValue}
          name="numberValue"
          placeholder="Number"
          required
        />
        <input type="submit" value="Принять" />
      </form>
    </div>
  );
}
