/*------------------------Components------------------------- */
import pages from "./navbar_data.json";
import NavItem from "./navbar_item";

type Props = {};

export function MainPages({}: Props) {
  let main_pages = pages["main-pages"].map((p, index) => {
    //use map function to turn array of the main application pages (main_page_data.json) into list components

    //if the current page is the same as the page id, then add the border to the left and right of the page. Right div to avoid icon potisioning issues
    return (
      <NavItem
        key={p + String(index)}
        page_title={p.title}
        page_id={p.id}
        page_link={p.link}
        icon_class={p.icon_class}
        icon_type={p.icon_type}
        icon_scale={String(p.scale)}
      />
    );
  });
  return <ul className="list-outside space-y-10">{main_pages}</ul>;
}

export function UserPages({}: Props) {
  let user_pages = pages["user-pages"].map((p, index) => {
    //use map function to turn array of the main application pages (main_page_data.json) into list components

    //if the current page is the same as the page id, then add the border to the left and right of the page. Right div to avoid icon potisioning issues
    return (
      <NavItem
        key={p + String(index)}
        page_title={p.title}
        page_id={p.id}
        page_link={p.link}
        icon_class={p.icon_class}
        icon_type={p.icon_type}
        icon_scale={String(p.scale)}
      />
    );
  });
  return <ul className="list-outside space-y-10">{user_pages}</ul>;
}
