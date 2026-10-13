# Security Specification for Project Management Tool

## 1. Data Invariants
1. **User Identity Invariant**: A user document at `/users/{userId}` can only be created or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Project Ownership Invariant**: A project document at `/projects/{projectId}` must have `ownerId == request.auth.uid` upon creation.
3. **Master Gate (Relational Sync) Invariant**: A task at `/projects/{projectId}/tasks/{taskId}` can only be accessed or modified if the user is the project owner or listed in the project's `memberIds`.
4. **Task Project Binding Invariant**: A task's `projectId` attribute must strictly match the parent `{projectId}` path variable and reference an existing parent project.
5. **State Progression Integrity**: Task progress must be a number between 0 and 100. Status must belong to allowed enum values (`todo`, `in_progress`, `review`, `done`).
6. **Immutable Fields**: `ownerId` on projects and `createdBy` on tasks cannot be modified after initial creation.

## 2. The "Dirty Dozen" Malicious Payloads
1. **Payload 1 (Identity Spoofing - User)**: User A writes to `/users/userB` attempting to overwrite user B's profile.
2. **Payload 2 (Ghost Project Creator)**: Creating a project with `ownerId: "attacker_uid"` while authenticated as `victim_uid`.
3. **Payload 3 (Project Owner Mutation)**: Updating a project to change `ownerId` from `originalOwner` to `attacker_uid`.
4. **Payload 4 (Orphaned Task Creation)**: Creating a task under `/projects/{projectId}/tasks/{taskId}` where `projectId` doesn't exist.
5. **Payload 5 (Path-Body Mismatch)**: Creating a task at `/projects/proj-1/tasks/task-1` with body `projectId: "proj-2"`.
6. **Payload 6 (Unauthorized Project Access)**: Non-member user attempting to read `/projects/{projectId}`.
7. **Payload 7 (Unauthorized Task Creation)**: Non-member attempting to create a task in someone else's project.
8. **Payload 8 (Invalid Priority Escalation)**: Creating a task with priority `"super_critical_hack"`.
9. **Payload 9 (Progress Out of Bounds)**: Updating task progress to `999` or `-50`.
10. **Payload 10 (Denial of Wallet - Bloated Title)**: Submitting a task with a 50KB title string.
11. **Payload 11 (Injection in Document ID)**: Creating project with ID containing path traversal characters like `../../hack`.
12. **Payload 12 (Unauthorized Task Deletion)**: Non-member attempting to delete tasks from an external project.

## 3. Test Runner Design
All 12 malicious payloads must be evaluated against security rules to ensure they return PERMISSION_DENIED.
