export function fromBoolToBit(value: boolean) {
  const bool = value ?? false;
  return bool ? 1 : 0;
}
