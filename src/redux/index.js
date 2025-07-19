import { configureStore } from "@reduxjs/toolkit";
import shoeInformSlice from "./shoeInform";

// 앱 시작 시 localStorage에 저장된 Redux 상태를 불러오는 함수
function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("reduxState");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

//Redux 상태를 문자열(JSON)로 변환하여 localStorage에 저장
function saveToLocalStorage(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (e) {
    // ignore write errors
    console.log(e);
  }
}

const store = configureStore({
  reducer: {
    shoeInform: shoeInformSlice.reducer,
  },
  //preloadedState로 위에서 가져온 localStorage의 상태를 전달
  preloadedState: loadFromLocalStorage(),
});

//Redux 상태가 바뀔 때마다 현재 상태를 localStorage에 자동 저장
store.subscribe(() => {
  saveToLocalStorage(store.getState());
});

export default store;
