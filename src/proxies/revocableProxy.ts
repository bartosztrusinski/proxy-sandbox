const query = {
  data: 'Sensitive data',
};

const { proxy: revocableQuery, revoke } = Proxy.revocable(query, {});
const revokes = new WeakMap(); // Use WeakMap to garbage collect revokes of revoked proxies
revokes.set(revocableQuery, revoke);

try {
  console.info(revocableQuery.data); // Sensitive data

  const revokeQuery = revokes.get(revocableQuery); // Easily get revoke function of given proxy
  revokeQuery(); // Disable proxy - revoke access to the sensitive data

  console.info(revocableQuery.data); // Cannot perform 'get' on a proxy that has been revoked
} catch (error) {
  console.error(error instanceof Error ? error.message : 'An error occurred');
}
