import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import styles from "./Add.module.css";
import { addFutsalImg, addFutsalShoes } from "../../data/supabaseClient";
import { useNavigate } from "react-router-dom";

const BRANDS = [
  { label: "나이키", value: "Nike" },
  { label: "아디다스", value: "Adidas" },
  { label: "푸마", value: "Puma" },
  { label: "미즈노", value: "Mizuno" },
  { label: "키카", value: "Kika" },
  { label: "아식스", value: "Asics" },
  // { label: "뉴발란스", value: "NB" },
  { label: "기타", value: "Etc" },
];

export default function Add({ setModalVisible }) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState(BRANDS[0].value);
  const [imgfile, setImgFile] = useState(null);
  const navigate = useNavigate();

  const nameInputRef = useRef(null);
  const brandInputRef = useRef(null);
  const fileInputRef = useRef(null);

  function handleDivClick() {
    fileInputRef.current.click();
  }

  function handleFileChange(e) {
    const inputFile = e.target.files[0];
    if (inputFile) {
      setImgFile(inputFile);
    }
  }

  function handleBrand(e) {
    const newValue = e.value;
    setBrand(newValue);
  }

  function handleCancel() {
    setModalVisible(false);
  }

  async function handleAdd() {
    if (name === "") {
      nameInputRef.current.focus();
      return;
    }
    if (brand === "") {
      brandInputRef.current.focus();
      return;
    }
    if (imgfile === null) {
      alert("이미지 파일을 추가해주세요");
      return;
    }
    const imgUrl = await addFutsalImg(imgfile);
    let existCheck = await addFutsalShoes(name, brand, imgUrl);
    if (existCheck === "exist") {
      alert("이미 존재하는 풋살화입니다.");
      return;
    } else {
      setModalVisible(false);
      navigate("/");
    }
  }
  return (
    <motion.div
      className={styles.AddWrapper}
      variants={{
        hidden: { opacity: 0, x: "90%", y: "0%" },
        visible: { opacity: 1, x: "90%", y: "20%" },
      }}
      initial="hidden"
      animate="visible"
      exit="hidden"
      open
    >
      <p className={styles.AddModalTitle}>풋살화 추가하기</p>
      <div className={styles.AddNameWrapper}>
        <p className={styles.ShoeNameLabel}>제품명</p>
        <input
          ref={nameInputRef}
          type="text"
          className={styles.ShoeNameInput}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className={styles.AddNameWrapper}>
        <p className={styles.ShoeNameLabel}>브랜드</p>
        <Select
          options={BRANDS}
          defaultValue={BRANDS[0]}
          onChange={handleBrand}
          styles={{
            control: (styles) => ({
              ...styles,
              height: "50px",
              fontWeight: "bold",
              fontFamily: "Quicksand, sans-serif",
            }),
            option: (styles) => ({
              ...styles,
              fontWeight: "bold",
              fontFamily: "Quicksand, sans-serif",
            }),
          }}
        />
      </div>
      <div className={styles.AddImgWrapper}>
        <p className={styles.ShoeNameLabel}>이미지</p>
        <div className={styles.ShoeImgAddBtnWrapper}>
          <div className={styles.ShoeImgBtn} onClick={handleDivClick}>
            추가하기
          </div>
          {imgfile && <div className={styles.ShoeImgLink}>{imgfile.name}</div>}
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className={styles.Buttons}>
        <div className={styles.ShoeImgCancelBtn} onClick={handleCancel}>
          취소
        </div>
        <div className={styles.ShoeImgAddBtn} onClick={handleAdd}>
          풋살화 추가
        </div>
      </div>
    </motion.div>
  );
}
