export function toLowerCaseQuery(value: string) {
  return { $regex: value, $options: 'i' };
}
