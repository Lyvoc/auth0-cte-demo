/**
 * DAE Filter Hook
 *
 * Runs when the admin opens the user list.
 * Returns a Lucene query that limits which users are visible.
 *
 * - Client 1 admin (client-1): sees users from both client-1 and client-2
 * - Client 2 admin (client-2): sees only client-2 users
 */

function (ctx, callback) {
  var adminOrgs =
    ctx.request.user.app_metadata &&
    ctx.request.user.app_metadata.organizations;

  var adminOrg = Array.isArray(adminOrgs) && adminOrgs.length > 0
    ? adminOrgs[0]
    : null;

  if (adminOrg === "client-1") {
    return callback(null, {
      query: 'app_metadata.organizations:"client-1" OR app_metadata.organizations:"client-2"'
    });
  }

  if (adminOrg === "client-2") {
    return callback(null, {
      query: 'app_metadata.organizations:"client-2"'
    });
  }

  // No org — show nothing
  return callback(null, { query: 'app_metadata.organizations:"__none__"' });
}
