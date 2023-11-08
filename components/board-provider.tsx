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
  //   In_review = "Procrastinating",
}

export type Column = {
  name: columnstate;
  items: Task[];
};

export type Columns = {
  [x: string]: Column;
};

export type Task = {
  id: string;
  title: string;
  assignedTo: string;
  state: columnstate;
  tags: string[];
  activityDate: string;
  comments: string[];
};

type BoardProviderProps = {
  children: ReactNode;
  defaultBoard?: Columns;
  storageKey?: string;
};

export type BoardProviderState = {
  columns: Columns;
  setColumns: (columns: Columns) => void;
};

const initialState: BoardProviderState = {
  columns: {
    [uuidv4v4()]: {
      name: columnstate.To_do,
      items: [],
    },
    [uuidv4v4()]: {
      name: columnstate.In_progress,
      items: [],
    },
    // [uuidv4v4()]: {
    //   name: columnstate.In_review,
    //   items: [],
    // },
    [uuidv4v4()]: {
      name: columnstate.Done,
      items: [],
    },
  },
  setColumns: () => null,
};

const BoardProviderContext = createContext<BoardProviderState>(initialState);

export function BoardProvider({
  children,
  defaultBoard = initialState.columns,
  storageKey = "todo-next-ui-board",
  ...props
}: BoardProviderProps) {
  // const [columns, setColumns] = useState<Columns>(() => {
  //   const columns = localStorage.getItem(storageKey);

  //   if (columns === "" || columns === null) return defaultBoard;
  //   return JSON.parse(columns);
  // });
  const [columns, setColumns] = useState<Columns>(defaultBoard);

  useEffect(() => {
    const columns = localStorage.getItem(storageKey);
    if (columns === "" || columns === null) setColumns(defaultBoard);
    else {
      setColumns(JSON.parse(columns));
      console.log(JSON.parse(columns), "in usestate");
    }
  }, []);

  const value = {
    columns,
    setColumns: (columns: Columns) => {
      localStorage.setItem(storageKey, JSON.stringify(columns));
      setColumns({ ...columns });
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
