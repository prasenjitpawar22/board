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

export type Column = {
  name: columnstate | string;
  items: Task[];
};

export type Columns = {
  [x: string]: Column;
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
  const [columns, setColumns] = useState<Columns>({});

  useEffect(() => {
    const localColumns = localStorage.getItem(storageKey);
    if (localColumns) {
      const columns: Columns = JSON.parse(localColumns);
      Object.keys(columns).length !== 0
        ? setColumns(columns)
        : setColumns(defaultBoard);
    } else {
      setColumns(defaultBoard);
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
