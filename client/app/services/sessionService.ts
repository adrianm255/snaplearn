export const getHeaders = () => {
  return {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
  };
};

export const logout = async () => {
  const response = await fetch('/users/sign_out', {
    method: 'DELETE',
    headers: getHeaders()
  } as any);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  window.location.href = '/';
};