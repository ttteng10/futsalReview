import {
  useLoaderData,
  defer,
  Await,
  json,
  useNavigate,
} from "react-router-dom";
import styles from "./Home.module.css";
import { useState, Suspense } from "react";
import BrandBar from "../../components/BrandBar/BrandBar";
import heartIcon from "../../assets/icon/heartIcon.svg";
import { getAllFutsal } from "../../data/supabaseClient";

const brandKR = new Map([
  ["nike", "나이키"],
  ["adidas", "아디다스"],
  ["mizuno", "미즈노"],
  ["puma", "푸마"],
  ["kika", "키카"],
  ["asics", "아식스"],
  ["nb", "뉴발란스"],
  ["etc", "기타"],
]);

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const loaderData = useLoaderData();
  const navigate = useNavigate();

  function handleNav(id) {
    navigate(`/home/detail/${id}`);
  }

  return (
    <div className={styles.homeWrapper}>
      <BrandBar
        filter={filter}
        setFilter={setFilter}
        setSearchInput={setSearchInput}
      />
      <Suspense fallback={<p>Loading shoes...</p>}>
        <Await resolve={loaderData.futsalData}>
          {(loadedData) => {
            const filteredData = loadedData
              .filter((item) =>
                searchInput === ""
                  ? true
                  : item.shoe.toLowerCase().includes(searchInput.toLowerCase())
              )
              .filter((item) =>
                filter === "All" ? true : item.brand === filter
              );
            return (
              <div className={styles.contentWrapper}>
                {filteredData.map((item, index) => (
                  <div
                    key={item.id}
                    className={styles.shoeDiv}
                    onClick={() => handleNav(item.id)}
                    title={item.shoe}
                  >
                    <img
                      src={item.img}
                      alt={item.shoe}
                      className={styles.shoeImg}
                    />
                    <div className={styles.shoeInform}>
                      <p className={styles.shoeIndex}>#{index + 1}</p>
                      <p className={styles.shoeBrand}>
                        {brandKR.get(item.brand)}
                      </p>
                      <p className={styles.shoeTitle}>
                        {item.shoe.length < 10
                          ? item.shoe
                          : item.shoe.slice(0, 10) + "..."}
                      </p>
                      <div className={styles.shoeLike}>
                        <img src={heartIcon} alt="heartIcon" />
                        <p>{item.like}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

export function loader() {
  return defer({
    futsalData: loadFutsalShoes(),
  });
}

async function loadFutsalShoes() {
  const futsalData = await getAllFutsal();
  if (!Array.isArray(futsalData)) {
    return json(
      { message: "풋살화 데이터를 불러올 수 없습니다." },
      { status: 500 }
    );
  }
  futsalData.sort((a, b) => b.like - a.like);
  return futsalData;
}
