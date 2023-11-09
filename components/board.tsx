"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { BadgeMinus, BadgePlus, Columns, Trash2Icon, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { v4 as uuidv4v4 } from "uuid";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  BoardProviderState,
  Column,
  Task,
  columnstate,
  useBoard,
} from "./board-provider";
import { Button } from "./ui/button";
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
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export default function Board() {
  const { columns, setColumns } = useBoard();
  const val = useBoard();
  console.log(val, "");

  const [addFunctionCalled, setAddFunctionCalled] = useState({
    state: false,
    itemId: "",
  });
  const [inputColumnName, setInputColumnName] = useState("");
  // on drag
  const onDragEnd = useCallback(
    (result: DropResult, { columns, setColumns }: BoardProviderState) => {
      if (!result.destination) return;
      const { source, destination } = result;

      if (source.droppableId !== destination.droppableId) {
        const sourceColumn = columns[source.droppableId];
        const destColumn = columns[destination.droppableId];
        const sourceItems = [...sourceColumn.items];
        const destItems = [...destColumn.items];
        const [removed] = sourceItems.splice(source.index, 1);
        destItems.splice(destination.index, 0, removed);
        destItems[destination.index].state = destColumn.name;

        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems,
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems,
          },
        });
      } else {
        const column = columns[source.droppableId];
        const copiedItems = [...column.items];
        const [removed] = copiedItems.splice(source.index, 1);
        copiedItems.splice(destination.index, 0, removed);
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...column,
            items: copiedItems,
          },
        });
      }
    },
    []
  );

  // add task
  const handleAdd = useCallback(
    (columnId: string) => {
      const items = columns[columnId].items;
      const newItemId = uuidv4v4();
      const newItems: Task[] = [
        {
          title: "",
          id: newItemId,
          state: columns[columnId].name,
          activityDate: "",
          assignedTo: "",
          comments: [""],
          tags: [""],
        },
        ...items,
      ];

      setColumns({
        ...columns,
        [columnId]: {
          ...columns[columnId],
          items: newItems,
        },
      });
      setAddFunctionCalled({ state: true, itemId: newItemId });
    },
    [columns]
  );

  // delete task
  const handleDelete = useCallback(
    (item: Task, column: Column, columnId: string) => {
      setColumns({
        ...columns,
        [columnId]: {
          ...column,
          items: columns[columnId].items.filter((i) => i.id != item.id),
        },
      });
    },
    [columns]
  );

  // focus the input field
  useEffect(() => {
    if (addFunctionCalled.state === true) {
      const input: HTMLInputElement | null = document.querySelector(
        `textarea[name="${addFunctionCalled.itemId}"]`
      );
      input?.focus();
    }
  }, [addFunctionCalled]);

  // add column
  const handleAddColumn = () => {
    if (inputColumnName != "") {
      const columnId = uuidv4v4();
      const newColumn: Column = { name: inputColumnName, items: [] };
      setColumns({ ...columns, [columnId]: newColumn });
    }
  };

  // remove column
  const handleRemoveColumn = (columnId: string) => {
    if (Object.hasOwn(columns, columnId)) {
      delete columns[columnId];
      setColumns(columns);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center">
      <div className="flex gap-2 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add Column</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Column</DialogTitle>
              <DialogDescription>
                Enter the column name to add.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Column name"
                  value={inputColumnName}
                  onChange={(e) => setInputColumnName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  onClick={handleAddColumn}
                  className="w-20"
                  type="submit"
                >
                  Add
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-wrap">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, { columns, setColumns })}
        >
          {Object.entries(columns)?.map(([columnId, column]) => {
            return (
              <div className="mr-3 flex flex-col mb-2" key={columnId}>
                <Card className="w-full rounded-bl-none rounded-br-none shadow-none border bg-background text-center">
                  <CardDescription className="flex select-none justify-between px-4 py-2">
                    <span>{column.name}</span>

                    <div className="flex gap-1">
                      <button className="cursor-pointer transition-all duration-200 hover:text-primary ">
                        <BadgePlus
                          size={20}
                          onClick={() => handleAdd(columnId)}
                        />
                      </button>
                      <button className="cursor-pointer transition-all duration-200 hover:text-primary ">
                        <X
                          size={20}
                          onClick={() => handleRemoveColumn(columnId)}
                        />
                      </button>
                    </div>
                  </CardDescription>
                </Card>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`h-[400px] w-56 overflow-y-auto overflow-x-hidden rounded-bl-xl rounded-br-xl bg-secondary ${
                          snapshot.isDraggingOver
                            ? "bg-primary"
                            : "bg-primary-foreground"
                        } `}
                      >
                        {column?.items?.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => {
                                return (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{ ...provided.draggableProps.style }}
                                    className="m-2 border-secondary p-2 hover:cursor-default"
                                  >
                                    <CardContent className="flex flex-col items-center justify-center gap-3 ">
                                      <Textarea
                                        name={item.id}
                                        id={item.id}
                                        className="resize-none overflow-hidden border-none shadow-none hover:shadow hover:cursor-default
                                       hover:overflow-auto hover:ring-1 ring-muted focus-visible:cursor-text focus-visible:ring-1 "
                                        placeholder="Task title"
                                        ref={provided.innerRef}
                                        value={item.title}
                                        onChange={(e) => {
                                          const items = columns[columnId].items;
                                          setColumns({
                                            ...columns,
                                            [columnId]: {
                                              ...column,
                                              items: items.map((data) => {
                                                if (data.id === item.id) {
                                                  data.title = e.target.value;
                                                }
                                                return data;
                                              }),
                                            },
                                          });
                                        }}
                                      />
                                      <div className="flex w-full items-end justify-end gap-2">
                                        <Badge
                                          variant={"secondary"}
                                          className={
                                            item.state ===
                                            columnstate.In_progress
                                              ? `bg-blue-300 hover:bg-blue-300 dark:bg-blue-500`
                                              : // : item.state ===
                                              //   columnstate.In_review
                                              // ? `bg-orange-300 hover:bg-orange-300 dark:bg-orange-200`
                                              // :
                                              item.state === columnstate.Done
                                              ? `bg-green-300 hover:bg-green-300 dark:bg-green-500`
                                              : ``
                                          }
                                        >
                                          {item.state}
                                        </Badge>
                                        <Trash2Icon
                                          onClick={() =>
                                            handleDelete(item, column, columnId)
                                          }
                                          size={20}
                                          className="cursor-pointer text-secondary-foreground 
                                              hover:text-destructive"
                                        />
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
