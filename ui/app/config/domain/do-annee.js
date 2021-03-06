import {isUndefined, isNull, isNaN, isNumber} from 'lodash/lang';
import isRealNumber from '../../utils/is-real-number';
export default {
    type: 'text',
    validator: [{
        type: 'function',
        value: value => {
            const isRealNumberValue = isRealNumber(value);
            if (isRealNumberValue !== undefined) {
                return isRealNumberValue;
            }
          if (value.toString().length !== 4){
            return false;
          }
          return true;
        },
        options: {translationKey:'domain.error.annee'}
    }]
};
