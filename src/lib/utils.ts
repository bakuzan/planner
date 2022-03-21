export function fromBoolToBit(value: boolean) {
  const bool = value ?? false;
  return bool ? 1 : 0;
}

function isJSON(request: Request) {
  return request.headers.get('accept')?.toLowerCase() === 'application/json';
}

export async function getRequestData(request: Request) {
  if (isJSON(request)) {
    return await request.json();
  } else {
    const formData = await request.formData();
    return Object.fromEntries(formData);
  }
}

export function sendErrorResponse(status: number, errorMessage: string) {
  return {
    status,
    body: { errors: [errorMessage] }
  };
}
