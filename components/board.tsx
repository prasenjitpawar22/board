"use client";

import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { BadgePlus, Trash2Icon } from "lucide-react";
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

export default function Board() {
  const { columns, setColumns } = useBoard();
  const [addFunctionCalled, setAddFunctionCalled] = useState({
    state: false,
    itemId: "",
  });

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
      console.log({ columnId });

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
      console.log({ newItems }, "as");

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

  useEffect(() => {
    console.log(columns, "changed");
  }, [columns]);

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

  return (
    <div className="flex w-full items-center justify-center">
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, { columns, setColumns })}
      >
        {Object.entries(columns)?.map(([columnId, column]) => {
          return (
            <div className="mr-3 flex flex-col" key={columnId}>
              <Card className="w-full rounded-bl-none rounded-br-none shadow-none border bg-background text-center">
                <CardDescription className="flex select-none justify-between px-4 py-2">
                  <span>{column.name}</span>
                  <span className="cursor-pointer transition-all duration-200 hover:text-primary ">
                    <BadgePlus onClick={() => handleAdd(columnId)} />
                  </span>
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
                                          item.state === columnstate.In_progress
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
  );
}
