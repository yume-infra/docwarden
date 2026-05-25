---
kind: magic-word
---

# transition

## Registry

本 registry 维护 transition magic words。

### `0->1`

Reading Role:

从没有长期 module 到初始 module skeleton 的生成位置。

Consumer:

- [[mapping/bootstrap/modules/concept/template|template]]
- [[mapping/bootstrap/relations/template-format-semantic-lint|template-format-semantic-lint]]

Source:

- [[mapping/bootstrap/relations/template-format-semantic-lint|template-format-semantic-lint]]

Confidence Role:

primary transition marker。

### `1->2`

Reading Role:

已有 module 在下一轮编辑中保持可消费形态的位置。

Consumer:

- [[mapping/bootstrap/modules/concept/format|format]]
- [[mapping/bootstrap/modules/concept/semantic-lint|semantic-lint]]
- [[mapping/bootstrap/relations/template-format-semantic-lint|template-format-semantic-lint]]

Source:

- [[mapping/bootstrap/relations/template-format-semantic-lint|template-format-semantic-lint]]

Confidence Role:

primary transition marker。
