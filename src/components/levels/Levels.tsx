import React, { useEffect, useState } from 'react';
import './level.less';

export type Level = {
  name: string;
  staticUrl?: string;
  deep?: Level[];
  action?: <T>(route: string) => T;
};

interface RenderLevel extends Level {
  deep?: RenderLevel[];
  extended: boolean | null;
}

interface Props {
  data: Level[];
  initExpanded?: boolean;
  baseFontSize?: number;
  fontSizeDecrease?: number;
  getCurrentActiveRoute?: (route: string) => any;
}

export const Levels = (props: Props) => {
  const { data, baseFontSize = 45, initExpanded = false, fontSizeDecrease = 3 } = props;

  const [compiledData, setCompiledData] = useState<RenderLevel[]>([]);

  const [activeRoute, setActiveRoute] = useState('');

  useEffect(() => {
    /**
     * assign extend state to every level, make no side effect
     * @param {Level[]} data
     * @param {boolean} initExpanded
     * @returns {RenderLevel[]}
     */
    function recursiveAssign(data: Level[], initExpanded: boolean): RenderLevel[] {
      // make sure no name include '/' so route wont failed
      const names = data.map(item => {
        if (item.name.match('/')) {
          throw new Error('Please make sure no "/" in level\'s name');
        }
        return item.name;
      });

      // make sure no name duplicate at this level
      names.map((name, i) => {
        for (let j = i + 1; j < names.length; j++) {
          if (!name) {
            throw new Error('Please check no empty name');
          }
          if (name === names[j]) {
            throw new Error('Please make sure no duplicated name on the same level');
          }
        }
      });

      return data.map(item => {
        let result: RenderLevel;
        let deep: RenderLevel['deep'];
        if (item.deep) {
          deep = recursiveAssign(item.deep, initExpanded);
        }

        // console.log('%c assigned result', 'color:#0fe;', initExpanded, item.deep);
        if (initExpanded && item.deep) {
          result = Object.assign(item, { extended: true, deep });
        } else if (!initExpanded && item.deep) {
          result = Object.assign(item, { extended: false, deep });
        } else {
          result = Object.assign(item, { extended: null, deep });
        }
        return result;
      });
    }

    let compiledData = recursiveAssign(data, initExpanded);
    setCompiledData(compiledData);
  }, [data]);

  const handleClickLevel = (item: RenderLevel, route: string) => {
    /**
     * change Level extended state
     * @param {RenderLevel[]} looper
     * @param {string[]} routes
     * @param {number} routeIndex
     * @returns
     */
    function changeLevelsExtended(looper: RenderLevel[], routes: string[], routeIndex: number, isLastRoute: boolean) {
      let isTheRouteEnd = routeIndex + 1 >= routes.length;
      let matchedIndex;
      for (let j = 0; j < looper.length; j++) {
        const ele = looper[j];
        if (ele.name === routes[routeIndex]) {
          ele.extended = isTheRouteEnd ? !ele.extended : true; // if is the loop's end, re-click will fold it
          matchedIndex = j;
        } else {
          ele.extended = false;
        }
      }

      if (matchedIndex === undefined) {
        return console.warn(`no matched index!`);
      }

      if (isTheRouteEnd) {
        return;
      }

      const nextLooper = looper[matchedIndex].deep;
      if (nextLooper === undefined) {
        return console.warn(`levels: loop chain broken!`);
      }

      changeLevelsExtended(nextLooper, routes, routeIndex + 1, isLastRoute);
    }

    function getUpdateLevels(levels: RenderLevel[]): RenderLevel[] {
      const routes = route.split('/');
      const isLastRoute = route === activeRoute;
      changeLevelsExtended(levels, routes, 0, isLastRoute);
      return levels;
    }

    item.extended !== null && setCompiledData(s => getUpdateLevels([...s]));
    item.staticUrl && window.open(item.staticUrl);
    item.action && item.action(route);
    setActiveRoute(route);
    console.log('%croute:', 'color:#0fe;', route);
  };

  /**
   * Render levels recursively
   * @param {RenderLevel} item
   * @param {number} [depth=0]
   * @param {string} [route]
   * @returns {React.ReactNode}
   */
  const recursiveRender = (item: RenderLevel, depth: number = 0, route: string = ''): React.ReactNode => {
    const currentRoute = route ? `${route}/${item.name}` : `${item.name}`;
    const fontSize = baseFontSize - fontSizeDecrease * depth > 12 ? baseFontSize - fontSizeDecrease * depth : 12;
    return (
      <div key={item.name}>
        <div
          key={item.name}
          className="g-levels-one"
          onClick={() => handleClickLevel(item, currentRoute)}
          style={{ fontSize, color: `${activeRoute === currentRoute ? '#2dc6ad' : ''}` }}
        >
          <span style={{ paddingLeft: `${depth}em` }}></span>
          {item.name}
        </div>
        {item.deep && item.extended && item.deep.map((deepItem: RenderLevel) => recursiveRender(deepItem, depth + 1, currentRoute))}
      </div>
    );
  };

  return <div className="g-levels-wrapper">{compiledData.map(item => recursiveRender(item))}</div>;
};
