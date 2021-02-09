import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';
import fromPairs from 'lodash/fromPairs';
import upperFirst from 'lodash/upperFirst';

// fix lodash tree-shaking
export { camelCase, cloneDeep, findIndex, fromPairs, upperFirst };
