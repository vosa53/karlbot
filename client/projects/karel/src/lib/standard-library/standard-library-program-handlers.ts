import { InterpretStopToken } from '../interpreter/interpret-stop-token';
import { Exception } from '../interpreter/exception';
import { MutableTown } from '../town/town';
import { TownTile } from '../town/town-tile';
import { Vector } from '../math/vector';
import { TownDirectionUtils } from '../town/town-direction-utils';
import { TownDirection } from '../town/town-direction';
import { ExternalProgramException } from '../interpreter/external-program-exception';

/**
 * Karel 'step' program.
 * @param town Town where the program should be executed.
 * @param actionDelay Delay before the program is executed.
 * @param stopToken Token to stop the program execution.
 */
export async function step(town: MutableTown, actionDelay: number, stopToken: InterpretStopToken): Promise<void | ExternalProgramException> {
    await delay(actionDelay, stopToken);
    const nextPosition = getNextPosition(town);

    if (isLandAt(town, nextPosition.x, nextPosition.y))
        town.karelPosition = nextPosition;
    else
        return new ExternalProgramException("Wall in a way.");
}

/**
 * Karel 'turnLeft' program.
 * @param town Town where the program should be executed.
 * @param actionDelay Delay before the program is executed.
 * @param stopToken Token to stop the program execution.
 */
export async function turnLeft(town: MutableTown, actionDelay: number, stopToken: InterpretStopToken): Promise<void> {
    await delay(actionDelay, stopToken);
    let { x, y } = TownDirectionUtils.toVector(town.karelDirection);
    [x, y] = [y, -x];
    town.karelDirection = TownDirectionUtils.fromVector(x, y);
}

/**
 * Karel 'pick' program.
 * @param town Town where the program should be executed.
 * @param actionDelay Delay before the program is executed.
 * @param stopToken Token to stop the program execution.
 */
export async function pick(town: MutableTown, actionDelay: number, stopToken: InterpretStopToken): Promise<void | ExternalProgramException> {
    await delay(actionDelay, stopToken);
    const currentSignCount = town.getSignCountAt(town.karelPosition.x, town.karelPosition.y);

    if (currentSignCount === 0)
        return new ExternalProgramException("No sign to pick.");
    else
        town.setSignCountAt(town.karelPosition.x, town.karelPosition.y, currentSignCount - 1);
}

/**
 * Karel 'put' program.
 * @param town Town where the program should be executed.
 * @param actionDelay Delay before the program is executed.
 * @param stopToken Token to stop the program execution.
 */
export async function put(town: MutableTown, actionDelay: number, stopToken: InterpretStopToken): Promise<void> {
    await delay(actionDelay, stopToken);
    const currentSignCount = town.getSignCountAt(town.karelPosition.x, town.karelPosition.y);

    town.setSignCountAt(town.karelPosition.x, town.karelPosition.y, currentSignCount + 1);
}

/**
 * Karel 'wall' program.
 * @param town Town where the program should be executed.
 */
export function wall(town: MutableTown): boolean {
    const nextPosition = getNextPosition(town);

    return !isLandAt(town, nextPosition.x, nextPosition.y);
}

/**
 * Karel 'sign' program.
 * @param town Town where the program should be executed.
 */
export function sign(town: MutableTown): boolean {
    const signCount = town.getSignCountAt(town.karelPosition.x, town.karelPosition.y);

    return signCount > 0;
}

/**
 * Karel 'north' program.
 * @param town Town where the program should be executed.
 */
export function north(town: MutableTown): boolean {
    return town.karelDirection === TownDirection.up;
}

/**
 * Karel 'south' program.
 * @param town Town where the program should be executed.
 */
export function south(town: MutableTown): boolean {
    return town.karelDirection === TownDirection.down;
}

/**
 * Karel 'west' program.
 * @param town Town where the program should be executed.
 */
export function west(town: MutableTown): boolean {
    return town.karelDirection === TownDirection.left;
}

/**
 * Karel 'east' program.
 * @param town Town where the program should be executed.
 */
export function east(town: MutableTown): boolean {
    return town.karelDirection === TownDirection.right;
}

/**
 * Karel 'home' program.
 * @param town Town where the program should be executed.
 */
export function isHome(town: MutableTown): boolean {
    return town.karelPosition.x === town.homePosition.x && town.karelPosition.y === town.homePosition.y;
}

function getNextPosition(town: MutableTown): Vector {
    const directionVector = TownDirectionUtils.toVector(town.karelDirection)
    return new Vector(town.karelPosition.x + directionVector.x, town.karelPosition.y + directionVector.y);
}

function isLandAt(town: MutableTown, x: number, y: number): boolean {
    if (x < 0 || y < 0 || x >= town.width || y >= town.height)
        return false;

    const tile = town.getTileAt(x, y);
    return tile === TownTile.land;
}

function delay(milliseconds: number, stopToken: InterpretStopToken): Promise<void> {
    if (milliseconds === 0)
        return Promise.resolve();

    // 'setTimeout' function is not a core Javascript feature,
    // so it does not have to be in all Javascript environments where the Karel library has to run.
    if (setTimeout === undefined && milliseconds !== 0)
        throw new Error("Can not set a non-zero delay when 'setTimeout' function is not defined.");

    return new Promise(resolve => {
        if (stopToken.isStopRequested) {
            resolve();
            return;
        }

        let timeoutHandle = -1;
        const stopTokenListener = () => {
            stopToken.stopRequested.removeListener(stopTokenListener);
            if (timeoutHandle !== -1)
                clearTimeout(timeoutHandle);
            resolve();
        };
        stopToken.stopRequested.addListener(stopTokenListener);

        timeoutHandle = window.setTimeout(() => {
            stopToken.stopRequested.removeListener(stopTokenListener);
            resolve();
        }, milliseconds);
    });
}