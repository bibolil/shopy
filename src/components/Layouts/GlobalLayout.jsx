import Header from "../header/header";
import Footer from "../footer/footer";
// import { useCartQuery } from "../../store/state/userApiSlice";
// import { useEffect } from "react";

function GlobalLayout({ order, setOrder, children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <Header order={order} setOrder={setOrder}></Header>
      </div>
      <div className="flex flex-col flex-grow justify-center w-full">
        {children}
      </div>
      <div className="w-full">
        <Footer />
      </div>
    </div>
  );
}

export default GlobalLayout;
