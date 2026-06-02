# Prototype Spec Tree

This directory tests only the stable spec side of the v0 file-structure model.

Rules:

- Directory names are current monorepo asset groups, not isomorph content kinds.
- Every `.md` file is a module.
- Frontmatter only carries `kind`.
- Module content carries assertions.
- No `mapping` field.
- No `status` field.
- Review/promote lifecycle stays in docwarden workflow material.
- Isomorph concepts stay outside `.docwarden/spec`.
- Template / mapping rules stay outside `.docwarden`.

Prototype tree:

```text
workspace/docs-authority.md
harness/spec-entry-boundary.md
harness/review-workflow.md
harness/promote-to-spec.md
harness/review-surface.md
```

Related prototypes:

```text
../prototype-isomorph-mapping/docwarden/modules/concept/spec.md
```
