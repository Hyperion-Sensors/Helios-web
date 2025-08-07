/*-----------------------------------Library Imports--------------------------------- */
import React from "react";
import Link from "next/link";
import HeliosIcon from "../icons";

/*-----------------------------------Auth--------------------------------- */
import { signOut } from "next-auth/react";

type Props = {
  item_name: string;
  icon_class: string;
  icon_type: string;
};

function DropdownItem({ item_name, icon_class, icon_type }: Props) {
  return (
      <li className="flex flex-row px-4 py-2 bg-primary hover:bg-neutral">
        <div className="w-5 h-5">
          <HeliosIcon
            icon_class={icon_class}
            icon_type={icon_type}
            color={"stroke-secondary"}
            stroke={"stroke-1"}
          />
        </div>

        <p className="w-2/3">{item_name}</p>
      </li>
  );
}

function HeaderDropdown() {
  return (
    <>
      <ul
        className="py-1 text-sm text-secondary w-32 rounded-md bg-primary border border-neutral shadow-lg z-10"
        aria-labelledby="dropdownDefault"
      >
        <Link href="/settings">
          <DropdownItem
          item_name={"Settings"}
          icon_class="gear"
          icon_type="basic"
          />
        </Link>

        <hr className="border border-accent-light mx-1" />
        <div onClick={() => signOut({callbackUrl: '/'})}>
          <DropdownItem
          item_name={"Sign-Out"}
          icon_class="auth"
          icon_type="logout"
        />
        </div>
        
      </ul>
    </>
  );
}

export default HeaderDropdown;
