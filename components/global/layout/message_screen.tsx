import Image from "next/image";

type Props = {
  message: string;
  image: string;
};

export default function MessageScreen({ message, image }: Props) {
  return (
    <div className="w-full h-full flex flex-row justify-center items-center gap-6">
      {" "}
      <div className="h-32 w-52 relative">
        {" "}
        <Image
          src={image}
          fill={true}
          alt={""}
          className="rounded-md opacity-60"
        />
      </div>
      <span>
        <span className="text-md font-bold">Sorry...</span>
        <br /> <span className="text-sm">{message}</span>
      </span>
    </div>
  );
}
