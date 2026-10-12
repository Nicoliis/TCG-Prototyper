# Contract Delta: Storage Adapter

No changes to `specs/001-projects-card-types/contracts/storage-adapter.md`.
`saveCardType(projectId, cardType)` still accepts and persists the whole
`CardType` object; the new `style` block on each element is just additional
nested data within that same object, opaque to every adapter. The existing
contract test suite (`tests/unit/storage-adapter.contract.test.mjs`) needs
no changes for this feature.
