export const readApiErrorMessage = async (response: Response): Promise<string> => {
  const text = await response.text();
  if (!text) return `${response.status} ${response.statusText}`;
  try {
    const data = JSON.parse(text) as { message?: string };
    if (typeof data.message === "string") return data.message;
  } catch {
    /* not JSON */
  }
  return text.slice(0, 200);
};
