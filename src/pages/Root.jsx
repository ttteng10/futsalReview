import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { useState } from "react";
import Add from "../components/Add/Add";

export default function RootLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Header setModalVisible={setModalVisible} />
      {modalVisible && <Add setModalVisible={setModalVisible} />}
      <main>
        <Outlet />
      </main>
    </>
  );
}
