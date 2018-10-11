// makesure the props.values
const mapPropsToFields = (props = {}) => {
  const res = {};
  const {
    fields = [],
  } = props;
  for (let i = 0; i < fields.length; i += 1) {
    const key = fields[i].name;
    const disabled = fields[i].disabled;
    const param = props.values && props.values[key];
    if (typeof param === 'object' && 'value' in param) {
      if (disabled) { // clear the errors, all the thing is data
        param.errors = null;
      }
      res[key] = param;
    } else {
      res[key] = { value: param };
    }
  }
  return res;
};

export default mapPropsToFields;
