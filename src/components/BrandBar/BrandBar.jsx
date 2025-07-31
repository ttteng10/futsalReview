import styles from "./BrandBar.module.css";

const BRANDS = [
  { brand: "전체", filter: "All" },
  { brand: "나이키", filter: "nike" },
  { brand: "아디다스", filter: "adidas" },
  { brand: "푸마", filter: "puma" },
  { brand: "미즈노", filter: "mizuno" },
  { brand: "키카", filter: "kika" },
  { brand: "아식스", filter: "asics" },
  // { brand: "뉴발란스", filter: "nb" },
  { brand: "기타", filter: "etc" },
];

export default function BrandBar({ filter, setFilter, setSearchInput }) {
  function handleBtn(filter) {
    setFilter(filter);
  }

  return (
    <div className={styles.BrandBarWrapper}>
      <div className={styles.BrandBarBtns}>
        {BRANDS.map((item) => (
          <div
            key={item.filter}
            className={
              filter === item.filter
                ? `${styles.BrandBtn} ${styles.active}`
                : styles.BrandBtn
            }
            onClick={() => handleBtn(item.filter)}
          >
            {item.brand}
          </div>
        ))}
      </div>
      <div className={styles.InputWrapper}>
        <input
          type="text"
          placeholder="풋살화 검색"
          className={styles.inputStyle}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>
    </div>
  );
}
