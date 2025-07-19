import styles from "./Pick.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import homePage from "../../assets/images/homePage.png";
import detailPage from "../../assets/images/detailPage.png";
import addModal from "../../assets/images/addModal.png";
import tipPage from "../../assets/images/tipPage.png";
import backgroundVideo from "../../assets/video/futsalVideo.mp4";
import { useNavigate } from "react-router-dom";

const explainBox = [
  {
    image: homePage,
    description: "내 풋살화의 순위와 리뷰를 확인하세요",
  },
  {
    image: detailPage,
    description: "다른 사람에게 풋살화를 추천하고 리뷰를 남겨주세요",
  },
  {
    image: addModal,
    description: "찾으시는 풋살화가 없다면 직접 추가할 수 있습니다.",
  },
  {
    image: tipPage,
    description: "풋살화에 관련된 정보를 공유해주세요",
  },
];

export default function Pick() {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };
  function handleNav() {
    navigate("/home");
  }
  return (
    <div className={styles.PickWrapper}>
      <video className={styles.backgroundVideo} autoPlay loop muted playsInline>
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <div className={styles.PickContentWrapper}>
        <div className={styles.PickHeader}>
          <p className={styles.PickHeaderTitle}>FootPick</p>
          <p className={styles.PickHeaderSubTitle}>
            가지고 있거나 추천하고 싶은 풋살화를 선택해주세요
          </p>
        </div>
        <div className={styles.PickSliderWrapper}>
          <Slider {...settings}>
            {explainBox.map((item) => (
              <div className={styles.sliderDiv}>
                <img src={item.image} className={styles.sliderImg} />
                <p className={styles.sliderDes}>{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div className={styles.ButtonWrapper}>
          <div className={styles.StartButton} onClick={handleNav}>
            시작하기
          </div>
        </div>
      </div>
    </div>
  );
}
