"use client";

type Props = {
  className?: string;
};

export default function SofinHeaderModel({className}: Props) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[30px] border border-white/40 bg-white/30 shadow-[0_20px_60px_rgba(10,32,71,0.10)] backdrop-blur-[18px]",
        className ?? ""
      ].join(" ")}
    />
  );
}