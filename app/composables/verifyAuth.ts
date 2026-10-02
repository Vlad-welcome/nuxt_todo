export async function verifyAuth() {
  const token = useCookie("token");

  if (!token.value) {
    return null;
  }

  try {
    const result = await $fetch("/api/auth/verifyToken", {
      method: "POST",
      body: { token: token.value },
    });

    if (!result.success) {
      return null;
    }

    return result.user;
  } catch {
    return null;
  }
}
