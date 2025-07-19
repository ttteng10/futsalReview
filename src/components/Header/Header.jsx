import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Menulist = [
  { menu: "랭킹", url: "/home" },
  { menu: "추천 & 팁", url: "/home/tip" },
];

export default function Header({ setModalVisible }) {
  const naivgate = useNavigate();

  function handleHome() {
    naivgate("/home");
  }
  function handleAdd() {
    setModalVisible(true);
  }
  return (
    <div className={styles.HeaderWrapper}>
      <div className={styles.HeaderLogo} onClick={handleHome}>
        <p className={styles.HeaderTitle}>FootPick</p>
        <p className={styles.HeaderSubTitle}>내가 고른 풋살화</p>
      </div>
      <div className={styles.HeaderMenus}>
        {Menulist.map((item) => (
          <div key={item.url} className={styles.MenuBtn}>
            <NavLink
              to={item.url}
              end
              className={({ isActive }) =>
                isActive ? styles.active : styles.linkTag
              }
            >
              <p className={styles.MenuName}>{item.menu}</p>
            </NavLink>
          </div>
        ))}
        <div className={styles.MenuBtn} onClick={handleAdd}>
          <NavLink className={styles.linkTag}>
            <p className={styles.MenuName}>추가하기</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
