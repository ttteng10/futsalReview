import {
  Await,
  defer,
  json,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import styles from "./Tip.module.css";
import { Suspense, useState, useRef } from "react";
import { addTip, getAllTips } from "../../data/supabaseClient";
import { AddTip } from "../../components/Add/Add";

export default function Tip() {
  const navigate = useNavigate();
  const { tipData } = useLoaderData();
  const [comment, setComment] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const commentRef = useRef();
  function handleAddTip() {
    setModalVisible(true);
  }
  return (
    <div className={styles.TipWrapper}>
      <div className={styles.TipHeader}>
        <p className={styles.TipHeaderTitle}>추천 & 팁 게시판</p>
        <p className={styles.TipHeaderSubTitle}>
          풋살화 추천, 고르는 팁, 구매 사이트 등 다양한 정보 공유해주세요
        </p>
      </div>
      <div className={styles.TipContentWrapper}>
        <div className={styles.reviewInputWrapper}>
          <div className={styles.reviewInputBox}>
            {modalVisible && <AddTip setModalVisible={setModalVisible} />}
          </div>
          <div className={styles.reviewBtn} onClick={handleAddTip}>
            리뷰 추가
          </div>
        </div>
        <div className={styles.CommentHeader}>
          <div className={styles.CommentDay}>날짜</div>
          <div className={styles.CommentTip}>추천 & 팁</div>
        </div>
        <Suspense fallback={<p>댓글 로딩 중...</p>}>
          <Await resolve={tipData}>
            {(tips) => (
              <div className={styles.reviewsWrapper}>
                {tips.map((item) => (
                  <div className={styles.reviewDiv} key={item.id}>
                    <div className={styles.RecommandTipDay}>
                      {new Date(item.created_at)
                        .toLocaleDateString("ko-KR")
                        .slice(2)}
                    </div>
                    <div className={styles.RecommandTip}>{item.tip}</div>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export function loader() {
  return defer({
    tipData: loadFutsalTips(),
  });
}

async function loadFutsalTips() {
  const tipData = await getAllTips();
  if (!Array.isArray(tipData)) {
    return json(
      { message: "풋살화 데이터를 불러올 수 없습니다." },
      { status: 500 }
    );
  }
  tipData.sort((a, b) => b.created_at - a.created_at);
  return tipData;
}
