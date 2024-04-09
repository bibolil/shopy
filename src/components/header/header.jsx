import * as React from "react";
import { Menubar } from "primereact/menubar";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/state/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { PrimeIcons } from "primereact/api";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && (
        <Badge className="ml-auto" severity="success" value={item.badge} />
      )}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </a>
  );
  const items = [
    {
      label: "Home",
      icon: "pi pi-home",
    },
    {
      label: "Groceries",
      icon: PrimeIcons.SHOPPING_BAG,
      command: () => {
        navigate("/groceries");
      },
    },
  ];

  const start = (
    <img
      alt="logo"
      src="src/assets/logo-no-background.png"
      width="90"
      className="mr-2"
    ></img>
  );
  const items2 = [
    {
      label: "Profile",
      items: [
        {
          label: "Settings",
          icon: "pi pi-cog",
        },
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: () => {
            console.log("i clicked on logout");
            dispatch(setCredentials(null));
          },
        },
      ],
    },
  ];
  const menuRight = React.useRef(null);
  const end = (
    <div className="flex justify-center items-center gap-6">
      <a>About</a>

      <a>Contact</a>
      <a
        className="pi pi-shopping-cart p-overlay-badge"
        style={{ fontSize: "1.4rem" }}
      >
        <Badge value="2" severity="success"></Badge>
      </a>
      <Menu
        model={items2}
        popup
        ref={menuRight}
        id="popup_menu_right"
        popupAlignment="right"
      />
      <Avatar
        image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
        shape="circle"
        className=""
        onClick={(event) => menuRight.current.toggle(event)}
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
