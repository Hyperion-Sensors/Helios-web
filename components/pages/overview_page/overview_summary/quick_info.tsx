import { format } from "date-fns";

type Props = {
  times: { id: number; time: string; fiber_id: number }[];
  open: boolean;
};

const Greeting = (props: Props) => {
  return (
    <>
      <div
        className={`mb-3 w-full border-accent-light pl-2 text-[0.6rem] 2xl:text-xs`}
      >
        <div
          className={` flex-row justify-center hidden ${
            props.open ? "" : "block"
          } `}
        >
          <span className={`  text-text font-bold`}>Expand ...</span>
        </div>
        {/*Current Time*/}
        <div className="flex flex-row justify-between ">
          <span className="   font-medium">{"Current Time "}</span>
          <span className="  text-text font-bold">
            {format(new Date(), "HH:mm:ss")}
          </span>
        </div>
        {/*Last Login*/}
        <div className="flex flex-row justify-between ">
          <span className="    font-medium">{"Last Login "}</span>
          <span className="  font-bold text-text">
            {format(new Date(), "MM/dd/HH:mm")}
          </span>
        </div>
        {/*Last Backup and Refresh Rate Summary*/}
        <div className="flex flex-col basis-1/5 row-span-1 border-accent-light">
          <div className="flex flex-row justify-between mb-1 mt-1">
            <span className="  font-medium">Last Backup</span>
            <span className="flex flex-row justify-center ">
              <span className="  font-bold text-text">
                {format(new Date(), "MM/dd/HH:mm")}
              </span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-3 h-3 stroke-current"
              >
                <path d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </div>
          <div className="flex flex-row justify-between mb-1">
            <span className="  inline-flex font-medium">Refresh</span>

            <div className="flex flex-row justify-center ">
              <span className="  font-bold text-text">1 minute</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-3 h-3 stroke-current"
              >
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />{" "}
              </svg>
            </div>
          </div>
        </div>
        {/* <hr className=" border-1 border-accent-light rounded-md" /> */}
      </div>
    </>
  );
};

export default Greeting;
