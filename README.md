# Geosan Cup Draft

Live draft site for the Geosan company basketball tournament: a weighted ticket lottery for draft order, then a draft where each team captain picks from their own computer. English and Mongolian.

Site: https://optidazi.github.io/geosan-draft/

## Roles

- **Admin** (one account): moves everyone through the steps, edits teams, captains and players, creates captain logins, runs the lottery, can pick for any team, can undo picks and reset.
- **Captains**: sign in with the login the admin created, watch the lottery live, and can draft only for their own team when it's their turn.
- **Spectators**: anyone with the link can click **Watch the draft** (or open https://optidazi.github.io/geosan-draft/#watch) and follow everything live without logging in. They can't change anything. Admins can copy the spectator link on the Teams step.

Captain login emails are kept in a separate admin-only document (`draft/private`), so spectators never see them.

Firestore security rules (`firestore.rules`) enforce these limits on Google's servers, so captains can't get around them by editing the page.

## One-time setup (about 10 minutes)

1. Go to https://console.firebase.google.com, click **Create a project**, name it (e.g. `geosan-draft`) and turn Google Analytics off. The free Spark plan is enough.
2. **Build → Authentication → Get started → Email/Password**: enable it and save.
3. **Authentication → Users → Add user**: enter your own (admin) email and a password. Copy the **User UID** shown in the list.
4. **Authentication → Settings → Authorized domains → Add domain**: `optidazi.github.io`.
5. **Build → Firestore Database → Create database**: pick a location near you (e.g. `asia-east2`, Hong Kong) and start in **production mode**.
6. **Firestore → Rules**: paste the contents of `firestore.rules` (it already has the admin UID) and click **Publish**.
7. **Project settings (gear icon) → General → Your apps → Web (`</>`)**: register an app (no hosting needed) and copy the `firebaseConfig` values.
8. Put those values and your UID into `firebase-config.js`, then commit and push. The site updates about a minute later.

## Running draft night

1. Open the site and sign in with the admin login. Click **Create draft**.
2. **Teams**: set last year's order with the arrows (champion = 1 ticket … last place = 6), rename the teams, and for each team enter the captain's email, click **Generate** for a password, then **Create login**. Copy the details from the pop-up and send them to that captain.
3. **Players**: replace the sample names (paste one per line: `Name, G/F/C`).
4. **Lottery**: captains sign in and watch. Click **Draw** five times; the last team is placed automatically.
5. **Draft**: the captain on the clock gets a "Your pick!" banner and their browser tab title changes. Everyone sees each pick appear live.
6. **Results**: copy the final rosters as text.

If a captain's email already has an account (e.g. from an earlier test), the Teams page asks for that account's User UID instead. You'll find it under Authentication → Users.

## Files

- `index.html`: layout and styles
- `app.js`: app logic (Firebase Auth + Firestore, live sync)
- `firebase-config.js`: your project's config and admin UID
- `firestore.rules`: security rules to paste into the Firebase console
