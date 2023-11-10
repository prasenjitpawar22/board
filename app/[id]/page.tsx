import { BoardWrapper } from "@/components/board";

export default function Page({ params }: { params: { id: string } }) {
  return <BoardWrapper id={params.id} />;
}
