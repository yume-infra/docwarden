---
name: skill-creator
description: 用于创建或更新 Codex skill、把 skill-primitive material 派生成 SKILL.md/repo-skill/plugin skill，或修正漂移成 generic scaffolding、CLI wrapper、膨胀 docs、trigger 不清、缺少 lead-review gate、未验证 artifact 的 skill；不用于只安装 skill、只跑脚本或只写 docs/prompt。
---

# Skill Creator

把 Codex skill 当作 agent behavior intervention 来创建或修复。先证明 repeatable drift，再写文件；skill 用来引导软判断，硬约束交给 CLI 或脚本。

## Capability

这个 skill 处理三类工作：

- 从用户请求、workflow 或 `skill-primitive` 派生新的 Codex skill。
- 更新已有 skill，使它重新对齐明确的 trigger、boundary、resource rules 与 validation。
- 修复已经漂移成 generic scaffolding、CLI wrapper、膨胀说明文档、结构有效但行为弱的 skill。

## Drift Pressure

动手前先用一句具体话命名这个 skill 要防止的 agent failure。

常见 drift:

- agent 在证明 skill 必要性前就生成目录和 `SKILL.md`。
- agent 明明有 skill-primitive material，却从 runtime folder、plugin export shape 或 generic scaffold 反推 skill。
- agent 把 hard constraints 与 soft workflow judgment 都写进 prose。
- agent 把 CLI command、directory structure 或内部 workflow node 当成 user-facing skill behavior。
- draft 通过结构校验，但缺少 trigger boundary、lead-review route、pressure scenario 或 forward-test surface。

## Workflow

1. 如果有 skill-primitive material，先接管它，把它当作 semantic source；具体 skill primitive material 应来自 owning contexta pack 或 semantic framework。
2. 以 primitive 为 derivation unit，再 materialize `SKILL.md`、repo-skill 或 plugin-distributed skill。
3. 读取已有 skill resources，再决定编辑范围。
4. 写出 pressure scenario：这个 skill 防止哪种可重复 agent drift。
5. 判断 artifact 应进入 skill、docs、prompt、CLI、script、reference 还是 asset。
6. 定义 activation：哪些用户说法应该触发，哪些相邻请求不该触发。
7. 分离 soft boundary 与 hard boundary。
8. 如果 drift、trigger 或 skill-vs-CLI 边界不确定，只让用户确认最小 semantic unit。
9. 只 materialize `SKILL.md` 和直接支撑该 skill 的 bundled resources。
10. 跑 deterministic validation，再把 skill 当作可用。

用户已经确认方向，或 primitive source 已经足够清楚时，直接推进 reversible baseline 并报告验证结果，不要问宽泛确认问题。

## Soft Boundary

skill instructions 只负责 agent judgment:

- repeated drift 是否足以支撑 reusable skill；
- 请求应该落到 skill、docs、prompt、CLI、script、reference 还是 asset；
- frontmatter `description` 的 positive / negative trigger boundary；
- 哪些内容是 SKILL.md every-use material，哪些应该进入一层 references；
- lead-review gate 放在哪里，以及最小 review unit 是什么；
- draft 是否太 generic、verbose、implementation-shaped 或 runtime-shaped。

## Hard Boundary

硬约束交给脚本或 CLI:

```bash
python3 scripts/init_skill.py "$SKILL_NAME" --path "$OUTPUT_DIR" --resources scripts,references
python3 scripts/generate_openai_yaml.py "$SKILL_DIR" --interface key=value
python3 scripts/quick_validate.py "$SKILL_DIR"
```

使用 `init_skill.py` 做 repeatable scaffolding，使用 `generate_openai_yaml.py` 生成 `agents/openai.yaml`，使用 `quick_validate.py` 校验 frontmatter、name、description 与 placeholder。

如果 skill 新增或修改 scripts，直接 run 或 smoke-test 那些 scripts。如果 skill 从 isomorph material 派生，先运行 `isomorph primitive skill` 验证 primitive source。

## Writing Rules

Frontmatter:

- `name` 是稳定 skill identity，使用 hyphen-case。
- `description` 是 activation surface，不是摘要。
- description 要包含重要 trigger 与 exclusion boundary。
- 不加入平台不支持的 metadata。
- description 保持在 1024 字符以内，不能包含 angle-bracket placeholder。

Body:

- 写给不知道当前对话的未来 Codex instance。
- `SKILL.md` 只保留 every-use instructions。
- 用具体 decision point 和 examples，避免解释性长文。
- 不在 skill 目录里添加 README、changelog、installation guide、process notes 或额外 docs。
- 条件性细节放入 `references/`，并在 `SKILL.md` 说明什么时候读取。
- references 保持一层深。
- `scripts/` 只放 deterministic、fragile 或反复被重写的操作。
- `assets/` 只放最终输出会实际使用的文件。

添加 optional UI metadata 前，先读 `references/openai_yaml.md`。

## Review Gates

只确认最小不确定单元：

- drift pressure 不清楚时，确认 skill 存在理由；
- activation boundary 不清楚时，确认 trigger 与 exclusion examples；
- skill-vs-CLI 边界混合时，确认 hard / soft responsibility；
- export shape 不清楚时，确认 skill identity 与 resource layout。

用户已经确认方向时，不要再要求 broad confirmation。

## Validation

总是运行：

```bash
python3 scripts/quick_validate.py "$SKILL_DIR"
```

当 frontmatter name、description、display name、short description 或 default prompt 改变时，重新生成 `agents/openai.yaml`。

从 primitive 派生时运行：

```bash
isomorph primitive skill .contexta/packs/isomorph-authoring/skills/skill-creator/skill-primitive.md --json
```

非平凡 skill 变更需要 forward-test，使用干净、真实的请求，例如：

```text
Use $generated-skill at $SKILL_DIR to handle: turn a repo-specific review workflow into a concise Codex skill.
```

forward-test 不要泄露预期答案、疑似 bug、目标修复或本轮结论，除非测试本身要求这些信息。
