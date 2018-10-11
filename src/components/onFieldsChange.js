// makesure the props.changeRecord
const onFieldsChange = (props, flds) => {
  const fields = flds;
  const keys = Object.keys(fields || {});
  const findFun = (name) => {
    const newName = name;
    return (item) => item.name === newName;
  };
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const fld = props.fields.find(findFun(fields[key].name));
    fields[key].type = fld && fld.type;
    fields[key] = {
      ...{ value: undefined },
      ...fields[key],
    };
  }
  props.changeRecord && props.changeRecord({
    ...props.values,
    ...fields,
  });
};

export default onFieldsChange;
