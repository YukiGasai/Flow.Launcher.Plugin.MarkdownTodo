import { Icon, Methods, State } from '../types.js';
import { I18n } from '../util/i18n.js';
import { iconMap } from '../util/iconMap.js';
import { showResult } from '../util/showResult.js';

export function handleContextMenu (params: string[]): void {
  const { query, item: todo } = JSON.parse(params.join(''));

  const i18n = I18n.getInstance();

  const results = Object.keys(State).map((key) => {
    const state = State[key as keyof typeof State];
    return {
      title: `${i18n.t('Change to State')} ${state}`,
      method: Methods.UPDATE_TODO,
      params: [JSON.stringify({ query, item: todo, state })],
      iconPath: iconMap.get(state) || Icon.ALERT,
      dontHideAfterAction: true,
    };
  });

  const deleteResult = {
    title: i18n.t('Delete Todo'),
    method: Methods.DELETE_TODO,
    params: [JSON.stringify({ query, item: todo })],
    iconPath: Icon.TRASH,
    dontHideAfterAction: false,
    score: 100,
  };

  return showResult(deleteResult, ...results);
}
