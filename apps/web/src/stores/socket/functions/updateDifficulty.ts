import { socket } from "../index";
import Difficulty from "../../../../../../packages/Types/Difficulty";

export default function updateDifficulty(difficulty: string, id: string){
    socket.emit("UPDATE DIFFICULTY", difficulty, id)
}