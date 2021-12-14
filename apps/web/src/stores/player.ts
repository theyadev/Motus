import { ref } from "vue";
import Player from "../../../../packages/Classes/Player";

const player = ref<Player>();

export default function usePlayer() {
  function updatePlayer(newPlayer: Player) {
    player.value = newPlayer;
  }
  return {
    player: player.value,
    updatePlayer,
  };
}
