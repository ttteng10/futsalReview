import {
  Await,
  defer,
  json,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import styles from "./Detail.module.css";
import {
  getFutsalById,
  incrementLike,
  decrementLike,
  addDetailComment,
  getCommentById,
} from "../../data/supabaseClient";
import { Suspense, useRef, useState, useEffect } from "react";
import Loading from "../../components/Loading/Loading";

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

export default function Detail() {
  const { detailData, commentData } = useLoaderData();
  const [likeState, setLikeState] = useState(false);
  const [comment, setComment] = useState("");
  const commentRef = useRef();
  const navigate = useNavigate();
  useEffect(() => {
    const pathname = window.location.pathname;
    const id = pathname.split("/").pop();
    const liked = localStorage.getItem(`liked-${id}`);
    if (liked === "true") {
      setLikeState(true);
    }
  }, []);
  async function handleIncrement(id) {
    setLikeState(true);
    localStorage.setItem(`liked-${id}`, "true");
    await incrementLike(id);
    navigate(`/home/detail/${id}`);
  }
  async function handleDecrement(id) {
    setLikeState(false);
    localStorage.removeItem(`liked-${id}`);
    await decrementLike(id);
    navigate(`/home/detail/${id}`);
  }
  async function handleAddReview(id) {
    if (comment !== "") {
      await addDetailComment(id, comment);
      setComment("");
      navigate(`/home/detail/${id}`);
    } else {
      commentRef.current.focus();
    }
  }
  return (
    <Suspense fallback={<Loading />}>
      <Await resolve={detailData}>
        {(detailShoe) => (
          <div className={styles.detailWrapper}>
            <div className={styles.detailContent}>
              <div className={styles.informWrapper}>
                <img
                  src={detailShoe.img}
                  alt="풋살화이미지"
                  className={styles.shoeImg}
                />
                <div className={styles.informs}>
                  <p className={styles.shoeName}>{detailShoe.shoe}</p>
                  <div className={styles.brandWrapper}>
                    <p className={styles.brandLabel}>브랜드 :</p>
                    <p className={styles.brand}>
                      {brandKR.get(detailShoe.brand)}
                    </p>
                  </div>
                  <div className={styles.informTexts}>
                    <p className={styles.informText}>풋살화를 추천하신다면</p>
                    <p className={styles.informText}>
                      추천 버튼 또는 리뷰를 남겨주세요
                    </p>
                  </div>
                  <div className={styles.likeWrapper}>
                    <p className={styles.likeLabel}>추천 :</p>
                    <p className={styles.like}>{detailShoe.like}</p>
                    <div
                      className={
                        !likeState ? styles.likeBtn : styles.activelikeBtn
                      }
                      onClick={
                        !likeState
                          ? () => handleIncrement(detailShoe.id)
                          : () => handleDecrement(detailShoe.id)
                      }
                    >
                      {likeState ? "추천취소" : "추천하기"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.reviewWrapper}>
              <p className={styles.reviewTitle}>Review</p>
              <div className={styles.reviewInputWrapper}>
                <div className={styles.reviewInputBox}>
                  <input
                    type="text"
                    placeholder="리뷰 남겨주세요"
                    className={styles.reviewInput}
                    maxLength={100}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    ref={commentRef}
                  />
                  <p className={styles.inputLen}>{comment.length} / 100</p>
                </div>
                <div
                  className={styles.reviewBtn}
                  onClick={() => handleAddReview(detailShoe.id)}
                >
                  리뷰 추가
                </div>
              </div>
              <Suspense fallback={<p>댓글 로딩 중...</p>}>
                <Await resolve={commentData}>
                  {(comments) => (
                    <div className={styles.reviewsWrapper}>
                      {comments.map((item) => (
                        <div className={styles.reviewDiv} key={item.id}>
                          {item.comment}
                        </div>
                      ))}
                    </div>
                  )}
                </Await>
              </Suspense>
            </div>
          </div>
        )}
      </Await>
    </Suspense>
  );
}

export function loader({ params }) {
  const shoeId = params.id;
  return defer({
    detailData: loadDetailData(shoeId),
    commentData: loadCommentData(shoeId),
  });
}

async function loadDetailData(shoeId) {
  const shoeData = await getFutsalById(shoeId);
  if (shoeData === null) {
    return json(
      {
        message: "데이터를 불러올 수 없습니다",
      },
      { status: 500 }
    );
  }
  return shoeData;
}

async function loadCommentData(shoeId) {
  const commentData = await getCommentById(shoeId);
  if (commentData === null) {
    return json(
      {
        message: "데이터를 불러올 수 없습니다",
      },
      { status: 500 }
    );
  }
  return commentData;
}
