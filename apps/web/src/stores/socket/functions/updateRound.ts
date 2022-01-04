import { socket } from "../index";

export default function updateRound(round: string, id: string){
    socket.emit("UPDATE ROUND", round, id)
}