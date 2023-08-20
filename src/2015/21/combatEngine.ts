import { type Character } from './Character.ts';
import { type Player } from './Player.ts';

export function resolveCombat(player: Player, boss: Character): void {
    while (!player.isDead() && !boss.isDead()) {
        player.attack(boss);

        if (boss.isDead()) {
            break;
        }

        boss.attack(player);
    }
}
