"use client";

import { v4 as uuidv4v4 } from "uuid";
import { useState } from "react";
import Link from "next/link";
import { TBoard, columnstate, useBoard } from "./board-provider";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { ChangeEvent, useCallback } from "react";

export default function BoardList() {
  const { boards } = useBoard();

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center">
      <div className="flex gap-2 w-full">
        <AddBoardButton />
      </div>
      <div className="flex flex-wrap w-full gap-4">
        {boards.map((board, i) => (
          <Link key={i} href={board.id}>
            <Card key={i} className="w-52 h-28 overflow-y-auto">
              <CardHeader>
                <CardTitle> {board.id.substring(0, 7)} </CardTitle>
                <CardDescription> {board.name}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export const AddBoardButton = () => {
  const { boards, setBoards } = useBoard();

  const [inputBoardName, setInputBoardName] = useState<string>("");
  function handleAddBoard() {
    const newBoard: TBoard = {
      id: uuidv4v4(),
      name: inputBoardName,
      columns: {
        [uuidv4v4()]: {
          name: columnstate.To_do,
          items: [],
        },
        [uuidv4v4()]: {
          name: columnstate.In_progress,
          items: [],
        },
        [uuidv4v4()]: {
          name: columnstate.Done,
          items: [],
        },
      },
    };

    const updateBoard = [...boards, newBoard];

    setBoards(updateBoard);
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Board</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add board</DialogTitle>
          <DialogDescription>Enter the board name to add.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Board name"
              value={inputBoardName}
              onChange={useCallback(
                (e: ChangeEvent<HTMLInputElement>) =>
                  setInputBoardName(e.target.value),
                []
              )}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAddBoard} className="w-20" type="submit">
              Add
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
