"use client";

import Board from "@/components/board";
import BoardList from "@/components/board-cards";
import { useBoard } from "@/components/board-provider";

export default function Home() {
  const { boards } = useBoard();

  return (
    <main className="w-full flex items-center justify-center">
      {boards.map((d, i) => (
        <Board key={i} id={d.id} boardColumns={d.columns} />
      ))}
    </main>
  );
}
