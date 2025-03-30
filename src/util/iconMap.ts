import { Icon, State } from '../types.js';

/**
 * This map will map the icon to the todo state char
 */
export const iconMap:Map<State, string> = new Map([
  [State.ALERT, Icon.ALERT],
  [State.BOOKMARK, Icon.BOOKMARK],
  [State.CAKE, Icon.CAKE],
  [State.CHECK, Icon.CHECK],
  [State.DOLLAR, Icon.DOLLAR],
  [State.DOWN, Icon.DOWN],
  [State.UP, Icon.UP],
  [State.FLAME, Icon.FLAME],
  [State.LIGHTBULB, Icon.LIGHTBULB],
  [State.INFO, Icon.INFO],
  [State.KEY, Icon.KEY],
  [State.LEFT, Icon.LEFT],
  [State.PIN, Icon.PIN],
  [State.HELP, Icon.HELP],
  [State.RIGHT, Icon.RIGHT],
  [State.STAR, Icon.STAR],
  [State.PRO, Icon.PRO],
  [State.CONTRA, Icon.CONTRA],
  [State.UNCHECKED, Icon.UNCHECKED],
  [State.ONE, Icon.ONE],
  [State.TWO, Icon.TWO],
  [State.THREE, Icon.THREE],
  [State.FOUR, Icon.FOUR],
  [State.FIVE, Icon.FIVE],
  [State.SIX, Icon.SIX],
  [State.SEVEN, Icon.SEVEN],
  [State.EIGHT, Icon.EIGHT],
  [State.NINE, Icon.NINE],
]);
