import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";

function MainLayout() {
  return (
    <div>
      <Header />
      <Outlet />

      <Footer />
    </div>
  );
}

export default MainLayout;
