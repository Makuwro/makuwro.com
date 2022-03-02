import React, { useState, useEffect } from "react";
import Dropdown from "./Dropdown";
import styles from "../../styles/Dropdown.module.css";

export default function BirthdateDropdown({ onChange }) {

  const [dateIndex, setDateIndex] = useState([]);

  const monthList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthComps = [];
  const dateComps = [];
  const yearComps = [];
  let year;
  let i;

  for (i = 0; monthList.length > i; i++) {

    monthComps.push(<li key={i}>{monthList[i]}</li>);

  }

  for (i = 0; 31 > i; i++) {

    dateComps.push(<li key={i}>{i + 1}</li>);

  }

  year = new Date().getFullYear();
  for (i = 0; 100 > i; i++) {

    yearComps.push(<li key={i}>{year - i}</li>);

  }

  useEffect(() => {

    onChange(new Date(`${monthList[dateIndex[0]]}/${dateComps[dateIndex[1]]?.props.children}/${yearComps[dateIndex[2]]?.props.children}`));

  }, [dateIndex]);

  function setIndex(arrayPos, index) {

    setDateIndex((dateIndex) => {
          
      const copy = [...dateIndex];
      copy[arrayPos] = index;
      return copy;

    });

  }

  return (
    <section className={styles.date}>
      <Dropdown index={dateIndex[0]} onChange={(index) => setIndex(0, index)} placeholder="Month" inPopup>
        {monthComps}
      </Dropdown>
      <Dropdown index={dateIndex[1]} onChange={(index) => setIndex(1, index)} placeholder="Day" inPopup>
        {dateComps}
      </Dropdown>
      <Dropdown index={dateIndex[2]} onChange={(index) => setIndex(2, index)} placeholder="Year" inPopup>
        {yearComps}
      </Dropdown>
    </section>
  );

}