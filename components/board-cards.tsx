import Board from "./board";

const list = [
  {
    name: "board 1",
    description: "border one des",
  },
  {
    name: "board 2",
    description: "border two des",
  },
  {
    name: "board 3",
    description: "border three des",
  },
];

export default function BoardList() {
  return (
    <div className="flex w-full items-center justify-center">
      <Board />
    </div>
  );
}
