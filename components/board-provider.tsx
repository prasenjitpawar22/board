"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { v4 as uuidv4v4 } from "uuid";

export enum columnstate {
  In_progress = "In progress",
  Done = "Done",
  To_do = "To do",
}

export type TColumn = {
  name: columnstate | string;
  items: Task[];
};

export type TColumns = {
  [x: string]: TColumn;
};

export type Task = {
  id: string;
  title: string;
  assignedTo: string;
  state: columnstate | string;
  tags: string[];
  activityDate: string;
  comments: string[];
};

// board type
export type Board = {
  id: string;
  name: string;
  columns: TColumns;
};

type BoardProviderProps = {
  children: ReactNode;
  defaultBoard?: Board[];
  storageKey?: string;
};

export type BoardProviderState = {
  boards: Board[];
  setBoards: (board: Board[]) => void;
};

const initialState: BoardProviderState = {
  boards: [
    {
      id: uuidv4v4(),
      name: "Default board",
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
    },
  ],
  setBoards: () => null,
};

const BoardProviderContext = createContext<BoardProviderState>(initialState);

export function BoardProvider({
  children,
  defaultBoard = initialState.boards,
  storageKey = "todo-next-ui-board",
  ...props
}: BoardProviderProps) {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    const localBoards = localStorage.getItem(storageKey);
    if (localBoards) {
      const boards: Board[] = JSON.parse(localBoards);
      boards.length !== 0 ? setBoards(boards) : setBoards(defaultBoard);
    } else {
      setBoards(defaultBoard);
    }
  }, []);

  const value = {
    boards,
    setBoards: (boards: Board[]) => {
      localStorage.setItem(storageKey, JSON.stringify(boards));
      setBoards(boards);
    },
  };

  return (
    <BoardProviderContext.Provider {...props} value={value}>
      {children}
    </BoardProviderContext.Provider>
  );
}

export const useBoard = () => {
  const context = useContext(BoardProviderContext);

  if (context === undefined)
    throw new Error("use Task must be used within a TaskProvider");

  return context;
};
