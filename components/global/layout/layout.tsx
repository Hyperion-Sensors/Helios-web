import React, { useContext, useEffect, useReducer, useState } from "react";

/*-----------------Libraries------------------- */
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

/*-----------------Components------------------- */
import Navbar from "../navbar/navbar"; // Page selection panel on the left edge of the screen
import SidePanel from "@/Global/side_panel"; //includes asset selection menu, main asset summary, and substation summary

/*-----------------Context------------------- */
import { AppContext } from "@/Context/app_context";
import { get_user_settings } from "hooks/endpoints/settings_services";
import axios from "axios";
import MessageScreen from "./message_screen";
import { useSettings } from "@/Queries/settings_queries";
import HeliosIcon from "../icons";

const Layout = ({ children }, props) => {
  /*----------------------------App Context Retrieval----------------------------- */

  const { sidePanelVisible, toggleSidePanelVisible, sidePanelButtonVisible } =
    useContext(AppContext);

  /*----------------------------Session Retrieval----------------------------- */

  const { data: session } = useSession();

  /*----------------------------Upon Refresh tech Window Size----------------------------- */
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Update the window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this useEffect runs once when the component mounts

  const {
    isLoading,
    error,
    data: settings,
    isFetching,
    //@ts-ignore
  } = useSettings(session.user.id);

  //set the side panel to the default position on each page

  if (isLoading || isFetching)
    setTimeout(() => {
      return (
        <MessageScreen
          message={"Loading User Settings"}
          image={"/photon.gif"}
        />
      );
    }, 2000);

  if (error) {
    return (
      <MessageScreen
        message={"Error Fetching Settings"}
        image={"/photon.gif"}
      />
    );
  }

  return (
    <>
      {windowWidth <= 1000 ? ( // if window width is less than 1000px, display message
        <div className="">
          <MessageScreen
            message={
              "We apologize for the inconvenience. At this time, a mobile-optimized view is not available for our platform. Our development team is actively working on implementing this feature to enhance your user experience. "
            }
            image={"/photon.gif"}
          />
        </div>
      ) : (
        <div
          id="Container"
          data-theme="lightTheme"
          className="flex flex-col h-screen relative overflow-hidden "
        >
          <aside
            id="Navbar"
            className="absolute left-0 z-30 md:w-[3.5vw] hover:w-[10vw] h-full ease-in-out transition-all group group/aside"
          >
            <Navbar name={session.user.firstName || ""} />
          </aside>
          <main className="flex flex-row w-full h-full bg-base-100">
            <div
              id="Side Panel"
              className={`${
                sidePanelVisible && sidePanelButtonVisible ? "block" : "hidden"
              } basis-1/12 xl:basis-2/12 relative bg-primary ml-[3.5vw]  border-r border-secondary/10 transition-translate-x-full duration-500`}
            >
              <SidePanel />
            </div>{" "}
            <div
              id="Page Container"
              className={`${
                sidePanelVisible && sidePanelButtonVisible
                  ? "basis-11/12 xl:basis-10/12"
                  : "pl-[3.5vw]"
              } transition-all duration-300 ease-out flex w-full max-h-screen overflow-x-hidden overflow-y-scroll `}
            >
              {children}
            </div>
          </main>
          <footer
            id="Footer"
            className="fixed inset-x-0 bottom-0 border-b-2 border-accent bg-accent/10 "
          >
            <div className=" flex flex-row right-2 justify-end items-center w-full text-sm ">
              <span>Hyperion Sensors Inc. 2023</span>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Layout;
