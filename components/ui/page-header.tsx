import BoardToggle from "../board-toggle";
import ModeToggle from "../display-mode-toggle";

export default function Header() {
  return (
    <div className="w-full flex">
      <div className="flex justify-between w-full items-center">
        <BoardToggle />
        <ModeToggle />
      </div>
    </div>
  );
}
